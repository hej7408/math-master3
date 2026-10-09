/* 조작판 — 숫자카드를 넘기며 받아올림·받아내림·자릿값을 눈으로 확인하는 웹 교구 */
(function () {
  const U = MD.util, h = U.h, F = U.frac;
  const PC = { '-3': '#adb5bd', '-2': '#f783ac', '-1': '#74c0fc', 0: '#ffd43b', 1: '#69db7c', 2: '#ffa94d', 3: '#ff8787', 4: '#b197fc', 5: '#4dabf7', 6: '#38d9a9', 7: '#c08457' };
  const PN = { '-3': '0.001', '-2': '0.01', '-1': '0.1', 0: '일', 1: '십', 2: '백', 3: '천', 4: '만', 5: '십만', 6: '백만', 7: '천만' };
  const OPS = [['+', '＋ 덧셈'], ['−', '－ 뺄셈'], ['×', '× 곱셈(한 자리 수)']];
  const rnd = (a, b) => U.int(a, b);

  /* ---------- 계산 계획 (자릿수별 올림·내림) ---------- */
  function plan(op, A, B) {
    const T = A.length, r = Array(T).fill(0), carryOut = Array(T).fill(0), borrow = Array(T).fill(0), sum = Array(T).fill(0), lend = Array(T).fill(0), top = Array(T).fill(0), cin = Array(T).fill(0);
    let c = 0, bad = false;
    if (op === '+') { for (let i = T - 1; i >= 0; i--) { cin[i] = c; const s = A[i] + B[i] + c; sum[i] = s; r[i] = s % 10; carryOut[i] = s >= 10 ? 1 : 0; c = carryOut[i]; } if (c) bad = 'over'; }
    else if (op === '×') { const m = B[T - 1]; for (let i = T - 1; i >= 0; i--) { cin[i] = c; const s = A[i] * m + c; sum[i] = s; r[i] = s % 10; carryOut[i] = Math.floor(s / 10); c = carryOut[i]; } if (c) bad = 'over'; }
    else {
      const va = +A.join(''), vb = +B.join(''); if (va < vb) bad = 'neg';
      for (let i = T - 1; i >= 0; i--) { let t = A[i] - lend[i]; top[i] = t; if (t < B[i]) { borrow[i] = 1; t += 10; if (i > 0) lend[i - 1] = 1; else bad = bad || 'neg'; } sum[i] = t; r[i] = t - B[i]; }
    }
    return { r, carryOut, borrow, sum, lend, top, cin, bad };
  }
  const digitsOf = (str, T) => { const d = String(str).replace('.', '').split('').map(Number); while (d.length < T) d.unshift(0); return d; };
  const exp = (i, T, D) => T - 1 - i - D;

  function genPair(op, intDigits, D, pref) {
    const T = intDigits + D;
    for (let tries = 0; tries < 400; tries++) {
      const mk = (n) => { let s = ''; for (let k = 0; k < n; k++) s += k === 0 ? rnd(1, 9) : rnd(0, 9); return s; };
      let a = mk(T), b = op === '×' ? String(rnd(2, 9)) : mk(Math.max(1, T - rnd(0, 1)));
      if (op === '−' && +a < +b) [a, b] = [b, a];
      if (op === '−' && +a === +b) continue;
      const A = digitsOf(a, T + 1), B = digitsOf(b, T + 1), P = plan(op, A, B);
      if (P.bad) continue;
      const any = op === '−' ? P.borrow.some(Boolean) : P.carryOut.some(Boolean);
      if (pref === 'yes' && !any) continue; if (pref === 'no' && any) continue;
      const withDot = (s) => (D ? s.slice(0, s.length - D) + '.' + s.slice(-D) : s);
      return [withDot(a), withDot(op === '×' ? b : b)];
    }
    return ['27', '89'];
  }

  /* ---------- 수 모형(비례 모델) ---------- */
  function token(e, cls) {
    const t = h('i', { class: 'tk ' + (cls || ''), style: { '--pc': PC[e] || '#aaa' } });
    t.dataset.e = e; if (e >= 3) t.textContent = PN[e]; return t;
  }

  MD.pages.place = {
    title: '조작판',
    render(root, params) {
      const st = { op: params.op === '−' || params.op === '-' || params.op === '×' ? (params.op === '-' ? '−' : params.op) : '+', digits: 2, D: 0, pref: 'any', mode: 'guide' };
      if (params.a && params.b) { const d = Math.max(params.a.replace('.', '').length, params.b.replace('.', '').length); st.digits = Math.min(6, Math.max(2, d)); st.D = (params.a.split('.')[1] || params.b.split('.')[1] || '').length; }
      let S = null, timers = [];
      const later = (fn, ms) => { timers.push(setTimeout(fn, ms)); };
      const wrap = h('div', { class: 'pl' }), tools = h('div', { class: 'card pl-tools' }), stage = h('div', { class: 'pl-stage' });
      wrap.append(tools, stage); root.append(wrap);

      function init(a, b) {
        timers.splice(0).forEach(clearTimeout);
        const D = a.includes('.') || b.includes('.') ? Math.max((a.split('.')[1] || '').length, (b.split('.')[1] || '').length) : 0;
        const intLen = Math.max(a.split('.')[0].length, b.split('.')[0].length);
        const T = intLen + D + 1; // 맨 앞에 올림용 칸 1개
        S = { op: st.op, T, D, A: digitsOf(a.replace('.', '').padEnd(a.split('.')[0].length + D, '0'), T), B: digitsOf(b.replace('.', '').padEnd(b.split('.')[0].length + D, '0'), T), R: Array(T).fill(null), carry: Array(T).fill(0), ten: Array(T).fill(0), minus: Array(T).fill(0), cur: T - 1, ok: new Set(), done: false, msg: null, hinted: 0, wrong: 0, auto: false };
        if (S.op === '×') { S.B = Array(T).fill(0); S.B[T - 1] = +b || 2; }
        if (st.mode === 'guide') skip();
        draw();
      }
      const newProblem = () => { const [a, b] = genPair(st.op, st.digits, st.D, st.pref); init(a, b); };

      /* 아무 할 일 없는 앞쪽 0 칸 자동 처리 */
      function skip() {
        const P = plan(S.op, S.A, S.B);
        while (S.cur >= 0) {
          const i = S.cur, nothing = S.A[i] === 0 && S.B[i] === 0 && P.cin[i] === 0 && P.lend[i] === 0;
          if (!nothing) break; S.R[i] = 0; S.ok.add(i); S.cur--;
        }
        if (S.cur < 0) finish();
      }
      function finish() { S.done = true; try { const e = S.op === '×' ? ['4수01-04'] : S.D ? ['4수01-16'] : S.T > 3 ? ['4수01-03'] : ['2수01-06']; U.store.record(e, S.T > 3 ? 3 : 2, true); } catch (x) {} }

      /* ---------- 도구 모음 ---------- */
      function drawTools() {
        tools.replaceChildren(
          h('div', { class: 'row' }, h('b', { class: 'tl' }, '계산'), OPS.map(([o, t]) => h('button', { class: 'btn sm ' + (st.op === o ? '' : 'w'), onclick: () => { st.op = o; if (o === '×') st.D = 0; drawTools(); newProblem(); } }, t))),
          h('div', { class: 'row' }, h('label', null, '자릿수 ', h('select', { onchange: (e) => { st.digits = +e.target.value; newProblem(); } }, [2, 3, 4, 5, 6].map((n) => h('option', { value: n, selected: n === st.digits || null }, n + '자리')))),
            h('label', null, '소수 ', h('select', { disabled: st.op === '×' || null, onchange: (e) => { st.D = +e.target.value; newProblem(); } }, [0, 1, 2, 3].map((n) => h('option', { value: n, selected: n === st.D || null }, n ? '소수 ' + n + '자리' : '자연수')))),
            h('label', null, '올림·내림 ', h('select', { onchange: (e) => { st.pref = e.target.value; newProblem(); } }, [['any', '섞어서'], ['yes', '있는 문제'], ['no', '없는 문제']].map(([v, t]) => h('option', { value: v, selected: v === st.pref || null }, t))))),
          h('div', { class: 'row' }, h('label', { class: 'chip' }, h('input', { type: 'checkbox', checked: st.mode === 'free' || null, onchange: (e) => { st.mode = e.target.checked ? 'free' : 'guide'; newProblem(); } }), ' 자유 조작'), h('button', { class: 'btn', onclick: newProblem }, '🔄 새 문제'))
        );
      }

      /* ---------- 칸 만들기 ---------- */
      function dcard(i, row, val, o) {
        const e = exp(i, S.T, S.D), ghost = (row !== 'R' && val === 0 && i < S.T - S.D - (S.T - S.D > 1 ? 1 : 0) && leadingZero(i, row)) || false;
        const el = h('div', { class: 'dc' + (ghost ? ' ghost' : '') + (val == null ? ' blank' : '') + (o.locked ? ' locked' : '') + (o.good ? ' good' : '') + (o.bad ? ' bad' : ''), style: { '--pc': PC[e] || '#ddd' } });
        const face = h('button', { class: 'face', 'aria-label': `${PN[e] || ''} 자리 ${val == null ? '비어 있음' : val}`, disabled: o.locked || null }, val == null ? '?' : String(val));
        const up = h('button', { class: 'ar up', 'aria-label': '다음 숫자', disabled: o.locked || null }, '▲'), dn = h('button', { class: 'ar dn', 'aria-label': '이전 숫자', disabled: o.locked || null }, '▼');
        const set = (d) => { if (o.locked) return; face.classList.remove('flip'); void face.offsetWidth; o.set(d); };
        face.addEventListener('click', () => set(1)); up.addEventListener('click', () => set(1)); dn.addEventListener('click', () => set(-1));
        el.append(up, face, dn); return el;
      }
      function leadingZero(i, row) { const arr = row === 'A' ? S.A : S.B; for (let k = 0; k <= i; k++) { if (arr[k] !== 0) return false; } return true; }
      const bump = (arr, i, d, lim) => { arr[i] = (((arr[i] == null ? (d > 0 ? -1 : 10) : arr[i]) + d) % (lim || 10) + (lim || 10)) % (lim || 10); };

      /* ---------- 그리기 ---------- */
      function draw() {
        const P = plan(S.op, S.A, S.B), T = S.T, D = S.D, free = st.mode === 'free';
        const cols = [];
        for (let i = 0; i < T; i++) { if (D && i === T - D) cols.push('.'); cols.push(i); }
        const gridCols = `38px ${cols.map((c) => (c === '.' ? '16px' : 'var(--cw)')).join(' ')}`;
        const board = h('div', { class: 'pboard', style: { '--g': gridCols } });
        const rowEl = (cls) => h('div', { class: 'prow ' + cls });
        const cell = (cls, node) => h('div', { class: 'pc ' + cls }, node);
        /* 자리 이름 */
        const hr = rowEl('hdr'); hr.append(cell('opc', ''));
        cols.forEach((c) => hr.append(c === '.' ? cell('dotc', '') : cell('name', h('span', { style: { '--pc': PC[exp(c, T, D)] } }, PN[exp(c, T, D)] || ''))));
        board.append(hr);
        /* 스티커 칸 */
        const lockedSlot = (i) => !free && S.cur !== i + 1 && !S.ok.has(i + 1);
        if (S.op === '−') {
          const r1 = rowEl('slots'); r1.append(cell('opc', h('small', null, '−1')));
          const r2 = rowEl('slots'); r2.append(cell('opc', h('small', null, '⑩')));
          cols.forEach((c) => {
            if (c === '.') { r1.append(cell('dotc', '')); r2.append(cell('dotc', '')); return; }
            const i = c;
            const lk1 = !free && S.cur !== i + 1 && !S.ok.has(i + 1), lk2 = !free && S.cur !== i && !S.ok.has(i);
            r1.append(cell('slotc', h('button', { class: 'slot minus' + (S.minus[i] ? ' on' : ''), disabled: lk1 || i === T - 1 || null, 'aria-label': '내림해 주는 자리 −1 스티커', onclick: () => { S.minus[i] = S.minus[i] ? 0 : 1; say(null); draw(); } }, S.minus[i] ? '−1' : '')));
            r2.append(cell('slotc', h('button', { class: 'slot ten' + (S.ten[i] ? ' on' : ''), disabled: lk2 || null, 'aria-label': '받아내림 ⑩ 스티커', onclick: () => { S.ten[i] = S.ten[i] ? 0 : 1; say(null); draw(); } }, S.ten[i] ? '⑩' : '')));
          });
          board.append(r1, r2);
        } else {
          const r1 = rowEl('slots'); r1.append(cell('opc', h('small', null, S.op === '+' ? '받아올림' : '올림')));
          cols.forEach((c) => {
            if (c === '.') { r1.append(cell('dotc', '')); return; }
            const i = c, v = S.carry[i], lk = (!free && S.cur !== i + 1 && !S.ok.has(i + 1)) || i === T - 1;
            r1.append(cell('slotc', h('button', { class: 'slot carry' + (v ? ' on' : ''), disabled: lk || null, 'aria-label': '받아올림 스티커', onclick: () => { S.carry[i] = S.op === '+' ? (v ? 0 : 1) : (v + 1) % 10; say(null); draw(); } }, v ? (S.op === '+' ? '①' : String(v)) : '')));
          });
          board.append(r1);
        }
        /* A, B 행 */
        const rA = rowEl('rowA'), rB = rowEl('rowB'), rR = rowEl('rowR');
        rA.append(cell('opc', '')); rB.append(cell('opc', h('span', { class: 'sign' }, S.op))); rR.append(cell('opc', h('span', { class: 'sign' }, '=')));
        cols.forEach((c) => {
          if (c === '.') { ['A', 'B', 'R'].forEach((k) => (k === 'A' ? rA : k === 'B' ? rB : rR).append(cell('dotc', h('b', null, '.')))); return; }
          const i = c, editNums = free || (S.ok.size === 0 && !S.done);
          rA.append(cell('', dcard(i, 'A', S.A[i], { locked: !editNums, set: (d) => { bump(S.A, i, d); resetWork(); } })));
          const bLock = !editNums || (S.op === '×' && i !== T - 1);
          rB.append(cell('', S.op === '×' && i !== T - 1 ? h('div', { class: 'dc ghost off' }) : dcard(i, 'B', S.B[i], { locked: bLock, set: (d) => { bump(S.B, i, d); if (S.op === '×' && S.B[i] < 2 && d > 0 && false) S.B[i] = 2; resetWork(); } })));
          const rl = !free && (S.cur !== i && !S.ok.has(i));
          rR.append(cell('', dcard(i, 'R', S.R[i], { locked: rl || (S.ok.has(i) && !free) || S.done, good: S.ok.has(i), bad: S.badCol === i, set: (d) => { bump(S.R, i, d); S.badCol = null; say(null); draw(); } })));
        });
        board.append(rA, rB, h('div', { class: 'pline' }), rR);
        /* 문제 표시 */
        const aTxt = trimNum(S.A, S.D), bTxt = S.op === '×' ? String(S.B[S.T - 1]) : trimNum(S.B, S.D);
        const info = h('div', { class: 'pinfo card' },
          h('div', { class: 'expr' }, `${aTxt} ${S.op} ${bTxt} =`, S.done ? h('b', { class: 'ans' }, ' ' + trimNum(S.R, S.D)) : h('b', null, ' ?')),
          S.done ? h('div', { class: 'done' }, h('div', { class: 'stars' }, '🎉'), h('p', null, `답은 ${trimNum(S.R, S.D)} 입니다.`), h('p', { class: 'muted' }, readNum(trimNum(S.R, S.D))), h('p', { class: 'chk' }, '🔁 거꾸로 확인: ', h('b', null, S.op === '+' ? `${trimNum(S.R, S.D)} − ${bTxt} = ${aTxt}` : S.op === '−' ? `${trimNum(S.R, S.D)} + ${bTxt} = ${aTxt}` : `${trimNum(S.R, S.D)} ÷ ${bTxt} = ${aTxt}`)), h('div', { class: 'row' }, h('button', { class: 'btn', onclick: newProblem }, '다음 문제 ▶'), h('a', { class: 'btn w', href: '#/board?grade=' + (S.T > 3 ? 3 : 2) + '&domain=num' }, '🧲 서술형 문제로')))
            : h('div', null, guideText(P), S.msg ? h('div', { class: 'msg ' + S.msg.kind }, S.msg.text) : null, controls(P)));
        const models = h('div', { class: 'card pmodel' }, h('h3', null, '🧊 수 모형으로 보기'), modelView(P));
        const left = h('div', { class: 'pl-left' }, h('div', { class: 'pframe' }, h('div', { class: 'phinge' }), board, h('div', { class: 'pfoot' }, h('span', null, '🔢 조작판'), h('span', { class: 'muted' }, '카드를 넘기면 숫자가 바뀌어요'))));
        stage.replaceChildren(left, h('div', { class: 'pl-right' }, info, models));
      }
      const trimNum = (arr, D) => { const s = arr.map((x) => (x == null ? 0 : x)).join(''); let i = s.length - D, ip = s.slice(0, i).replace(/^0+(?=\d)/, '') || '0', dp = s.slice(i).replace(/0+$/, ''); return D && dp ? ip + '.' + dp : ip; };
      const readNum = (s) => { const [i, d] = s.split('.'); return '읽기: ' + U.readKorean(i) + (d ? ' 점 ' + d.split('').map((x) => (x === '0' ? '영' : ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'][+x])).join('') : ''); };
      function resetWork() { S.R = Array(S.T).fill(null); S.carry = Array(S.T).fill(0); S.ten = Array(S.T).fill(0); S.minus = Array(S.T).fill(0); S.cur = S.T - 1; S.ok = new Set(); S.done = false; S.badCol = null; say(null); if (st.mode === 'guide') skip(); draw(); }
      const say = (t, k) => { S.msg = t ? { text: t, kind: k || '' } : null; };

      /* ---------- 안내 문구 ---------- */
      function guideText(P) {
        if (P.bad === 'neg') return h('p', { class: 'pguide' }, '⚠️ 빼어지는 수가 빼는 수보다 크거나 같게 카드를 맞추어 주세요.');
        if (P.bad === 'over') return h('p', { class: 'pguide' }, '⚠️ 결과가 칸을 넘어가요. 자릿수를 늘려 새 문제를 만들어 주세요.');
        if (st.mode === 'free') return h('p', { class: 'pguide' }, '카드를 마음대로 넘겨 보세요. 위쪽 카드로 두 수를 만들고, 스티커와 아래 카드로 답을 써 보세요. 다 했으면 [✔ 전체 확인]!');
        const i = S.cur, e = exp(i, S.T, S.D), nm = e >= 0 ? PN[e] + '의 자리' : '소수 ' + (-e) + '째 자리';
        const base = S.op === '+' ? '두 수와 받아올림을 더해요.' : S.op === '−' ? '위 수에서 아래 수를 빼요. 모자라면 받아내림!' : '위 수에 곱하는 수를 곱하고 올림을 더해요.';
        return h('p', { class: 'pguide' }, h('b', null, nm), '를 계산해요. ', base, S.op !== '−' ? ' 결과가 10 이상이면 다음 자리에 올림 스티커를 붙여요.' : ' 받아내림이 필요하면 윗자리에 −1, 이 자리에 ⑩ 스티커를 붙여요.');
      }
      function controls(P) {
        const free = st.mode === 'free', r = h('div', { class: 'row' });
        r.append(h('button', { class: 'btn', disabled: P.bad || null, onclick: free ? checkAll : checkCol }, free ? '✔ 전체 확인' : '✔ 이 자리 확인'));
        r.append(h('button', { class: 'btn w', onclick: hint }, '💡 힌트'), h('button', { class: 'btn y', disabled: P.bad || null, onclick: autoPlay }, MD.state.teacher ? '▶ 시범(자동 계산)' : '👀 보여 줘'));
        return r;
      }

      /* ---------- 검사 ---------- */
      function colState(P, i) {
        const rOk = S.R[i] === P.r[i];
        let stOk;
        if (S.op === '−') stOk = (S.ten[i] === P.borrow[i]) && (i === 0 ? P.borrow[i] === 0 : S.minus[i - 1] === P.borrow[i]);
        else stOk = i === 0 ? P.carryOut[i] === 0 : S.carry[i - 1] === P.carryOut[i];
        return { rOk, stOk };
      }
      function explain(P, i) {
        const e = exp(i, S.T, S.D), nm = e >= 0 ? PN[e] + '의 자리' : '소수 ' + (-e) + '째 자리';
        if (S.op === '+') { const t = `${S.A[i]} + ${S.B[i]}${P.cin[i] ? ' + ' + P.cin[i] + '(받아올림)' : ''} = ${P.sum[i]}`; return P.carryOut[i] ? `${nm}: ${t}. 10개를 묶어 한 자리 위로 받아올림 ①을 붙이고, ${nm}에는 ${P.r[i]}!` : `${nm}: ${t}. 받아올림 없이 ${P.r[i]}!`; }
        if (S.op === '×') return `${nm}: ${S.A[i]} × ${S.B[S.T - 1]}${P.cin[i] ? ' + ' + P.cin[i] + '(올림)' : ''} = ${P.sum[i]} → ${P.carryOut[i] ? P.carryOut[i] + ' 올림, ' : ''}${P.r[i]}을(를) 써요.`;
        const lent = P.lend[i] ? `(윗자리에서 1 받아내려 줘서 ${S.A[i]}−1 = ${S.A[i] - 1})` : '';
        return P.borrow[i] ? `${nm}: ${P.top[i]}에서 ${S.B[i]}를 뺄 수 없어요${lent}. 윗자리에서 10을 받아내려 ${P.top[i] + 10} − ${S.B[i]} = ${P.r[i]}!` : `${nm}: ${P.top[i]} − ${S.B[i]} = ${P.r[i]}${lent ? ' ' + lent : ''}`;
      }
      function checkCol() {
        const P = plan(S.op, S.A, S.B), i = S.cur; if (P.bad) return;
        const { rOk, stOk } = colState(P, i);
        if (rOk && stOk) { S.ok.add(i); S.cur--; S.badCol = null; say(explain(P, i), 'ok'); skip(); if (S.done) say(null); draw(); return; }
        S.wrong++; S.badCol = rOk ? null : i;
        if (S.R[i] == null) say('아래 카드를 넘겨서 이 자리의 답을 만들어요.', 'bad');
        else if (!rOk) say(`이 자리의 계산을 다시 해 봐요. (${S.op === '×' ? '곱한 값에 올림을 더한 뒤' : S.op === '−' ? '받아내림까지 생각해서' : '두 수와 받아올림을 모두 더한 뒤'} 일의 자리 숫자만 써요)`, 'bad');
        else say(S.op === '−' ? '카드는 맞아요! 받아내림 스티커(윗자리 −1, 이 자리 ⑩)를 확인해요.' : '카드는 맞아요! 올림 스티커를 확인해요. 10 이상이면 위 칸에 올림을 붙여요.', 'bad');
        draw();
      }
      function checkAll() {
        const P = plan(S.op, S.A, S.B); if (P.bad) return;
        const bad = []; for (let i = 0; i < S.T; i++) { const s = colState(P, i); if (!s.rOk && !(S.R[i] == null && P.r[i] === 0 && i < S.T - S.D - 1 && S.A[i] === 0 && S.B[i] === 0)) bad.push(i); }
        S.badCol = bad.length ? bad[bad.length - 1] : null;
        if (!bad.length) { for (let i = 0; i < S.T; i++) if (S.R[i] == null) S.R[i] = 0; S.done = true; finish(); say(null); } else { S.wrong++; say(`아직 달라요. 빨갛게 표시된 자리를 다시 계산해 봐요. (${bad.length}군데)`, 'bad'); }
        draw();
      }
      function hint() {
        const P = plan(S.op, S.A, S.B); S.hinted++;
        if (P.bad) return; const i = st.mode === 'free' ? S.R.findIndex((v, k) => v !== P.r[k]) : S.cur; if (i < 0) return;
        say('💡 ' + explain(P, i).split('. ')[0] + '. 계산해 볼까요?', ''); draw();
      }
      function autoPlay() {
        const P = plan(S.op, S.A, S.B); if (P.bad) return; resetWork(); st.mode === 'guide' && skip();
        let k = 0;
        for (let i = S.T - 1; i >= 0; i--) {
          if (S.ok.has(i)) continue;
          later(() => {
            S.cur = i;
            if (S.op === '−') { S.ten[i] = P.borrow[i]; if (i > 0) S.minus[i - 1] = P.borrow[i]; } else if (i > 0) S.carry[i - 1] = P.carryOut[i];
            S.R[i] = P.r[i]; S.ok.add(i); S.cur = i - 1; say(explain(P, i), 'ok'); if (i === 0 || S.cur < 0) { S.done = true; finish(); say(null); } draw();
          }, (MD.fast ? 25 : 700) * ++k);
        }
        S.hinted += 3;
      }

      function modelView(P) {
        const box = h('div', { class: 'mview' });
        if (S.done) { box.append(h('p', { class: 'muted' }, '완성! 각 자리에서 10개가 모이면 한 자리 위의 1개로 바꾸었어요.')); return box; }
        const i = st.mode === 'free' ? Math.max(0, S.R.findIndex((v) => v == null)) : S.cur; if (i < 0 || P.bad) return box;
        const e = exp(i, S.T, S.D), nm = e >= 0 ? PN[e] + '의 자리' : '소수 ' + (-e) + '째 자리';
        box.append(h('p', { class: 'muted' }, nm + ' 의 수 모형'));
        const group = (n, cls, label) => h('div', { class: 'tg' }, h('div', { class: 'tks' }, Array.from({ length: n }, (_, k) => { const t = token(e, cls); if (k === 9 && false) t.classList.add('ten-end'); return t; })), h('small', null, label));
        const items = [];
        if (S.op === '+') {
          items.push(group(S.A[i], '', `위 ${S.A[i]}`), h('span', { class: 'sg' }, '+'), group(S.B[i], '', `아래 ${S.B[i]}`));
          if (P.cin[i]) items.push(h('span', { class: 'sg' }, '+'), group(P.cin[i], 'new', `올림 ${P.cin[i]}`));
        } else if (S.op === '×') {
          items.push(group(S.A[i] * S.B[S.T - 1], '', `${S.A[i]}개씩 ${S.B[S.T - 1]}묶음`)); if (P.cin[i]) items.push(h('span', { class: 'sg' }, '+'), group(P.cin[i], 'new', `올림 ${P.cin[i]}`));
        } else {
          const topN = S.A[i] - P.lend[i] + (S.ten[i] ? 10 : 0), shown = P.borrow[i] && !S.ten[i] ? S.A[i] - P.lend[i] : topN;
          items.push(group(P.lend[i] ? S.A[i] - 1 : S.A[i], '', `위 ${P.lend[i] ? S.A[i] + '(−1)' : S.A[i]}`));
          if (P.borrow[i]) items.push(h('span', { class: 'sg' }, '+'), group(10, 'new', '받아내림 10'));
          items.push(h('span', { class: 'sg' }, '−'), group(S.B[i], 'x', `빼기 ${S.B[i]}`));
        }
        box.append(h('div', { class: 'tkrow' }, items));
        const tot = P.sum[i];
        if (S.op !== '−') box.append(h('p', { class: 'mnote' }, tot >= 10 ? `모두 ${tot}개 → 10개는 한 자리 위의 1개로 바꾸고, ${P.r[i]}개가 남아요.` : `모두 ${tot}개예요. 10개가 안 되니 올림이 없어요.`));
        else box.append(h('p', { class: 'mnote' }, P.borrow[i] ? `${P.top[i]}개에서 ${S.B[i]}개를 뺄 수 없으니 윗자리 1개를 10개로 바꿔 와요. ${P.top[i] + 10} − ${S.B[i]} = ${P.r[i]}` : `${P.top[i]}개에서 ${S.B[i]}개를 빼면 ${P.r[i]}개!`));
        return box;
      }

      drawTools();
      if (params.a && params.b) init(params.a, params.b); else newProblem();
      return () => timers.forEach(clearTimeout);
    },
  };
})();

