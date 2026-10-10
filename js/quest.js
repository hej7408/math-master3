/* 수학박사 모험 — 게이미피케이션 (레벨·코인·캐릭터 꾸미기·모험 지도·보스전·타임어택·일일 미션·배지) */
(function () {
  const U = MD.util, h = U.h, P = MD.problems, S = MD.std, C = MD.comp;
  const KEY = 'mathdoctor3.quest.v1';

  /* ---------- 상점 아이템 ---------- */
  const ITEMS = [
    { id: 'hat0', slot: 'hat', e: '🎓', n: '박사 모자', p: 0 }, { id: 'hat1', slot: 'hat', e: '🧢', n: '야구 모자', p: 25 }, { id: 'hat2', slot: 'hat', e: '🎩', n: '마술 모자', p: 40 },
    { id: 'hat3', slot: 'hat', e: '⛑️', n: '탐험 헬멧', p: 40 }, { id: 'hat4', slot: 'hat', e: '👑', n: '왕관', p: 120 },
    { id: 'tool0', slot: 'tool', e: '✏️', n: '연필', p: 0 }, { id: 'tool1', slot: 'tool', e: '🔭', n: '망원경', p: 30 }, { id: 'tool2', slot: 'tool', e: '🪄', n: '마법 지팡이', p: 60 },
    { id: 'tool3', slot: 'tool', e: '🧪', n: '실험 플라스크', p: 50 }, { id: 'tool4', slot: 'tool', e: '🗡️', n: '용사의 검', p: 90 },
    { id: 'pet0', slot: 'pet', e: '🐥', n: '병아리', p: 0 }, { id: 'pet1', slot: 'pet', e: '🐶', n: '강아지', p: 45 }, { id: 'pet2', slot: 'pet', e: '🐱', n: '고양이', p: 45 },
    { id: 'pet3', slot: 'pet', e: '🐰', n: '토끼', p: 55 }, { id: 'pet4', slot: 'pet', e: '🐲', n: '아기 용', p: 140 }, { id: 'pet5', slot: 'pet', e: '🦄', n: '유니콘', p: 160 },
    { id: 'bg0', slot: 'bg', e: '☁️', n: '구름 하늘', p: 0, c: 'linear-gradient(#bde7ff,#eaf8ff)' }, { id: 'bg1', slot: 'bg', e: '🌲', n: '숲속', p: 35, c: 'linear-gradient(#b7f0b1,#e7ffd9)' },
    { id: 'bg2', slot: 'bg', e: '🌊', n: '바닷속', p: 50, c: 'linear-gradient(#7fd6ff,#d1f1ff)' }, { id: 'bg3', slot: 'bg', e: '🌌', n: '우주', p: 100, c: 'linear-gradient(#2b1b6b,#6a4cc0)' },
    { id: 'bg4', slot: 'bg', e: '🌋', n: '화산', p: 70, c: 'linear-gradient(#ffb199,#ff7e5f)' },
  ];
  const SLOT_NAME = { hat: '모자', tool: '도구', pet: '친구', bg: '배경' };
  const LV_TITLE = ['새싹', '꿈나무', '수학 탐험가', '수학 도전자', '수학 달인', '수학 박사', '수학 마스터', '수학 전설'];

  /* ---------- 일일 미션 · 배지 ---------- */
  const MISSIONS = [
    { id: 'c5', t: '문제 5개 맞히기', type: 'correct', goal: 5, r: 15 }, { id: 'c10', t: '문제 10개 맞히기', type: 'correct', goal: 10, r: 25 },
    { id: 'clr', t: '모험 스테이지 1개 깨기', type: 'clear', goal: 1, r: 20 }, { id: 'cmb', t: '3연속 정답 달성', type: 'combo', goal: 3, r: 15 },
    { id: 'brd', t: '연산판 서술형 1문제 완료', type: 'board', goal: 1, r: 15 }, { id: 'plc', t: '조작판으로 계산 1번 완료', type: 'place', goal: 1, r: 15 },
    { id: 'tmr', t: '타임어택 도전하기', type: 'time', goal: 1, r: 15 },
  ];
  const BADGES = [
    { id: 'first', e: '🌱', n: '첫걸음', d: '첫 문제를 맞혔어요', ok: (q) => q.stat.correct >= 1 },
    { id: 'c50', e: '🔥', n: '50문제 정복', d: '문제 50개 맞히기', ok: (q) => q.stat.correct >= 50 },
    { id: 'c200', e: '💎', n: '200문제 달인', d: '문제 200개 맞히기', ok: (q) => q.stat.correct >= 200 },
    { id: 'cmb5', e: '⚡', n: '콤보 5', d: '5연속 정답', ok: (q) => q.stat.maxCombo >= 5 },
    { id: 'cmb10', e: '🌩️', n: '콤보 10', d: '10연속 정답', ok: (q) => q.stat.maxCombo >= 10 },
    { id: 'st3', e: '🗓️', n: '3일 연속', d: '3일 연속 출석', ok: (q) => q.streak >= 3 },
    { id: 'st7', e: '🏅', n: '일주일 출석왕', d: '7일 연속 출석', ok: (q) => q.streak >= 7 },
    { id: 'clr1', e: '🗺️', n: '모험의 시작', d: '스테이지 1개 클리어', ok: (q) => Object.keys(q.stages).length >= 1 },
    { id: 'boss', e: '👹', n: '보스 사냥꾼', d: '보스 스테이지 클리어', ok: (q) => Object.keys(q.stages).some((k) => /-5$/.test(k)) },
    { id: 'perf', e: '🌟', n: '완벽한 승리', d: '별 3개로 스테이지 클리어', ok: (q) => Object.values(q.stages).some((s) => s >= 3) },
    { id: 'dom4', e: '🌈', n: '4개 영역 탐험', d: '4개 영역 모두 문제 풀기', ok: (q) => Object.keys(q.stat.dom || {}).length >= 4 },
    { id: 'time', e: '⏱️', n: '번개 손', d: '타임어택 10문제 이상', ok: (q) => q.best.time >= 10 },
    { id: 'shop', e: '🛍️', n: '수집가', d: '아이템 6개 모으기', ok: (q) => q.owned.length >= 6 },
    { id: 'lv5', e: '🎖️', n: '레벨 5', d: '레벨 5 달성', ok: (q) => lvOf(q.xp) >= 5 },
  ];
  /* 레벨 n → n+1 에 필요한 경험치: 80, 100, 120 … (점점 늘어요) */
  const need = (lv) => 60 + 20 * lv;
  function lvInfo(xp) { let lv = 1, left = xp; while (left >= need(lv)) { left -= need(lv); lv++; } return { lv, cur: left, max: need(lv) }; }
  const lvOf = (xp) => lvInfo(xp).lv;

  /* ---------- 저장소 ---------- */
  const fresh = () => ({ xp: 0, coins: 10, streak: 0, last: '', owned: ['hat0', 'tool0', 'pet0', 'bg0'], equip: { hat: 'hat0', tool: 'tool0', pet: 'pet0', bg: 'bg0' }, badges: {}, stages: {}, best: { time: 0 }, stat: { correct: 0, wrong: 0, maxCombo: 0, dom: {} }, daily: { day: '', prog: {}, claimed: {} }, mute: false, nick: '' });
  let Q = fresh();
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d) Q = Object.assign(fresh(), d, { stat: Object.assign(fresh().stat, d.stat), best: Object.assign(fresh().best, d.best) }); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(Q)); } catch (e) {} };
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const dayNum = () => Math.floor(new Date(today()).getTime() / 86400000);

  /* ---------- 소리 · 효과 ---------- */
  let ac = null;
  function beep(kind) {
    if (Q.mute) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const seq = { ok: [[660, .08], [880, .12]], bad: [[220, .18]], win: [[523, .1], [659, .1], [784, .1], [1047, .25]], coin: [[988, .06], [1319, .12]], lvl: [[392, .1], [523, .1], [659, .1], [784, .1], [1047, .3]] }[kind] || [];
      let t = ac.currentTime;
      seq.forEach(([f, d]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = kind === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d); t += d * .9; });
    } catch (e) {}
  }
  function burst(emojis, n) {
    const box = h('div', { class: 'confetti', 'aria-hidden': 'true' });
    for (let i = 0; i < (n || 26); i++) box.append(h('i', { style: { left: Math.random() * 100 + '%', animationDelay: Math.random() * .5 + 's', fontSize: 18 + Math.random() * 18 + 'px', '--dx': (Math.random() * 120 - 60) + 'px' } }, emojis[i % emojis.length]));
    document.body.append(box); setTimeout(() => box.remove(), 2600);
  }

  /* ---------- 공개 API ---------- */
  const API = (MD.quest = {
    touch() {
      const t = today();
      if (Q.last !== t) {
        const y = new Date(); y.setDate(y.getDate() - 1);
        const yd = y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0');
        Q.streak = Q.last === yd ? Q.streak + 1 : 1; Q.last = t;
        if (Q.daily.day !== t) Q.daily = { day: t, prog: {}, claimed: {} };
        const bonus = Math.min(10, 2 + Q.streak); Q.coins += bonus; save();
        setTimeout(() => U.toast(`🔥 ${Q.streak}일 연속 출석! 코인 +${bonus}`, 'ok'), 600); badgeCheck();
      }
    },
    addXP(n, why) { const before = lvOf(Q.xp); Q.xp += n; save(); if (lvOf(Q.xp) > before) { beep('lvl'); burst(['🎉', '⭐', '✨'], 30); U.toast(`🎊 레벨 업! Lv.${lvOf(Q.xp)} ${LV_TITLE[Math.min(Math.floor((lvOf(Q.xp) - 1) / 2), LV_TITLE.length - 1)]}`, 'ok'); badgeCheck(); } },
    addCoins(n) { Q.coins += n; save(); },
    /* 다른 화면에서 호출: 'board' | 'place' | 'correct' | 'clear' | 'combo' | 'time' */
    event(type, n, extra) {
      n = n == null ? 1 : n;
      if (Q.daily.day !== today()) Q.daily = { day: today(), prog: {}, claimed: {} };
      const dp = Q.daily.prog;
      if (type === 'combo') dp.combo = Math.max(dp.combo || 0, n); else dp[type] = (dp[type] || 0) + n;
      if (type === 'correct') { Q.stat.correct += n; if (extra && extra.dom) Q.stat.dom[extra.dom] = (Q.stat.dom[extra.dom] || 0) + 1; }
      if (type === 'combo') Q.stat.maxCombo = Math.max(Q.stat.maxCombo, n);
      if (type === 'board') { API.addXP(10 + (extra || 0) * 5); API.addCoins(3 + (extra || 0)); U.toast(`🧲 연산판 완료! XP +${10 + (extra || 0) * 5}, 코인 +${3 + (extra || 0)}`, 'ok'); }
      if (type === 'place') { API.addXP(8); API.addCoins(2); }
      save(); badgeCheck();
    },
    state: () => Q,
  });
  function badgeCheck() {
    BADGES.forEach((b) => { if (!Q.badges[b.id] && b.ok(Q)) { Q.badges[b.id] = today(); save(); beep('win'); burst([b.e, '✨'], 20); U.toast(`${b.e} 새 배지! ‘${b.n}’`, 'ok'); } });
  }
  const todaysMissions = () => { const base = dayNum(); return [0, 1, 2].map((i) => MISSIONS[(base * 3 + i * 2 + i) % MISSIONS.length]).filter((m, i, a) => a.findIndex((x) => x.id === m.id) === i); };
  const progOf = (m) => Math.min(m.goal, Q.daily.day === today() ? (m.type === 'combo' ? Q.daily.prog.combo || 0 : Q.daily.prog[m.type] || 0) : 0);

  /* ---------- 캐릭터 ---------- */
  const item = (id) => ITEMS.find((i) => i.id === id);
  function avatar(big) {
    const bg = item(Q.equip.bg);
    return h('div', { class: 'av' + (big ? ' big' : ''), style: { background: bg.c }, 'aria-label': '내 캐릭터' }, h('span', { class: 'av-hat' }, item(Q.equip.hat).e), h('span', { class: 'av-body' }, '🧑‍🎓'), h('span', { class: 'av-tool' }, item(Q.equip.tool).e), h('span', { class: 'av-pet' }, item(Q.equip.pet).e));
  }
  const xpBar = () => { const { lv, cur, max } = lvInfo(Q.xp); return h('div', { class: 'xp' }, h('div', { class: 'xpb' }, h('i', { style: { width: (cur / max) * 100 + '%' } })), h('small', null, `Lv.${lv} ${LV_TITLE[Math.min(Math.floor((lv - 1) / 2), LV_TITLE.length - 1)]} · ${cur}/${max} XP`)); };

  /* ---------- 세션(문제 풀이 라운드) ---------- */
  function runSession(box, o, done) {
    // o: {title, count, hearts, time, grade, domain, std}
    const st = { i: 0, ok: 0, hearts: o.hearts, combo: 0, maxCombo: 0, tries: 0, left: o.time || 0, over: false, hint: false, p: null, msg: null };
    let timer = null;
    MD.dbgQ = st; // 자동 점검용
    const newP = () => { st.p = P.make({ grade: o.grade, domain: o.domain === 'all' ? undefined : o.domain, avoid: st.p && st.p.tpl }); st.tries = 0; st.hint = false; st.msg = null; st.fin = null; };
    const end = (win) => { if (st.over) return; st.over = true; clearInterval(timer); done(st, win); };
    function draw() {
      if (st.over) return;
      const p = st.p, K = S.KINDS[p.kind];
      if (!st.fin) st.fin = C.finalInput(p, { onSubmit: submit });
      const top = h('div', { class: 'qtop' },
        h('b', null, o.title),
        o.hearts ? h('span', { class: 'hearts', 'aria-label': `목숨 ${st.hearts}` }, '❤️'.repeat(st.hearts) + '🖤'.repeat(Math.max(0, o.hearts - st.hearts))) : null,
        o.count ? h('span', { class: 'pill' }, `${Math.min(st.i + 1, o.count)} / ${o.count}`) : h('span', { class: 'pill' }, `맞힌 문제 ${st.ok}`),
        o.time ? h('span', { class: 'timer' + (st.left <= 10 ? ' low' : '') }, '⏱️ ' + st.left + '초') : null,
        st.combo >= 2 ? h('span', { class: 'combo' }, `🔥 ${st.combo} 콤보`) : null);
      box.replaceChildren(top,
        h('div', { class: 'card qcard' }, h('p', { class: 'ptext' }, C.hlText(p.text, st.hint ? C.findKw(p.text, p.kind) : [])), p.figure ? h('div', { class: 'pfig', html: MD.fig.render(p.figure) }) : null,
          st.hint ? h('div', { class: 'msg' }, `💡 분류카드: ${K.label} — ${K.desc}`) : null, st.hint && p.eq ? h('div', { class: 'msg' }, '💡 식 힌트: ' + p.eq.show.replace(/[0-9]+/g, (m) => m)) : null,
          h('div', { class: 'finwrap' }, st.fin), st.msg ? h('div', { class: 'msg ' + st.msg.k }, st.msg.t) : null,
          h('div', { class: 'row' }, h('button', { class: 'btn', onclick: submit }, '✔ 정답 확인'), h('button', { class: 'btn w', onclick: () => { st.hint = true; draw(); } }, '💡 힌트'), h('button', { class: 'btn w', onclick: skip }, '넘기기'))));
      const first = box.querySelector('.fin'); if (first) first.focus();
    }
    function advance() { st.i++; if (o.count && st.i >= o.count) return end(true); newP(); draw(); }
    function skip() { st.combo = 0; if (o.hearts) { st.hearts--; beep('bad'); if (st.hearts <= 0) return end(false); } advance(); }
    function submit() {
      if (st.over) return;
      const p = st.p, inp = st.fin.read(); const empty = p.final.type === 'num' && String(inp.v).trim() === '';
      const r = empty ? { ok: false, msg: '답을 써 보세요.' } : P.checkFinal(p, inp);
      if (r.ok) {
        st.ok++; st.combo++; st.maxCombo = Math.max(st.maxCombo, st.combo); beep('ok');
        const xp = 5 + Math.min(st.combo, 5), coin = 2 + (st.combo >= 3 ? 1 : 0); API.addXP(xp); API.addCoins(coin);
        API.event('correct', 1, { dom: p.domain }); if (st.combo >= 2) API.event('combo', st.combo);
        U.store.record(p.std, p.grade, true);
        U.toast(`+${xp} XP · 🪙+${coin}${st.combo >= 3 ? ' · 🔥콤보!' : ''}`, 'ok'); advance();
      } else {
        st.tries++; st.combo = 0; Q.stat.wrong++; save(); beep('bad');
        if (st.tries >= 2) { U.store.record(p.std, p.grade, false); st.msg = { t: `정답은 ${p.ansText} 였어요. ${p.explain || ''}`, k: 'bad' }; if (o.hearts) { st.hearts--; if (st.hearts <= 0) return end(false); } setTimeout(() => { if (!st.over) advance(); }, 1800); }
        else st.msg = { t: r.msg + (o.hearts ? ' (한 번 더 도전!)' : ''), k: 'bad' };
        draw();
      }
    }
    if (o.time) timer = setInterval(() => { st.left--; if (st.left <= 0) { end(true); } else { const t = box.querySelector('.timer'); if (t) { t.textContent = '⏱️ ' + st.left + '초'; t.classList.toggle('low', st.left <= 10); } } }, 1000);
    newP(); draw();
    return () => clearInterval(timer);
  }

  /* ---------- 페이지 ---------- */
  MD.pages.quest = {
    title: '수학박사 모험',
    render(root, params) {
      let view = params.v || 'home', grade = +params.grade || MD.state.grade || 2, stop = null;
      const wrap = h('div', { class: 'qs' }); root.append(wrap);
      const nav = () => h('div', { class: 'tabsmall' }, [['home', '🏠 내 캐릭터'], ['map', '🗺️ 모험 지도'], ['time', '⏱️ 타임어택'], ['shop', '🛍️ 상점'], ['badges', '🏅 배지']].map(([k, t]) => h('button', { class: view === k ? 'on' : '', onclick: () => go(k) }, t)));
      const stats = () => h('div', { class: 'qstat' }, h('span', { class: 'chip' }, '🪙 ' + Q.coins), h('span', { class: 'chip' }, '🔥 ' + Q.streak + '일'), h('span', { class: 'chip' }, '⭐ XP ' + Q.xp), h('button', { class: 'chip', onclick: () => { Q.mute = !Q.mute; save(); go(view); }, 'aria-label': '소리 켜기/끄기' }, Q.mute ? '🔇' : '🔊'));
      function go(v) { if (stop) { stop(); stop = null; } view = v; draw(); }
      function draw() {
        const body = h('div');
        wrap.replaceChildren(h('div', { class: 'row' }, h('h1', { style: { margin: 0 } }, '🏆 수학박사 모험'), h('span', { class: 'grow' }), stats()), nav(), body);
        ({ home, map, time, shop, badges }[view] || home)(body);
      }

      /* 내 캐릭터 */
      function home(b) {
        const ms = todaysMissions();
        b.append(h('div', { class: 'qhome' },
          h('div', { class: 'card' }, avatar(true), h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '8px' } }, h('input', { type: 'text', maxlength: 8, placeholder: '내 별명', value: Q.nick, 'aria-label': '별명', style: { width: '140px', textAlign: 'center' }, onchange: (e) => { Q.nick = e.target.value; save(); } })), xpBar(),
            h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '8px' } }, h('button', { class: 'btn y', onclick: () => go('map') }, '🗺️ 모험 떠나기'), h('button', { class: 'btn w', onclick: () => go('shop') }, '🛍️ 꾸미기'))),
          h('div', { class: 'card' }, h('h3', null, '📅 오늘의 미션'), h('div', { class: 'missions' }, ms.map((m) => {
            const pr = progOf(m), done = pr >= m.goal, got = Q.daily.claimed[m.id];
            return h('div', { class: 'mis' + (done ? ' done' : '') }, h('div', { class: 'grow' }, h('b', null, m.t), h('div', { class: 'bar-prog', style: { width: '100%', marginTop: '4px' } }, h('i', { style: { width: (pr / m.goal) * 100 + '%' } })), h('small', { class: 'muted' }, `${pr} / ${m.goal}`)),
              h('button', { class: 'btn sm ' + (got ? 'w' : 'y'), disabled: !done || got || null, onclick: () => { Q.daily.claimed[m.id] = 1; API.addCoins(m.r); API.addXP(10); beep('coin'); burst(['🪙', '✨'], 16); U.toast(`🪙 +${m.r} 코인!`, 'ok'); go('home'); } }, got ? '받음 ✓' : `🪙 ${m.r} 받기`));
          })), h('p', { class: 'muted', style: { fontSize: '.84rem' } }, '연산판·조작판을 풀어도 경험치와 코인을 얻어요. 매일 출석하면 보너스 코인!'))));
      }

      /* 모험 지도 */
      function map(b) {
        b.append(h('div', { class: 'row' }, h('b', null, '학년'), MD.ui.gradeChips(grade, (g) => { grade = g; MD.state.grade = g; MD.saveState(); draw(); })), h('p', { class: 'muted' }, '각 영역의 섬에서 스테이지를 차례로 깨요. 5번째는 👹 보스! (목숨 ❤️ 3개)'));
        const isl = h('div', { class: 'islands' });
        const BOSS = { num: '🐉', rel: '🦑', geo: '🗿', data: '🦖' };
        Object.values(S.DOMAINS).forEach((d) => {
          const nodes = h('div', { class: 'path' });
          let prevOk = true;
          for (let n = 1; n <= 5; n++) {
            const key = `${grade}-${d.id}-${n}`, stars = Q.stages[key] || 0, open = prevOk, boss = n === 5;
            nodes.append(h('button', { class: 'node' + (stars ? ' clr' : '') + (open ? '' : ' lock') + (boss ? ' boss' : ''), disabled: !open || null, style: { '--c': d.color, marginLeft: [0, 28, 8, 34, 14][n - 1] + 'px' }, 'aria-label': `${d.name} ${n}번 스테이지${stars ? ' 별 ' + stars + '개' : ''}`, onclick: () => playStage(d, n, key) },
              h('span', { class: 'ne' }, boss ? BOSS[d.id] : open ? String(n) : '🔒'), h('small', null, stars ? '⭐'.repeat(stars) : boss ? '보스' : open ? '도전' : '')));
            prevOk = prevOk && stars > 0;
          }
          isl.append(h('div', { class: 'card island', style: { borderColor: d.color } }, h('h3', { style: { color: d.color } }, d.icon + ' ' + d.name + ' 섬'), nodes));
        });
        b.append(isl);
      }
      function playStage(d, n, key) {
        const boss = n === 5, cfg = { title: `${d.icon} ${d.name} ${boss ? '보스전' : n + '번'}`, count: boss ? 8 : 5, hearts: boss ? 3 : 0, grade, domain: d.id };
        const body = h('div'); wrap.replaceChildren(h('div', { class: 'row' }, h('button', { class: 'btn w sm', onclick: () => go('map') }, '← 그만두기'), stats()), body);
        stop = runSession(body, cfg, (st, win) => {
          const need = boss ? 6 : 3, ok = st.ok >= need && win, stars = ok ? (st.ok >= cfg.count ? 3 : st.ok >= cfg.count - 1 ? 2 : 1) : 0;
          let first = false; if (ok) { first = !Q.stages[key]; Q.stages[key] = Math.max(Q.stages[key] || 0, stars); API.event('clear', 1); const xp = 15 * stars + (first ? 20 : 0), co = 8 * stars + (first ? 10 : 0) + (boss ? 20 : 0); API.addXP(xp); API.addCoins(co); save(); badgeCheck(); beep('win'); burst(['🎉', '⭐', '🪙', '✨'], 36); body.replaceChildren(result(true, st, cfg, stars, xp, co)); }
          else { beep('bad'); body.replaceChildren(result(false, st, cfg, 0, 0, 0)); }
          function result(w, st2, c, s, xp, co) {
            return h('div', { class: 'card result' }, h('div', { class: 'big' }, w ? (boss ? '👑' : '🎉') : '💪'), h('h2', null, w ? (boss ? '보스를 물리쳤어요!' : '스테이지 클리어!') : '아쉬워요, 다시 도전!'),
              h('div', { class: 'stars' }, w ? '⭐'.repeat(s) + '☆'.repeat(3 - s) : ''), h('p', null, `맞힌 문제 ${st2.ok} / ${c.count} · 최고 콤보 ${st2.maxCombo}`), w ? h('p', { class: 'bigeq' }, `XP +${xp}   🪙 +${co}`) : h('p', { class: 'muted' }, `통과하려면 ${need}문제를 맞혀야 해요.`),
              h('div', { class: 'row', style: { justifyContent: 'center' } }, h('button', { class: 'btn', onclick: () => playStage(d, n, key) }, '🔁 다시'), n < 5 && w ? h('button', { class: 'btn y', onclick: () => playStage(d, n + 1, `${grade}-${d.id}-${n + 1}`) }, '다음 스테이지 ▶') : null, h('button', { class: 'btn w', onclick: () => go('map') }, '🗺️ 지도로')));
          }
        });
      }

      /* 타임어택 */
      function time(b) {
        b.append(h('div', { class: 'card' }, h('h3', null, '⏱️ 60초 타임어택'), h('p', null, '60초 동안 최대한 많은 문제를 맞혀 보세요! 연속으로 맞히면 콤보 보너스.'), h('p', { class: 'muted' }, `내 최고 기록: ${Q.best.time}문제`),
          h('div', { class: 'row' }, MD.ui.gradeChips(grade, (g) => { grade = g; draw(); }), MD.ui.domainChips(MD.state.domain || 'all', (d) => { MD.state.domain = d; MD.saveState(); draw(); }, true)), h('button', { class: 'btn y', style: { fontSize: '1.2rem', marginTop: '10px' }, onclick: startTime }, '🚀 시작!')));
      }
      function startTime() {
        const body = h('div'); wrap.replaceChildren(h('div', { class: 'row' }, h('button', { class: 'btn w sm', onclick: () => go('time') }, '← 그만두기'), stats()), body);
        stop = runSession(body, { title: '⏱️ 타임어택', time: 60, grade, domain: MD.state.domain || 'all' }, (st) => {
          API.event('time', 1); const rec = st.ok > Q.best.time; if (rec) { Q.best.time = st.ok; save(); } badgeCheck(); beep('win'); if (st.ok >= 3) burst(['⚡', '⭐', '🪙'], 28);
          body.replaceChildren(h('div', { class: 'card result' }, h('div', { class: 'big' }, '⏰'), h('h2', null, '시간 종료!'), h('p', { class: 'bigeq' }, `${st.ok}문제 성공 · 최고 콤보 ${st.maxCombo}`), rec && st.ok ? h('p', { class: 'ok' }, '🏆 새 기록이에요!') : h('p', { class: 'muted' }, `내 최고 기록: ${Q.best.time}문제`), h('div', { class: 'row', style: { justifyContent: 'center' } }, h('button', { class: 'btn y', onclick: startTime }, '🔁 다시 도전'), h('button', { class: 'btn w', onclick: () => go('home') }, '내 캐릭터로'))));
        });
      }

      /* 상점 */
      function shop(b) {
        b.append(h('div', { class: 'card', style: { marginBottom: '12px' } }, h('div', { class: 'row', style: { justifyContent: 'center' } }, avatar(true))));
        Object.keys(SLOT_NAME).forEach((slot) => {
          b.append(h('h3', { style: { marginTop: '14px' } }, SLOT_NAME[slot]), h('div', { class: 'shop' }, ITEMS.filter((i) => i.slot === slot).map((it) => {
            const own = Q.owned.includes(it.id), on = Q.equip[slot] === it.id;
            return h('button', { class: 'sitem card' + (on ? ' on' : '') + (own ? '' : ' buy'), onclick: () => {
              if (own) { Q.equip[slot] = it.id; save(); beep('ok'); go('shop'); return; }
              if (Q.coins < it.p) { beep('bad'); U.toast(`코인이 ${it.p - Q.coins}개 부족해요. 문제를 풀어 모아 봐요!`, 'bad'); return; }
              Q.coins -= it.p; Q.owned.push(it.id); Q.equip[slot] = it.id; save(); beep('coin'); burst(['🛍️', '✨'], 14); badgeCheck(); go('shop');
            } }, h('span', { class: 'se' }, it.e), h('b', null, it.n), h('small', null, on ? '착용 중' : own ? '착용하기' : '🪙 ' + it.p));
          })));
        });
      }

      /* 배지 */
      function badges(b) {
        const got = Object.keys(Q.badges).length;
        b.append(h('p', { class: 'muted' }, `모은 배지 ${got} / ${BADGES.length}`), h('div', { class: 'badges' }, BADGES.map((x) => h('div', { class: 'card badge' + (Q.badges[x.id] ? ' got' : '') }, h('span', { class: 'be' }, Q.badges[x.id] ? x.e : '❔'), h('b', null, x.n), h('small', { class: 'muted' }, x.d), Q.badges[x.id] ? h('small', { class: 'ok' }, Q.badges[x.id]) : null))));
      }

      draw();
      return () => { if (stop) stop(); };
    },
  };
})();
