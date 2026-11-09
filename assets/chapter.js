(function () {
  'use strict';
  const { t, tx, ttl, esc, rich, TTS, shuffle } = App;
  const params = new URLSearchParams(location.search);
  const CID = Math.max(1, Math.min(21, parseInt(params.get('c') || '1', 10) || 1));
  const pad = n => String(n).padStart(2, '0');
  let CH = null, INDEX = [];
  let tab = (location.hash || '#learn').slice(1);
  if (!['learn', 'vocab', 'practice'].includes(tab)) tab = 'learn';
  let order = [];          // exercise indexes in display order
  let state = {};          // idx -> {resp, done, ok}
  let secFilter = 'all';
  let showResult = false;
  const ACCENTS = ['à', 'è', 'é', 'í', 'ï', 'ò', 'ó', 'ú', 'ü', 'ç', 'l·l', '’'];
  let lastInput = null;

  App.header({ back: true });

  Promise.all([
    fetch(`data/ch${pad(CID)}.json`).then(r => r.json()),
    fetch('data/index.json').then(r => r.json()).catch(() => [])
  ]).then(([d, idx]) => {
    CH = d; INDEX = idx;
    order = CH.exercises.map((_, i) => i);
    render();
  }).catch(() => { document.getElementById('main').innerHTML = '<div class="empty">⚠️ Chapter not found.</div>'; });

  document.addEventListener('langchange', () => { capture(); render(); });

  // ---------- helpers ----------
  const norm = s => String(s).normalize('NFC').toLowerCase().replace(/['`´]/g, '’').replace(/l\.l/g, 'l·l')
    .replace(/[\s ]+/g, ' ').trim().replace(/^[¿¡]+/, '').replace(/[.?!…,;:]+$/, '').trim();
  const typeLabel = ty => ({ mc: 'A/B/C', fill: '✍️', tf: 'O / X', order: '🔀', match: '🔗' }[ty]);

  function capture() {
    // keep typed text when re-rendering
    document.querySelectorAll('.q[data-i]').forEach(el => {
      const i = +el.dataset.i, st = state[i] || (state[i] = {});
      const inp = el.querySelector('input.fill');
      if (inp && !st.done) st.resp = inp.value;
    });
  }

  // ---------- render ----------
  function render() {
    document.title = `${CH.title.ca} · Català`;
    const label = CID === 21 ? 'A' : CID;
    const partName = t('part' + CH.part);
    document.getElementById('main').innerHTML = `
      <section class="ch-hero">
        <div class="crumbs"><a href="index.html">${esc(t('home'))}</a> › ${esc(partName)}</div>
        <h1><span>${CH.icon}</span><span>${CID === 21 ? '' : esc(t('chapters').replace(/s$/, '')) + ' '}${label}. ${esc(ttl(CH.title))}</span></h1>
        ${App.lang !== 'ca' ? `<div class="ca-title">${TTS.button(CH.title.ca)} ${esc(CH.title.ca)}</div>` : ''}
        <p class="summary">${rich(tx(CH.summary))}</p>
      </section>
      <nav class="tabs" role="tablist">
        <button class="tab ${tab === 'learn' ? 'on' : ''}" data-tab="learn">📖 ${esc(t('learn'))} <span class="cnt">${CH.sections.length}</span></button>
        <button class="tab ${tab === 'vocab' ? 'on' : ''}" data-tab="vocab">🗣️ ${esc(t('vocab'))} <span class="cnt">${CH.vocab.length}</span></button>
        <button class="tab ${tab === 'practice' ? 'on' : ''}" data-tab="practice">✏️ ${esc(t('practice'))} <span class="cnt">${CH.exercises.length}</span></button>
      </nav>
      <div id="pane"></div>
      ${pager()}`;
    document.querySelectorAll('.tab').forEach(b => b.onclick = () => {
      capture(); tab = b.dataset.tab; history.replaceState(null, '', '#' + tab);
      document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === b));
      renderPane(); window.scrollTo({ top: document.querySelector('.tabs').offsetTop - 60, behavior: 'smooth' });
    });
    document.getElementById('foot').textContent = t('footer');
    renderPane();
  }

  function pager() {
    const prev = INDEX.find(c => c.id === CID - 1), next = INDEX.find(c => c.id === CID + 1);
    const lab = c => (c.id === 21 ? 'A' : c.id) + '. ' + ttl(c.title);
    return `<div class="pager">
      ${prev ? `<a href="chapter.html?c=${prev.id}"><small>← ${esc(t('prev'))}</small><b>${esc(lab(prev))}</b></a>` : '<span></span>'}
      ${next ? `<a class="nx" href="chapter.html?c=${next.id}"><small>${esc(t('next'))} →</small><b>${esc(lab(next))}</b></a>` : `<a class="nx" href="index.html"><small>🏠</small><b>${esc(t('home'))}</b></a>`}
    </div>`;
  }

  function renderPane() {
    const p = document.getElementById('pane');
    if (tab === 'learn') p.innerHTML = learnHTML(), bindLearn();
    else if (tab === 'vocab') p.innerHTML = vocabHTML();
    else { p.innerHTML = practiceHTML(); bindPractice(); }
  }

  // ---------- learn ----------
  function learnHTML() {
    const toc = CH.sections.map(s => `<a href="#s-${esc(s.id)}" data-sec="${esc(s.id)}">${esc(s.id)} ${esc(ttl(s.title))}</a>`).join('');
    const secs = CH.sections.map(s => {
      const tb = s.table ? tableHTML(s.table) : '';
      const exs = (s.examples || []).map(e => `<div class="example">${TTS.button(e.ca)}<div><div class="ca">${esc(e.ca)}</div><div class="tr">${esc(tx(e))}</div></div></div>`).join('');
      const allText = (s.examples || []).map(e => e.ca).join(' ');
      return `<article class="sec" id="s-${esc(s.id)}">
        <h2><span class="sid">${esc(s.id)}</span> ${esc(ttl(s.title))}</h2>
        ${App.lang !== 'ca' ? `<div class="sca">${esc(s.title.ca)}</div>` : ''}
        <ul class="points">${s.points.map(pt => `<li>${rich(tx(pt))}</li>`).join('')}</ul>
        ${tb}
        ${exs ? `<div class="ex-h">💬 ${esc(t('examples'))} <button class="btn sm ghost" data-say="${esc(allText)}">▶ ${esc(t('speakAll'))}</button></div>${exs}` : ''}
      </article>`;
    }).join('');
    const goals = (CH.goals || []).map(g => `<li>${rich(tx(g))}</li>`).join('');
    return `<div class="layout"><aside class="toc">${toc}</aside><div>
      ${goals ? `<div class="goals"><h3>🎯 ${esc(t('goals'))}</h3><ul>${goals}</ul></div>` : ''}
      ${secs}
      <div style="text-align:center;margin:26px 0"><button class="btn primary" id="goPractice">✏️ ${esc(t('practice'))} (${CH.exercises.length}) →</button></div>
    </div></div>`;
  }
  function tableHTML(tb) {
    const sp = new Set(tb.speak || []);
    return `<div class="tbl-wrap"><table class="para"><thead><tr>${tb.head.map(h => `<th>${rich(h)}</th>`).join('')}</tr></thead><tbody>
      ${tb.rows.map(r => `<tr>${r.map((c, j) => `<td>${sp.has(j) && String(c).trim() && c !== '—' && c !== '-' ? `<span class="cell">${TTS.button(c)}${rich(c)}</span>` : rich(c)}</td>`).join('')}</tr>`).join('')}
    </tbody></table></div>`;
  }
  function bindLearn() {
    const g = document.getElementById('goPractice');
    if (g) g.onclick = () => document.querySelector('[data-tab="practice"]').click();
    const links = [...document.querySelectorAll('.toc a')];
    const secs = [...document.querySelectorAll('.sec')];
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    secs.forEach(s => io.observe(s));
  }

  // ---------- vocab ----------
  function vocabHTML() {
    return `<p style="color:var(--muted)">👆 ${esc(t('listenWord'))}</p><div class="vocab-grid">${CH.vocab.map(v => `
      <div class="vcard" data-say="${esc(v.ca)}">${TTS.button(v.ca)}<div><div class="ca">${esc(v.ca)}</div><div class="tr">${esc(tx(v))}</div></div></div>`).join('')}</div>`;
  }

  // ---------- practice ----------
  function visible() { return order.filter(i => secFilter === 'all' || String(CH.exercises[i].sec) === secFilter); }

  function practiceHTML() {
    const secs = [...new Set(CH.exercises.map(e => String(e.sec)))];
    const vis = visible();
    const answered = vis.filter(i => isAnswered(i)).length;
    const graded = vis.filter(i => state[i] && state[i].done);
    const right = graded.filter(i => state[i].ok).length;
    const best = App.scores()[CID];
    return `
      <div class="pbar">
        <div class="prog"><b>${answered}</b> ${esc(t('of'))} ${vis.length} <small>· ✅ ${right} / ${graded.length}${best ? ` · ★ ${esc(t('best'))} ${best.best}%` : ''}</small>
          <div class="bar"><i style="width:${vis.length ? Math.round(answered / vis.length * 100) : 0}%"></i></div></div>
        <select id="secSel" aria-label="${esc(t('filter'))}"><option value="all">${esc(t('filter'))}: ${esc(t('all'))}</option>${secs.map(s => `<option value="${esc(s)}" ${secFilter === s ? 'selected' : ''}>${esc(s)} ${esc(secName(s))}</option>`).join('')}</select>
        <button class="btn primary sm" id="gradeAll">✔ ${esc(t('gradeAll'))}</button>
      </div>
      <div id="resultBox">${showResult ? resultHTML() : ''}</div>
      <div id="qs">${vis.map((i, n) => qHTML(i, n + 1)).join('')}</div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:20px 0">
        <button class="btn primary" id="gradeAll2">✔ ${esc(t('gradeAll'))}</button>
        <button class="btn" id="retry">↻ ${esc(t('retry'))}</button>
        <button class="btn" id="showAll">👁 ${esc(t('showAll'))}</button>
      </div>`;
  }
  function secName(id) { const s = CH.sections.find(x => String(x.id) === id); return s ? '· ' + ttl(s.title) : ''; }

  function isAnswered(i) {
    const e = CH.exercises[i], st = state[i]; if (!st) return false;
    if (e.type === 'fill') return !!(st.resp && st.resp.trim());
    if (e.type === 'order') return st.resp && st.resp.length > 0;
    if (e.type === 'match') return st.resp && Object.keys(st.resp).length === e.pairs.length;
    return st.resp !== undefined && st.resp !== null;
  }

  function qHTML(i, n) {
    const e = CH.exercises[i], st = state[i] || (state[i] = {});
    const cls = st.done ? (st.ok ? 'ok' : 'no') : '';
    let body = '';
    const dis = st.done ? 'disabled' : '';
    if (e.type === 'mc') {
      if (!st.opts) st.opts = shuffle(e.options.map((_, k) => k));
      body = `<div class="opts">${st.opts.map((k, j) => {
        let c = st.resp === k ? 'sel' : '';
        if (st.done) { if (k === e.answer) c = 'right'; else if (st.resp === k) c = 'wrongsel'; }
        return `<button class="opt ${c}" data-k="${k}" ${dis}><span class="k">${'ABCDE'[j]}</span><span>${esc(e.options[k])}</span></button>`;
      }).join('')}</div>`;
    } else if (e.type === 'tf') {
      body = `<div class="opts">${[true, false].map((v, j) => {
        let c = st.resp === v ? 'sel' : '';
        if (st.done) { if (v === e.answer) c = 'right'; else if (st.resp === v) c = 'wrongsel'; }
        return `<button class="opt ${c}" data-k="${v}" ${dis}><span class="k">${v ? 'O' : 'X'}</span><span>${esc(t(String(v)))}</span></button>`;
      }).join('')}</div>`;
    } else if (e.type === 'fill') {
      body = `<div class="fill-in"><input class="fill" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(t('typeHere'))}" value="${esc(st.resp || '')}" ${dis}>
        ${st.done ? '' : `<button class="btn sm ghost kbtn" type="button">⌨️ ${esc(t('keyboard'))}</button>`}</div>
        <div class="keys" hidden>${ACCENTS.map(a => `<button type="button" data-ch="${a}">${a}</button>`).join('')}</div>`;
    } else if (e.type === 'order') {
      if (!st.toks) st.toks = shuffle(e.words.map((_, k) => k));
      const used = new Set(st.resp || []);
      body = `<div class="order-out">${(st.resp || []).map((k, j) => `<button class="tok" data-out="${j}" ${dis}>${esc(e.words[k])}</button>`).join('') || `<span style="color:var(--muted);font-size:14px;padding:6px">${esc(t('tapWords'))}</span>`}</div>
        <div class="order-in">${st.toks.map(k => `<button class="tok ${used.has(k) ? 'used' : ''}" data-in="${k}" ${dis}>${esc(e.words[k])}</button>`).join('')}</div>`;
    } else if (e.type === 'match') {
      if (!st.ropts) st.ropts = shuffle(e.pairs.map((_, k) => k));
      const r = st.resp || {};
      body = e.pairs.map((p, k) => {
        let c = '';
        if (st.done) c = String(r[k]) === String(k) ? 'right' : 'wrongsel';
        return `<div class="match-row"><div class="l">${TTS.button(p.l)} ${esc(p.l)}</div>
          <select data-row="${k}" class="${c}" ${dis}><option value="">${esc(t('choose'))}</option>${st.ropts.map(j => `<option value="${j}" ${String(r[k]) === String(j) ? 'selected' : ''}>${esc(tx(e.pairs[j].r))}</option>`).join('')}</select></div>`;
      }).join('');
    }
    const caLine = e.ca ? `<div class="q-ca">${TTS.button(st.done && e.type === 'fill' ? e.ca.replace(/_{2,}/, e.answer[0]) : e.ca)}<span>${esc(e.ca)}</span></div>` : '';
    return `<div class="q ${cls}" data-i="${i}" id="q${i}">
      <div class="q-head"><span class="q-num">${n}</span><div class="q-text">${rich(tx(e.q))}</div><span class="q-type">${esc(String(e.sec))} · ${typeLabel(e.type)}</span></div>
      ${caLine}
      <div class="q-body">${body}</div>
      ${st.done ? feedbackHTML(e, st) : `<div class="q-foot"><button class="btn sm dark chk">${esc(t('check'))}</button></div>`}
    </div>`;
  }

  function correctText(e) {
    if (e.type === 'mc') return e.options[e.answer];
    if (e.type === 'tf') return t(String(e.answer));
    if (e.type === 'fill') return e.answer.join(' / ');
    if (e.type === 'order') return e.answer;
    if (e.type === 'match') return e.pairs.map(p => `${p.l} = ${tx(p.r)}`).join(' · ');
    return '';
  }
  function feedbackHTML(e, st) {
    const say = e.type === 'order' ? e.answer : e.type === 'fill' && e.ca ? e.ca.replace(/_{2,}/, e.answer[0]) : (e.type === 'mc' && e.ca && /_{2,}/.test(e.ca) ? e.ca.replace(/_{2,}/, e.options[e.answer]) : '');
    return `<div class="fb ${st.ok ? 'ok' : 'no'}">
      <div>${st.ok ? '✅ <b>' + esc(t('correct')) + '</b>' : '❌ <b>' + esc(t('wrong')) + '</b> — ' + esc(t('answer')) + ': <span class="ans">' + esc(correctText(e)) + '</span>'}
      ${say ? ' ' + TTS.button(say) : ''}</div>
      ${e.explain ? `<div style="margin-top:6px">💡 ${rich(tx(e.explain))}</div>` : ''}
    </div>`;
  }

  function grade(i) {
    const e = CH.exercises[i], st = state[i] || (state[i] = {});
    let ok = false;
    if (e.type === 'mc' || e.type === 'tf') ok = st.resp === e.answer;
    else if (e.type === 'fill') ok = e.answer.some(a => norm(a) === norm(st.resp || ''));
    else if (e.type === 'order') {
      const built = norm((st.resp || []).map(k => e.words[k]).join(' '));
      ok = [e.answer].concat(e.alt || []).some(a => norm(a) === built);
    } else if (e.type === 'match') ok = e.pairs.every((_, k) => String((st.resp || {})[k]) === String(k));
    st.done = true; st.ok = ok;
    return ok;
  }

  function rerenderQ(i) {
    const el = document.getElementById('q' + i); if (!el) return;
    const n = +el.querySelector('.q-num').textContent;
    el.outerHTML = qHTML(i, n);
    bindQ(document.getElementById('q' + i));
    updateBar();
  }
  function updateBar() {
    const vis = visible();
    const answered = vis.filter(isAnswered).length;
    const graded = vis.filter(i => state[i] && state[i].done);
    const right = graded.filter(i => state[i].ok).length;
    const best = App.scores()[CID];
    const pr = document.querySelector('.pbar .prog');
    if (pr) pr.innerHTML = `<b>${answered}</b> ${esc(t('of'))} ${vis.length} <small>· ✅ ${right} / ${graded.length}${best ? ` · ★ ${esc(t('best'))} ${best.best}%` : ''}</small><div class="bar"><i style="width:${vis.length ? Math.round(answered / vis.length * 100) : 0}%"></i></div>`;
  }

  function bindQ(el) {
    const i = +el.dataset.i, e = CH.exercises[i], st = state[i];
    el.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (st.done) return;
      st.resp = e.type === 'tf' ? b.dataset.k === 'true' : +b.dataset.k;
      el.querySelectorAll('.opt').forEach(x => x.classList.toggle('sel', x === b));
      updateBar();
    });
    const inp = el.querySelector('input.fill');
    if (inp) {
      inp.oninput = () => { st.resp = inp.value; updateBar(); };
      inp.onfocus = () => { lastInput = inp; };
      inp.onkeydown = ev => { if (ev.key === 'Enter') { st.resp = inp.value; grade(i); rerenderQ(i); } };
    }
    const kb = el.querySelector('.kbtn'), keys = el.querySelector('.keys');
    if (kb) kb.onclick = () => { keys.hidden = !keys.hidden; };
    el.querySelectorAll('.keys [data-ch]').forEach(b => b.onmousedown = ev => ev.preventDefault());
    el.querySelectorAll('.keys [data-ch]').forEach(b => b.onclick = () => {
      const target = inp; const ch = b.dataset.ch;
      const s = target.selectionStart ?? target.value.length, en = target.selectionEnd ?? s;
      target.value = target.value.slice(0, s) + ch + target.value.slice(en);
      target.focus(); target.setSelectionRange(s + ch.length, s + ch.length);
      st.resp = target.value; updateBar();
    });
    el.querySelectorAll('[data-in]').forEach(b => b.onclick = () => {
      if (st.done) return; st.resp = (st.resp || []).concat(+b.dataset.in); rerenderQ(i);
    });
    el.querySelectorAll('[data-out]').forEach(b => b.onclick = () => {
      if (st.done) return; st.resp = st.resp.filter((_, j) => j !== +b.dataset.out); rerenderQ(i);
    });
    el.querySelectorAll('select[data-row]').forEach(s => s.onchange = () => {
      st.resp = st.resp || {};
      if (s.value === '') delete st.resp[s.dataset.row]; else st.resp[s.dataset.row] = s.value;
      updateBar();
    });
    const chk = el.querySelector('.chk');
    if (chk) chk.onclick = () => { if (inp) st.resp = inp.value; grade(i); rerenderQ(i); maybeFinish(); };
  }

  function maybeFinish() {
    const vis = visible();
    if (vis.every(i => state[i] && state[i].done)) finish();
  }
  function finish() {
    const vis = visible();
    const right = vis.filter(i => state[i].ok).length;
    const pct = Math.round(right / vis.length * 100);
    if (secFilter === 'all' && vis.length === CH.exercises.length) App.saveScore(CID, pct, right, vis.length);
    showResult = true;
    document.getElementById('resultBox').innerHTML = resultHTML();
    bindResult();
    updateBar();
    document.getElementById('resultBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function resultHTML() {
    const vis = visible();
    const graded = vis.filter(i => state[i] && state[i].done);
    const right = graded.filter(i => state[i].ok).length;
    const pct = vis.length ? Math.round(right / vis.length * 100) : 0;
    const msg = pct === 100 ? t('perfect') : pct >= 70 ? t('good') : t('keep');
    const col = pct >= 80 ? '#2ecc71' : pct >= 50 ? '#f6c90e' : '#ff5a5a';
    return `<div class="result">
      <div class="ring" style="background:conic-gradient(${col} ${pct * 3.6}deg, #3a4150 0)"><span>${pct}</span></div>
      <div><h3>${esc(t('yourScore'))}: ${right} / ${vis.length} (${pct}%)</h3><p>${esc(msg)}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${right < vis.length ? `<button class="btn sm" id="rWrong">↻ ${esc(t('retryWrong'))}</button>` : ''}
          <button class="btn sm" id="rAll">↻ ${esc(t('retry'))}</button>
          ${INDEX.find(c => c.id === CID + 1) ? `<a class="btn sm" href="chapter.html?c=${CID + 1}#learn">${esc(t('next'))} →</a>` : ''}
        </div></div></div>`;
  }
  function bindResult() {
    const w = document.getElementById('rWrong'), a = document.getElementById('rAll');
    if (w) w.onclick = () => {
      visible().forEach(i => { if (state[i] && !state[i].ok) state[i] = {}; });
      order = shuffle(order); showResult = false; renderPane(); scrollToQs();
    };
    if (a) a.onclick = reset;
  }
  function reset() {
    state = {}; order = shuffle(CH.exercises.map((_, i) => i)); showResult = false; renderPane(); scrollToQs();
  }
  function scrollToQs() { const q = document.getElementById('qs'); if (q) window.scrollTo({ top: q.offsetTop - 180, behavior: 'smooth' }); }

  function bindPractice() {
    document.querySelectorAll('.q[data-i]').forEach(bindQ);
    document.getElementById('secSel').onchange = ev => { capture(); secFilter = ev.target.value; showResult = false; renderPane(); };
    const gradeAll = () => {
      capture();
      const vis = visible();
      const un = vis.filter(i => !(state[i] && state[i].done) && !isAnswered(i)).length;
      if (un && !confirm(t('unanswered'))) return;
      vis.forEach(i => { if (!(state[i] && state[i].done)) grade(i); });
      renderPane(); finish();
    };
    document.getElementById('gradeAll').onclick = gradeAll;
    document.getElementById('gradeAll2').onclick = gradeAll;
    document.getElementById('retry').onclick = reset;
    document.getElementById('showAll').onclick = () => {
      capture();
      visible().forEach(i => { if (!(state[i] && state[i].done)) grade(i); });
      showResult = false; renderPane();
    };
    if (showResult) bindResult();
  }
})();
