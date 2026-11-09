(function () {
  'use strict';
  const { t, tx, ttl, esc, TTS } = App;
  let INDEX = [];
  let query = '';
  const ROMAN = ['', 'I', 'II', 'III', 'IV', 'A'];
  const PHRASES = [
    { ca: 'Bon dia!', en: 'Good morning!', ko: '좋은 아침!', es: '¡Buenos días!' },
    { ca: 'Com et dius?', en: 'What’s your name?', ko: '이름이 뭐야?', es: '¿Cómo te llamas?' },
    { ca: 'Parles català?', en: 'Do you speak Catalan?', ko: '카탈루냐어 할 줄 알아?', es: '¿Hablas catalán?' },
    { ca: 'Moltes gràcies!', en: 'Thank you very much!', ko: '정말 고마워요!', es: '¡Muchas gracias!' },
    { ca: 'Fins demà!', en: 'See you tomorrow!', ko: '내일 봐!', es: '¡Hasta mañana!' }
  ];

  App.header();

  fetch('data/index.json').then(r => r.json()).then(d => { INDEX = d; render(); })
    .catch(() => { document.getElementById('main').innerHTML = '<div class="empty">⚠️ data/index.json</div>'; });
  document.addEventListener('langchange', render);

  function scoreChip(id) {
    const s = App.scores()[id];
    if (!s) return `<span class="chip">${t('notyet')}</span>`;
    const cls = s.best >= 80 ? '' : s.best >= 50 ? 'mid' : 'low';
    return `<span class="chip score ${cls}">★ ${t('best')} ${s.best}%</span>`;
  }

  function render() {
    const scores = App.scores();
    const totalQ = INDEX.reduce((a, c) => a + c.nEx, 0);
    const doneIds = Object.keys(scores).filter(k => INDEX.some(c => String(c.id) === k));
    const avg = doneIds.length ? Math.round(doneIds.reduce((a, k) => a + scores[k].best, 0) / doneIds.length) : 0;
    const pctDone = INDEX.length ? Math.round(doneIds.length / INDEX.length * 100) : 0;
    const q = query.trim().toLowerCase();
    const match = c => !q || [c.title.ca, c.title.en, c.title.ko, c.title.es, tx(c.summary), ...c.sections.map(s => [s.ca, tx(s)].join(' '))]
      .join(' ').toLowerCase().includes(q) || String(c.id) === q;

    const parts = [1, 2, 3, 4, 5].map(p => {
      const list = INDEX.filter(c => c.part === p && match(c));
      if (!list.length) return '';
      return `<section class="part"><div class="part-h"><span class="roman">${ROMAN[p]}</span><h2>${esc(t('part' + p).replace(/^[^·]*·\s*/, ''))}</h2></div>
        <div class="grid">${list.map(card).join('')}</div></section>`;
    }).join('');

    document.getElementById('main').innerHTML = `
      <section class="hero">
        <div>
          <span class="eyebrow"><span class="senyera"></span> Gramàtica catalana</span>
          <h1>Aprenem <em>català</em>, capítol a capítol.</h1>
          <p class="lead">${esc(t('tagline'))}</p>
          <div class="hero-cta">
            <a class="btn primary" href="chapter.html?c=1">▶ ${esc(t('start'))}</a>
            <a class="btn" href="chapter.html?c=21">📘 ${esc(t('part5').replace(/^[^·]*·\s*/, ''))}</a>
          </div>
        </div>
        <div class="hero-card">
          ${PHRASES.map(p => `<div class="phrase">${TTS.button(p.ca)}<div><div class="ca">${esc(p.ca)}</div><div class="tr">${esc(tx(p))}</div></div></div>`).join('')}
        </div>
      </section>
      <h3 style="margin:0 0 10px">📊 ${esc(t('progress'))}</h3>
      <div class="stats">
        <div class="stat"><div class="n">${INDEX.length}</div><div class="l">${esc(t('chapters'))}</div></div>
        <div class="stat"><div class="n">${totalQ}</div><div class="l">${esc(t('total'))}</div></div>
        <div class="stat"><div class="n">${doneIds.length}<small style="font-size:16px;color:var(--muted)"> / ${INDEX.length}</small></div><div class="l">${esc(t('done'))}</div><div class="bar"><i style="width:${pctDone}%"></i></div></div>
        <div class="stat"><div class="n">${avg}%</div><div class="l">${esc(t('avg'))}</div><div class="bar"><i style="width:${avg}%"></i></div></div>
      </div>
      <div class="toolbar"><input class="search" id="search" type="search" placeholder="🔎 ${esc(t('search'))}" value="${esc(query)}"></div>
      ${parts || `<div class="empty">—</div>`}`;

    const s = document.getElementById('search');
    s.oninput = () => { query = s.value; const pos = s.selectionStart; render(); const n = document.getElementById('search'); n.focus(); n.setSelectionRange(pos, pos); };
    document.getElementById('foot').textContent = t('footer');
    const rb = document.getElementById('resetBtn');
    rb.textContent = t('reset');
    rb.onclick = () => { if (confirm(t('resetQ'))) { App.store.set('scores', {}); render(); } };
  }

  function card(c) {
    const label = c.id === 21 ? 'A' : c.id;
    return `<a class="card" href="chapter.html?c=${c.id}">
      <div class="top"><span class="num">${label}</span><span class="ico">${c.icon}</span></div>
      <h3>${esc(ttl(c.title))}</h3>
      ${App.lang !== 'ca' ? `<div class="ca-t">${esc(c.title.ca)}</div>` : ''}
      <p>${esc(tx(c.summary))}</p>
      <div class="meta"><span class="chip">📚 ${c.sections.length} ${esc(t('sections'))}</span><span class="chip">✏️ ${c.nEx} ${esc(t('exercises'))}</span>${scoreChip(c.id)}</div>
    </a>`;
  }
})();
