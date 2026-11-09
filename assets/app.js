/* Shared: i18n, storage, Catalan TTS, header (language switch + voice settings) */
(function () {
  'use strict';

  const LANGS = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'ca', label: 'Català', flag: '🟨' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' }
  ];
  const CONTENT_LANGS = ['en', 'ko', 'es'];

  const UI = {
    ko: { brand: '카탈루냐어 문법', tagline: '교재 「Catalan: An Essential Grammar」 전 과정을 듣고, 읽고, 풀어 보는 인터랙티브 학습 사이트', start: '1과부터 시작하기', chapters: '챕터', exercises: '연습문제', sections: '소단원', progress: '나의 학습 현황', done: '완료한 챕터', avg: '평균 점수', total: '전체 문제', best: '최고 점수', notyet: '아직 풀지 않음', search: '챕터·주제 검색…', part1: '1부 · 카탈루냐어란?', part2: '2부 · 단어, 어구, 조어', part3: '3부 · 절과 문장', part4: '4부 · 실제 언어 사용', part5: '부록 · 동사 활용', learn: '학습', vocab: '핵심 표현', practice: '연습문제', goals: '이 챕터의 학습 목표', examples: '예문', listen: '듣기', check: '확인', gradeAll: '전체 채점하기', retry: '다시 풀기', retryWrong: '틀린 문제만 다시', showAll: '모든 정답 보기', correct: '정답!', wrong: '오답', answer: '정답', yourScore: '나의 점수', prev: '이전 챕터', next: '다음 챕터', home: '메인', all: '전체', typeHere: '답을 입력하세요', tapWords: '단어를 눌러 문장을 완성하세요', choose: '— 선택 —', true: '맞다 (O)', false: '틀리다 (X)', voice: '음성 설정', voiceAuto: '자동 선택', voiceOnline: '온라인 카탈루냐어 음성', speed: '속도', test: '테스트', noVoice: '이 기기에는 카탈루냐어 음성이 없어 온라인 음성을 사용합니다. (Edge 브라우저에서 가장 자연스러운 원어민 음성을 들을 수 있어요.)', hasVoice: '카탈루냐어 원어민 음성 사용 중:', unanswered: '아직 답하지 않은 문제가 있어요. 그래도 채점할까요?', perfect: '완벽해요! 🎉', good: '잘했어요! 👏', keep: '조금만 더 연습해 봐요 💪', reset: '학습 기록 초기화', resetQ: '모든 점수 기록을 지울까요?', footer: '수업용 학습 자료 · 교재: Dols & Mansell, Catalan: An Essential Grammar (Routledge, 2017)', speakAll: '전체 듣기', keyboard: '특수문자', clear: '지우기', filter: '소단원', of: '/', q: '문제', listenWord: '눌러서 들어 보세요' },
    en: { brand: 'Catalan Grammar', tagline: 'Listen, read and practise every chapter of “Catalan: An Essential Grammar” — an interactive study site', start: 'Start with Chapter 1', chapters: 'Chapters', exercises: 'Exercises', sections: 'Sections', progress: 'My progress', done: 'Chapters completed', avg: 'Average score', total: 'Total questions', best: 'Best score', notyet: 'Not started', search: 'Search chapters & topics…', part1: 'Part I · What is Catalan?', part2: 'Part II · Words, word groups & word formation', part3: 'Part III · Clauses and sentences', part4: 'Part IV · Doing things & real language', part5: 'Appendix · Verb conjugation', learn: 'Learn', vocab: 'Key expressions', practice: 'Practice', goals: 'Learning goals', examples: 'Examples', listen: 'Listen', check: 'Check', gradeAll: 'Grade all', retry: 'Try again', retryWrong: 'Retry wrong ones', showAll: 'Show all answers', correct: 'Correct!', wrong: 'Not quite', answer: 'Answer', yourScore: 'Your score', prev: 'Previous', next: 'Next', home: 'Home', all: 'All', typeHere: 'Type your answer', tapWords: 'Tap the words to build the sentence', choose: '— choose —', true: 'True', false: 'False', voice: 'Voice settings', voiceAuto: 'Automatic', voiceOnline: 'Online Catalan voice', speed: 'Speed', test: 'Test', noVoice: 'No Catalan voice on this device, so an online voice is used. (Microsoft Edge offers the most natural native voices.)', hasVoice: 'Using native Catalan voice:', unanswered: 'Some questions are unanswered. Grade anyway?', perfect: 'Perfect! 🎉', good: 'Well done! 👏', keep: 'Keep practising 💪', reset: 'Reset progress', resetQ: 'Delete all saved scores?', footer: 'Classroom study material · Textbook: Dols & Mansell, Catalan: An Essential Grammar (Routledge, 2017)', speakAll: 'Play all', keyboard: 'Accents', clear: 'Clear', filter: 'Section', of: '/', q: 'Q', listenWord: 'Tap to listen' },
    es: { brand: 'Gramática catalana', tagline: 'Escucha, lee y practica todos los capítulos de «Catalan: An Essential Grammar» en un sitio interactivo', start: 'Empezar por el capítulo 1', chapters: 'Capítulos', exercises: 'Ejercicios', sections: 'Apartados', progress: 'Mi progreso', done: 'Capítulos completados', avg: 'Nota media', total: 'Preguntas totales', best: 'Mejor nota', notyet: 'Sin empezar', search: 'Buscar capítulos y temas…', part1: 'Parte I · ¿Qué es el catalán?', part2: 'Parte II · Palabras y formación de palabras', part3: 'Parte III · Oraciones', part4: 'Parte IV · La lengua en uso', part5: 'Apéndice · Conjugación verbal', learn: 'Aprender', vocab: 'Expresiones clave', practice: 'Ejercicios', goals: 'Objetivos', examples: 'Ejemplos', listen: 'Escuchar', check: 'Comprobar', gradeAll: 'Corregir todo', retry: 'Repetir', retryWrong: 'Repetir los fallos', showAll: 'Ver todas las respuestas', correct: '¡Correcto!', wrong: 'Incorrecto', answer: 'Respuesta', yourScore: 'Tu nota', prev: 'Anterior', next: 'Siguiente', home: 'Inicio', all: 'Todo', typeHere: 'Escribe tu respuesta', tapWords: 'Toca las palabras para formar la frase', choose: '— elige —', true: 'Verdadero', false: 'Falso', voice: 'Voz', voiceAuto: 'Automática', voiceOnline: 'Voz catalana en línea', speed: 'Velocidad', test: 'Probar', noVoice: 'Este dispositivo no tiene voz catalana; se usa una voz en línea. (Microsoft Edge ofrece las voces nativas más naturales.)', hasVoice: 'Voz catalana nativa:', unanswered: 'Hay preguntas sin responder. ¿Corregir igualmente?', perfect: '¡Perfecto! 🎉', good: '¡Muy bien! 👏', keep: 'Sigue practicando 💪', reset: 'Borrar progreso', resetQ: '¿Borrar todas las notas guardadas?', footer: 'Material de clase · Libro: Dols & Mansell, Catalan: An Essential Grammar (Routledge, 2017)', speakAll: 'Escuchar todo', keyboard: 'Acentos', clear: 'Borrar', filter: 'Apartado', of: '/', q: 'P', listenWord: 'Toca para escuchar' },
    ca: { brand: 'Gramàtica catalana', tagline: 'Escolta, llegeix i practica tots els capítols de «Catalan: An Essential Grammar» en un web interactiu', start: 'Comença pel capítol 1', chapters: 'Capítols', exercises: 'Exercicis', sections: 'Apartats', progress: 'El meu progrés', done: 'Capítols completats', avg: 'Nota mitjana', total: 'Preguntes totals', best: 'Millor nota', notyet: 'Per començar', search: 'Cerca capítols i temes…', part1: 'Part I · Què és el català?', part2: 'Part II · Paraules i formació de mots', part3: 'Part III · Oracions', part4: 'Part IV · La llengua en ús', part5: 'Apèndix · Conjugació verbal', learn: 'Aprèn', vocab: 'Expressions clau', practice: 'Exercicis', goals: 'Objectius', examples: 'Exemples', listen: 'Escolta', check: 'Comprova', gradeAll: 'Corregeix-ho tot', retry: 'Torna-hi', retryWrong: 'Repeteix els errors', showAll: 'Mostra les respostes', correct: 'Correcte!', wrong: 'Incorrecte', answer: 'Resposta', yourScore: 'La teva nota', prev: 'Anterior', next: 'Següent', home: 'Inici', all: 'Tot', typeHere: 'Escriu la resposta', tapWords: 'Toca les paraules per formar la frase', choose: '— tria —', true: 'Vertader', false: 'Fals', voice: 'Veu', voiceAuto: 'Automàtica', voiceOnline: 'Veu catalana en línia', speed: 'Velocitat', test: 'Prova', noVoice: 'Aquest dispositiu no té veu catalana; s’usa una veu en línia. (Microsoft Edge ofereix les veus natives més naturals.)', hasVoice: 'Veu catalana nativa:', unanswered: 'Hi ha preguntes sense resposta. Vols corregir igualment?', perfect: 'Perfecte! 🎉', good: 'Molt bé! 👏', keep: 'Continua practicant 💪', reset: 'Esborra el progrés', resetQ: 'Vols esborrar totes les notes desades?', footer: 'Material de classe · Llibre: Dols & Mansell, Catalan: An Essential Grammar (Routledge, 2017)', speakAll: 'Escolta-ho tot', keyboard: 'Accents', clear: 'Esborra', filter: 'Apartat', of: '/', q: 'P', listenWord: 'Toca per escoltar' },
    fr: { brand: 'Grammaire catalane', tagline: 'Écoutez, lisez et pratiquez chaque chapitre de « Catalan: An Essential Grammar » — site d’étude interactif', start: 'Commencer au chapitre 1', chapters: 'Chapitres', exercises: 'Exercices', sections: 'Sections', progress: 'Ma progression', done: 'Chapitres terminés', avg: 'Note moyenne', total: 'Questions au total', best: 'Meilleure note', notyet: 'Pas commencé', search: 'Rechercher…', part1: 'Partie I · Qu’est-ce que le catalan ?', part2: 'Partie II · Mots et formation des mots', part3: 'Partie III · Propositions et phrases', part4: 'Partie IV · La langue en action', part5: 'Annexe · Conjugaison', learn: 'Apprendre', vocab: 'Expressions clés', practice: 'Exercices', goals: 'Objectifs', examples: 'Exemples', listen: 'Écouter', check: 'Vérifier', gradeAll: 'Tout corriger', retry: 'Recommencer', retryWrong: 'Refaire les erreurs', showAll: 'Voir les réponses', correct: 'Correct !', wrong: 'Incorrect', answer: 'Réponse', yourScore: 'Votre note', prev: 'Précédent', next: 'Suivant', home: 'Accueil', all: 'Tout', typeHere: 'Votre réponse', tapWords: 'Touchez les mots pour former la phrase', choose: '— choisir —', true: 'Vrai', false: 'Faux', voice: 'Voix', voiceAuto: 'Automatique', voiceOnline: 'Voix catalane en ligne', speed: 'Vitesse', test: 'Tester', noVoice: 'Aucune voix catalane sur cet appareil : une voix en ligne est utilisée. (Microsoft Edge offre les voix natives les plus naturelles.)', hasVoice: 'Voix catalane native :', unanswered: 'Certaines questions sont sans réponse. Corriger quand même ?', perfect: 'Parfait ! 🎉', good: 'Bravo ! 👏', keep: 'Continuez à pratiquer 💪', reset: 'Réinitialiser', resetQ: 'Effacer toutes les notes ?', footer: 'Support de cours · Manuel : Dols & Mansell, Catalan: An Essential Grammar (Routledge, 2017)', speakAll: 'Tout écouter', keyboard: 'Accents', clear: 'Effacer', filter: 'Section', of: '/', q: 'Q', listenWord: 'Touchez pour écouter' },
    de: { brand: 'Katalanische Grammatik', tagline: 'Alle Kapitel von „Catalan: An Essential Grammar“ hören, lesen und üben — interaktive Lernseite', start: 'Mit Kapitel 1 beginnen', chapters: 'Kapitel', exercises: 'Übungen', sections: 'Abschnitte', progress: 'Mein Fortschritt', done: 'Erledigte Kapitel', avg: 'Durchschnitt', total: 'Fragen gesamt', best: 'Bestes Ergebnis', notyet: 'Nicht begonnen', search: 'Kapitel & Themen suchen…', part1: 'Teil I · Was ist Katalanisch?', part2: 'Teil II · Wörter & Wortbildung', part3: 'Teil III · Sätze', part4: 'Teil IV · Sprache im Gebrauch', part5: 'Anhang · Konjugation', learn: 'Lernen', vocab: 'Schlüsselausdrücke', practice: 'Übungen', goals: 'Lernziele', examples: 'Beispiele', listen: 'Anhören', check: 'Prüfen', gradeAll: 'Alles auswerten', retry: 'Nochmal', retryWrong: 'Fehler wiederholen', showAll: 'Alle Lösungen', correct: 'Richtig!', wrong: 'Falsch', answer: 'Lösung', yourScore: 'Dein Ergebnis', prev: 'Zurück', next: 'Weiter', home: 'Start', all: 'Alle', typeHere: 'Antwort eingeben', tapWords: 'Tippe die Wörter, um den Satz zu bilden', choose: '— wählen —', true: 'Wahr', false: 'Falsch', voice: 'Stimme', voiceAuto: 'Automatisch', voiceOnline: 'Katalanische Online-Stimme', speed: 'Tempo', test: 'Test', noVoice: 'Keine katalanische Stimme auf diesem Gerät; es wird eine Online-Stimme verwendet. (Microsoft Edge bietet die natürlichsten Stimmen.)', hasVoice: 'Katalanische Stimme:', unanswered: 'Einige Fragen sind unbeantwortet. Trotzdem auswerten?', perfect: 'Perfekt! 🎉', good: 'Gut gemacht! 👏', keep: 'Weiter üben 💪', reset: 'Fortschritt löschen', resetQ: 'Alle gespeicherten Ergebnisse löschen?', footer: 'Unterrichtsmaterial · Lehrbuch: Dols & Mansell, Catalan: An Essential Grammar (Routledge, 2017)', speakAll: 'Alles abspielen', keyboard: 'Akzente', clear: 'Löschen', filter: 'Abschnitt', of: '/', q: 'F', listenWord: 'Zum Anhören tippen' },
    zh: { brand: '加泰罗尼亚语语法', tagline: '听、读、练《Catalan: An Essential Grammar》全部章节的互动学习网站', start: '从第1章开始', chapters: '章节', exercises: '练习', sections: '小节', progress: '我的学习进度', done: '已完成章节', avg: '平均分', total: '题目总数', best: '最高分', notyet: '未开始', search: '搜索章节与主题…', part1: '第一部分 · 什么是加泰罗尼亚语', part2: '第二部分 · 词、词组与构词', part3: '第三部分 · 从句与句子', part4: '第四部分 · 语言的实际运用', part5: '附录 · 动词变位', learn: '学习', vocab: '核心表达', practice: '练习', goals: '学习目标', examples: '例句', listen: '听', check: '检查', gradeAll: '全部评分', retry: '重做', retryWrong: '只做错题', showAll: '显示全部答案', correct: '正确！', wrong: '错误', answer: '答案', yourScore: '我的得分', prev: '上一章', next: '下一章', home: '首页', all: '全部', typeHere: '输入答案', tapWords: '点击单词组成句子', choose: '— 选择 —', true: '对', false: '错', voice: '语音设置', voiceAuto: '自动', voiceOnline: '在线加泰罗尼亚语语音', speed: '语速', test: '试听', noVoice: '此设备没有加泰罗尼亚语语音，正在使用在线语音。（Microsoft Edge 提供最自然的母语语音。）', hasVoice: '正在使用加泰罗尼亚语母语语音：', unanswered: '还有未作答的题目，仍要评分吗？', perfect: '满分！🎉', good: '做得好！👏', keep: '继续加油 💪', reset: '重置进度', resetQ: '删除所有已保存的分数？', footer: '课堂学习资料 · 教材：Dols & Mansell, Catalan: An Essential Grammar (Routledge, 2017)', speakAll: '全部播放', keyboard: '特殊字母', clear: '清除', filter: '小节', of: '/', q: '题', listenWord: '点击收听' },
    ja: { brand: 'カタルーニャ語文法', tagline: '『Catalan: An Essential Grammar』全章を聞いて・読んで・解いて学ぶインタラクティブ学習サイト', start: '第1章から始める', chapters: '章', exercises: '練習問題', sections: '節', progress: '学習状況', done: '完了した章', avg: '平均点', total: '問題数', best: '最高点', notyet: '未着手', search: '章・トピックを検索…', part1: '第1部 · カタルーニャ語とは', part2: '第2部 · 語・語群・語形成', part3: '第3部 · 節と文', part4: '第4部 · 実際の言語使用', part5: '付録 · 動詞活用', learn: '学習', vocab: '重要表現', practice: '練習問題', goals: '学習目標', examples: '例文', listen: '聞く', check: '確認', gradeAll: 'すべて採点', retry: 'もう一度', retryWrong: '間違いだけ再挑戦', showAll: 'すべての正解を見る', correct: '正解！', wrong: '不正解', answer: '正解', yourScore: 'あなたの点数', prev: '前の章', next: '次の章', home: 'ホーム', all: 'すべて', typeHere: '答えを入力', tapWords: '単語をタップして文を作ろう', choose: '— 選択 —', true: '正しい', false: '誤り', voice: '音声設定', voiceAuto: '自動', voiceOnline: 'オンライン・カタルーニャ語音声', speed: '速度', test: 'テスト', noVoice: 'この端末にはカタルーニャ語音声がないため、オンライン音声を使用します。（Microsoft Edge で最も自然なネイティブ音声が使えます。）', hasVoice: 'カタルーニャ語ネイティブ音声：', unanswered: '未回答の問題があります。採点しますか？', perfect: '満点！🎉', good: 'よくできました！👏', keep: 'もう少し練習しよう 💪', reset: '記録をリセット', resetQ: '保存した点数をすべて削除しますか？', footer: '授業用学習資料 · 教材：Dols & Mansell, Catalan: An Essential Grammar (Routledge, 2017)', speakAll: 'すべて再生', keyboard: '特殊文字', clear: 'クリア', filter: '節', of: '/', q: '問', listenWord: 'タップで再生' }
  };

  // ---------- storage ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('cat_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('cat_' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  function detectLang() {
    const saved = store.get('lang', null);
    if (saved && UI[saved]) return saved;
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return UI[nav] ? nav : 'en';
  }

  const App = {
    LANGS, UI, store,
    lang: detectLang(),
    t(key) { return (UI[App.lang] && UI[App.lang][key]) || UI.en[key] || key; },
    // content text: object {en, ko, es, (ca)}
    tx(obj) {
      if (obj == null) return '';
      if (typeof obj === 'string') return obj;
      const cl = CONTENT_LANGS.includes(App.lang) ? App.lang : (App.lang === 'ca' && obj.ca ? 'ca' : 'en');
      return obj[cl] || obj.en || obj.ko || '';
    },
    // title: show Catalan + localized
    ttl(obj) {
      if (!obj) return '';
      if (App.lang === 'ca') return obj.ca;
      return App.tx(obj);
    },
    setLang(code) {
      App.lang = code; store.set('lang', code);
      document.documentElement.lang = code;
      document.dispatchEvent(new CustomEvent('langchange'));
    },
    esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); },
    // allow only <b>, <i>, <br>
    rich(s) {
      return App.esc(s).replace(/&lt;(\/?)(b|i|br)\s*\/?&gt;/g, '<$1$2>');
    },
    shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  };

  // ---------- Catalan TTS ----------
  const TTS = {
    voices: [], voice: null, rate: store.get('rate', 0.9), choice: store.get('voice', 'auto'), audio: null,
    rank(v) {
      const n = v.name.toLowerCase(); let s = 0;
      if (/natural|online|neural/.test(n)) s += 50; // Edge neural (Joana, Enric, Alba)
      if (/google/.test(n)) s += 30;
      if (/joana|enric|alba|montserrat|jordi|pau/.test(n)) s += 10;
      if (v.lang.toLowerCase().replace('_', '-') === 'ca-es') s += 5;
      if (v.localService === false) s += 2;
      return s;
    },
    load() {
      if (!('speechSynthesis' in window)) return;
      const all = speechSynthesis.getVoices();
      TTS.voices = all.filter(v => /^ca([-_]|$)/i.test(v.lang)).sort((a, b) => TTS.rank(b) - TTS.rank(a));
      if (TTS.choice === 'online') TTS.voice = null;
      else if (TTS.choice !== 'auto') TTS.voice = TTS.voices.find(v => v.name === TTS.choice) || TTS.voices[0] || null;
      else TTS.voice = TTS.voices[0] || null;
      document.dispatchEvent(new CustomEvent('voiceschange'));
    },
    clean(text) {
      return String(text).replace(/<[^>]+>/g, '').replace(/_{2,}/g, ' … ').replace(/[*✓✗]/g, '').replace(/\s+/g, ' ').trim();
    },
    stop() {
      try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
      if (TTS.audio) { TTS.audio.pause(); TTS.audio = null; }
      document.querySelectorAll('.spk.playing').forEach(b => b.classList.remove('playing'));
    },
    speak(text, btn) {
      text = TTS.clean(text); if (!text) return;
      TTS.stop();
      if (btn) btn.classList.add('playing');
      const done = () => btn && btn.classList.remove('playing');
      if (TTS.voice && TTS.choice !== 'online') {
        const u = new SpeechSynthesisUtterance(text);
        u.voice = TTS.voice; u.lang = TTS.voice.lang; u.rate = TTS.rate;
        u.onend = done; u.onerror = done;
        speechSynthesis.speak(u);
      } else {
        TTS.online(text, done);
      }
    },
    online(text, done) {
      // split into chunks ≤ 180 chars at punctuation
      const parts = []; let cur = '';
      text.split(/(?<=[.,;:!?…])\s+/).forEach(seg => {
        if ((cur + ' ' + seg).trim().length > 180) { if (cur) parts.push(cur.trim()); cur = seg; } else cur += ' ' + seg;
      });
      if (cur.trim()) parts.push(cur.trim());
      let i = 0;
      const next = () => {
        if (i >= parts.length) { done(); return; }
        const url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ca&ttsspeed=' + (TTS.rate < 0.8 ? '0.6' : '1') + '&q=' + encodeURIComponent(parts[i++]);
        const a = new Audio(url); TTS.audio = a;
        a.playbackRate = Math.max(0.7, Math.min(1.3, TTS.rate / 0.9));
        a.onended = next;
        a.onerror = () => {
          // last resort: any voice with lang ca-ES
          if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(text); u.lang = 'ca-ES'; u.rate = TTS.rate; u.onend = done; u.onerror = done; speechSynthesis.speak(u);
          } else done();
        };
        a.play().catch(a.onerror);
      };
      next();
    },
    button(text, extraClass) {
      return `<button type="button" class="spk ${extraClass || ''}" data-say="${App.esc(TTS.clean(text))}" aria-label="${App.esc(App.t('listen'))}" title="${App.esc(App.t('listen'))}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 10v4h4l5 4V6L7 10H3zm13.5 2A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg></button>`;
    }
  };
  if ('speechSynthesis' in window) {
    TTS.load();
    speechSynthesis.onvoiceschanged = TTS.load;
    setTimeout(TTS.load, 600);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-say]');
    if (b) { e.preventDefault(); e.stopPropagation(); TTS.speak(b.getAttribute('data-say'), b); }
  });
  App.TTS = TTS;

  // ---------- header ----------
  App.header = function (opts) {
    opts = opts || {};
    const h = document.getElementById('topbar');
    const cur = LANGS.find(l => l.code === App.lang) || LANGS[1];
    h.innerHTML = `
      <div class="bar-inner">
        <a class="brand" href="index.html"><span class="senyera" aria-hidden="true"></span><span><b>Català</b> <small data-i="brand">${App.t('brand')}</small></span></a>
        <div class="bar-actions">
          ${opts.back ? `<a class="btn ghost sm hide-sm" href="index.html">🏠 <span data-i="home">${App.t('home')}</span></a>` : ''}
          <div class="dd" id="voiceDD">
            <button class="btn ghost sm" id="voiceBtn" aria-haspopup="true" title="${App.t('voice')}">🔊<span class="hide-sm"> <span data-i="voice">${App.t('voice')}</span></span></button>
            <div class="dd-menu voice-menu" id="voiceMenu" hidden></div>
          </div>
          <div class="dd" id="langDD">
            <button class="btn lang-btn sm" id="langBtn" aria-haspopup="true">🌐 <span id="langCur">${cur.label}</span> ▾</button>
            <div class="dd-menu" id="langMenu" hidden>
              ${LANGS.map(l => `<button class="dd-item ${l.code === App.lang ? 'on' : ''}" data-lang="${l.code}">${l.flag} ${l.label}</button>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
    const lb = h.querySelector('#langBtn'), lm = h.querySelector('#langMenu');
    const vb = h.querySelector('#voiceBtn'), vm = h.querySelector('#voiceMenu');
    lb.onclick = e => { e.stopPropagation(); vm.hidden = true; lm.hidden = !lm.hidden; };
    vb.onclick = e => { e.stopPropagation(); lm.hidden = true; renderVoice(); vm.hidden = !vm.hidden; };
    vm.onclick = e => e.stopPropagation();
    document.addEventListener('click', () => { lm.hidden = true; vm.hidden = true; });
    lm.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => {
      App.setLang(b.dataset.lang);
      lm.querySelectorAll('.dd-item').forEach(x => x.classList.toggle('on', x === b));
      h.querySelector('#langCur').textContent = LANGS.find(l => l.code === App.lang).label;
      h.querySelectorAll('[data-i]').forEach(el => el.textContent = App.t(el.dataset.i));
      lm.hidden = true;
    });
    function renderVoice() {
      const opt = (val, label) => `<option value="${App.esc(val)}" ${TTS.choice === val ? 'selected' : ''}>${App.esc(label)}</option>`;
      vm.innerHTML = `
        <div class="vm-title">🔊 ${App.t('voice')}</div>
        <p class="vm-note">${TTS.voices.length ? App.t('hasVoice') + ' <b>' + App.esc(TTS.voice ? TTS.voice.name : App.t('voiceOnline')) + '</b>' : App.t('noVoice')}</p>
        <select id="voiceSel">${opt('auto', App.t('voiceAuto'))}${TTS.voices.map(v => opt(v.name, v.name)).join('')}${opt('online', App.t('voiceOnline'))}</select>
        <label class="vm-rate">${App.t('speed')} <input type="range" id="rateIn" min="0.6" max="1.2" step="0.05" value="${TTS.rate}"><span id="rateOut">${TTS.rate.toFixed(2)}×</span></label>
        <button class="btn primary sm" id="voiceTest">▶ ${App.t('test')}</button>`;
      vm.querySelector('#voiceSel').onchange = e => { TTS.choice = e.target.value; store.set('voice', TTS.choice); TTS.load(); renderVoice(); };
      vm.querySelector('#rateIn').oninput = e => { TTS.rate = +e.target.value; store.set('rate', TTS.rate); vm.querySelector('#rateOut').textContent = TTS.rate.toFixed(2) + '×'; };
      vm.querySelector('#voiceTest').onclick = () => TTS.speak('Bon dia! Benvinguts a la classe de català. Com estàs?');
    }
    document.addEventListener('voiceschange', () => { if (!vm.hidden) renderVoice(); });
    document.documentElement.lang = App.lang;
  };

  // ---------- progress ----------
  App.scores = () => store.get('scores', {});
  App.saveScore = (ch, pct, correct, total) => {
    const s = App.scores(); const prev = s[ch];
    if (!prev || pct >= prev.best) s[ch] = { best: pct, correct, total, at: Date.now() };
    else s[ch].last = pct;
    store.set('scores', s);
  };

  window.App = App;
})();
