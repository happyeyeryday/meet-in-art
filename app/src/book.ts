import type {ComparisonSession, Artwork} from './types.ts';
import {countries} from './countries.ts';

/* ------------------------------------------------------------------
   护照内页：双页书 + 拖拽 DIY + 自动保存
   数据：localStorage 'meet-in-art.book.v1'
   { spread: number, pages: Item[][] }
------------------------------------------------------------------- */
const KEY = 'meet-in-art.book.v1';

export type ItemKind = 'photo' | 'original' | 'stamp' | 'seal' | 'sticker';
export interface BookItem {
  id: string; kind: ItemKind; ref: string;
  x: number; y: number; w: number; rot: number; z: number;
}
interface BookData { spread: number; pages: BookItem[][] }

export interface BookContext {
  records: ComparisonSession[];
  artworks: Artwork[];
  onClose?: () => void;
}

let data: BookData = loadBook();
let ctx: BookContext = {records: [], artworks: []};
let overlay: HTMLElement | null = null;
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function loadBook(): BookData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.pages)) {
        while (parsed.pages.length < 2) parsed.pages.push([]);
        return {spread: Number(parsed.spread) || 0, pages: parsed.pages};
      }
    }
  } catch {}
  return {spread: 0, pages: [[], []]};
}
function saveBook() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, 180);
}
function flush() {
  clearTimeout(saveTimer);
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

/* ---------------- 素材 ---------------- */
const photoOf = (s: ComparisonSession) => s.attempts[1]?.dataUrl || s.attempts[0]?.dataUrl || '';
const titleOf = (id: string) => ctx.artworks.find(a => a.id === id)?.title || id;
const dateOf = (id: string) => {
  const list = ctx.records.filter(r => r.artworkId === id).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  return list[0] ? new Date(list[0].savedAt).toLocaleDateString('zh-CN') : '';
};
function savedWorkIds(): string[] {
  return [...new Set(ctx.records.map(r => r.artworkId))];
}
function completedCountries() {
  return countries.filter(c => {
    const ids = ctx.artworks.filter(a => a.country === c.id).map(a => a.id);
    return ids.length > 0 && ids.every(id => ctx.records.some(r => r.artworkId === id));
  });
}

const STICKERS: Record<string, string> = {
  rose: `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="#9a5348" stroke-width="2"><circle cx="32" cy="26" r="13"/><circle cx="32" cy="26" r="8"/><circle cx="32" cy="26" r="3"/></g><g fill="#c98a86"><path d="M18 30c-6-2-9-8-6-13 4 3 7 7 8 11z"/><path d="M46 30c6-2 9-8 6-13-4 3-7 7-8 11z"/></g><path d="M32 39v14" stroke="#6f7a55" stroke-width="2"/><path d="M32 47c5-3 9-2 12 1-5 2-9 2-12 0z" fill="#7c8a5e"/></svg>`,
  leaf: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 52C14 30 30 14 52 12c2 22-14 40-38 40z" fill="#8a9a6b"/><path d="M18 48C28 34 38 24 50 16" stroke="#5f6f47" stroke-width="2" fill="none"/></svg>`,
  dome: `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="#8a6a44" stroke-width="1.6"><path d="M8 52h48M14 52V34h36v18M20 34V26h24v8"/><path d="M32 10c8 4 12 9 12 16H20c0-7 4-12 12-16z"/><path d="M32 6v4M26 52v-8M38 52v-8M22 26v-4M42 26v-4"/></g></svg>`,
  star: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6l5 21 21 5-21 5-5 21-5-21-21-5 21-5z" fill="#b59a6c"/></svg>`,
  seal: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22" fill="none" stroke="#8c3a2e" stroke-width="2" stroke-dasharray="4 3"/><circle cx="32" cy="32" r="16" fill="none" stroke="#8c3a2e" stroke-width="1.4"/><text x="32" y="38" text-anchor="middle" font-size="16" fill="#8c3a2e">✳</text></svg>`,
  ribbon: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 12h36v22l-18 10-18-10z" fill="#cbb08a"/><path d="M14 12h36v6H14z" fill="#a8895f"/><path d="M24 34v18l8-6 8 6V34" fill="#b59a6c"/></svg>`
};
const STICKER_LIST = ['rose', 'leaf', 'dome', 'star', 'seal', 'ribbon'];

const SIZE: Record<ItemKind, number> = {photo: 36, original: 30, stamp: 20, seal: 18, sticker: 13};

/* ---------------- 渲染 ---------------- */
function visual(item: BookItem): string {
  if (item.kind === 'photo') {
    const s = ctx.records.find(r => r.id === item.ref) || ctx.records[0];
    if (!s) return '<div class="bk-missing">照片已删除</div>';
    return `<img src="${photoOf(s)}" alt="">`;
  }
  if (item.kind === 'original') {
    const a = ctx.artworks.find(w => w.id === item.ref);
    return `<img src="${a ? a.image : ''}" alt="">`;
  }
  if (item.kind === 'stamp') {
    return `<div class="bk-stamp"><b>${titleOf(item.ref)}</b><small>${dateOf(item.ref)}</small></div>`;
  }
  if (item.kind === 'seal') {
    const c = countries.find(x => x.id === item.ref);
    return `<div class="bk-seal"><span>✳</span><b>${c ? c.name : item.ref}</b></div>`;
  }
  return STICKERS[item.ref] || '';
}
function itemHTML(item: BookItem): string {
  return `<div class="bk-item bk-${item.kind}" data-id="${item.id}" style="left:${item.x}%;top:${item.y}%;width:${item.w}%;transform:rotate(${item.rot}deg);z-index:${item.z}">
    ${visual(item)}<button class="bk-del" title="移除" aria-label="移除">×</button>
  </div>`;
}
function pageHTML(index: number): string {
  const items = data.pages[index] || [];
  return `<section class="book-page" data-page="${index}" data-side="${index % 2 === 0 ? 'left' : 'right'}">
    <div class="page-ornament"></div>
    ${items.length ? items.map(itemHTML).join('') : '<div class="page-empty">从左右两侧拖入照片与贴纸，摆成你的护照</div>'}
  </section>`;
}
function spreadHTML(): string {
  const a = data.spread * 2, b = a + 1;
  return `${pageHTML(a)}<div class="book-spine"></div>${pageHTML(b)}`;
}
function railItem(kind: ItemKind, ref: string, label: string, thumb: string, cls = ''): string {
  return `<button class="rail-item ${cls}" data-kind="${kind}" data-ref="${ref}" title="${label}">
    <span class="rail-thumb">${thumb}</span><span class="rail-name">${label}</span></button>`;
}
function leftRailHTML(): string {
  const photos = ctx.records.map(r => {
    const a = ctx.artworks.find(w => w.id === r.artworkId);
    return railItem('photo', r.id, a ? a.title : '我的仿拍', `<img src="${photoOf(r)}" alt="">`);
  }).join('');
  const originals = ctx.artworks.map(a => railItem('original', a.id, a.title, `<img src="${a.image}" alt="">`)).join('');
  return `
    <div class="rail-label">我的仿拍</div>
    <div class="rail-scroll">${photos || '<p class="rail-empty">完成并保存一幅仿拍后，你的照片会出现在这里。</p>'}</div>
    <div class="rail-label">原画</div>
    <div class="rail-scroll">${originals}</div>`;
}
function rightRailHTML(): string {
  const works = savedWorkIds();
  const stamps = works.map(id => railItem('stamp', id, titleOf(id), `<span class="mini-stamp">${titleOf(id).slice(0, 4)}</span>`, 'is-stamp')).join('');
  const seals = completedCountries().map(c => railItem('seal', c.id, c.name, `<span class="mini-seal">✳<b>${c.name}</b></span>`, 'is-seal')).join('');
  const stickers = STICKER_LIST.map(k => railItem('sticker', k, k, STICKERS[k], 'is-sticker')).join('');
  return `
    <div class="rail-label">印章</div>
    <div class="rail-scroll">${stamps}${seals}${stamps || seals ? '' : '<p class="rail-empty">完成一幅仿拍，就会得到对应的作品印章。</p>'}</div>
    <div class="rail-label">贴纸</div>
    <div class="rail-scroll">${stickers}</div>`;
}

/* ---------------- 交互 ---------------- */
function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }
function addItem(page: number, kind: ItemKind, ref: string, cx: number, cy: number) {
  if (!data.pages[page]) data.pages[page] = [];
  const w = SIZE[kind];
  const item: BookItem = {
    id: crypto.randomUUID(), kind, ref,
    x: clamp(cx - w / 2, 0, 100 - w), y: clamp(cy - w / 2, 0, 92),
    w, rot: Math.round((Math.random() * 10 - 5)), z: Date.now() % 100000
  };
  data.pages[page].push(item);
  saveBook();
  rerender();
  return item;
}
function removeItem(page: number, id: string) {
  data.pages[page] = (data.pages[page] || []).filter(i => i.id !== id);
  saveBook();
  rerender();
}
function startMove(e: PointerEvent, el: HTMLElement, page: number) {
  const item = (data.pages[page] || []).find(i => i.id === el.dataset.id);
  if (!item) return;
  const host = el.parentElement as HTMLElement;
  const rect = host.getBoundingClientRect();
  const start = {x: e.clientX, y: e.clientY, ix: item.x, iy: item.y};
  item.z = Date.now() % 100000;
  el.style.zIndex = String(item.z);
  el.setPointerCapture(e.pointerId);
  el.classList.add('dragging');
  const move = (ev: PointerEvent) => {
    item.x = clamp(start.ix + (ev.clientX - start.x) / rect.width * 100, -4, 96);
    item.y = clamp(start.iy + (ev.clientY - start.y) / rect.height * 100, -4, 96);
    el.style.left = item.x + '%';
    el.style.top = item.y + '%';
  };
  const up = () => {
    el.classList.remove('dragging');
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    saveBook();
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
}
function startFromTray(e: PointerEvent, kind: ItemKind, ref: string) {
  const ghost = document.createElement('div');
  ghost.className = 'bk-ghost';
  ghost.style.width = '80px';
  ghost.innerHTML = `<div class="bk-${kind}">${visual({id: 'ghost', kind, ref, x: 0, y: 0, w: SIZE[kind], rot: 0, z: 0})}</div>`;
  document.body.appendChild(ghost);
  const move = (ev: PointerEvent) => { ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px'; };
  move(e);
  const up = (ev: PointerEvent) => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', up);
    ghost.remove();
    const pageEl = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.book-page') as HTMLElement | null;
    if (!pageEl) return;
    const rect = pageEl.getBoundingClientRect();
    addItem(Number(pageEl.dataset.page), kind, ref,
      (ev.clientX - rect.left) / rect.width * 100,
      (ev.clientY - rect.top) / rect.height * 100);
  };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up);
}

/* ---------------- 外框 ---------------- */
function rerender() {
  if (!overlay) return;
  const spread = overlay.querySelector('#bookSpread') as HTMLElement;
  if (spread) spread.innerHTML = spreadHTML();
  const pager = overlay.querySelector('.book-pager');
  if (pager) pager.textContent = `${data.spread + 1} / ${Math.ceil(data.pages.length / 2)}`;
  bindPages();
}

function bindPages() {
  if (!overlay) return;
  overlay.querySelectorAll<HTMLElement>('.bk-item').forEach(el => {
    el.addEventListener('pointerdown', ev => {
      if ((ev.target as HTMLElement).closest('.bk-del')) return;
      ev.preventDefault();
      startMove(ev, el, Number(el.closest('.book-page')!.getAttribute('data-page')));
    });
  });
  overlay.querySelectorAll<HTMLElement>('.bk-del').forEach(btn => {
    btn.addEventListener('click', ev => {
      ev.stopPropagation();
      const page = Number(btn.closest('.book-page')!.getAttribute('data-page'));
      const id = (btn.closest('.bk-item') as HTMLElement).dataset.id!;
      removeItem(page, id);
    });
  });
}

export function openBook(context: BookContext) {
  ctx = context;
  if (overlay) { overlay.classList.add('open'); rerender(); return; }
  overlay = document.createElement('div');
  overlay.className = 'book-overlay open';
  overlay.innerHTML = `
    <div class="book-toolbar">
      <div><span class="eyebrow">INNER PAGES · 护照内页</span><span class="book-sub">拖动照片与印章排版 · 自动保存</span></div>
      <div class="book-actions">
        <button class="book-btn" data-act="add">＋ 加一页</button>
        <button class="book-btn" data-act="close">合上护照 ✕</button>
      </div>
    </div>
    <div class="book-body">
      <aside class="book-rail" aria-label="我的仿拍与原画">${leftRailHTML()}</aside>
      <div class="book-stage">
        <button class="book-nav prev" data-act="prev" aria-label="上一页">‹</button>
        <div class="book-spread" id="bookSpread"></div>
        <button class="book-nav next" data-act="next" aria-label="下一页">›</button>
      </div>
      <aside class="book-rail" aria-label="印章与贴纸">${rightRailHTML()}</aside>
    </div>
    <div class="book-pager"></div>`;
  document.body.appendChild(overlay);
  document.body.classList.add('book-open');

  const spread = overlay.querySelector('#bookSpread')!;
  spread.innerHTML = spreadHTML();
  bindPages();

  overlay.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest('[data-act]') as HTMLElement | null;
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'close') closeBook();
    if (act === 'prev' && data.spread > 0) { data.spread--; saveBook(); rerender(); }
    if (act === 'next') { const max = Math.ceil(data.pages.length / 2) - 1; if (data.spread < max) { data.spread++; saveBook(); rerender(); } }
    if (act === 'add') { data.pages.push([], []); data.spread = Math.ceil(data.pages.length / 2) - 1; saveBook(); rerender(); }
  });

  overlay.querySelectorAll<HTMLElement>('.rail-item').forEach(el => {
    el.addEventListener('pointerdown', ev => {
      ev.preventDefault();
      startFromTray(ev, el.dataset.kind as ItemKind, el.dataset.ref!);
    });
  });

  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeBook(); };
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('remove', () => document.removeEventListener('keydown', onKey));
  (overlay as any)._onKey = onKey;

  rerender();
}

export function closeBook() {
  if (!overlay) return;
  flush();
  const onKey = (overlay as any)._onKey;
  if (onKey) document.removeEventListener('keydown', onKey);
  overlay.remove();
  overlay = null;
  document.body.classList.remove('book-open');
  ctx.onClose?.();
}

