export function mountSplash() {
  const param = new URLSearchParams(location.search).get('splash');
  if (param === '0') { sessionStorage.setItem('mia.splash', '1'); return; }
  const force = param === '1' || param === 'shoot' || param === 'hold';
  if (!force && sessionStorage.getItem('mia.splash')) return;
  sessionStorage.setItem('mia.splash', '1');

  const el = document.createElement('div');
  el.className = 'splash';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', '开场');
  el.innerHTML = `
    <div class="splash-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <div class="splash-inner">
      <div class="splash-eyebrow">PORTRAITURE THROUGH TIME</div>
      <p class="splash-line l1">人类描绘自己的历史，<br>远比我们想象的更加悠久。</p>
      <p class="splash-line l2">一幅肖像画，从来不只是对一个人外貌的简单记录。<br>它是一个时代对人的理解。</p>
      <p class="splash-line l3">如果我们不再只是观看，<br>而是尝试成为画中的人呢？</p>
      <button class="splash-enter" id="splashEnter">按下快门，走进画框 <span aria-hidden="true">◉</span></button>
    </div>
    <div class="splash-rec"><i></i>READY</div>
    <button class="splash-skip" id="splashSkip">跳过</button>
    <div class="iris" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <mask id="irisHole">
            <rect width="100" height="100" fill="white"/>
            <circle class="iris-hole" cx="50" cy="50" r="130" fill="black"/>
          </mask>
        </defs>
        <rect width="100" height="100" fill="#0b0907" mask="url(#irisHole)"/>
        <g class="iris-blades">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(214,190,150,.22)" stroke-width=".35"/>
          <g stroke="rgba(214,190,150,.2)" stroke-width=".3">
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(0 50 50)"/>
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(60 50 50)"/>
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(120 50 50)"/>
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(180 50 50)"/>
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(240 50 50)"/>
            <line x1="50" y1="6" x2="50" y2="94" transform="rotate(300 50 50)"/>
          </g>
        </g>
      </svg>
    </div>
    <div class="flash" aria-hidden="true"></div>
  `;
  document.body.appendChild(el);
  document.body.style.overflow = 'hidden';

  const finish = () => {
    document.body.style.overflow = '';
    el.classList.add('done');
    setTimeout(() => el.remove(), 750);
  };

  const shoot = () => {
    if (el.classList.contains('shooting')) return;
    el.classList.add('shooting');
    shutterSound();
    if (param !== 'hold') setTimeout(finish, 620);
  };

  el.querySelector('#splashEnter')?.addEventListener('click', shoot);
  el.querySelector('#splashSkip')?.addEventListener('click', finish);
  if (param === 'shoot' || param === 'hold') setTimeout(shoot, 900);
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Enter') {
      document.removeEventListener('keydown', onKey);
      e.key === 'Escape' ? finish() : shoot();
    }
  });
}

function shutterSound() {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const click = (at: number, gainValue: number, freq: number) => {
      const len = Math.floor(ctx.sampleRate * 0.05);
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = freq;
      filter.Q.value = 1.2;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(gainValue, at);
      gain.gain.exponentialRampToValueAtTime(0.001, at + 0.08);
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start(at);
      src.stop(at + 0.1);
    };
    click(now, 0.5, 2600);
    click(now + 0.09, 0.35, 1800);
    setTimeout(() => ctx.close && ctx.close(), 600);
  } catch {}
}
