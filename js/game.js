/* 수학박사 보드게임 — 주사위를 굴려 문제 칸에서 서술형 문제에 도전! */
(function () {
  const U = MD.util, h = U.h, P = MD.problems, S = MD.std, C = MD.comp;
  const N = 24;
  const SPECIAL = { 5: 'bonus', 9: 'jump', 12: 'safe', 15: 'back', 18: 'bonus', 20: 'jump', 22: 'back' };
  const ICON = { q: '❓', bonus: '⭐', jump: '🚀', back: '🐌', safe: '🍀', start: '🏁', goal: '🏆' };
  const PCOL = ['#e63946', '#1c7ed6'];

  MD.pages.game = {
    title: '보드게임',
    render(root, params) {
      let cfg = { grade: +params.grade || MD.state.grade || 2, domain: MD.state.domain || 'all', players: 2, names: ['빨강팀', '파랑팀'] };
      const wrap = h('div', { class: 'gm' });
      root.append(wrap);
      let G = null, locked = false;

      function setup() {
        wrap.replaceChildren(h('h1', null, '🎲 수학박사 보드게임'), h('p', { class: 'muted' }, '주사위를 굴려 도착 칸의 문제를 풀면 별을 얻어요! 먼저 🏆에 도착하거나, 가장 많은 별을 모으면 승리! 서술형 문제를 ‘놀이’로 일반화해 보세요.'),
          h('div', { class: 'card gm-setup' },
            h('div', { class: 'row' }, h('b', null, '학년'), MD.ui.gradeChips(cfg.grade, (g) => { cfg.grade = g; setup(); })),
            h('div', { class: 'row' }, h('b', null, '영역'), MD.ui.domainChips(cfg.domain, (d) => { cfg.domain = d; setup(); }, true)),
            h('div', { class: 'row' }, h('b', null, '인원'), [1, 2].map((n) => h('button', { class: 'btn sm ' + (cfg.players === n ? '' : 'w'), onclick: () => { cfg.players = n; setup(); } }, n + '명')),
              Array.from({ length: cfg.players }, (_, i) => h('input', { type: 'text', value: cfg.names[i], maxlength: 8, style: { width: '110px', borderColor: PCOL[i] }, 'aria-label': (i + 1) + '번 이름', oninput: (e) => (cfg.names[i] = e.target.value || '팀' + (i + 1)) }))),
            h('button', { class: 'btn y', style: { fontSize: '1.2rem' }, onclick: start }, '🎮 게임 시작!')));
      }
      function start() {
        G = { pos: Array(cfg.players).fill(0), stars: Array(cfg.players).fill(0), turn: 0, log: [], over: false, rolled: null, cells: Array.from({ length: N }, (_, i) => (i === 0 ? 'start' : i === N - 1 ? 'goal' : SPECIAL[i] || 'q')), q: null, count: 0 };
        draw();
      }
      const cellPos = (i) => { const row = Math.floor(i / 6), col = row % 2 ? 5 - (i % 6) : i % 6; return [row, col]; };

      function draw() {
        const board = h('div', { class: 'gboard' });
        G.cells.forEach((t, i) => {
          const [r, c] = cellPos(i), here = G.pos.map((p, k) => (p === i ? k : -1)).filter((k) => k >= 0);
          board.append(h('div', { class: 'gcell ' + t, style: { gridRow: r + 1, gridColumn: c + 1 } }, h('small', null, String(i)), h('span', { class: 'gi' }, ICON[t]), h('div', { class: 'toks' }, here.map((k) => h('i', { class: 'tok' + (k === G.turn ? ' on' : ''), style: { background: PCOL[k] }, title: cfg.names[k] })))));
        });
        const sb = h('div', { class: 'score' }, G.pos.map((p, k) => h('div', { class: 'sp card' + (k === G.turn && !G.over ? ' turn' : ''), style: { borderColor: PCOL[k] } }, h('b', { style: { color: PCOL[k] } }, cfg.names[k]), h('div', null, '⭐ ' + G.stars[k]), h('small', { class: 'muted' }, p + ' / ' + (N - 1) + ' 칸'))));
        const ctrl = h('div', { class: 'gctrl' });
        if (G.over) {
          const best = Math.max(...G.stars), win = G.pos.map((p, k) => k).filter((k) => G.pos[k] >= N - 1).concat(G.stars.map((s, k) => (s === best ? k : -1)).filter((k) => k >= 0))[0];
          ctrl.append(h('div', { class: 'good' }, h('img', { src: 'assets/photos/mascot.jpg', alt: '' }), h('div', null, h('h2', null, '🏆 ' + cfg.names[win] + ' 승리!'), h('p', null, G.pos.map((p, k) => `${cfg.names[k]}: ⭐${G.stars[k]}`).join('  ·  ')))), h('div', { class: 'row' }, h('button', { class: 'btn', onclick: start }, '다시 하기'), h('button', { class: 'btn w', onclick: setup }, '설정 바꾸기')));
        } else if (G.q) ctrl.append(questionUI());
        else ctrl.append(h('div', { class: 'row' }, h('div', { class: 'die' }, G.rolled || '🎲'), h('button', { class: 'btn y', style: { fontSize: '1.15rem' }, disabled: locked || null, onclick: roll }, `🎲 ${cfg.names[G.turn]} 차례 — 주사위 굴리기`)), h('p', { class: 'muted' }, '❓ 문제 칸 · ⭐ 보너스 · 🚀 +2칸 · 🐌 −2칸 · 🍀 안전'));
        wrap.replaceChildren(h('div', { class: 'row' }, h('button', { class: 'btn w sm', onclick: setup }, '← 설정'), h('h2', { style: { margin: 0 } }, '수학박사 마스터 로드'), h('span', { class: 'pill' }, `${cfg.grade}학년`)), sb, board, ctrl, G.log.length ? h('ul', { class: 'glog' }, G.log.slice(-4).reverse().map((l) => h('li', null, l))) : null);
      }
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      async function roll() {
        if (locked) return; locked = true;
        for (let i = 0; i < 8; i++) { G.rolled = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][U.int(0, 5)]; draw(); await sleep(70); }
        const d = U.int(1, 6); G.rolled = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][d - 1]; G.log.push(`${cfg.names[G.turn]}: 주사위 ${d}`);
        for (let s = 0; s < d && G.pos[G.turn] < N - 1; s++) { G.pos[G.turn]++; draw(); await sleep(180); }
        locked = false; land();
      }
      function land() {
        const k = G.turn, t = G.cells[G.pos[k]];
        if (t === 'goal') { G.over = true; G.log.push(cfg.names[k] + ' 도착!'); return draw(); }
        if (t === 'bonus') { G.stars[k]++; G.log.push(cfg.names[k] + ': ⭐ 보너스'); return next(); }
        if (t === 'jump') { G.pos[k] = Math.min(N - 1, G.pos[k] + 2); G.log.push(cfg.names[k] + ': 🚀 +2칸'); if (G.pos[k] >= N - 1) { G.over = true; return draw(); } return next(); }
        if (t === 'back') { G.pos[k] = Math.max(0, G.pos[k] - 2); G.log.push(cfg.names[k] + ': 🐌 −2칸'); return next(); }
        if (t === 'safe') return next();
        const p = P.make({ grade: cfg.grade, domain: cfg.domain === 'all' ? undefined : cfg.domain, avoid: G.q && G.q.p && G.q.p.tpl });
        G.q = { p, hint: false, tries: 0, msg: null }; draw();
      }
      function next() { G.turn = (G.turn + 1) % cfg.players; G.count++; if (G.count > 40) G.over = true; G.q = null; draw(); }
      function questionUI() {
        const q = G.q, p = q.p, k = G.turn, K = S.KINDS[p.kind];
        const fin = C.finalInput(p, { onSubmit: submit });
        function submit() {
          const r = (p.final.type === 'num' && fin.read().v === '') ? { ok: false, msg: '답을 써 보세요.' } : P.checkFinal(p, fin.read());
          if (r.ok) { G.stars[k]++; G.pos[k] = Math.min(N - 1, G.pos[k] + 1); G.log.push(`${cfg.names[k]}: 정답! ⭐+1, 1칸 전진`); U.store.record(p.std, p.grade, true); if (G.pos[k] >= N - 1) { G.over = true; G.q = null; return draw(); } next(); }
          else { q.tries++; q.msg = q.tries >= 2 ? '정답은 ' + p.ansText + ' 였어요. 다음에 도전!' : r.msg; if (q.tries >= 2) { G.log.push(`${cfg.names[k]}: 아쉬워요 (정답 ${p.ansText})`); U.store.record(p.std, p.grade, false); q.done = true; } draw(); }
        }
        return h('div', { class: 'card gq', style: { borderColor: PCOL[k] } }, h('div', { class: 'row' }, h('span', { class: 'pbadge', style: { background: PCOL[k], color: '#fff', padding: '2px 12px', borderRadius: '999px', fontFamily: 'var(--font-h)' } }, cfg.names[k] + ' 문제'), h('span', { class: 'pill' }, S.DOMAINS[p.domain].icon + ' ' + S.DOMAINS[p.domain].name)),
          h('p', { class: 'ptext' }, C.hlText(p.text, q.hint ? C.findKw(p.text, p.kind) : [])), p.figure ? h('div', { class: 'pfig', html: MD.fig.render(p.figure) }) : null,
          q.hint ? h('div', { class: 'msg' }, '💡 분류카드: ' + K.label + ' — ' + K.desc) : null,
          q.done ? h('div', null, h('div', { class: 'msg bad' }, q.msg), h('button', { class: 'btn', onclick: next }, '다음 차례 ▶')) : h('div', null, h('div', { class: 'finwrap' }, fin), q.msg ? h('div', { class: 'msg bad' }, q.msg) : null, h('div', { class: 'row' }, h('button', { class: 'btn', onclick: submit }, '✔ 정답 확인'), h('button', { class: 'btn w', onclick: () => { q.hint = true; draw(); } }, '💡 분류 힌트'), h('button', { class: 'btn w', onclick: () => { G.log.push(cfg.names[k] + ': 패스'); next(); } }, '패스'))));
      }
      setup();
    },
  };
})();
