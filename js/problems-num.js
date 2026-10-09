/* 수와 연산 — 문제 템플릿 (1~6학년, 2022 개정 성취기준) */
(function () {
  const U = MD.util, F = U.frac, P = MD.problems, H = P.helpers;
  const { card, mcard, J, pk, ri } = H;
  const R = (d) => P.reg(d);
  const OBJ = P.OBJ, BOX = P.BOX, NAMES = P.NAMES;
  const two = () => U.sample(NAMES, 2);
  const dec = (n, k) => String(parseFloat((n / Math.pow(10, k)).toFixed(k)));
  const val = (tokens) => U.evalTokens(tokens);
  const numStr = (tokens) => F.toDec(val(tokens));
  function colFinal(op, a, b, unit) {
    const A = String(a), B = String(b);
    return { eq: { tokens: [A, op, B] }, calc: { type: 'col', op, a: A, b: B }, final: { type: 'num', ans: numStr([A, op, B]), unit: unit || '' } };
  }
  const verbLeft = (o) => (o.food ? '먹었습니다' : '친구에게 주었습니다');

  /* ---------- 더하기 · 첨가 (1~3학년) ---------- */
  function addRange(g) {
    if (g === 1) return [ri(3, 9), ri(3, 9)];
    if (g === 2) { const a = ri(14, 78), b = ri(6, 19); return [a, Math.min(b, 99 - a)]; }
    const a = ri(128, 689), b = ri(135, 309); return [a, Math.min(b, 999 - a)];
  }
  function subRange(g) {
    if (g === 1) { if (ri(0, 1)) { const a = ri(11, 18), b = ri(a - 9 < 2 ? 2 : a - 9, 9); return [a, Math.min(b, a - 1)]; } const a = ri(5, 9); return [a, ri(1, a - 1)]; }
    if (g === 2) { const a = ri(31, 99), b = ri(6, Math.min(59, a - 4)); return [a, b]; }
    const a = ri(321, 999), b = ri(126, a - 110); return [a, b];
  }
  const STD_AS = (g) => (g === 1 ? ['2수01-05'] : g === 2 ? ['2수01-05', '2수01-06'] : ['4수01-03']);

  R({ id: 'add-add', grades: [1, 2, 3], domain: 'num', std: ['2수01-05', '2수01-06', '4수01-03'], gen(g) {
    const o = pk(OBJ), [n1, n2] = two(), [a, b] = addRange(g);
    const tail = g === 3 ? '' : '';
    return Object.assign({
      std: STD_AS(g), kind: 'add_add',
      text: `${J(n1, '은/는')} ${J(o.n, '을/를')} ${qty(o, a)} 가지고 있습니다. ${J(n2, '이/가')} ${J(qty(o, b), '을/를')} 더 주었습니다. ${J(n1, '이/가')} 가지고 있는 ${J(o.n, '은/는')} 모두 몇 ${o.c}일까요?${tail}`,
      cards: [card(o, a), card(o, b)],
      sentence: `${n1}${'이가'[U.batchim(n1) ? 0 : 1]} 가지고 있는 ${o.n}${'은는'[U.batchim(o.n) ? 0 : 1]} 모두 {a}입니다.`,
      explain: '처음 가진 수에 더 받은 수를 더해요.',
    }, colFinal('+', a, b, o.c));
  } });
  function qty(o, n) { return `${n}${o.c}`; }

  /* ---------- 더하기 · 합병 ---------- */
  const PAIR = [
    { place: '동물원에', A: '청둥오리', B: '흰뺨오리', tot: '오리', e: '🦆', e2: '🦆', c: '마리' },
    { place: '공원에', A: '참새', B: '비둘기', tot: '새', e: '🐦', e2: '🕊️', c: '마리' },
    { place: '연못에', A: '금붕어', B: '잉어', tot: '물고기', e: '🐠', e2: '🐟', c: '마리' },
    { place: '주머니에', A: '빨간 구슬', B: '파란 구슬', tot: '구슬', e: '🔴', e2: '🔵', c: '개' },
    { place: '바구니에', A: '사과', B: '배', tot: '과일', e: '🍎', e2: '🍐', c: '개' },
    { place: '우리 반에', A: '남학생', B: '여학생', tot: '학생', e: '👦', e2: '👧', c: '명' },
    { place: '책꽂이에', A: '동화책', B: '과학책', tot: '책', e: '📘', e2: '📗', c: '권' },
    { place: '꽃밭에', A: '장미', B: '튤립', tot: '꽃', e: '🌹', e2: '🌷', c: '송이' },
    { place: '제주도로 가는 비행기에', A: '어른', B: '어린이', tot: '탄 사람', e: '🧑', e2: '🧒', c: '명', v: '탔습니다', ask: '이 비행기에 모두 몇 명이 탔을까요?' },
  ];
  R({ id: 'add-merge', grades: [1, 2, 3], domain: 'num', std: ['2수01-05', '2수01-06', '4수01-03'], gen(g) {
    const p = pk(PAIR), [a, b] = addRange(g);
    return Object.assign({
      std: STD_AS(g), kind: 'add_merge',
      text: `${p.place} ${J(p.A, '이/가')} ${a}${p.c}, ${J(p.B, '이/가')} ${b}${p.c} ${p.v || '있습니다'}. ${p.ask || `${J(p.tot, '은/는')} 모두 몇 ${p.c}일까요?`}`,
      cards: [{ e: p.e, label: p.A, value: String(a), unit: p.c, vis: a <= 30 ? 'icons' : 'blocks' }, { e: p.e2, label: p.B, value: String(b), unit: p.c, vis: b <= 30 ? 'icons' : 'blocks' }],
      sentence: `${p.tot}${'은는'[U.batchim(p.tot) ? 0 : 1]} 모두 {a}입니다.`,
      explain: '따로 있는 두 부분을 합하면 전체가 돼요.',
    }, colFinal('+', a, b, p.c));
  } });

  /* ---------- 빼기 · 구잔 / 구차 ---------- */
  R({ id: 'sub-left', grades: [1, 2, 3], domain: 'num', std: ['2수01-05', '2수01-06', '4수01-03'], gen(g) {
    const o = pk(OBJ), [n1] = two(), [a, b] = subRange(g);
    return Object.assign({
      std: STD_AS(g), kind: 'sub_left',
      text: `${J(n1, '은/는')} ${J(o.n, '을/를')} ${qty(o, a)} 가지고 있었습니다. 그 중 ${J(qty(o, b), '을/를')} ${verbLeft(o)}. 남은 ${J(o.n, '은/는')} 몇 ${o.c}일까요?`,
      cards: [card(o, a), card(o, b)],
      sentence: `남은 ${o.n}${'은는'[U.batchim(o.n) ? 0 : 1]} {a}입니다.`,
      explain: '전체에서 덜어낸 만큼을 빼면 남은 수가 나와요.',
    }, colFinal('−', a, b, o.c));
  } });
  R({ id: 'sub-diff', grades: [1, 2, 3], domain: 'num', std: ['2수01-05', '2수01-06', '4수01-03'], gen(g) {
    const o = pk(OBJ), [n1, n2] = two(); let [a, b] = subRange(g); if (b > a - 1) b = a - 1;
    return Object.assign({
      std: STD_AS(g), kind: 'sub_diff',
      text: `${J(n1, '은/는')} ${J(o.n, '을/를')} ${qty(o, a)}, ${J(n2, '은/는')} ${qty(o, b)} 가지고 있습니다. ${J(n1, '은/는')} ${n2}보다 ${J(o.n, '이/가')} 몇 ${o.c} 더 많을까요?`,
      cards: [card(o, a, { label: o.n + '(' + n1 + ')' }), card(o, b, { label: o.n + '(' + n2 + ')' })],
      sentence: `${n1}${'은는'[U.batchim(n1) ? 0 : 1]} ${n2}보다 {a} 더 많습니다.`,
      explain: '두 양을 비교할 때는 큰 수에서 작은 수를 빼서 차를 구해요.',
    }, colFinal('−', a, b, o.c));
  } });

  /* ---------- □ 구하기 / 분해·합성 ---------- */
  R({ id: 'unknown', grades: [1, 2], domain: 'num', std: ['2수01-04', '2수01-09'], gen(g) {
    const o = pk(OBJ), [n1] = two();
    if (g === 1) {
      const t = ri(6, 12), a = ri(2, t - 2);
      return { std: ['2수01-04'], kind: 'unknown',
        text: `${J(o.n, '을/를')} ${t}${o.c} 두 주머니에 나누어 담았습니다. 한 주머니에 ${J(qty(o, a), '이/가')} 들어 있다면 다른 주머니에는 몇 ${J(o.c, '이/가')} 들어 있을까요?`,
        cards: [card(o, t), card(o, a)], eq: { tokens: [String(t), '−', String(a)] },
        calc: { type: 'col', op: '−', a: String(t), b: String(a) }, final: { type: 'num', ans: String(t - a), unit: o.c },
        sentence: '다른 주머니에는 {a}가 들어 있습니다.', explain: `${t}은 ${a}와 ${t - a}로 가를 수 있어요.` };
    }
    if (ri(0, 1)) {
      const rest = ri(8, 40), used = ri(5, 30), t = rest + used;
      return { std: ['2수01-09'], kind: 'unknown',
        text: `${J(n1, '은/는')} ${J(o.n, '을/를')} 몇 ${o.c} 가지고 있었습니다. ${J(qty(o, used), '을/를')} ${verbLeft(o)}. 지금 ${J(qty(o, rest), '이/가')} 남았다면, 처음에 가지고 있던 ${J(o.n, '은/는')} 몇 ${o.c}일까요?`,
        cards: [card(o, used), card(o, rest)], eq: { tokens: [String(rest), '+', String(used)] },
        calc: { type: 'col', op: '+', a: String(rest), b: String(used) }, final: { type: 'num', ans: String(t), unit: o.c },
        sentence: '처음에 가지고 있던 수는 {a}입니다.', explain: `□ − ${used} = ${rest} 이므로 □ = ${rest} + ${used}` };
    }
    const x = ri(12, 60), add = ri(7, 29);
    return { std: ['2수01-09'], kind: 'unknown',
      text: `어떤 수에 ${add}를 더했더니 ${x + add}가 되었습니다. 어떤 수는 얼마일까요?`,
      cards: [mcard('➕', '더한 수', add, '', 'num'), mcard('🟰', '결과', x + add, '', 'num')],
      eq: { tokens: [String(x + add), '−', String(add)] }, calc: { type: 'col', op: '−', a: String(x + add), b: String(add) },
      final: { type: 'num', ans: String(x) }, sentence: '어떤 수는 {a}입니다.', explain: `□ + ${add} = ${x + add} 이므로 □ = ${x + add} − ${add}` };
  } });

  /* ---------- 덧셈과 뺄셈의 관계 (2수01-07) ---------- */
  R({ id: 'addsub-rel', grades: [2], domain: 'num', std: ['2수01-07'], gen() {
    const o = pk(OBJ), a = ri(12, 45), b = ri(8, 40), t = a + b;
    return { kind: 'sub_left',
      text: `${o.n}${'이가'[U.batchim(o.n) ? 0 : 1]} 한 상자에 ${qty(o, a)}, 다른 상자에 ${qty(o, b)} 들어 있어서 모두 ${qty(o, t)}입니다. 모두 ${qty(o, t)} 중 한 상자의 ${J(qty(o, b), '을/를')} 꺼내면 남는 ${o.n}${'은는'[U.batchim(o.n) ? 0 : 1]} 몇 ${o.c}일까요?`,
      cards: [card(o, t), card(o, b)], eq: { tokens: [String(t), '−', String(b)] }, calc: { type: 'col', op: '−', a: String(t), b: String(b) },
      final: { type: 'num', ans: String(a), unit: o.c }, sentence: `${a} + ${b} = ${t} 이므로 ${t} − ${b} = {a}. 덧셈과 뺄셈은 서로 거꾸로예요.`, explain: '덧셈식 하나로 뺄셈식을 만들 수 있어요.' };
  } });

  /* ---------- 세 수의 계산 (2수01-08) ---------- */
  R({ id: 'three-num', grades: [2], domain: 'num', std: ['2수01-08'], gen() {
    const a = ri(22, 60), b = ri(6, 19), c = ri(6, 19), s = ri(0, 1);
    const tok = s ? [String(a), '−', String(b), '+', String(c)] : [String(a), '+', String(b), '−', String(c)];
    const p1 = s ? a - b : a + b, ans = val(tok).n;
    return { kind: 'seq',
      text: s ? `버스에 ${a}명이 타고 있었습니다. 정류장에서 ${b}명이 내리고 ${c}명이 탔습니다. 지금 버스에 타고 있는 사람은 몇 명일까요?`
        : `${a}권의 책이 있던 책꽂이에 ${b}권을 더 꽂고, ${c}권을 빌려 갔습니다. 지금 책꽂이에 있는 책은 몇 권일까요?`,
      cards: [mcard(s ? '🚌' : '📚', s ? '처음 승객' : '처음 책', a, s ? '명' : '권', 'blocks'), mcard(s ? '⬇️' : '➕', s ? '내린 사람' : '꽂은 책', b, s ? '명' : '권', 'icons'), mcard(s ? '⬆️' : '➖', s ? '탄 사람' : '빌려 간 책', c, s ? '명' : '권', 'icons')],
      eq: { tokens: tok }, calc: { type: 'steps' },
      prep: [{ q: `먼저 앞의 두 수를 계산해요. ${tok[0]} ${tok[1]} ${tok[2]} = □`, ans: String(p1) }, { q: `그 결과에 이어서 계산해요. ${p1} ${tok[3]} ${tok[4]} = □`, ans: String(ans) }],
      final: { type: 'num', ans: String(ans), unit: s ? '명' : '권' }, sentence: '지금은 {a}입니다.', explain: '세 수의 계산은 앞에서부터 차례로 해요.' };
  } });

  /* ---------- 네 자리 수 · 자릿값 (2수01-01~03) ---------- */
  R({ id: 'place-tens', grades: [1], domain: 'num', std: ['2수01-01', '2수01-02'], gen() {
    const a = ri(2, 9), b = ri(1, 9), o = pk(OBJ.filter((x) => x.c === '개' || x.c === '자루'));
    return { kind: 'place',
      text: `${J(o.n, '을/를')} 10${o.c}씩 묶었더니 ${a}묶음이 되고, ${J(b + o.c, '이/가')} 남았습니다. ${o.n}${'은는'[U.batchim(o.n) ? 0 : 1]} 모두 몇 ${o.c}일까요?`,
      cards: [mcard('🎁', '10개씩 묶음', a, '묶음', 'blocks'), card(o, b)],
      eq: { tokens: [String(a), '×', '10', '+', String(b)], tray: [String(a), '10', String(b), '100'] },
      pre: [{ q: '10개씩 묶음 1개는 모두 몇 개일까요?', ans: '10' }],
      calc: { type: 'steps' }, prep: [{ q: `${a}묶음은 ${a} × 10 = □(개)`, ans: String(a * 10) }],
      final: { type: 'num', ans: String(a * 10 + b), unit: o.c }, sentence: '모두 {a}입니다.', explain: '묶음 수는 십의 자리, 낱개는 일의 자리에 써요.' };
  } });
  R({ id: 'place-money', grades: [2], domain: 'num', std: ['2수01-02', '2수01-03'], gen() {
    const sets = [[1000, 100, 10], [100, 10, 1], [1000, 100, 1], [1000, 10, 1]], s = pk(sets);
    const cnt = s.map(() => ri(1, 9)), tok = [];
    s.forEach((v, i) => { if (i) tok.push('+'); tok.push(String(v), '×', String(cnt[i])); });
    const tot = s.reduce((t, v, i) => t + v * cnt[i], 0);
    const nm = (v) => (v >= 1000 ? `${v}원짜리 지폐` : `${v}원짜리 동전`), ct = (v) => (v >= 1000 ? '장' : '개');
    return { kind: 'place',
      text: `${J(s.map((v, i) => `${nm(v)} ${cnt[i]}${ct(v)}`).join(', '), '이/가')} 있습니다. 모두 얼마일까요?`,
      cards: s.map((v, i) => mcard(v >= 1000 ? '💵' : '🪙', `${v}원`, cnt[i], ct(v), 'icons')),
      eq: { tokens: tok, tray: [].concat(s.map(String), cnt.map(String)) },
      calc: { type: 'steps' }, prep: s.map((v, i) => ({ q: `${v}원짜리 ${cnt[i]}${ct(v)}는 □원`, ans: String(v * cnt[i]) })),
      final: { type: 'num', ans: String(tot), unit: '원' }, sentence: '모두 {a}입니다.', explain: '각 자리의 값을 모두 더하면 어떤 수가 돼요.' };
  } });

  /* ---------- 곱셈 ---------- */
  R({ id: 'mul-equal', grades: [2, 3, 4], domain: 'num', std: ['2수01-10', '2수01-11', '4수01-04'], gen(g) {
    const o = pk(OBJ), bx = pk(BOX);
    let a, b, std;
    if (g === 2) { a = ri(2, 9); b = ri(2, 9); std = ['2수01-10', '2수01-11']; }
    else if (g === 3) { a = ri(12, 99); b = ri(2, 9); std = ['4수01-04']; }
    else { a = ri(112, 489); b = ri(12, 48); std = ['4수01-04']; }
    return Object.assign({ std, kind: 'mul_equal',
      text: `한 ${bx.n}에 ${J(o.n, '을/를')} ${qty(o, a)}씩 담았습니다. ${bx.n} ${b}개에 담은 ${J(o.n, '은/는')} 모두 몇 ${o.c}일까요?`,
      cards: [card(o, a, { label: `한 ${bx.n}에 담은 ${o.n}` }), mcard(bx.e, bx.n, b, '개', 'icons')],
      sentence: `담은 ${o.n}${'은는'[U.batchim(o.n) ? 0 : 1]} 모두 {a}입니다.`, explain: `${a}씩 ${b}묶음 → ${a} × ${b}` }, colFinal('×', a, b, o.c));
  } });
  R({ id: 'mul-times', grades: [2, 3], domain: 'num', std: ['2수01-10', '4수01-04'], gen(g) {
    const o = pk(OBJ), [n1, n2] = two(); const a = g === 2 ? ri(2, 9) : ri(12, 49), b = g === 2 ? ri(2, 5) : ri(3, 9);
    return Object.assign({ std: g === 2 ? ['2수01-10'] : ['4수01-04'], kind: 'mul_times',
      text: `${J(n1, '은/는')} ${J(o.n, '을/를')} ${qty(o, a)} 가지고 있고, ${J(n2, '은/는')} ${n1}의 ${b}배만큼 가지고 있습니다. ${J(n2, '이/가')} 가진 ${J(o.n, '은/는')} 몇 ${o.c}일까요?`,
      cards: [card(o, a, { label: `${o.n}(${n1})` }), mcard('✖️', '배', b, '배', 'num')],
      sentence: `${n2}${'이가'[U.batchim(n2) ? 0 : 1]} 가진 ${o.n}${'은는'[U.batchim(o.n) ? 0 : 1]} {a}입니다.`, explain: `${b}배는 ${a}를 ${b}번 더한 것과 같아요.` }, colFinal('×', a, b, o.c));
  } });

  /* ---------- 나눗셈 ---------- */
  function divPrep(a, b, q) {
    return [{ q: `${b} × □ 가 ${a}를 넘지 않으면서 가장 큰 □는?`, ans: String(q) }, { q: `${b} × ${q} = □`, ans: String(b * q) }];
  }
  R({ id: 'div-exact', grades: [3], domain: 'num', std: ['4수01-05'], gen() {
    const o = pk(OBJ), b = ri(2, 9), q = ri(2, 9), a = b * q, share = ri(0, 1);
    return { kind: share ? 'div_share' : 'div_group',
      text: share ? `${J(o.n, '을/를')} ${qty(o, a)} 있습니다. ${b}명에게 똑같이 나누어 주면 한 명에게 몇 ${o.c}씩 줄 수 있을까요?`
        : `${J(o.n, '을/를')} ${qty(o, a)} 있습니다. 한 명에게 ${qty(o, b)}씩 나누어 주면 몇 명에게 줄 수 있을까요?`,
      cards: share ? [card(o, a), mcard('🧒', '나누어 받는 사람', b, '명', 'icons')] : [card(o, a), card(o, b, { label: `한 명에게 주는 ${o.n}` })],
      eq: { tokens: [String(a), '÷', String(b)] }, calc: { type: 'div', a, b },
      prep: [{ q: `${b} × □ = ${a} 에서 □는?`, ans: String(q) }],
      final: { type: 'num', ans: String(q), unit: share ? o.c : '명' },
      sentence: share ? '한 명에게 {a}씩 줄 수 있어요.' : '{a}에게 줄 수 있어요.', explain: '곱셈구구로 나눗셈의 몫을 찾을 수 있어요. (곱셈과 나눗셈의 관계)' };
  } });
  R({ id: 'div-rem', grades: [3, 4], domain: 'num', std: ['4수01-06', '4수01-07'], gen(g) {
    const o = pk(OBJ), bx = pk(BOX);
    let b, q, r, a, std;
    if (g === 3) { b = ri(3, 9); q = ri(5, 19); r = ri(1, b - 1); std = ['4수01-06']; } else { b = ri(12, 29); q = ri(6, 29); r = ri(1, b - 1); std = ['4수01-07']; }
    a = b * q + r;
    const share = g === 3 && ri(0, 1);
    return { std, kind: share ? 'div_share' : 'div_group',
      text: share ? `${J(o.n, '을/를')} ${qty(o, a)} 가지고 있습니다. ${b}명이 똑같이 나누어 가지면 한 명이 몇 ${o.c}씩 가지고, 몇 ${J(o.c, '이/가')} 남을까요?`
        : `${J(o.n, '을/를')} ${qty(o, a)} 가지고 있습니다. 한 ${bx.n}에 ${qty(o, b)}씩 담으면 몇 ${bx.n}에 담고, 몇 ${J(o.c, '이/가')} 남을까요?`,
      cards: share ? [card(o, a), mcard('🧒', '나누는 사람', b, '명', 'icons')] : [card(o, a), card(o, b, { label: `한 ${bx.n}에 담는 ${o.n}` })],
      eq: { tokens: [String(a), '÷', String(b)] }, calc: { type: 'div', a, b }, prep: divPrep(a, b, q),
      final: { type: 'qr', q, r, unit: share ? o.c : bx.n, unit2: o.c, a, b },
      sentence: share ? `한 명이 {q}${o.c}씩 가지고, {r}${J(o.c, '이/가')} 남습니다.` : `{q}${bx.n}에 담고, {r}${J(o.c, '이/가')} 남습니다.`, explain: `${a} ÷ ${b} = ${q} … ${r}  (${b} × ${q} + ${r} = ${a})` };
  } });

  /* ---------- 어림셈 / 큰 수 (4수01-01,02,08) ---------- */
  R({ id: 'round-est', grades: [4], domain: 'num', std: ['4수01-08'], gen() {
    const a = ri(112, 948), b = ri(112, 948), ra = Math.round(a / 100) * 100, rb = Math.round(b / 100) * 100, [n1] = two();
    const x = pk([['공책', '문구점'], ['색연필', '문구점'], ['빵', '빵집'], ['도시락', '마트']]), y = pk([['지우개'], ['풀'], ['우유'], ['과자']]);
    return { kind: 'round',
      text: `${n1}${'이가'[U.batchim(n1) ? 0 : 1]} ${x[1]}에서 ${a}원짜리 ${x[0]}과(와) ${b}원짜리 ${y[0]}을(를) 사려고 합니다. 각각 반올림하여 백의 자리까지 어림하면 합은 약 몇 원일까요?`.replace('과(와)', U.batchim(x[0]) ? '과' : '와').replace('을(를)', U.batchim(y[0]) ? '을' : '를'),
      cards: [mcard('🛒', x[0], a, '원', 'blocks'), mcard('🛒', y[0], b, '원', 'blocks')],
      pre: [{ q: `${a}을 반올림하여 백의 자리까지 나타내면? (십의 자리 숫자가 5 이상이면 올려요)`, ans: String(ra) }, { q: `${b}를 반올림하여 백의 자리까지 나타내면?`, ans: String(rb) }],
      eq: { tokens: [String(ra), '+', String(rb)], tray: [String(ra), String(rb), String(a), String(b)] }, calc: { type: 'col', op: '+', a: String(ra), b: String(rb) },
      final: { type: 'num', ans: String(ra + rb), unit: '원' }, sentence: '합은 약 {a}입니다.', explain: '어림하면 계산이 쉬워지고, 결과가 합리적인지 확인할 수 있어요.' };
  } });
  R({ id: 'big-number', grades: [4], domain: 'num', std: ['4수01-01', '4수01-02'], gen() {
    const a = ri(1, 9), b = ri(1, 9), c = ri(1, 9), unit = pk([['만', 10000], ['억', 100000000]]);
    const t1 = unit[1], t2 = t1 / 10, t3 = t1 / 100;
    const tot = a * t1 + b * t2 + c * t3;
    return { kind: 'place',
      text: `어떤 수는 ${t1}이 ${a}개, ${t2}이 ${b}개, ${t3}이 ${c}개인 수입니다. 이 수를 숫자로 쓰면 얼마일까요?`,
      cards: [mcard('🔟', String(t1), a, '개', 'num'), mcard('🔟', String(t2), b, '개', 'num'), mcard('🔟', String(t3), c, '개', 'num')],
      eq: { tokens: [String(t1), '×', String(a), '+', String(t2), '×', String(b), '+', String(t3), '×', String(c)], tray: [String(t1), String(a), String(t2), String(b), String(t3), String(c)] },
      calc: { type: 'steps' }, prep: [{ q: `${t1} × ${a} = □`, ans: String(t1 * a) }, { q: `${t2} × ${b} = □`, ans: String(t2 * b) }, { q: `${t3} × ${c} = □`, ans: String(t3 * c) }],
      final: { type: 'num', ans: String(tot) }, sentence: `어떤 수는 {a} (${U.readKorean(String(tot))})입니다.`, explain: '큰 수는 네 자리씩 끊어서 만, 억, 조…로 읽어요.' };
  } });

  /* ---------- 분수 (3~6학년) ---------- */
  R({ id: 'frac-rep', grades: [3], domain: 'num', std: ['4수01-09', '4수01-10', '4수01-11'], gen() {
    const d = pk([4, 5, 6, 8, 10]), n = ri(1, d - 1), thing = pk([['피자', '🍕', '조각'], ['케이크', '🍰', '조각'], ['초콜릿', '🍫', '칸'], ['색종이', '🟧', '칸']]);
    return { kind: 'frac_rep',
      text: `${thing[0]} 한 개를 똑같이 ${d}${thing[2]}으로 나누었습니다. 그 중 ${n}${thing[2]}을 먹었습니다. 먹은 양은 전체의 얼마인지 분수로 나타내 보세요.`,
      cards: [mcard(thing[1], '전체를 나눈 수', d, thing[2], 'frac'), mcard('😋', '먹은 수', n, thing[2], 'icons')], figure: { type: 'fracbar', n, d },
      eq: { tokens: [String(n), '÷', String(d)], ops: ['÷', '+', '−', '×'] }, calc: { type: 'steps' }, prep: [{ q: `전체를 똑같이 나눈 수(분모)는 □`, ans: String(d) }, { q: `그 중 먹은 수(분자)는 □`, ans: String(n) }],
      final: { type: 'frac', ans: `${n}/${d}`, exact: true }, sentence: `먹은 양은 전체의 {a}입니다. (${d}분의 ${n})`, explain: '분모는 전체를 똑같이 나눈 수, 분자는 그 중 선택한 수예요.' };
  } });
  R({ id: 'frac-same', grades: [4], domain: 'num', std: ['4수01-15'], gen() {
    const d = ri(5, 12), [n1, n2] = two(), sub = ri(0, 1), L = pk(['주스', '우유', '물']);
    if (!sub) {
      const a = ri(2, d - 1), b = ri(2, d - 1), s = a + b;
      return { kind: 'add_merge', text: `${J(n1, '은/는')} ${L}${'를을'[U.batchim(L) ? 1 : 0]} ${a}/${d} L 마시고 ${J(n2, '은/는')} ${b}/${d} L 마셨습니다. 두 사람이 마신 ${L}${'은는'[U.batchim(L) ? 0 : 1]} 모두 몇 L일까요?`,
        cards: [mcard('🥤', n1 + '(마신 양)', `${a}/${d}`, 'L', 'frac'), mcard('🥤', n2 + '(마신 양)', `${b}/${d}`, 'L', 'frac')],
        eq: { tokens: [`${a}/${d}`, '+', `${b}/${d}`] }, calc: { type: 'steps' }, prep: [{ q: `분모는 그대로 두고 분자끼리 더하면 ${a} + ${b} = □`, ans: String(s) }],
        final: { type: 'frac', ans: `${s}/${d}`, unit: 'L' }, sentence: '모두 {a}를 마셨습니다.', explain: '분모가 같으면 분자끼리 더해요. 가분수는 대분수로도 나타낼 수 있어요.' };
    }
    const a = ri(4, d - 1), b = ri(1, a - 1);
    return { kind: 'sub_left', text: `${L}${'이가'[U.batchim(L) ? 0 : 1]} ${a}/${d} L 있었습니다. 그 중 ${b}/${d} L를 마셨습니다. 남은 ${L}${'은는'[U.batchim(L) ? 0 : 1]} 몇 L일까요?`,
      cards: [mcard('🥛', `처음 ${L}`, `${a}/${d}`, 'L', 'frac'), mcard('😋', '마신 양', `${b}/${d}`, 'L', 'frac')],
      eq: { tokens: [`${a}/${d}`, '−', `${b}/${d}`] }, calc: { type: 'steps' }, prep: [{ q: `분모는 그대로 두고 분자끼리 빼면 ${a} − ${b} = □`, ans: String(a - b) }],
      final: { type: 'frac', ans: `${a - b}/${d}`, unit: 'L' }, sentence: '남은 양은 {a}입니다.', explain: '분모가 같은 분수의 뺄셈은 분자끼리 빼요.' };
  } });
  R({ id: 'frac-mixed', grades: [4], domain: 'num', std: ['4수01-15'], gen() {
    const d = ri(4, 9), w1 = ri(2, 4), n1 = ri(1, d - 1), w2 = ri(1, w1 - 1), n2 = ri(n1 + 1 <= d - 1 ? n1 + 1 : 1, d - 1); // 받아내림 유도
    const A = `${w1} ${n1}/${d}`, B = `${w2} ${n2}/${d}`, rib = pk(['리본', '끈']);
    const diff = val([A, '−', B]);
    return { kind: 'sub_left', text: `${rib} ${A} m 중에서 ${B} m를 사용했습니다. 남은 ${rib}의 길이는 몇 m일까요?`,
      cards: [mcard('🎀', `처음 ${rib}`, A, 'm', 'frac'), mcard('✂️', '사용한 길이', B, 'm', 'frac')],
      eq: { tokens: [A, '−', B] }, calc: { type: 'steps' },
      prep: [{ q: `${A} = □/${d} (가분수로 바꾸기)`, ans: `${w1 * d + n1}/${d}` }, { q: `${B} = □/${d} (가분수로 바꾸기)`, ans: `${w2 * d + n2}/${d}` }, { q: `분자끼리 빼면 □/${d}`, ans: `${w1 * d + n1 - w2 * d - n2}/${d}` }],
      final: { type: 'frac', ans: F.toStr(diff), unit: 'm' }, sentence: '남은 길이는 {a}입니다.', explain: '자연수 부분이 받아내림되면 가분수로 바꾸어 계산하면 쉬워요.' };
  } });

  /* ---------- 소수 (4학년) ---------- */
  R({ id: 'dec-addsub', grades: [4], domain: 'num', std: ['4수01-12', '4수01-13', '4수01-16'], gen() {
    const add = ri(0, 1), k = pk([1, 2]), A = ri(Math.pow(10, k) + 3, 9 * Math.pow(10, k) + 5), B = add ? ri(3, 9 * Math.pow(10, k - 0)) : 0;
    let a, b;
    if (add) { a = dec(A, k); b = dec(ri(12, 96), 1); } else { const big = ri(250, 980), small = ri(21, big - 15); a = dec(big, 2); b = ri(0, 1) ? dec(small, 2) : dec(Math.min(ri(11, 90) * 10, big - 10), 2); }
    const th = pk([['리본', '🎀', 'm'], ['끈', '🧵', 'm'], ['철사', '〰️', 'm']]);
    if (add) return Object.assign({ kind: 'add_merge',
      text: `${th[0]}${'이가'[U.batchim(th[0]) ? 0 : 1]} ${a} m, ${b} m 있습니다. ${th[0]}의 길이는 모두 몇 m일까요?`,
      cards: [mcard(th[1], th[0] + ' ①', a, 'm'), mcard(th[1], th[0] + ' ②', b, 'm')], sentence: '길이는 모두 {a}입니다.', explain: '소수점의 위치를 맞추어 같은 자리끼리 더해요.' }, colFinal('+', a, b, 'm'));
    return Object.assign({ kind: 'sub_left',
      text: `${th[0]} ${a} m 중에서 ${b} m를 사용했습니다. 남은 ${th[0]}의 길이는 몇 m일까요?`,
      cards: [mcard(th[1], '처음 ' + th[0], a, 'm'), mcard('✂️', '사용한 길이', b, 'm')], sentence: '남은 길이는 {a}입니다.', explain: '소수점의 위치를 맞추어 같은 자리끼리 빼요.' }, colFinal('−', a, b, 'm'));
  } });

  /* ---------- 5학년: 혼합 계산 ---------- */
  R({ id: 'mixed-change', grades: [5], domain: 'num', std: ['6수01-01'], gen() {
    const o = pk([['연필', '✏️', '자루'], ['공책', '📓', '권'], ['지우개', '🧽', '개']]), p = ri(3, 9) * 100, k = ri(2, 6), pay = Math.ceil((p * k + 1) / 1000) * 1000 + (ri(0, 1) ? 1000 : 0);
    return { kind: 'mixed',
      text: `${o[0]} 한 ${o[2]}에 ${p}원입니다. ${o[0]} ${J(k + o[2], '을/를')} 사고 ${pay}원을 냈다면 거스름돈은 얼마일까요?`,
      cards: [mcard(o[1], `${o[0]} 한 ${o[2]}`, p, '원', 'blocks'), mcard('🛒', '산 수', k, o[2], 'icons'), mcard('💵', '낸 돈', pay, '원', 'blocks')],
      eq: { tokens: [String(pay), '−', String(p), '×', String(k)] }, calc: { type: 'steps' },
      prep: [{ q: `먼저 곱셈! ${p} × ${k} = □(원)`, ans: String(p * k) }, { q: `그 다음 뺄셈! ${pay} − ${p * k} = □(원)`, ans: String(pay - p * k) }],
      final: { type: 'num', ans: String(pay - p * k), unit: '원' }, sentence: '거스름돈은 {a}입니다.', explain: '덧셈·뺄셈과 곱셈·나눗셈이 섞여 있으면 곱셈·나눗셈을 먼저 계산해요. 괄호가 있으면 괄호 안을 가장 먼저!' };
  } });
  R({ id: 'mixed-paren', grades: [5], domain: 'num', std: ['6수01-01'], gen() {
    const a = ri(5, 14), b = ri(5, 14), c = ri(3, 9);
    return { kind: 'mixed',
      text: `한 모둠에 남학생이 ${a}명, 여학생이 ${b}명 있습니다. ${c}개 모둠의 학생은 모두 몇 명일까요?`,
      cards: [mcard('👦', '남학생(한 모둠)', a, '명', 'icons'), mcard('👧', '여학생(한 모둠)', b, '명', 'icons'), mcard('👥', '모둠 수', c, '개', 'icons')],
      eq: { tokens: ['(', String(a), '+', String(b), ')', '×', String(c)] }, calc: { type: 'steps' },
      prep: [{ q: `괄호 안을 먼저! ${a} + ${b} = □`, ans: String(a + b) }, { q: `${a + b} × ${c} = □`, ans: String((a + b) * c) }],
      final: { type: 'num', ans: String((a + b) * c), unit: '명' }, sentence: '학생은 모두 {a}입니다.', explain: '한 모둠의 학생 수를 먼저 구하고(괄호) 모둠 수를 곱해요.' };
  } });

  /* ---------- 약수·배수 ---------- */
  function divisors(n) { const r = []; for (let i = 1; i <= n; i++) if (n % i === 0) r.push(i); return r; }
  R({ id: 'gcd', grades: [5], domain: 'num', std: ['6수01-04'], gen() {
    const g = ri(3, 9), p = pk([2, 3, 4, 5]), q = pk([3, 5, 7].filter((x) => x !== p)), a = g * p, b = g * q;
    return { kind: 'divisor',
      text: `사탕 ${a}개와 초콜릿 ${b}개를 최대한 많은 친구에게 남김없이 똑같이 나누어 주려고 합니다. 몇 명에게 나누어 줄 수 있을까요?`,
      cards: [mcard('🍬', '사탕', a, '개', 'blocks'), mcard('🍫', '초콜릿', b, '개', 'blocks')], eq: null,
      calc: { type: 'steps' }, prep: [{ q: `${a}의 약수를 모두 쓰세요 (쉼표로 구분)`, ans: divisors(a), type: 'list' }, { q: `${b}의 약수를 모두 쓰세요 (쉼표로 구분)`, ans: divisors(b), type: 'list' }, { q: `두 수의 공약수 중 가장 큰 수(최대공약수)는?`, ans: String(g) }],
      final: { type: 'num', ans: String(g), unit: '명' }, sentence: '최대 {a}에게 나누어 줄 수 있어요.', explain: '남김없이 똑같이 나누려면 두 수의 공약수를 찾아요. 가장 많은 사람 → 최대공약수.' };
  } });
  R({ id: 'lcm', grades: [5], domain: 'num', std: ['6수01-05'], gen() {
    const pairs = [[4, 6], [6, 8], [3, 4], [6, 9], [4, 10], [8, 12], [9, 12], [10, 15], [5, 6], [6, 10]], [a, b] = pk(pairs), L = U.lcm(a, b), mul = (n) => U.range(1, 6).map((i) => n * i);
    return { kind: 'multiple',
      text: `${a}분마다 오는 버스와 ${b}분마다 오는 버스가 오전 9시에 동시에 출발했습니다. 두 버스가 다음에 처음으로 동시에 출발하는 때는 몇 분 뒤일까요?`,
      cards: [mcard('🚌', '가 버스 간격', a, '분', 'icons'), mcard('🚍', '나 버스 간격', b, '분', 'icons')], eq: null,
      calc: { type: 'steps' }, prep: [{ q: `${a}의 배수를 작은 수부터 6개 쓰세요`, ans: mul(a), type: 'list' }, { q: `${b}의 배수를 작은 수부터 6개 쓰세요`, ans: mul(b), type: 'list' }, { q: '두 수의 공배수 중 가장 작은 수(최소공배수)는?', ans: String(L) }],
      final: { type: 'num', ans: String(L), unit: '분' }, sentence: '{a} 뒤에 처음으로 동시에 출발해요.', explain: '동시에 다시 만나는 때는 두 수의 공배수. 가장 빠른 때 → 최소공배수.' };
  } });

  /* ---------- 올림/버림/반올림/범위 ---------- */
  R({ id: 'ceil-floor', grades: [5], domain: 'num', std: ['6수01-02', '6수01-03'], gen() {
    const t = ri(0, 2);
    if (t === 0) { const b = pk([6, 8, 10, 12]), a = b * ri(3, 9) + ri(1, b - 1), q = Math.floor(a / b);
      return { kind: 'round', text: `달걀 ${a}개를 한 상자에 ${b}개씩 담으려고 합니다. 달걀을 모두 담으려면 상자는 최소 몇 개 필요할까요?`,
        cards: [mcard('🥚', '달걀', a, '개', 'blocks'), mcard('📦', '한 상자에 담는 수', b, '개', 'icons')], eq: null, calc: { type: 'steps' },
        prep: [{ q: `${a} ÷ ${b} 의 몫은 □ (나머지가 ${a - q * b})`, ans: String(q) }, { q: '남은 달걀도 담아야 하므로 몫에서 한 상자 더 필요해요. 필요한 상자는 □개 (올림)', ans: String(q + 1) }],
        final: { type: 'num', ans: String(q + 1), unit: '개' }, sentence: '상자는 최소 {a}가 필요해요. (올림)', explain: '모자라지 않아야 할 때는 올림을 사용해요.' }; }
    if (t === 1) { const m = ri(23, 98) * 100 + ri(1, 99);
      return { kind: 'round', text: `${m}원을 1000원짜리 지폐로 바꾸려고 합니다. 바꿀 수 있는 지폐는 최대 몇 장일까요?`,
        cards: [mcard('💵', '가진 돈', m, '원', 'blocks'), mcard('💴', '지폐 한 장', 1000, '원', 'blocks')], eq: null, calc: { type: 'steps' },
        prep: [{ q: `${m}에서 1000이 몇 번 들어가나요? (천의 자리 아래는 버려요) □`, ans: String(Math.floor(m / 1000)) }],
        final: { type: 'num', ans: String(Math.floor(m / 1000)), unit: '장' }, sentence: '최대 {a} 바꿀 수 있어요. (버림)', explain: '모자라는 부분은 쓸 수 없을 때 버림을 사용해요.' }; }
    const m = ri(1234, 9876), pl = pk([[10, '십'], [100, '백'], [1000, '천']]), r = Math.round(m / pl[0]) * pl[0];
    return { kind: 'round', text: `어느 마을의 인구는 ${m}명입니다. 이 인구를 반올림하여 ${pl[1]}의 자리까지 나타내면 몇 명일까요?`,
      cards: [mcard('🏘️', '마을 인구', m, '명', 'blocks')], eq: null, calc: { type: 'steps' },
      prep: [{ q: `${pl[1]}의 자리 바로 아래 숫자는 ${String(m)[String(m).length - String(pl[0]).length]}입니다. 5 이상이면 올림, 4 이하면 버림! 반올림한 수는? □`, ans: String(r) }],
      final: { type: 'num', ans: String(r), unit: '명' }, sentence: '약 {a}입니다.', explain: '반올림은 바로 아래 자리가 5 이상이면 올리고, 4 이하이면 버려요.' };
  } });
  R({ id: 'range', grades: [5], domain: 'num', std: ['6수01-02'], gen() {
    const th = pk([[120, '이상'], [130, '이상'], [140, '이상']]), hs = U.sample([108, 115, 119, 120, 124, 127, 130, 131, 135, 138, 140, 142, 145, 150], 6), cnt = hs.filter((h) => h >= th[0]).length;
    return { kind: 'range', text: `놀이기구는 키가 ${th[0]} cm ${th[1]}인 어린이만 탈 수 있습니다. 어린이 6명의 키가 ${hs.join(' cm, ')} cm일 때, 이 놀이기구를 탈 수 있는 어린이는 몇 명일까요?`,
      cards: [mcard('🎢', '기준 키', th[0], 'cm', 'bar'), mcard('📏', '어린이 수', 6, '명', 'icons')], eq: null, calc: { type: 'steps' },
      prep: [{ q: `${th[0]} cm ${th[1]}은 ${th[0]} cm를 (포함한다 / 포함하지 않는다) → 포함하면 1, 아니면 0을 쓰세요`, ans: '1' }, { q: `${th[0]} 이상인 키는 모두 몇 개인가요? □`, ans: String(cnt) }],
      final: { type: 'num', ans: String(cnt), unit: '명' }, sentence: '탈 수 있는 어린이는 {a}입니다.', explain: '‘이상’은 기준 수를 포함하고, ‘초과’는 포함하지 않아요.' };
  } });

  /* ---------- 5학년: 이분모 분수, 분수·소수 곱셈 ---------- */
  const DPAIR = [[2, 3], [2, 4], [3, 4], [3, 6], [4, 6], [2, 5], [3, 5], [4, 5], [6, 8], [4, 8], [2, 6], [5, 10], [3, 9], [6, 9]];
  R({ id: 'frac-diff', grades: [5], domain: 'num', std: ['6수01-06', '6수01-07', '6수01-08'], gen() {
    const [d1, d2] = pk(DPAIR); const sub = ri(0, 1); const L = U.lcm(d1, d2), op = sub ? '−' : '+';
    let a, b, A, B, r, guard = 0;
    do { a = ri(1, d1 - 1); b = ri(1, d2 - 1); A = `${a}/${d1}`; B = `${b}/${d2}`; r = val([A, op, B]); } while (sub && r.n <= 0 && ++guard < 50);
    if (sub && r.n <= 0) { a = d1 - 1; b = 1; A = `${a}/${d1}`; B = `${b}/${d2}`; r = val([A, op, B]); }
    const th = pk([['물', '💧'], ['주스', '🧃'], ['우유', '🥛']]), [n1, n2] = two();
    return { kind: sub ? 'sub_left' : 'add_merge',
      text: sub ? `${th[0]}${'이가'[U.batchim(th[0]) ? 0 : 1]} ${A} L 있었습니다. 그 중 ${B} L를 마셨다면 남은 ${th[0]}의 양은 몇 L일까요?`
        : `${J(n1, '은/는')} ${th[0]}${'을를'[U.batchim(th[0]) ? 0 : 1]} ${A} L, ${J(n2, '은/는')} ${B} L 마셨습니다. 두 사람이 마신 ${th[0]}의 양은 모두 몇 L일까요?`,
      cards: [mcard(th[1], sub ? '처음 양' : n1 + '(마신 양)', A, 'L', 'frac'), mcard(th[1], sub ? '마신 양' : n2 + '(마신 양)', B, 'L', 'frac')],
      eq: { tokens: [A, op, B] }, calc: { type: 'steps' },
      prep: [{ q: `${d1}과 ${d2}의 최소공배수로 통분해요. 공통분모는 □`, ans: String(L) }, { q: `${A} = □/${L}`, ans: `${a * (L / d1)}/${L}` }, { q: `${B} = □/${L}`, ans: `${b * (L / d2)}/${L}` }, { q: `분자끼리 ${sub ? '빼면' : '더하면'} □/${L}`, ans: `${sub ? a * (L / d1) - b * (L / d2) : a * (L / d1) + b * (L / d2)}/${L}` }],
      final: { type: 'frac', ans: F.toStr(r), unit: 'L', reduce: true }, sentence: '양은 {a}입니다.', explain: '분모가 다르면 통분해서 분모를 같게 만든 뒤 계산하고, 약분해서 기약분수로 나타내요.' };
  } });
  R({ id: 'frac-mul', grades: [5], domain: 'num', std: ['6수01-09'], gen() {
    if (ri(0, 1)) { const d = pk([3, 4, 5, 6, 8]), n = ri(1, d - 1), k = ri(2, 6), A = `${n}/${d}`, th = pk([['물', '💧', 'L'], ['리본', '🎀', 'm']]); const r = val([A, '×', String(k)]);
      return { kind: 'mul_equal', text: `하루에 ${th[0]}${'을를'[U.batchim(th[0]) ? 1 : 0]} ${A} ${th[2]}씩 사용합니다. ${k}일 동안 사용한 ${th[0]}의 양은 모두 몇 ${th[2]}일까요?`,
        cards: [mcard(th[1], '하루 사용량', A, th[2], 'frac'), mcard('📅', '날 수', k, '일', 'icons')], eq: { tokens: [A, '×', String(k)] }, calc: { type: 'steps' },
        prep: [{ q: `분자에 ${k}를 곱해요. ${n} × ${k} = □`, ans: String(n * k) }], final: { type: 'frac', ans: F.toStr(r), unit: th[2], reduce: true }, sentence: '모두 {a}입니다.', explain: '(분수)×(자연수)는 분자에 자연수를 곱한 뒤 약분해요.' }; }
    const d1 = pk([3, 4, 5, 6]), n1 = ri(1, d1 - 1), d2 = pk([3, 4, 5, 7]), n2 = ri(1, d2 - 1), A = `${n1}/${d1}`, B = `${n2}/${d2}`; const r = val([A, '×', B]);
    return { kind: 'frac_of', text: `텃밭의 ${A}에 채소를 심었고, 그 중 ${B}에는 상추를 심었습니다. 상추를 심은 부분은 텃밭 전체의 얼마일까요?`,
      cards: [mcard('🌱', '채소 심은 부분', A, '', 'frac'), mcard('🥬', '그 중 상추', B, '', 'frac')], eq: { tokens: [A, '×', B] }, calc: { type: 'steps' },
      prep: [{ q: `분자끼리 곱해요. ${n1} × ${n2} = □`, ans: String(n1 * n2) }, { q: `분모끼리 곱해요. ${d1} × ${d2} = □`, ans: String(d1 * d2) }],
      final: { type: 'frac', ans: F.toStr(r), reduce: true }, sentence: '상추를 심은 부분은 전체의 {a}입니다.', explain: '(분수)×(분수)는 분자끼리, 분모끼리 곱해요.' };
  } });
  R({ id: 'dec-mul', grades: [5], domain: 'num', std: ['6수01-13'], gen() {
    if (ri(0, 1)) { const a = dec(ri(12, 89), 1), k = ri(2, 7), th = pk([['주스', '🧃', 'L'], ['끈', '🧵', 'm']]); const ans = numStr([a, '×', String(k)]);
      return { kind: 'mul_equal', text: `한 병에 ${th[0]}${'이가'[U.batchim(th[0]) ? 0 : 1]} ${a} ${th[2]}씩 들어 있습니다. ${k}병에 들어 있는 ${th[0]}의 양은 모두 몇 ${th[2]}일까요?`,
        cards: [mcard(th[1], '한 병의 양', a, th[2], 'bar'), mcard('🍼', '병 수', k, '병', 'icons')], eq: { tokens: [a, '×', String(k)] }, calc: { type: 'steps' },
        prep: [{ q: `소수점을 없애고 정수처럼 계산해요. ${a.replace('.', '')} × ${k} = □`, ans: String(+a.replace('.', '') * k) }],
        final: { type: 'num', ans, unit: th[2] }, sentence: '모두 {a}입니다.', explain: '(소수)×(자연수)는 자연수처럼 곱한 뒤 소수점을 제자리에 찍어요.' }; }
    const a = dec(ri(12, 49), 1), b = dec(ri(3, 9), 1), ans = numStr([a, '×', b]);
    return { kind: 'mul_equal', text: `가로가 ${a} m, 세로가 ${b} m인 직사각형 모양의 꽃밭이 있습니다. 이 꽃밭의 넓이는 몇 m²일까요?`,
      cards: [mcard('↔️', '가로', a, 'm', 'bar'), mcard('↕️', '세로', b, 'm', 'bar')], figure: { type: 'rect', w: a, h: b, unit: 'm' }, eq: { tokens: [a, '×', b] }, calc: { type: 'steps' },
      prep: [{ q: `소수점을 무시하고 곱해요. ${a.replace('.', '')} × ${b.replace('.', '')} = □`, ans: String(+a.replace('.', '') * +b.replace('.', '')) }, { q: '곱하는 두 수의 소수점 아래 자릿수는 모두 몇 개인가요? □', ans: '2' }],
      final: { type: 'num', ans, unit: 'm²' }, sentence: '꽃밭의 넓이는 {a}입니다.', explain: '소수점 아래 자릿수의 합만큼 곱의 오른쪽에서 소수점을 찍어요.' };
  } });

  /* ---------- 6학년: 분수·소수 나눗셈 ---------- */
  R({ id: 'natdiv-frac', grades: [6], domain: 'num', std: ['6수01-10', '6수01-12'], gen() {
    const b = pk([3, 4, 5, 6, 8]), a = ri(1, b + 3); if (a % b === 0) return P.templates({ tpl: 'natdiv-frac' })[0].gen(6);
    const th = pk([['끈', '🧵', 'm'], ['주스', '🧃', 'L']]); const r = F.make(a, b);
    return { kind: 'div_share', text: `${th[0]} ${a} ${th[2]}를 ${b}명이 똑같이 나누어 가지려고 합니다. 한 명이 가지는 ${th[0]}의 양은 몇 ${th[2]}일까요? (분수로 나타내세요)`,
      cards: [mcard(th[1], th[0], a, th[2], 'bar'), mcard('🧒', '나누는 사람', b, '명', 'icons')], eq: { tokens: [String(a), '÷', String(b)] }, calc: { type: 'steps' },
      prep: [{ q: `(자연수)÷(자연수)의 몫은 분수로 나타내요. ${a} ÷ ${b} = □/${b}`, ans: `${a}/${b}` }],
      final: { type: 'frac', ans: F.toStr(r), unit: th[2], reduce: true }, sentence: '한 명이 {a}씩 가져요.', explain: '(자연수)÷(자연수)의 몫은 나누어지는 수를 분자, 나누는 수를 분모로 하는 분수예요.' };
  } });
  R({ id: 'frac-div', grades: [6], domain: 'num', std: ['6수01-11'], gen() {
    const t = ri(0, 2);
    if (t === 0) { const d = pk([4, 5, 7, 8]), n = ri(2, d - 1) * 1, k = ri(2, 4), A = `${n * k}/${d}`; const r = val([A, '÷', String(k)]);
      return { kind: 'div_share', text: `물 ${A} L를 ${k}개의 컵에 똑같이 나누어 담았습니다. 한 컵에 담은 물의 양은 몇 L일까요?`, cards: [mcard('💧', '물', A, 'L', 'frac'), mcard('🥤', '컵 수', k, '개', 'icons')],
        eq: { tokens: [A, '÷', String(k)] }, calc: { type: 'steps' }, prep: [{ q: `나눗셈을 곱셈으로: ${A} × 1/${k} 의 분자는 □`, ans: String(n * k) }, { q: '분모는 □', ans: String(d * k) }],
        final: { type: 'frac', ans: F.toStr(r), unit: 'L', reduce: true }, sentence: '한 컵에 {a}씩 담았어요.', explain: '(분수)÷(자연수)는 나누는 수의 역수를 곱해요. 약분을 먼저 하면 더 쉬워요.' }; }
    if (t === 1) { const m = ri(2, 5), d = pk([3, 4, 5]), n = 1, k = ri(2, 4) * d, B = `${n}/${d}`; const L = pk([6, 8, 9, 10, 12]); const r = val([String(L), '÷', B]);
      return { kind: 'div_group', text: `길이가 ${L} m인 끈을 ${B} m씩 자르면 몇 도막이 될까요?`, cards: [mcard('🧵', '끈', L, 'm', 'bar'), mcard('✂️', '한 도막', B, 'm', 'frac')],
        eq: { tokens: [String(L), '÷', B] }, calc: { type: 'steps' }, prep: [{ q: `${B}의 역수는 □/□ → 분자는 □`, ans: String(d) }, { q: `${L} × ${d} = □`, ans: String(L * d) }],
        final: { type: 'num', ans: F.toStr(r), unit: '도막' }, sentence: '{a}이 돼요.', explain: '(자연수)÷(분수)는 분수를 뒤집어(역수) 곱해요.' }; }
    const A = pk(['3/4', '2/3', '5/6', '3/5']), B = pk(['1/8', '1/4', '1/2', '1/6']); const r = val([A, '÷', B]);
    return { kind: 'div_group', text: `주스 ${A} L를 컵 하나에 ${B} L씩 나누어 담으려고 합니다. 몇 개의 컵에 담을 수 있을까요?`, cards: [mcard('🧃', '주스', A, 'L', 'frac'), mcard('🥤', '컵 하나', B, 'L', 'frac')],
      eq: { tokens: [A, '÷', B] }, calc: { type: 'steps' }, prep: [{ q: `${B}의 역수는 ${B.split('/')[1]}/${B.split('/')[0]}. ${A} × ${B.split('/')[1]}/${B.split('/')[0]} 의 값은? (분수로)`, ans: F.toStr(r) }],
      final: { type: 'frac', ans: F.toStr(r), unit: '개', reduce: true }, sentence: '{a}에 담을 수 있어요.', explain: '(분수)÷(분수)는 나누는 분수의 역수를 곱해요.' };
  } });
  R({ id: 'dec-div', grades: [6], domain: 'num', std: ['6수01-14', '6수01-15'], gen() {
    if (ri(0, 1)) { const k = ri(2, 6), q = dec(ri(12, 59), 1), a = numStr([q, '×', String(k)]);
      return { kind: 'div_share', text: `리본 ${a} m를 ${k}명이 똑같이 나누어 가지면 한 명이 가지는 리본의 길이는 몇 m일까요?`, cards: [mcard('🎀', '리본', a, 'm', 'bar'), mcard('🧒', '나누는 사람', k, '명', 'icons')],
        eq: { tokens: [a, '÷', String(k)] }, calc: { type: 'steps' }, prep: [{ q: `소수점을 무시하고 나눠요. ${a.replace('.', '')} ÷ ${k} = □`, ans: String(+a.replace('.', '') / k) }],
        final: { type: 'num', ans: q, unit: 'm' }, sentence: '한 명이 {a}씩 가져요.', explain: '(소수)÷(자연수)는 자연수처럼 나눈 뒤, 나누어지는 수의 소수점 위치에 맞춰 몫의 소수점을 찍어요.' }; }
    const b = pk([4, 5, 8, 20, 25]), a = ri(1, 3 * b), r = F.make(a, b); if (!F.toDec(r)) return P.templates({ tpl: 'dec-div' })[0].gen(6);
    return { kind: 'div_share', text: `물 ${a} L를 ${b}개의 병에 똑같이 나누어 담으려고 합니다. 한 병에 담는 물의 양은 몇 L일까요? (소수로 나타내세요)`, cards: [mcard('💧', '물', a, 'L', 'bar'), mcard('🍼', '병 수', b, '개', 'icons')],
      eq: { tokens: [String(a), '÷', String(b)] }, calc: { type: 'steps' }, prep: [{ q: `${a} ÷ ${b} = □/${b} (분수) → 분자는 □`, ans: String(a) }],
      final: { type: 'num', ans: F.toDec(r), unit: 'L' }, sentence: '한 병에 {a}씩 담아요.', explain: '나누어떨어지지 않으면 0을 내려 계속 나누어 소수로 나타내요.' };
  } });
})();
