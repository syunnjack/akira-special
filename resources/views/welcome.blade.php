<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>1Fリリース練習機｜アケコン入力トレーナー</title>
  <meta name="description" content="PCにアケコンを接続して、格闘ゲームの1フレーム同時押し・リリース技を練習できる専用ツール。K(キック)とG(ガード)を同時に押し、Gだけを1フレームで離す精度をミリ秒単位で計測します。">
  <link rel="canonical" href="https://1frame-training.jp/">
  <meta property="og:site_name" content="1Fリリース練習機">
  <meta property="og:type" content="website">
  <meta property="og:title" content="1Fリリース練習機｜アケコン入力トレーナー">
  <meta property="og:description" content="K+G同時押しからGだけを1フレームで離す精度をミリ秒単位で計測する、格闘ゲーム専用の入力練習ツール。">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"1Fリリース練習機","url":"https://1frame-training.jp/","applicationCategory":"GameApplication"}</script>

  @if(config('services.ga4.id'))
  <script async src="https://www.googletagmanager.com/gtag/js?id={{ config('services.ga4.id') }}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '{{ config('services.ga4.id') }}');
  </script>
  @endif

  <style>
    :root { --ink:#e9e7df; --dim:#8a8c88; --black:#0d0f0e; --panel:#161917; --line:#313631; --acid:#d8ff43; --red:#ff5b42; }
    * { box-sizing:border-box; }
    html { background:var(--black); }
    body { margin:0; color:var(--ink); background:radial-gradient(circle at 78% 14%,#283022 0,transparent 25%),var(--black); font-family:"Arial Narrow","Noto Sans JP",Arial,sans-serif; }
    button { font:inherit; }
    main { max-width:1280px; margin:auto; min-height:100vh; padding:0 34px 40px; }
    .topbar { height:70px; display:flex; align-items:center; gap:14px; border-bottom:1px solid var(--line); font-size:12px; font-weight:800; letter-spacing:.18em; }
    .brand-mark { display:grid; place-items:center; width:34px; height:34px; color:var(--black); background:var(--acid); font-size:19px; letter-spacing:0; }
    .connection { margin-left:auto; color:#777; font-weight:700; letter-spacing:.06em; }
    .connection.online { color:var(--acid); }
    .hero { padding:54px 0 38px; position:relative; }
    .eyebrow { color:var(--acid); font-size:12px; font-weight:900; letter-spacing:.22em; margin-bottom:17px; }
    h1 { font-size:clamp(46px,6.5vw,84px); line-height:1; letter-spacing:-.065em; margin:0; max-width:1000px; font-weight:900; }
    h1 em { color:transparent; -webkit-text-stroke:1px var(--ink); font-style:normal; }
    .hero .lead { color:#c5c8c1; font-size:15px; max-width:660px; line-height:1.8; margin:24px 0 0; }
    .lab { border:1px solid var(--line); background:linear-gradient(145deg,#1b1f1c,#111311); box-shadow:0 30px 80px #0008; }
    .start-guide { display:grid; grid-template-columns:repeat(3,1fr) auto; border:1px solid var(--line); margin-bottom:18px; background:#111412; }
    .start-guide>div { padding:18px; display:flex; gap:13px; align-items:center; border-right:1px solid var(--line); opacity:.45; }
    .start-guide>div.active { opacity:1; background:#22291d; box-shadow:inset 0 -3px var(--acid); }
    .start-guide>div.done { opacity:.8; }
    .start-guide>div.done>b { background:var(--acid); color:#111; }
    .start-guide b { width:28px; height:28px; border:1px solid #666; display:grid; place-items:center; flex:0 0 auto; }
    .start-guide span { display:flex; flex-direction:column; gap:5px; }
    .start-guide strong { font-size:13px; }
    .start-guide small { font-size:10px; color:var(--dim); }
    .start-guide>button { border:0; background:none; color:var(--acid); padding:14px; font-size:10px; cursor:pointer; }
    .command-strip { min-height:64px; border-bottom:1px solid var(--line); display:flex; align-items:center; gap:12px; padding:12px 20px; }
    .command-strip>span:first-child { font-size:10px; color:var(--acid); font-weight:900; letter-spacing:.18em; margin-right:10px; }
    .command-strip b { width:38px; height:38px; display:grid; place-items:center; border:1px solid #656b63; background:#292d29; font-size:19px; }
    .command-strip i { font-style:normal; color:var(--dim); }
    .command-strip .arrow { color:var(--acid); font-size:24px; }
    .command-strip .release-key { border-color:var(--acid); color:var(--acid); position:relative; }
    .command-strip strong { font-size:13px; }
    .command-strip small { margin-left:auto; color:var(--acid); font:700 12px monospace; }
    .workbench { display:grid; grid-template-columns:1fr 310px; }
    .input-zone { padding:34px; }
    .coach { display:flex; align-items:center; gap:15px; padding:15px 18px; margin-bottom:22px; border-left:4px solid #555; background:#111; }
    .coach>span { font-weight:900; color:#999; }
    .coach>strong { font-size:16px; }
    .coach.go { border-color:var(--acid); background:#29301f; }
    .coach.go>span, .coach.go>strong { color:var(--acid); }
    .buttons { display:flex; align-items:center; gap:18px; max-width:680px; }
    .practice-button { touch-action:none; flex:1; min-height:190px; border:1px solid #3d433d; color:var(--ink); background:#202420; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; transition:.08s; user-select:none; }
    .practice-button small { letter-spacing:.2em; color:var(--dim); font-size:9px; }
    .practice-button strong { font-size:74px; line-height:1; margin:8px 0; }
    .practice-button span { color:#777d76; font:10px monospace; }
    .practice-button.held { color:var(--black); background:var(--acid); border-color:var(--acid); transform:translateY(3px); box-shadow:0 0 35px #d8ff4322; }
    .practice-button.held small, .practice-button.held span { color:#3f491c; }
    .plus { color:#666; font-size:25px; }
    .finger-tip { display:flex; gap:10px; margin-top:18px; padding:12px; background:#121512; color:#a7aba4; font-size:12px; }
    .finger-tip b { color:var(--acid); }
    .verdict { border-left:1px solid var(--line); padding:34px; display:flex; flex-direction:column; justify-content:center; }
    .verdict-label { color:var(--dim); font:10px monospace; letter-spacing:.18em; }
    .verdict>strong { font-size:54px; margin:17px 0 0; letter-spacing:-.05em; }
    .verdict>strong small { color:var(--dim); font-size:14px; }
    .verdict .frames { font:12px monospace; color:var(--dim); }
    .verdict p { border-top:1px solid var(--line); padding-top:18px; margin-top:26px; font-size:13px; font-weight:800; }
    .verdict.success>strong, .verdict.success p { color:var(--acid); }
    .verdict.fail>strong, .verdict.fail p { color:var(--red); }
    .dashboard { display:grid; grid-template-columns:1fr 1.35fr; gap:24px; margin-top:24px; }
    .stats { display:grid; grid-template-columns:repeat(3,1fr); border:1px solid var(--line); }
    .stats article { min-height:170px; padding:22px; border-right:1px solid var(--line); display:flex; flex-direction:column; }
    .stats article:last-child { border:0; }
    .stats span { color:var(--dim); font:9px monospace; letter-spacing:.13em; }
    .stats strong { font-size:38px; margin:auto 0 0; }
    .stats small { color:var(--dim); font-size:12px; }
    .meter { height:3px; background:#30352f; margin-top:12px; }
    .meter i { display:block; height:100%; background:var(--acid); }
    .history { border:1px solid var(--line); padding:20px; min-height:222px; }
    .history-head { display:flex; align-items:center; border-bottom:1px solid var(--line); padding-bottom:13px; margin-bottom:8px; }
    .history h2 { font-size:12px; margin:0; letter-spacing:.12em; }
    .history button, footer button { margin-left:auto; border:0; background:none; color:var(--dim); font:9px monospace; cursor:pointer; }
    .history-row { display:grid; grid-template-columns:24px 1fr 76px 50px; align-items:center; gap:10px; min-height:28px; font:10px monospace; }
    .history-row>span { color:#60655f; }
    .history-row>div { background:#292d29; height:3px; }
    .history-row i { display:block; height:100%; }
    .history-row i.ok { background:var(--acid); }
    .history-row i.ng { background:var(--red); }
    .history-row b { text-align:right; }
    .history-row em { font-style:normal; color:var(--red); }
    .history-row i.ok~* { color:var(--acid); }
    .empty { color:#666b65; font-size:12px; padding:30px 0; }
    footer { margin-top:28px; display:flex; justify-content:space-between; align-items:center; color:#666b65; font-size:10px; }
    footer>div { display:flex; align-items:center; gap:6px; }
    footer b { color:var(--dim); margin-right:8px; }
    footer button { margin:0; border:1px solid var(--line); padding:8px 12px; }
    footer button.selected { color:var(--acid); border-color:var(--acid); }
    @media(max-width:850px){ main{padding:0 16px 30px} .hero{padding-top:38px} .workbench,.dashboard{grid-template-columns:1fr} .verdict{border-left:0;border-top:1px solid var(--line)} .stats{order:2} .command-strip small{display:none} .start-guide{grid-template-columns:1fr} .start-guide>div{border-right:0;border-bottom:1px solid var(--line)} .connection{font-size:9px} footer{align-items:flex-start;gap:20px;flex-direction:column} }
    @media(max-width:520px){ .input-zone{padding:22px} .practice-button{min-height:145px} .practice-button strong{font-size:55px} .plus{display:none} .buttons{gap:8px} .stats{grid-template-columns:1fr} .stats article{min-height:105px;border-right:0;border-bottom:1px solid var(--line)} .stats strong{margin-top:20px} .hero p{font-size:12px} .command-strip{gap:8px} }
    @media(prefers-reduced-motion:reduce){*{transition:none!important}}
  </style>
</head>
<body>
  <main>
    <header class="topbar">
      <span class="brand-mark">1F</span>
      <span>1Fリリース練習機</span>
      <span class="connection" id="connection-label">アケコン未接続</span>
    </header>

    <section class="hero">
      <div class="eyebrow">PCにアケコンをつなぐだけで、そのまま練習</div>
      <h1>技の<em>キレ</em>を、<em>出せる手</em>に。</h1>
      <p class="lead">格闘ゲーム(バーチャファイター等)の同時押し・1フレームリリース専用トレーナー。ボタンを離した時間を1/1000秒単位で測り、失敗した理由まで教えます。</p>
    </section>

    <section class="start-guide" id="start-guide">
      <div id="step-connect" class="active"><b>1</b><span><strong>アケコンをUSB接続</strong><small id="pad-name-label">接続すると自動で見つかります</small></span></div>
      <div id="step-k"><b>2</b><span><strong>Kに使うボタンを押す</strong><small id="k-label">普段のKボタンを1回押す</small></span></div>
      <div id="step-g"><b>3</b><span><strong>Gに使うボタンを押す</strong><small id="g-label">普段のGボタンを1回押す</small></span></div>
      <button id="reset-buttons-btn" style="display:none">ボタンを再設定</button>
    </section>

    <section class="lab" aria-label="入力練習">
      <div class="command-strip">
        <span>押し方はこれだけ</span><b>K</b><i>と</i><b>G</b><strong>同時に押す</strong>
        <span class="arrow">→</span><b class="release-key">G</b><strong>だけすぐ離す</strong>
        <small>Kは押したまま</small>
      </div>
      <div class="workbench">
        <div class="input-zone">
          <div class="coach" id="coach">
            <span id="coach-icon">練習</span>
            <strong id="coach-text">上の手順でボタンを登録してください</strong>
          </div>
          <div class="buttons">
            <button class="practice-button k-button" id="k-button"><small>KICK</small><strong>K</strong><span id="k-source">Keyboard J</span></button>
            <div class="plus">+</div>
            <button class="practice-button g-button" id="g-button"><small>GUARD</small><strong>G</strong><span id="g-source">Keyboard K</span></button>
          </div>
          <div class="finger-tip"><b>コツ</b><span>Kを押す指は止めたまま。Gの指だけをボタン表面から跳ねあげる。</span></div>
        </div>
        <div class="verdict idle" id="verdict">
          <span class="verdict-label">LAST INPUT</span>
          <strong id="verdict-ms">—<small> ms</small></strong>
          <span class="frames" id="verdict-frames">— FRAME</span>
          <p id="verdict-reason">最初の入力を待っています</p>
        </div>
      </div>
    </section>

    <section class="dashboard">
      <div class="stats">
        <article><span>SUCCESS RATE</span><strong id="stat-rate">0<small>%</small></strong><div class="meter"><i id="stat-meter" style="width:0%"></i></div></article>
        <article><span>CLEAN INPUTS</span><strong id="stat-clean">0<small> / 0</small></strong></article>
        <article><span>連続成功</span><strong id="stat-streak">0<small> 回</small></strong></article>
      </div>
      <div class="history">
        <div class="history-head"><h2>入力カルテ — 直近10回</h2><button id="clear-history-btn">記録を消す</button></div>
        <div id="history-list"><p class="empty">まだデータがありません。K+Gから始めましょう。</p></div>
      </div>
    </section>

    <footer>
      <div>
        <b>練習レベル</b>
        <button id="loose-btn">やさしい 1.5F</button>
        <button id="strict-btn" class="selected">実戦 1F</button>
        <button id="sound-btn" class="selected">判定音 ON</button>
      </div>
      <p>まずは「やさしい」で10回中8回を目指し、達成したら「実戦」へ。1F = 約16.67ms(60fps)。</p>
    </footer>
  </main>

  <script>
    const FRAME_MS = 1000 / 60;
    let held = { k: false, g: false, kAt: null, gAt: null };
    let attempts = [];
    let strict = true;
    let sound = true;
    let padLabels = [null, null];
    let setupStep = 'connect';
    let padPrev = [];
    let attemptId = 0;

    const els = {
      connectionLabel: document.getElementById('connection-label'),
      padNameLabel: document.getElementById('pad-name-label'),
      stepConnect: document.getElementById('step-connect'),
      stepK: document.getElementById('step-k'),
      stepG: document.getElementById('step-g'),
      kLabel: document.getElementById('k-label'),
      gLabel: document.getElementById('g-label'),
      resetButtonsBtn: document.getElementById('reset-buttons-btn'),
      coach: document.getElementById('coach'),
      coachIcon: document.getElementById('coach-icon'),
      coachText: document.getElementById('coach-text'),
      kButton: document.getElementById('k-button'),
      gButton: document.getElementById('g-button'),
      kSource: document.getElementById('k-source'),
      gSource: document.getElementById('g-source'),
      verdict: document.getElementById('verdict'),
      verdictMs: document.getElementById('verdict-ms'),
      verdictFrames: document.getElementById('verdict-frames'),
      verdictReason: document.getElementById('verdict-reason'),
      statRate: document.getElementById('stat-rate'),
      statMeter: document.getElementById('stat-meter'),
      statClean: document.getElementById('stat-clean'),
      statStreak: document.getElementById('stat-streak'),
      historyList: document.getElementById('history-list'),
      clearHistoryBtn: document.getElementById('clear-history-btn'),
      looseBtn: document.getElementById('loose-btn'),
      strictBtn: document.getElementById('strict-btn'),
      soundBtn: document.getElementById('sound-btn'),
    };

    function setSetupStep(step) {
      setupStep = step;
      els.stepConnect.className = step === 'connect' ? 'active' : 'done';
      els.stepK.className = step === 'k' ? 'active' : (['g', 'done'].includes(step) ? 'done' : '');
      els.stepG.className = step === 'g' ? 'active' : (step === 'done' ? 'active done' : '');
      els.resetButtonsBtn.style.display = step === 'done' ? 'inline-block' : 'none';
    }

    function press(button, at) {
      at = at ?? performance.now();
      if (held[button]) return;
      held[button] = true;
      held[button + 'At'] = at;
      renderHeld();
      if (held.k && held.g) {
        els.coach.classList.add('go');
        els.coachIcon.textContent = '今!';
        els.coachText.textContent = 'Gだけ離す(Kは押したまま)';
      }
    }

    function release(button, at) {
      at = at ?? performance.now();
      if (!held[button]) return;
      if (button === 'g' && held.gAt !== null) {
        const ms = at - held.gAt;
        const together = held.kAt !== null && Math.abs(held.gAt - held.kAt) <= (strict ? FRAME_MS : FRAME_MS * 2);
        const success = held.k && together && ms <= (strict ? FRAME_MS : FRAME_MS * 1.5);
        const reason = !held.k ? 'Kが離れています' : !together ? '同時押しがずれています' : ms > (strict ? FRAME_MS : FRAME_MS * 1.5) ? 'Gを離すのが遅い' : '1Fリリース成功';
        attempts = [{ id: ++attemptId, ms, success, reason }, ...attempts].slice(0, 10);
        if (sound) {
          try {
            const audio = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audio.createOscillator();
            const gain = audio.createGain();
            osc.frequency.value = success ? 760 : 180;
            gain.gain.value = 0.035;
            osc.connect(gain);
            gain.connect(audio.destination);
            osc.start();
            osc.stop(audio.currentTime + 0.07);
          } catch (e) {}
        }
        els.coach.classList.remove('go');
        els.coachIcon.textContent = '練習';
        els.coachText.textContent = setupStep !== 'done' ? '上の手順でボタンを登録してください' : 'K + Gを同時に押してください';
        renderVerdict(attempts[0]);
        renderStats();
        renderHistory();
      }
      held[button] = false;
      held[button + 'At'] = null;
      renderHeld();
    }

    function renderHeld() {
      els.kButton.classList.toggle('held', held.k);
      els.gButton.classList.toggle('held', held.g);
    }

    function renderVerdict(latest) {
      if (!latest) return;
      els.verdict.className = 'verdict ' + (latest.success ? 'success' : 'fail');
      els.verdictMs.innerHTML = latest.ms.toFixed(1) + '<small> ms</small>';
      els.verdictFrames.textContent = (latest.ms / FRAME_MS).toFixed(2) + ' FRAME';
      els.verdictReason.textContent = latest.reason;
    }

    function renderStats() {
      const success = attempts.filter(a => a.success).length;
      const rate = attempts.length ? Math.round(success / attempts.length * 100) : 0;
      let streak = 0;
      for (const a of attempts) { if (!a.success) break; streak++; }
      els.statRate.innerHTML = rate + '<small>%</small>';
      els.statMeter.style.width = rate + '%';
      els.statClean.innerHTML = success + '<small> / ' + attempts.length + '</small>';
      els.statStreak.innerHTML = streak + '<small> 回</small>';
    }

    function renderHistory() {
      if (attempts.length === 0) {
        els.historyList.innerHTML = '<p class="empty">まだデータがありません。K+Gから始めましょう。</p>';
        return;
      }
      els.historyList.innerHTML = attempts.map((a, index) => {
        const width = Math.min(100, a.ms / 40 * 100);
        return '<div class="history-row"><span>' + String(attempts.length - index).padStart(2, '0') + '</span>' +
          '<div><i class="' + (a.success ? 'ok' : 'ng') + '" style="width:' + width + '%"></i></div>' +
          '<b>' + a.ms.toFixed(1) + ' ms</b><em>' + (a.success ? 'CLEAN' : 'MISS') + '</em></div>';
      }).join('');
    }

    document.addEventListener('keydown', (event) => {
      if (event.repeat) return;
      if (event.code === 'KeyJ') { event.preventDefault(); press('k'); }
      if (event.code === 'KeyK') { event.preventDefault(); press('g'); }
      if (event.code === 'Space') { event.preventDefault(); attempts = []; renderStats(); renderHistory(); }
    });
    document.addEventListener('keyup', (event) => {
      if (event.code === 'KeyJ') release('k');
      if (event.code === 'KeyK') release('g');
    });

    function touchProps(el, button) {
      el.addEventListener('pointerdown', (e) => { el.setPointerCapture(e.pointerId); press(button); });
      el.addEventListener('pointerup', () => release(button));
      el.addEventListener('pointercancel', () => release(button));
    }
    touchProps(els.kButton, 'k');
    touchProps(els.gButton, 'g');

    els.clearHistoryBtn.addEventListener('click', () => { attempts = []; renderStats(); renderHistory(); });
    els.looseBtn.addEventListener('click', () => { strict = false; els.looseBtn.classList.add('selected'); els.strictBtn.classList.remove('selected'); });
    els.strictBtn.addEventListener('click', () => { strict = true; els.strictBtn.classList.add('selected'); els.looseBtn.classList.remove('selected'); });
    els.soundBtn.addEventListener('click', () => { sound = !sound; els.soundBtn.classList.toggle('selected', sound); els.soundBtn.textContent = '判定音 ' + (sound ? 'ON' : 'OFF'); });

    function pollGamepad() {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const pad = pads[0];
      if (pad) {
        const name = pad.id.replace(/\s*\([^)]*\)/g, '').slice(0, 54);
        els.connectionLabel.textContent = 'アケコン接続中';
        els.connectionLabel.classList.add('online');
        els.padNameLabel.textContent = name;
        if (setupStep === 'connect') setSetupStep('k');

        const current = pad.buttons.map(b => b.pressed);
        const newlyPressed = current.map((v, i) => v && !padPrev[i]).map((v, i) => v ? i : -1).filter(i => i >= 0);
        for (const index of newlyPressed) {
          if (setupStep === 'k') { padLabels = [index, null]; els.kLabel.textContent = 'ボタン ' + index + ' を登録済み'; setSetupStep('g'); break; }
          if (setupStep === 'g' && index !== padLabels[0]) { padLabels = [padLabels[0], index]; els.gLabel.textContent = 'ボタン ' + index + ' を登録済み'; setSetupStep('done'); break; }
        }
        const [kButtonIdx, gButtonIdx] = padLabels;
        if (kButtonIdx !== null) { current[kButtonIdx] ? press('k') : release('k'); els.kSource.textContent = 'Keyboard J · Pad ' + kButtonIdx; }
        if (gButtonIdx !== null) { current[gButtonIdx] ? press('g') : release('g'); els.gSource.textContent = 'Keyboard K · Pad ' + gButtonIdx; }
        padPrev = current;
      }
      requestAnimationFrame(pollGamepad);
    }
    requestAnimationFrame(pollGamepad);

    els.resetButtonsBtn.addEventListener('click', () => {
      padLabels = [null, null];
      setSetupStep(els.padNameLabel.textContent !== '接続すると自動で見つかります' ? 'k' : 'connect');
    });
  </script>
</body>
</html>
