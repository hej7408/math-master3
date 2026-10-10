/* 연산판 — 서술형 문제를 6단계(MASTER KEY)로 푸는 웹 교구 */
(function () {
  const U = MD.util, h = U.h, F = U.frac, P = MD.problems, S = MD.std, C = MD.comp;
  const T = () => (MD.fast ? 15 : 450);
const STEPS = ['그림 붙이기', '분류하기', '식 세우기', '세로식 쓰기', '답 구하기', 'GOOD!'];
  const MAG = ['#e63946', '#f4a261', '#2a9d8f', '#1c7ed6', '#7048e8', '#d6336c', '#f2b705', '#2f9e44'];
  const GUIDE = [
    '서술형 문제에 있는 <b>그림</b>을 찾아 붙여 봐요!',
    '문제를 읽고 <b>어떤 계산</b>인지 생각해요. (양옆에 표를 봐요)',
    '<b>숫자 자석</b>과 <b>기호</b>를 붙여서 식을 세워 봐요!',
    '만들어진 식을 쉬운 <b>세로식</b>으로 바꿔 써 봐요!',
    '세로식을 계산해서 <b>답</b>을 구해요!',
    '<b>GOOD!</b> 참 잘했습니다. 어때요? 서술형 문제 참 쉽죠?',
  ];

  MD.pages.board = {
    title: '연산판',
    render(root, params) {
      let grade = +params.grade || MD.state.grade || 2, domain = params.domain || MD.state.domain || 'all', std = params.std || 'all';
      if (params.grade) MD.state.grade = grade;
      let B = null;
      MD.dbg = { get B() { return B; } }; // 자동 점검용
      const timers = [];
      const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); };
      const wrap = h('div', { class: 'bd' });
      const toolbar = h('div', { class: 'card bd-tools' });
      const main = h('div', { class: 'bd-main' });
      wrap.append(toolbar, main); root.append(wrap);

      /* ---------- 문제 생성 ---------- */
      function newProblem(keepTpl) {
        timers.splice(0).forEach(clearTimeout);
        const opts = { grade, domain: domain === 'all' ? undefined : domain, std: std === 'all' ? undefined : std };
        if (keepTpl && B) opts.tpl = B.p.tpl; else if (B) opts.avoid = B.p.tpl;
        const p = P.make(opts);
        B = { p, step: 1, view: 1, placed: [], kindOk: false, kindPick: null, tokens: [], preDone: !(p.pre && p.pre.length), eqDone: !p.eq, calcDone: false, finalDone: false, wrong: 0, hints: 0, demoUsed: false, tray: U.shuffle(p.cards.concat(p.decoys)), msg: null, notes: [], form: null, formMode: null, fills: {}, glow: null, hintKw: false, done: false };
        if (!p.eq) B.msgEq = true;
        draw();
      }

      /* ---------- 도구 모음 ---------- */
      function drawToolbar() {
        const stdOpts = P.stdsFor(grade, domain).filter((c) => S.byCode[c]);
        if (std !== 'all' && !stdOpts.includes(std)) std = 'all';
        const sel = h('select', { 'aria-label': '성취기준 선택', onchange: (e) => { std = e.target.value; newProblem(); } }, h('option', { value: 'all' }, '성취기준: 모두 (섞어서)'),
          stdOpts.map((c) => h('option', { value: c, selected: c === std || null }, `[${c}] ${S.byCode[c].text.slice(0, 30)}…`)));
        const dsel = h('select', { 'aria-label': '영역 선택', onchange: (e) => { domain = e.target.value; MD.state.domain = domain; MD.saveState(); std = 'all'; drawToolbar(); newProblem(); } },
          [['all', '🌈 전 영역']].concat(Object.values(S.DOMAINS).map((d) => [d.id, d.icon + ' ' + d.name])).map(([v, t]) => h('option', { value: v, selected: v === domain || null }, t)));
        toolbar.replaceChildren(
          h('div', { class: 'row' }, h('b', { class: 'tl' }, '학년'), MD.ui.gradeChips(grade, (g) => { grade = g; MD.state.grade = g; MD.saveState(); std = 'all'; drawToolbar(); newProblem(); })),
          h('div', { class: 'row grow' }, dsel, sel),
          h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => newProblem() }, '🔄 새 문제'), h('button', { class: 'btn w', onclick: () => newProblem(true) }, '같은 유형으로'))
        );
      }

      /* ---------- 그리기 ---------- */
      function draw() {
        const p = B.p;
        const left = h('div', { class: 'bd-left' }, problemCard(), strip(), panel());
        main.replaceChildren(left, h('div', { class: 'bd-right' }, boardFrame()));
      }
      const say = (text, kind) => { B.msg = text ? { text, kind: kind || '' } : null; };

      function problemCard() {
        const p = B.p, d = S.DOMAINS[p.domain];
        const kw = B.kindOk || B.hintKw ? C.findKw(p.text, p.kind) : [];
        const wrap = h('div', { class: 'card problem', style: { '--c': S.GRADE_COLOR[p.grade] } },
          h('div', { class: 'prow' }, h('span', { class: 'pbadge' }, `${p.grade}학년`), h('span', { class: 'pdom' }, d.icon + ' ' + d.name), h('span', { class: 'grow' }), p.std.map((c) => h('span', { class: 'pill', title: S.byCode[c] ? S.byCode[c].text : '' }, c))),
          h('p', { class: 'ptext' }, C.hlText(p.text, kw)));
        if (p.figure) wrap.append(h('div', { class: 'pfig', html: MD.fig.render(p.figure) }));
        return wrap;
      }
      function strip() {
        return h('div', { class: 'stepstrip', role: 'list' }, STEPS.map((t, i) => {
          const n = i + 1, cls = n < B.step || (n === 6 && B.done) ? 'done' : n === B.step ? 'cur' : 'lock';
          return h('button', { class: 'sc ' + cls + (B.view === n ? ' view' : ''), role: 'listitem', disabled: n > B.step || null, 'aria-current': n === B.step ? 'step' : null, onclick: () => { B.view = n; draw(); } }, h('i', null, n < B.step ? '✓' : String(n)), h('span', null, t));
        }));
      }

      /* ---------- 칠판(연산판) ---------- */
      function boardFrame() {
        const p = B.p;
        const maxBar = Math.max(...p.cards.map((c) => parseFloat(c.value)).filter((x) => !isNaN(x)), 1);
        const surf = h('div', { class: 'surface' });
        const cards = h('div', { class: 'bz cards' + (B.placed.length > 2 ? ' many' : '') });
        B.placed.forEach((id) => { const c = p.cards.find((x) => x.id === id); cards.append(h('div', { class: 'pc pop' }, C.gcard(c, p.grade, { cls: 'placed' }), C.visEl(c, { max: maxBar }))); });
        if (!B.placed.length) cards.append(h('div', { class: 'hintz' }, '① 그림카드를 이곳에 붙여요'));
        surf.append(cards);
        const lower = h('div', { class: 'bz lower' });
        const left = h('div', { class: 'bz leftcol' });
        if (B.kindOk) { const K = S.KINDS[p.kind]; left.append(h('div', { class: 'kbadge', style: { '--kc': K.color } }, h('span', { class: 'ksym' }, K.sym), h('span', null, K.label))); }
        const toks = B.eqDone ? (p.eq ? p.eq.tokens : []) : B.tokens;
        if (toks.length || B.eqDone) left.append(h('div', { class: 'eqline' }, toks.map((t, i) => (/^[+−×÷()]$/.test(t) ? h('span', { class: 'mag op sm', style: { '--mc': MAG[(i + 2) % 8] } }, t) : h('span', { class: 'mag num sm', style: { '--mc': MAG[i % 8] } }, C.tok(t)))), p.eq && B.eqDone ? h('span', { class: 'mag eq sm' }, '=') : null));
        if (B.notes.length) left.append(h('ul', { class: 'notes' }, B.notes.map((n) => h('li', null, n))));
        lower.append(left);
        const right = h('div', { class: 'bz rightcol' });
        const form = ensureForm();
        if (form) right.append(form.el);
        else if (B.step >= 5 && B.finalDone) right.append(h('div', { class: 'bigans' }, p.ansText));
        lower.append(right);
        surf.append(lower);
        return h('div', { class: 'frame' }, h('div', { class: 'hinge' }), surf, h('div', { class: 'frame-foot' }, h('span', null, '🧲 연산판'), h('span', { class: 'muted' }, '서술형 문제를 눈으로 풀어요')));
      }
      function formKind() { return B.p.calc && (B.p.calc.type === 'col' || B.p.calc.type === 'units') ? B.p.calc.type : null; }
      function ensureForm() {
        const k = formKind(); if (!k) return null;
        const mode = B.step >= 6 ? 'view' : B.step === 5 ? 5 : B.step === 4 ? 4 : B.step > 4 ? 'view' : null;
        if (mode == null) return null;
        if (B.formMode !== mode) { B.form = k === 'col' ? C.colForm(B.p, mode) : C.unitsForm(B.p, mode); B.formMode = mode; }
        return B.form;
      }

      /* ---------- 단계 패널 ---------- */
      function panel() {
        const p = B.p, v = B.view, box = h('div', { class: 'card steppanel' });
        box.append(h('div', { class: 'guide' }, h('span', { class: 'gnum' }, String(v)), h('span', { html: GUIDE[v - 1] })));
        if (v < B.step) { box.append(h('p', { class: 'muted' }, '✓ 이미 끝낸 단계예요. 위 칠판에서 결과를 확인해요.'), h('button', { class: 'btn y', onclick: () => { B.view = B.step; draw(); } }, '지금 단계로 ▶')); return box; }
        if (v === 1) step1(box); else if (v === 2) step2(box); else if (v === 3) step3(box); else if (v === 4) step4(box); else if (v === 5) step5(box); else step6(box);
        if (B.msg) box.append(h('div', { class: 'msg ' + B.msg.kind, role: 'status' }, B.msg.text));
        if (v < 6) box.append(tools(box));
        return box;
      }
      function tools() {
        const t = h('div', { class: 'ptools' });
        t.append(h('button', { class: 'btn w sm', onclick: hint }, '💡 힌트'));
        if (MD.state.teacher || B.wrong >= 3) t.append(h('button', { class: 'btn y sm', onclick: () => { B.demoUsed = true; demo(); } }, MD.state.teacher ? '▶ 시범 보이기' : '👀 정답 보기'));
        return t;
      }
      const nextBtn = (label, cond) => h('button', { class: 'btn g next', onclick: () => { B.step = Math.min(6, B.step + 1); B.view = B.step; say(null); if (B.step === 6) finish(); draw(); } }, label || '다음 단계 ▶');

      /* 1단계: 그림카드 */
      function step1(box) {
        const p = B.p, need = p.cards.length, got = B.placed.length;
        box.append(h('p', { class: 'sub' }, `문제에 나온 그림카드를 모두 찾아 붙여요. (${got}/${need})`));
        const tray = h('div', { class: 'tray' });
        B.tray.forEach((c) => {
          const placed = B.placed.includes(c.id);
          tray.append(C.gcard(c, p.grade, { cls: (placed ? 'used ' : '') + (B.glow === c.id ? 'glow' : ''), onclick: () => pickCard(c) }));
        });
        box.append(tray);
        if (got === need) box.append(h('div', { class: 'msg ok' }, '👏 좋아요! 문제에 나온 그림을 모두 붙였어요.'), nextBtn());
      }
      function pickCard(c) {
        if (B.step !== 1 || B.placed.includes(c.id)) return;
        const p = B.p;
        if (c.id[0] === 'c') { B.placed.push(c.id); B.glow = null; say(null); if (B.placed.length === p.cards.length) { say('👏 좋아요! 문제에 나온 그림을 모두 붙였어요.', 'ok'); } draw(); return; }
        B.wrong++;
        const same = p.cards.find((x) => x.label === c.label);
        say(same ? '그림은 맞지만 수가 달라요! 문제에 나온 수와 비교해 보세요.' : '이 그림은 문제에 나오지 않았어요. 문제를 다시 읽어 봐요.', 'bad'); draw();
      }

      /* 2단계: 분류 */
      function step2(box) {
        const p = B.p;
        box.append(h('p', { class: 'sub' }, '이 문제는 어떤 계산일까요? 알맞은 분류카드를 골라요.'));
        const grid = h('div', { class: 'kgrid' });
        p.choices.forEach((k) => {
          const K = S.KINDS[k], chosen = B.kindPick === k;
          grid.append(h('button', { class: 'kcard' + (chosen ? (B.kindOk ? ' ok' : ' no') : ''), style: { '--kc': K.color }, disabled: B.kindOk || null, onclick: () => pickKind(k) },
            h('span', { class: 'ksym' }, K.sym), h('b', null, K.label), h('small', null, K.desc), h('span', { class: 'kws' }, K.keywords.slice(0, 6).map((w) => h('i', null, w)))));
        });
        box.append(grid);
        if (B.kindOk) box.append(h('div', { class: 'msg ok' }, `✅ 맞아요! ${S.KINDS[p.kind].label} — ${S.KINDS[p.kind].desc}`), nextBtn());
      }
      function pickKind(k) {
        if (B.kindOk) return;
        const p = B.p; B.kindPick = k;
        if (k === p.kind) { B.kindOk = true; say(null); draw(); return; }
        B.wrong++;
        const found = C.findKw(p.text, k);
        say(found.length ? `‘${found[0]}’ 때문에 이 카드를 골랐나요? 문제의 마지막 질문까지 읽고 다시 생각해 봐요.` : '다시 한 번 질문을 읽어 볼까요? 구하려는 것이 무엇인지 찾아봐요.', 'bad'); draw();
      }

      /* 3단계: 식 세우기 */
      function step3(box) {
        const p = B.p;
        if (!p.eq) { box.append(h('div', { class: 'msg ok' }, '이 문제는 식 대신 아래 단계별 계산으로 풀어요. 바로 다음으로 가요!'), nextBtn()); return; }
        if (!B.preDone) {
          box.append(h('p', { class: 'sub' }, '먼저 알아볼 것이 있어요.'));
          if (!B.fills.pre) B.fills.pre = C.fillList(p.pre, { onDone: () => { B.preDone = true; say('좋아요! 이제 자석으로 식을 만들어요.', 'ok'); draw(); }, onWrong: () => { B.wrong++; } });
          box.append(B.fills.pre.el); return;
        }
        box.append(h('p', { class: 'sub' }, '숫자 자석과 기호 자석을 눌러 식을 만들어요.'));
        const tray = h('div', { class: 'magtray' });
        p.eq.tray.forEach((t, i) => tray.append(h('button', { class: 'mag num', style: { '--mc': MAG[i % 8], '--rot': ((i * 37) % 7) - 3 + 'deg' }, disabled: B.eqDone || null, onclick: () => { B.tokens.push(t); draw(); }, 'aria-label': t }, C.tok(t))));
        p.eq.ops.forEach((o, i) => tray.append(h('button', { class: 'mag op', style: { '--mc': MAG[(i + 3) % 8], '--rot': ((i * 53) % 7) - 3 + 'deg' }, disabled: B.eqDone || null, onclick: () => { B.tokens.push(o); draw(); }, 'aria-label': o }, o)));
        box.append(tray);
        const line = h('div', { class: 'eqprev' }, h('span', { class: 'muted' }, '내가 만든 식:'), B.tokens.length ? C.tokens(B.tokens) : h('span', { class: 'muted' }, '(자석을 눌러요)'));
        box.append(line);
        if (!B.eqDone) box.append(h('div', { class: 'row' },
          h('button', { class: 'btn w sm', onclick: () => { B.tokens.pop(); draw(); } }, '⌫ 하나 지우기'), h('button', { class: 'btn w sm', onclick: () => { B.tokens = []; say(null); draw(); } }, '⟲ 모두 지우기'),
          h('button', { class: 'btn', onclick: checkEq }, '✔ 식 확인')));
        else box.append(h('div', { class: 'msg ok' }, '🎉 식이 맞아요! ' + p.eq.show + ' ='), nextBtn());
      }
      function checkEq() {
        const r = P.checkEq(B.p, B.tokens);
        if (r.ok) { B.eqDone = true; say(null); } else { B.wrong++; say(r.msg, 'bad'); }
        draw();
      }

      /* 4단계: 세로식 쓰기 / 계산 준비 */
      function step4(box) {
        const p = B.p, k = formKind();
        if (k) {
          box.append(h('p', { class: 'sub' }, k === 'col' ? '칠판의 칸에 두 수를 ' + (p.calc.a.includes('.') || p.calc.b.includes('.') ? '소수점과 자릿값을 맞추어 ' : '일의 자리부터 자릿값을 맞추어 ') + '써 넣어요.' : '단위끼리 맞추어 두 양을 써 넣어요.'));
          if (B.calcDone) box.append(h('div', { class: 'msg ok' }, '✍️ 세로식을 잘 썼어요!'), nextBtn());
          else box.append(h('button', { class: 'btn', onclick: check4 }, '✔ 확인'));
        } else {
          box.append(h('p', { class: 'sub' }, '계산 과정을 차례로 풀어 봐요.'));
          if (!B.fills.prep) B.fills.prep = C.fillList(p.prep || [], { onStep: (i) => { const s = p.prep[i], a = Array.isArray(s.ans) ? s.ans.join(', ') : String(s.ans), fr = /^(\d+)\/\d+$/.exec(a); B.notes.push(String(s.q).replace(/□(?!.*□)/, fr && /□\s*\/\s*\d+/.test(s.q) ? fr[1] : a)); draw(); }, onDone: () => { B.calcDone = true; say('계산 준비 끝!', 'ok'); draw(); }, onWrong: () => { B.wrong++; } });
          if (!(p.prep || []).length) { B.calcDone = true; }
          if (p.prep && p.prep.length) box.append(B.fills.prep.el);
          if (B.calcDone) box.append(h('div', { class: 'msg ok' }, '👍 준비한 과정을 잘 풀었어요!'), nextBtn());
        }
      }
      function check4() {
        const f = ensureForm(); if (!f) return;
        if (f.ok4()) { B.calcDone = true; say(null); } else { B.wrong++; say('빨간 칸을 확인해요. 자릿값(일의 자리, 소수점)에 맞게 써야 해요.', 'bad'); }
        draw();
      }

      /* 5단계: 답 */
      function step5(box) {
        const p = B.p, k = formKind();
        if (B.finalDone) { box.append(h('div', { class: 'msg ok' }, '🎊 정답이에요!'), nextBtn()); return; }
        if (k) {
          box.append(h('p', { class: 'sub' }, k === 'col' ? '일의 자리부터 계산해서 아래 칸에 답을 써요. 받아올림·받아내림은 위 작은 칸에 메모해도 좋아요.' : '작은 단위부터 계산해요. 60(또는 100, 1000)이 넘으면 받아올림!'));
          box.append(h('button', { class: 'btn', onclick: check5 }, '✔ 답 확인'));
        } else {
          if (!B.fin) B.fin = C.finalInput(p, { onSubmit: check5 }); const fi = B.fin; box.append(h('div', { class: 'finwrap' }, fi), h('button', { class: 'btn', onclick: check5 }, '✔ 답 확인'));
        }
      }
      function check5() {
        const p = B.p, k = formKind(); let r;
        if (k === 'col') { const f = ensureForm(), s = f.readRes().trim(); r = s ? P.checkFinal(p, { v: s }) : { ok: false, msg: '답을 써 넣어요.' }; }
        else if (k === 'units') { const f = ensureForm(); r = P.checkFinal(p, { parts: f.readParts() }); }
        else r = P.checkFinal(p, B.fin.read());
        if (r.ok) { B.finalDone = true; B.step = 6; B.view = 6; say(null); finish(); } else { B.wrong++; say(r.msg, 'bad'); }
        draw();
      }

      /* 6단계: GOOD! */
      function finish() {
        if (B.done) return; B.done = true; B.finalDone = true; B.step = 6;
        const stars = B.demoUsed ? 0 : B.wrong <= 1 && B.hints === 0 ? 3 : B.wrong <= 4 ? 2 : 1; B.stars = stars;
        U.store.record(B.p.std, B.p.grade, stars >= 1);
        if (stars > 1) { const d = U.store.load(); d.stars += stars - 1; U.store.save(d); }
        if (stars > 0 && MD.quest) MD.quest.event('board', 1, stars);
      }
      function checkBack(p) {
        const f = p.final, c = p.calc;
        if (c && c.type === 'col') { const A = c.a, Bb = c.b, R = f.ans; if (c.op === '+') return `${R} − ${Bb} = ${A}`; if (c.op === '−') return `${R} + ${Bb} = ${A}`; if (c.op === '×') return `${R} ÷ ${Bb} = ${A}`; }
        if (f.type === 'qr') return `${f.b} × ${f.q} + ${f.r} = ${f.a}`;
        return null;
      }
      function step6(box) {
        const p = B.p, stars = B.stars == null ? 0 : B.stars;
        box.append(h('div', { class: 'good' }, h('img', { src: 'assets/photos/mascot.jpg', alt: '수학박사 칭찬' }), h('div', null,
          h('div', { class: 'stars', 'aria-label': `별 ${stars}개` }, '⭐'.repeat(stars) + '☆'.repeat(3 - stars)),
          h('p', { class: 'sentence' }, p.sentenceDone), p.explain ? h('p', { class: 'muted' }, '💡 ' + p.explain) : null,
          checkBack(p) ? h('p', { class: 'chk' }, '🔁 거꾸로 확인: ', h('b', null, checkBack(p))) : null,
          B.demoUsed ? h('p', { class: 'muted' }, '(시범/정답 보기를 사용해서 별은 얻지 못했어요. 다음에는 직접 해 봐요!)') : null)));
        const acts = h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => newProblem() }, '다음 문제 ▶'), h('button', { class: 'btn w', onclick: () => newProblem(true) }, '같은 유형 한 번 더'));
        const c = p.calc;
        if (c && c.type === 'col' && (c.op === '+' || c.op === '−')) acts.append(h('a', { class: 'btn y', href: `#/place?a=${encodeURIComponent(c.a)}&b=${encodeURIComponent(c.b)}&op=${encodeURIComponent(c.op)}` }, '🔢 조작판에서 확인'));
        box.append(acts);
      }

      /* ---------- 힌트 / 시범 ---------- */
      function hint() {
        const p = B.p; B.hints++;
        if (B.view === 1) { const miss = p.cards.find((c) => !B.placed.includes(c.id)); if (miss) { B.glow = miss.id; say(`문제를 읽으며 ‘${miss.value}’ 이라는 수를 찾아봐요. 반짝이는 그림카드가 힌트예요!`); } }
        else if (B.view === 2) { B.hintKw = true; say('문제 속 낱말이 표시되었어요. 질문 문장도 다시 읽어 봐요: ' + (p.kindHint || S.KINDS[p.kind].desc)); }
        else if (B.view === 3) { if (!B.preDone) say('위의 질문부터 차근차근 풀어 봐요.'); else say(`식은 ‘${p.eq.tokens[0]}’(으)로 시작해요. 기호는 분류카드에서 고른 계산이에요.`); }
        else say(p.explain || '앞 단계에서 만든 식을 다시 살펴봐요.');
        draw();
      }
      function demo() {
        const p = B.p, v = B.view;
        if (v === 1) { if (B.demoBusy) return; B.demoBusy = true; const miss = p.cards.filter((c) => !B.placed.includes(c.id)); later(() => { B.demoBusy = false; }, T() * (miss.length + 1)); miss.forEach((c, i) => later(() => { if (!B.placed.includes(c.id)) B.placed.push(c.id); say('이 그림카드는 문제에 나온 수예요: ' + c.value + c.unit, 'ok'); if (B.placed.length === p.cards.length) say('시범: 문제에 나온 그림카드를 모두 붙였어요!', 'ok'); draw(); }, T() * (i + 1))); if (!miss.length) say(null); }
        else if (v === 2) { B.kindPick = p.kind; B.kindOk = true; say('시범: ' + S.KINDS[p.kind].desc, 'ok'); draw(); }
        else if (v === 3) {
          if (!p.eq) { draw(); return; }
          if (!B.preDone && B.fills.pre) { B.fills.pre.solveAll(); }
          B.preDone = true; B.tokens = p.eq.tokens.slice(); B.eqDone = true; say('시범: 식은 ' + p.eq.show + ' 이에요.', 'ok'); draw();
        } else if (v === 4) {
          const k = formKind();
          if (k) { const f = ensureForm(); f.fill4(); check4(); } else if (B.fills.prep && p.prep && p.prep.length) { B.fills.prep.solveAll(); }
          else { B.calcDone = true; draw(); }
        } else if (v === 5) {
          const k = formKind();
          if (k) { const f = ensureForm(); f.fill5(); later(check5, MD.fast ? 10 : 250); } else if (B.fin) { B.fin.fill(); later(check5, MD.fast ? 10 : 250); }
        }
      }

      /* 시작 */
      drawToolbar(); newProblem();
      return () => timers.forEach(clearTimeout);
    },
  };
})();

