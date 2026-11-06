import {artworks, demoArtworks, allArtworks} from './artworks.ts';
import {countries} from './countries.ts';
import {WORLD_PATH} from './world.ts';
import {comparePose, emptyAnalysis, CONNECTIONS, reliable, comparePair, ALGORITHM_VERSION} from './analysis.ts';
import {decodePhoto, canvasFromUrl, photoBlob} from './images.ts';
import {paletteFrom} from './palette.ts';
import {detect, MODEL_VERSION} from './detector.ts';
import {saveSession, listSessions, removeSession} from './storage.ts';
import {exportPNG, exportJSON} from './export.ts';
import {openBook} from './book.ts';
import type {Artwork, Attempt, ComparisonSession, Points, Swatch} from './types.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;
type Page = 'explore' | 'studio' | 'passport';
const initialPage = new URLSearchParams(location.search).get('page');
let page: Page = initialPage === 'studio' || initialPage === 'passport' ? initialPage : 'explore';
let countryId = 'france';
const initialCountry = new URLSearchParams(location.search).get('country');
if (initialCountry && countries.some(c => c.id === initialCountry)) countryId = initialCountry;
let art: Artwork = artworks[0];
const initialArt = new URLSearchParams(location.search).get('art');
if (initialArt) {
  const found = allArtworks.find(w => w.id === initialArt);
  if (found) art = found;
}
let attempts: [Attempt | null, Attempt | null] = [null, null];
let reflection = '', active = 0;
let busy = false, showPoints = true;
let records: ComparisonSession[] = [];
let sessionId = crypto.randomUUID();
let referencePalette: Swatch[] = [];
let toastTimer: ReturnType<typeof setTimeout>;
let query = '', levelFilter = 0, mapZoom = 1;
const LEVEL: Record<number, string> = {1: 'EASY', 2: 'MEDIUM', 3: 'CHALLENGE'};

const PASSPORT_KEY = 'meet-in-art.passport.v1';
const passport = loadPassport();

function loadPassport(): {no: string, cover: string} {
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.no === 'string' && typeof parsed.cover === 'string') return parsed;
    }
  } catch {}
  return {no: 'MIA-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 900) + 100), cover: '#7a3b3f'};
}
function savePassport() { try { localStorage.setItem(PASSPORT_KEY, JSON.stringify(passport)); } catch {} }
const COVERS = ['#7a3b3f', '#47634f', '#3f4e63', '#a0784f'];

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]!));
function toast(message: string) {
  const box = document.querySelector<HTMLElement>('#toast')!;
  box.textContent = message; box.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => box.classList.remove('visible'), 5500);
}
const countryOf = (id: string | undefined) => countries.find(c => c.id === id);
const worksOf = (id: string) => artworks.filter(w => w.country === id);
const doneCount = (id: string) => worksOf(id).filter(w => records.some(r => r.artworkId === w.id)).length;
const isDone = (id: string) => records.some(r => r.artworkId === id);
const workDate = (id: string) => {
  const list = records.filter(r => r.artworkId === id).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  return list[0] ? new Date(list[0].savedAt).toLocaleDateString('zh-CN') : '';
};
const totalDone = () => new Set(records.map(r => r.artworkId)).size;
const explored = () => countries.filter(c => doneCount(c.id) > 0).length;

function swatches(items: Swatch[]) {
  return items.length ? `<div class="swatches">${items.map(c => `<span class="swatch" style="--color:${c.hex};flex:${Math.max(c.proportion, .04)}" title="${c.hex} · ${Math.round(c.proportion * 100)}%"><i>${Math.round(c.proportion * 100)}%</i></span>`).join('')}</div><div class="color-keys">${items.map(c => `<span>${c.hex}</span>`).join('')}</div>` : '<p class="muted small">图片载入后显示主要颜色</p>';
}
function thumb(w: Artwork, cls = '') {
  return `<div class="art-thumb ${cls}"><div class="art-plate"><span>${esc(w.englishTitle)}</span></div><img data-img src="${w.image}" alt="" loading="lazy"></div>`;
}
function tags(w: Artwork) {
  if (!w.level) return '';
  return `<span class="tag lv${w.level}">${LEVEL[w.level]}</span><span class="tag">${w.people || ''}</span>`;
}

/* ------------------------------------------------------------------ shell */
function shell(inner: string) {
  app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="#explore" data-nav="explore"><img src="/favicon.svg" alt="" width="34" height="34"><span>与画相逢 <small>MEET IN ART</small></span></a>
    <nav aria-label="主导航">
      <button data-nav="explore" class="${page === 'explore' ? 'on' : ''}">探索世界</button>
      <button data-nav="studio" class="${page === 'studio' ? 'on' : ''}">创作室</button>
      <button data-nav="passport" class="${page === 'passport' ? 'on' : ''}">我的护照 <span>${totalDone()}</span></button>
    </nav>
    <span class="local-badge"><i></i>照片留在你的浏览器</span>
  </header>
  <main id="top">${inner}</main>
  <footer><span>与画相逢 / MEET IN ART</span><p>相似程度只是观察线索，作品的意义由你决定。</p><small>朱昭荣 · 宋琪语<br>艺术与 AI 课程项目 · 2026</small></footer>`;
  bind();
  requestAnimationFrame(drawAll);
}

/* ------------------------------------------------------------------ explore */
function mapDots() {
  return countries.map(c => {
    const done = doneCount(c.id);
    const cls = 'map-dot' + (done === 4 ? ' done' : done > 0 ? ' progress' : '') + (c.id === countryId ? ' selected' : '');
    return `<button class="${cls}" data-country="${c.id}" style="left:${c.dot.x}%;top:${c.dot.y}%" aria-label="${c.name}">
      ${done === 4 ? '<i class="seal">✳</i>' : ''}<span class="map-dot-label">${c.name}</span></button>`;
  }).join('');
}
function artCards(list: Artwork[]) {
  if (!list.length) return '<div class="empty-note">没有匹配的作品，换个关键词或难度试试。</div>';
  return list.map(w => `<button class="art-card" data-art="${w.id}">
    ${thumb(w)}
    <div class="art-meta">
      <h4>${w.title}</h4>
      <p>${w.artist} · ${w.year}</p>
      <p class="muted small">${w.museum}</p>
      <div class="tags">${tags(w)}${isDone(w.id) ? '<span class="tag done">已收集 ✳</span>' : ''}</div>
    </div>
  </button>`).join('');
}
function exploreView() {
  const c = countryOf(countryId)!;
  const q = query.trim().toLowerCase();
  const list = worksOf(c.id).filter(w => {
    const okLevel = levelFilter === 0 || w.level === levelFilter;
    const okQuery = !q || w.title.toLowerCase().includes(q) || w.englishTitle.toLowerCase().includes(q) || w.artist.toLowerCase().includes(q);
    return okLevel && okQuery;
  });
  return `
  <section class="explore-hero">
    <div>
      <div class="eyebrow"><span class="short-line"></span>艺术 × AI · 一次亲手参与的观看</div>
      <p>选一个国家，挑一幅名画，用自己的身体、衣服和身边的物品重新演绎它。<br>看见差异，再拍一次，留下你自己的表达。</p>
    </div>
    <div class="explore-stats">
      <div><b>${explored()}</b><span>已探索国家</span></div>
      <div><b>${totalDone()}</b><span>已完成作品</span></div>
      <div><b>${countries.reduce((n, x) => n + (doneCount(x.id) === 4 ? 1 : 0), 0)}</b><span>国家纪念章</span></div>
    </div>
  </section>

  <section class="explore-map">
    <div class="map-card">
      <div class="map-frame" id="mapFrame">
        <div class="map-paper" aria-hidden="true"></div>
        <svg class="map-defs" width="0" height="0" aria-hidden="true"><defs>
          <linearGradient id="landFill" x1="0" y1="0" x2="0.7" y2="1">
            <stop offset="0" stop-color="#a4784a"/><stop offset="0.45" stop-color="#85582f"/><stop offset="1" stop-color="#96683c"/>
          </linearGradient>
          <filter id="coast" x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="9" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs></svg>
        <div class="map-plane" id="mapPlane" style="transform:scale(${mapZoom})">
          <svg class="map-svg" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-label="世界地图">
            <path d="${WORLD_PATH}" fill-rule="evenodd"/>
          </svg>
          ${mapDots()}
        </div>
        <div class="map-grain" aria-hidden="true"></div>
        <div class="map-tip" id="mapTip" aria-live="polite"></div>
        <div class="map-zoom">
          <button type="button" id="zoomIn" aria-label="放大">＋</button>
          <button type="button" id="zoomOut" aria-label="缩小">－</button>
          <button type="button" id="zoomReset" aria-label="复位">⟲</button>
        </div>
      </div>
    </div>
    <aside class="country-side">
      <div class="eyebrow">START YOUR JOURNEY</div>
      <h3>热门目的地</h3>
      <p class="small muted map-hint">点击圆点或下方国家名切换 · 右上角按钮缩放</p>
      <div class="country-list">${countries.map(x => `
        <button class="country-row ${x.id === countryId ? 'on' : ''}" data-country="${x.id}">
          <span class="flag">${x.flag}</span>
          <span><strong>${x.name}</strong><small>${x.era} · ${doneCount(x.id)}/4</small></span>
          <em>${doneCount(x.id) === 4 ? '✳' : '↗'}</em>
        </button>`).join('')}</div>
      <p class="small muted side-note">完成一幅仿拍，就会在护照里盖下对应的作品印章。集齐一个国家的四幅，解锁国家纪念章。</p>
    </aside>
  </section>

  <section class="country-block">
    <div class="country-head">
      <div class="eyebrow">${c.region} · ${c.era}</div>
      <h2>${c.name}</h2>
      <p>${c.desc}</p>
      <p class="small muted">代表艺术家：${c.artists}</p>
    </div>
    <div class="country-tools">
      <input id="artSearch" class="search-input" value="${esc(query)}" placeholder="搜索作品 / 艺术家" aria-label="搜索作品">
      ${[0, 1, 2, 3].map(l => `<button class="chip ${levelFilter === l ? 'on' : ''}" data-level="${l}">${l === 0 ? 'ALL' : LEVEL[l]}</button>`).join('')}
    </div>
    <div class="art-grid" id="artGrid">${artCards(list)}</div>
  </section>

  <section class="demo-strip">
    <div class="section-label"><h2><span>DEMO</span> 内置示例</h2><p>三幅带真实参考点与示例照片的作品，用来演示完整流程</p></div>
    <div class="demo-grid">${demoArtworks.map(w => `<button class="demo-card" data-demo="${w.id}">${thumb(w)}<div><strong>${w.title}</strong><span>${w.artist} · ${w.year}</span><small>AI 合成演示素材</small></div></button>`).join('')}</div>
  </section>`;
}

/* ------------------------------------------------------------------ studio */
function slot(index: number) {
  const a = attempts[index];
  return `<section class="attempt-card ${active === index ? 'active' : ''}" data-testid="attempt-${index}"><div class="card-head"><button class="text-button attempt-tab" data-slot="${index}" ${busy ? 'disabled' : ''}><span class="dot-number">${index + 1}</span>${index === 0 ? '第一次尝试' : '带着观察，再拍一次'}</button>${a ? `<button class="icon-button mirror" data-slot="${index}" title="水平镜像照片后重新分析" ${busy ? 'disabled' : ''}>⇄ 镜像</button>` : ''}</div><div class="image-stage attempt-stage ${a ? '' : 'empty'}">${a ? `<img src="${a.dataUrl}" alt="${index + 1} 次仿拍照片" class="pose-image"><canvas class="skeleton" data-points="${index}" aria-label="照片中可见的肩肘腕标记"></canvas><span class="provenance">${a.provenance === 'ai-generated' ? 'AI 合成演示素材' : '用户上传照片'}${a.mirrored ? ' · 已镜像' : ''}</span>` : `<div class="upload-hint"><span class="upload-mark">＋</span><strong>${index === 0 ? '把第一次尝试放在这里' : '让新的观察，出现在照片里'}</strong><p>${index === 0 ? '先试着摆一摆，不必一次到位。' : '调整姿态或取景，再上传一张。'}</p></div>`}</div><div class="attempt-actions"><label class="button ${a ? 'subtle' : 'primary'} ${busy ? 'disabled' : ''}"><input type="file" accept="image/jpeg,image/png,image/webp" data-upload="${index}" ${busy ? 'disabled' : ''}>${a ? '更换照片' : '上传照片'} <span>↗</span></label>${art.demo ? `<button class="button ghost demo-single" data-slot="${index}" ${busy ? 'disabled' : ''}>用示例试试</button>` : ''}</div>${a ? `<div class="attempt-palette">${swatches(a.analysis.palette)}</div>` : '<p class="small muted file-hint">JPG / PNG / WebP · 最大 20 MB</p>'}</section>`;
}
function feedback() {
  const a = attempts[active];
  if (!a) return `<div class="feedback-empty"><span class="eyebrow">看见，再调整</span><h3>一些具体的差异，<br>会从一张照片开始。</h3><p>上传照片后，这里会比较手臂姿态、人物位置与主要颜色。你可以采纳建议，也可以保留自己的改编。</p></div>`;
  const r = a.analysis; const bad = ['model-error', 'no-person', 'multiple-people'].includes(r.status);
  return `<div class="feedback-title"><span class="eyebrow">第 ${active + 1} 次尝试 · 观察反馈</span><h3>${r.status === 'model-error' ? '姿态识别暂不可用' : bad ? '先让画面更清楚' : r.poseError !== null ? '看看哪些地方可以再试一次' : '已有一些可观察的信息'}</h3></div><p class="analysis-note ${bad ? 'warning' : ''}" role="status">${esc(r.reason)}</p><div class="metrics"><div><span>姿态差异</span><strong>${r.poseError === null ? '—' : r.poseError.toFixed(2)}<small>${r.poseError === null ? '' : '肩宽'}</small></strong><p>${art.annotated ? '越小越接近参考姿态' : '未标注参考点'}</p></div><div><span>肩宽占画幅</span><strong>${r.composition ? Math.round(r.composition.scaleRatio * 100) + '%' : '—'}</strong><p>相对于参考原画</p></div><div><span>可比较关键点</span><strong>${r.matched.length}<small>/ 6</small></strong><p>低置信度点不参与</p></div></div><div class="advice-list">${r.advice.length ? r.advice.map((x, i) => `<article class="advice"><span class="advice-number">0${i + 1}</span><div><span class="tag">${x.kind === 'pose' ? '姿态' : '构图'}</span><h4>${esc(x.title)}</h4><p>${esc(x.detail)}</p></div></article>`).join('') : !bad && r.poseError !== null ? '<article class="advice"><span class="advice-number">✓</span><div><h4>当前几何关系比较接近参考</h4><p>可以继续观察光线、道具与自己的表达；无需为了数值反复调整。</p></div></article>' : ''}</div><p class="small muted">人物大小以肩宽近似。骨架点和建议都可能受遮挡与识别误差影响。${r.inferenceMs !== null ? '本次模型推理 ' + Math.round(r.inferenceMs) + ' ms。' : ''}</p>`;
}
function studioView() {
  const both = attempts.every(Boolean);
  const pair = both && art.annotated ? comparePair(art.reference, art.frame, {points: attempts[0]!.analysis.points, frame: attempts[0]!}, {points: attempts[1]!.analysis.points, frame: attempts[1]!}) : null;
  const c = countryOf(art.country);
  return `
  <section class="studio-page">
    <div class="studio-top">
      <div>
        <div class="eyebrow">${c ? c.name : 'DEMO'} · ${art.year} · ${art.annotated ? '可比较姿态' : '待标注参考点'}</div>
        <h2>${art.title}</h2>
        <p class="small muted">${art.artist} · ${art.museum || ''}</p>
      </div>
      <div class="studio-tools">
        <label class="toggle"><input id="show-points" type="checkbox" ${showPoints ? 'checked' : ''}>显示肩、肘、腕标记</label>
        <button class="text-button" data-nav="explore">← 换一幅画</button>
      </div>
    </div>
    ${art.annotated ? '' : '<p class="notice">这幅画还没有标注参考点，暂不比较姿态。你仍然可以查看观察卡、配色与构图比例；标注后即可启用完整的姿态反馈。</p>'}
    <div class="studio-grid">
      <aside class="reference-card">
        <div class="card-head"><span class="eyebrow">参考原画 · ${art.annotated ? '人工近似标点' : '待标注参考点'}</span><span class="small muted">${art.englishTitle}</span></div>
        <div class="image-stage reference-stage"><img class="pose-image" src="${art.image}" alt="${art.title}参考原画" data-ref-img><canvas class="skeleton" data-points="reference" aria-label="人工标注的原画关键点"></canvas></div>
        <div class="observation"><span class="eyebrow">观察卡</span><h3>${art.focus}</h3><p>${art.observation}</p><ul>${art.observations.map(s => `<li>${s}</li>`).join('')}</ul><div class="prop-list">${art.props.map(p => `<span>${p}</span>`).join('')}</div><details><summary>作品与图片来源</summary><p>${art.title} · ${art.artist} · ${art.year}</p><p>${art.license}</p><a href="${art.source}" target="_blank" rel="noreferrer">馆方作品资料 ↗</a><br><a href="${art.imageSource}" target="_blank" rel="noreferrer">数字图来源 ↗</a></details></div>
      </aside>
      <div class="attempts-column">
        <div class="attempts-grid">${slot(0)}${slot(1)}</div>
        <section class="feedback" aria-live="polite">${feedback()}</section>
      </div>
    </div>
    <section class="palette-comparison"><div><span class="eyebrow">配色观察</span><h3>颜色可以接近，<br>材料可以不同。</h3><p>观察主要色块与比例，再决定如何使用衣服、道具和背景。</p></div><div class="palette-rows"><div><span>原画</span><div>${swatches(referencePalette)}</div></div>${attempts.map((a, i) => `<div><span>第 ${i + 1} 次</span><div>${a ? swatches(a.analysis.palette) : '<p class="small muted">等待上传照片</p>'}</div></div>`).join('')}</div></section>
    <section id="reflection" class="reflection"><div class="section-label"><h2><span>03</span> 留下这次观看</h2><p>变化，不只是更像一点</p></div><div class="reflection-grid"><div><h3>${both ? (pair ? pair.summary : '两次都完成后再比较变化') : '你想保留什么，又改变了什么？'}</h3><p>${both ? (pair ? pair.detail + ' 看看两次照片，再写下一处新发现的画面关系。也可以说明你有意保留的不同。' : '这幅画还没有参考点，暂时只比较配色与你自己的两次选择。') : '完成两次尝试后，保存一张原画与前后照片的对比图。'}</p><div class="demo-note"><span>演示素材说明</span><p>内置照片由 AI 合成，展示功能流程，不是真人试用或学习效果证据。</p>${art.demo ? `<button id="load-pair" class="text-button" ${busy ? 'disabled' : ''}>载入这幅画的完整示例 ↗</button>` : ''}</div></div><div><label for="reflection-text">我的拍摄想法 <span>可选 · 200 字以内</span></label><textarea id="reflection-text" maxlength="200" placeholder="例如：第二次我把手肘抬高了，才发现两条手臂形成了不同方向的线。我保留了日常的白衬衫。">${esc(reflection)}</textarea><div class="save-actions"><button id="save" class="button primary" ${!both || busy ? 'disabled' : ''}>保存到本机</button><button id="export-png" class="button secondary" ${!both || busy ? 'disabled' : ''}>导出对比图 ↓</button><button id="export-json" class="button ghost" ${!both || busy ? 'disabled' : ''}>导出数据</button></div><p class="small muted">仅点击保存后写入本机。清理浏览器数据会移除记录，请及时导出。</p></div></div></section>
  </section>`;
}

/* ------------------------------------------------------------------ passport */
function passportView() {
  const total = totalDone();
  return `
  <section class="passport-page">
    <div class="explore-hero">
      <div>
        <div class="eyebrow"><span class="short-line"></span>你的旅程 · 你的收藏</div>
        <h1>我的<span>艺术护照</span>。</h1>
        <p>每完成一幅仿拍，就盖下一枚印章；集齐一个国家的四幅，得到一枚国家纪念章。</p>
      </div>
      <div class="explore-stats"><div><b>${explored()}</b><span>已探索国家</span></div><div><b>${total}</b><span>作品印章</span></div><div><b>${countries.reduce((n, x) => n + (doneCount(x.id) === 4 ? 1 : 0), 0)}</b><span>国家纪念章</span></div></div>
    </div>
    <div class="passport-grid">
      <div>
        <div class="passport-cover" id="passportCover" tabindex="0" role="button" aria-label="打开护照内页" style="background:${passport.cover}">
          <div class="cover-inner">
            <div class="globe">◎</div>
            <h2>ART<br>PASSPORT</h2>
            <p>WORLD ART EXPLORER</p>
            <div class="cover-mark">✳</div>
            <p>与画相逢 · MEET IN ART</p>
          </div>
          <div class="passport-no">PASSPORT NO. ${esc(passport.no)}</div>
        </div>
        <div class="cover-swatches"><span class="eyebrow">封面颜色</span>${COVERS.map(c => `<button class="swatch-btn ${passport.cover === c ? 'on' : ''}" data-cover="${c}" style="background:${c}" aria-label="封面颜色 ${c}"></button>`).join('')}</div>
        <p class="small muted cover-hint">双击封面打开内页 · 也可以 <button class="text-button" id="openBookBtn">打开内页 ↗</button></p>
      </div>
      <div class="passport-body">
        <div class="panel">
          <div class="eyebrow">TRAVEL RECORD</div>
          <h3>印章收藏 <span class="count">· ${total} / 20</span></h3>
          ${countries.map(c => `
            <div class="stamp-country">
              <div class="stamp-head"><span>${c.flag}</span><b>${c.name}</b><small>${doneCount(c.id)} / 4</small><span class="seal ${doneCount(c.id) === 4 ? 'on' : ''}">${doneCount(c.id) === 4 ? 'COUNTRY SEAL ✳' : '未集齐'}</span></div>
              <div class="stamp-grid">${worksOf(c.id).map(w => {
                const done = isDone(w.id);
                return `<div class="stamp ${done ? 'done' : ''}" title="${w.title}"><b>${w.title.length > 7 ? w.title.slice(0, 7) + '…' : w.title}</b><small>${done ? workDate(w.id) : 'LOCKED'}</small></div>`;
              }).join('')}</div>
            </div>`).join('')}
        </div>
        <div class="panel">
          <div class="eyebrow">MY ART GALLERY</div>
          <h3>我的作品集</h3>
          ${records.length ? `<div class="gallery-grid">${records.map(r => {
            const w = allArtworks.find(x => x.id === r.artworkId);
            const photo = r.attempts[1]?.dataUrl || r.attempts[0]?.dataUrl || '';
            return `<article class="gallery-card"><img src="${photo}" alt=""><div><h4>${w ? w.title : r.artworkId}</h4><p class="small muted">${new Date(r.savedAt).toLocaleString('zh-CN')}</p><div class="gallery-actions"><button class="text-button" data-open="${r.id}">打开</button><button class="text-button danger" data-del="${r.id}">删除</button></div></div></article>`;
          }).join('')}</div>` : '<div class="empty-note">还没有作品。完成两次尝试并保存后，这里会出现你的第一件收藏。</div>'}
        </div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ render */
function render() {
  const inner = page === 'explore' ? exploreView() : page === 'studio' ? studioView() : passportView();
  shell(inner);
  if (page === 'explore') { bindMap(); bindGrid(); }
  if (page === 'studio') bindStudio();
  if (page === 'passport') bindPassport();
}

function bind() {
  for (const b of app.querySelectorAll<HTMLElement>('[data-nav]')) {
    b.onclick = (e) => { e.preventDefault(); page = b.dataset.nav as Page; render(); };
  }
}
function bindMap() {
  const frame = app.querySelector<HTMLElement>('#mapFrame')!;
  const tip = app.querySelector<HTMLElement>('#mapTip')!;
  const show = (id: string, dot: HTMLElement) => {
    const c = countryOf(id)!; const done = doneCount(id);
    tip.innerHTML = `<div class="tip-top"><span class="eyebrow">${c.region} · ${c.era}</span><span class="tip-star">✳</span></div>
      <h4>${c.name} <span>${c.flag}</span></h4>
      <p class="small muted">${c.artists}</p>
      <p class="tip-desc">${c.desc}</p>
      <div class="tip-thumbs">${worksOf(id).slice(0, 3).map(w => `<button data-tip-art="${w.id}">${thumb(w, 'tiny')}<span>${w.title}</span></button>`).join('')}</div>
      <div class="tip-foot"><span>${done} / 4 COLLECTED</span><button data-tip-all="${id}">查看全部 ↗</button></div>`;
    tip.classList.add('show');
    const fr = frame.getBoundingClientRect(), dr = dot.getBoundingClientRect();
    let x = dr.left - fr.left + 18, y = dr.top - fr.top + 16;
    if (x + 300 > frame.clientWidth) x = dr.left - fr.left - 300;
    if (y + 290 > frame.clientHeight) y = Math.max(8, frame.clientHeight - 300);
    tip.style.left = Math.max(8, x) + 'px'; tip.style.top = Math.max(8, y) + 'px';
    for (const b of tip.querySelectorAll<HTMLElement>('[data-tip-art]')) b.onclick = () => selectArtwork(b.dataset.tipArt!);
    const all = tip.querySelector<HTMLElement>('[data-tip-all]');
    if (all) all.onclick = () => { selectCountry(id); tip.classList.remove('show'); };
    for (const img of tip.querySelectorAll<HTMLImageElement>('img[data-img]')) watchImage(img);
  };
  for (const dot of app.querySelectorAll<HTMLElement>('.map-dot')) {
    dot.onmouseenter = () => show(dot.dataset.country!, dot);
    dot.onfocus = () => show(dot.dataset.country!, dot);
    dot.onclick = (e) => { e.stopPropagation(); selectCountry(dot.dataset.country!); };
  }
  for (const row of app.querySelectorAll<HTMLElement>('.country-row')) {
    row.onclick = () => selectCountry(row.dataset.country!);
    row.onmouseenter = () => { const d = app.querySelector<HTMLElement>(`.map-dot[data-country="${row.dataset.country}"]`); if (d) show(row.dataset.country!, d); };
  }
  frame.onmouseleave = (e) => { const to = e.relatedTarget as HTMLElement | null; if (!(to && to.closest && to.closest('.map-tip'))) tip.classList.remove('show'); };
  tip.onmouseleave = () => tip.classList.remove('show');
  const zoom = (f: number) => { mapZoom = Math.min(1.9, Math.max(1, +(mapZoom * f).toFixed(2))); app.querySelector<HTMLElement>('#mapPlane')!.style.transform = `scale(${mapZoom})`; };
  app.querySelector<HTMLElement>('#zoomIn')!.onclick = () => zoom(1.2);
  app.querySelector<HTMLElement>('#zoomOut')!.onclick = () => zoom(.83);
  app.querySelector<HTMLElement>('#zoomReset')!.onclick = () => { mapZoom = 1; app.querySelector<HTMLElement>('#mapPlane')!.style.transform = 'scale(1)'; };
}
function bindGrid() {
  for (const card of app.querySelectorAll<HTMLElement>('[data-art]')) card.onclick = () => selectArtwork(card.dataset.art!);
  for (const card of app.querySelectorAll<HTMLElement>('[data-demo]')) card.onclick = () => selectArtwork(card.dataset.demo!);
  for (const img of app.querySelectorAll<HTMLImageElement>('img[data-img]')) watchImage(img);
  const search = app.querySelector<HTMLInputElement>('#artSearch')!;
  search.oninput = () => { query = search.value; renderGrid(); };
  for (const chip of app.querySelectorAll<HTMLElement>('[data-level]')) chip.onclick = () => { levelFilter = Number(chip.dataset.level); renderGrid(); };
}
function renderGrid() {
  const grid = app.querySelector<HTMLElement>('#artGrid');
  if (!grid) return;
  const q = query.trim().toLowerCase();
  const list = worksOf(countryId).filter(w => (levelFilter === 0 || w.level === levelFilter) && (!q || w.title.toLowerCase().includes(q) || w.englishTitle.toLowerCase().includes(q) || w.artist.toLowerCase().includes(q)));
  grid.innerHTML = artCards(list);
  for (const card of grid.querySelectorAll<HTMLElement>('[data-art]')) card.onclick = () => selectArtwork(card.dataset.art!);
  for (const img of grid.querySelectorAll<HTMLImageElement>('img[data-img]')) watchImage(img);
  for (const chip of app.querySelectorAll<HTMLElement>('[data-level]')) chip.classList.toggle('on', Number(chip.dataset.level) === levelFilter);
}
function watchImage(img: HTMLImageElement) {
  const host = img.closest('.art-thumb');
  if (!host) return;
  const fail = () => host.classList.add('missing');
  const ok = () => host.classList.add('loaded');
  if (img.complete) { if (img.naturalWidth > 0) ok(); else fail(); }
  img.addEventListener('load', ok, {once: true});
  img.addEventListener('error', fail, {once: true});
}
function selectCountry(id: string) { countryId = id; query = ''; levelFilter = 0; render(); }
function selectArtwork(id: string) {
  const found = allArtworks.find(w => w.id === id);
  if (!found) return;
  art = found; attempts = [null, null]; reflection = ''; active = 0; sessionId = crypto.randomUUID(); referencePalette = [];
  page = 'studio'; render(); void updateReference();
}

/* ------------------------------------------------------------------ studio logic */
function bindStudio() {
  const ref = app.querySelector<HTMLImageElement>('img[data-ref-img]');
  if (ref) ref.onerror = () => { ref.style.visibility = 'hidden'; ref.parentElement!.classList.add('missing'); };
  for (const input of app.querySelectorAll<HTMLInputElement>('[data-upload]')) input.onchange = () => { const f = input.files?.[0]; if (!f) return; const index = Number(input.dataset.upload); void run(async () => { attempts[index] = await createAttempt(f, f.name, 'user-upload'); active = index; }); };
  for (const b of app.querySelectorAll<HTMLElement>('.demo-single')) b.onclick = () => void run(() => loadDemo(Number(b.dataset.slot)));
  for (const b of app.querySelectorAll<HTMLElement>('.attempt-tab')) b.onclick = () => { active = Number(b.dataset.slot); render(); };
  for (const b of app.querySelectorAll<HTMLElement>('.mirror')) b.onclick = () => void run(async () => { const index = Number(b.dataset.slot), a = attempts[index]!; const blob = photoBlob(a.dataUrl); const next = await createAttempt(blob, a.filename, a.provenance, true); next.mirrored = !a.mirrored; attempts[index] = next; active = index; });
  const toggle = app.querySelector<HTMLInputElement>('#show-points');
  if (toggle) toggle.onchange = (e) => { showPoints = (e.target as HTMLInputElement).checked; drawAll(); };
  const text = app.querySelector<HTMLTextAreaElement>('#reflection-text');
  if (text) text.oninput = (e) => { reflection = (e.target as HTMLTextAreaElement).value; };
  const pair = app.querySelector<HTMLElement>('#load-pair');
  if (pair) pair.onclick = () => void run(async () => { await loadDemo(0); await loadDemo(1); toast('示例已分析。内置照片为 AI 合成素材。'); });
  const save = app.querySelector<HTMLElement>('#save');
  if (save) save.onclick = async () => { try { await saveSession(session()); records = await listSessions(); toast('已保存到当前浏览器。'); render(); } catch { toast('本机保存失败，可能是浏览器存储空间不足。请先导出对比图或数据。'); } };
  const ej = app.querySelector<HTMLElement>('#export-json');
  if (ej) ej.onclick = () => exportJSON(session());
  const ep = app.querySelector<HTMLElement>('#export-png');
  if (ep) ep.onclick = () => void run(async () => { await document.fonts.ready; await exportPNG(art, session()); toast('对比图已导出。'); });
}
function bindPassport() {
  const open = () => openBook({records, artworks: allArtworks});
  const cover = app.querySelector<HTMLElement>('#passportCover');
  if (cover) {
    cover.ondblclick = open;
    cover.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
  }
  const openBtn = app.querySelector<HTMLElement>('#openBookBtn');
  if (openBtn) openBtn.onclick = open;
  for (const b of app.querySelectorAll<HTMLElement>('[data-cover]')) b.onclick = () => { passport.cover = b.dataset.cover!; savePassport(); render(); };
  for (const b of app.querySelectorAll<HTMLElement>('[data-open]')) b.onclick = () => restore(b.dataset.open!);
  for (const b of app.querySelectorAll<HTMLElement>('[data-del]')) b.onclick = async () => { try { await removeSession(b.dataset.del!); records = await listSessions(); render(); toast('已删除此记录。'); } catch { toast('删除失败，请重试。'); } };
}
function restore(id: string) {
  const r = records.find(x => x.id === id);
  if (!r) return;
  const found = allArtworks.find(w => w.id === r.artworkId);
  if (!found) { toast('这条记录对应的作品不在当前作品库中。'); return; }
  art = found; attempts = structuredClone(r.attempts); reflection = r.reflection; sessionId = r.id; active = 1;
  page = 'studio'; render(); void updateReference();
}

/* ------------------------------------------------------------------ attempts */
function drawAll() {
  for (const canvas of app.querySelectorAll<HTMLCanvasElement>('canvas.skeleton')) {
    const image = canvas.parentElement!.querySelector<HTMLImageElement>('.pose-image')!;
    const renderPoints = () => {
      const frame = canvas.parentElement!.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(frame.width * 2)); canvas.height = Math.max(1, Math.round(frame.height * 2));
      const ctx = canvas.getContext('2d')!; ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!showPoints || !image.naturalWidth) return;
      const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight), w = image.naturalWidth * scale, h = image.naturalHeight * scale, ox = (canvas.width - w) / 2, oy = (canvas.height - h) / 2;
      const key = canvas.dataset.points!; const points = key === 'reference' ? art.reference : attempts[Number(key)]?.analysis.points || {};
      ctx.strokeStyle = key === 'reference' ? '#fbdf8c' : '#9be8e0'; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 3.5; ctx.shadowColor = '#17231a'; ctx.shadowBlur = 4;
      for (const [a, b] of CONNECTIONS) if (reliable(points[a]) && reliable(points[b])) { ctx.beginPath(); ctx.moveTo(ox + points[a]!.x * w, oy + points[a]!.y * h); ctx.lineTo(ox + points[b]!.x * w, oy + points[b]!.y * h); ctx.stroke(); }
      for (const id of [11, 12, 13, 14, 15, 16]) if (reliable(points[id])) { const p = points[id]!; ctx.beginPath(); ctx.arc(ox + p.x * w, oy + p.y * h, 6, 0, Math.PI * 2); ctx.fill(); }
    };
    if (image.complete) renderPoints(); else image.addEventListener('load', renderPoints, {once: true});
  }
}
function session(): ComparisonSession { return {schemaVersion: 1, id: sessionId, artworkId: art.id, attempts, reflection, savedAt: new Date().toISOString(), modelVersion: MODEL_VERSION, algorithmVersion: ALGORITHM_VERSION}; }
async function updateReference() {
  const id = art.id;
  try { const c = await canvasFromUrl(art.image); if (art.id !== id) return; art.frame = {width: c.width, height: c.height}; referencePalette = paletteFrom(c); }
  catch { referencePalette = []; }
  if (art.id === id) render();
}
async function createAttempt(blob: Blob, filename: string, provenance: Attempt['provenance'], mirrored = false): Promise<Attempt> {
  const canvas = await decodePhoto(blob, mirrored); const palette = paletteFrom(canvas); let analysis;
  try {
    const result = await detect(canvas);
    if (result.poses.length === 0) analysis = emptyAnalysis('no-person', '没有找到清晰的人物。请让一位人物的肩膀和手臂完整入镜，改善光线后再试。');
    else if (result.poses.length > 1) analysis = emptyAnalysis('multiple-people', '识别到多个人物。请使用只有一位人物的照片，避免误把别人的姿态用于比较。');
    else {
      const points: Points = Object.fromEntries(result.poses[0].map((p, i) => [i, p]));
      const cmp = comparePose(art.reference, art.frame, points, {width: canvas.width, height: canvas.height});
      analysis = art.annotated ? {...cmp, palette, inferenceMs: result.inferenceMs}
        : {...cmp, status: 'partial', reason: '这幅画还没有标注参考点，暂不比较姿态；配色与观察仍可使用。', poseError: null, composition: null, advice: [], palette, inferenceMs: result.inferenceMs};
    }
    analysis.inferenceMs = result.inferenceMs;
  } catch (error) {
    console.warn('Pose inference unavailable:', error);
    analysis = emptyAnalysis('model-error', 'AI 姿态识别暂不可用。请确认通过本地服务打开网页，且离线包中的模型和 WASM 文件齐全。配色仍可观察；本次没有生成姿态判断。');
  }
  analysis.palette = palette;
  return {id: crypto.randomUUID(), dataUrl: canvas.toDataURL('image/jpeg', .9), width: canvas.width, height: canvas.height, filename, provenance, mirrored, analysis, createdAt: new Date().toISOString()};
}
async function run(task: () => Promise<void>) { if (busy) return; busy = true; render(); try { await task(); } catch (error) { toast(error instanceof Error ? error.message : String(error)); } finally { busy = false; render(); } }
async function loadDemo(index: number) { const url = art.demo![index]; const r = await fetch(url); if (!r.ok) throw new Error('示例图片缺失，请检查离线素材包。'); attempts[index] = await createAttempt(await r.blob(), url.split('/').pop()!, 'ai-generated'); active = index; }

/* ------------------------------------------------------------------ boot */
render();
void updateReference();
listSessions().then(items => {
  records = items;
  render();
  if (new URLSearchParams(location.search).get('book') === '1' && page === 'passport') openBook({records, artworks: allArtworks});
}).catch(() => toast('当前浏览器不支持本机保存，仍可使用导出功能。'));
