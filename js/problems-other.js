/* 변화와 관계 · 도형과 측정 · 자료와 가능성 — 문제 템플릿 (2022 개정) */
(function () {
  const U = MD.util, F = U.frac, P = MD.problems, H = P.helpers;
  const { card, mcard, J, pk, ri } = H;
  const R = (d) => P.reg(d);
  const NAMES = P.NAMES;
  const two = () => U.sample(NAMES, 2);
  const val = (t) => U.evalTokens(t);
  const S = String;
  const eun = (w) => w + '은는'[U.batchim(w) ? 0 : 1];
  const iga = (w) => w + '이가'[U.batchim(w) ? 0 : 1];
  const eul = (w) => w + '을를'[U.batchim(w) ? 0 : 1];
  const dec = (n, k) => String(parseFloat((n / Math.pow(10, k)).toFixed(k)));

  /* =================== 변화와 관계 =================== */
  R({ id: 'pattern-seq', grades: [1, 2], domain: 'rel', std: ['2수02-01', '2수02-02'], gen(g) {
    const d = g === 1 ? pk([1, 2, 3, 5, 10]) : pk([3, 4, 5, 6, 10, 100]), up = ri(0, 3) > 0;
    const start = up ? (g === 1 ? ri(1, 20) : d === 100 ? ri(1, 5) * 100 : ri(5, 60)) : d * 4 + ri(1, 12);
    const terms = U.range(0, 3).map((i) => start + (up ? 1 : -1) * i * d), nxt = start + (up ? 1 : -1) * 4 * d;
    return { kind: 'pattern', text: `수가 규칙에 따라 늘어놓여 있습니다. ${terms.join(', ')}, □ 에 알맞은 수는 얼마일까요?`,
      cards: [mcard('🔢', '마지막으로 보이는 수', terms[3], '', 'num')], figure: { type: 'seq', terms: terms.concat(['□']) },
      pre: [{ q: `이웃한 두 수가 ${up ? '늘어나는' : '줄어드는'} 크기(차)는 □`, ans: S(d) }],
      eq: { tokens: [S(terms[3]), up ? '+' : '−', S(d)], tray: [S(terms[3]), S(d), S(terms[0])] },
      calc: { type: 'col', op: up ? '+' : '−', a: S(terms[3]), b: S(d) }, final: { type: 'num', ans: S(nxt) },
      sentence: '□에 알맞은 수는 {a}입니다.', explain: `${d}씩 ${up ? '커지는' : '작아지는'} 규칙이에요.` };
  } });
  R({ id: 'pattern-stick', grades: [4], domain: 'rel', std: ['4수02-01', '4수02-02'], gen() {
    const sh = pk([['정삼각형', 3, 2, '🔺'], ['정사각형', 4, 3, '🟧'], ['정오각형', 5, 4, '⬠']]), n = ri(8, 15), step = sh[2];
    return { kind: 'pattern', text: `성냥개비로 ${sh[0]}을 한 줄로 이어 붙여 만들려고 합니다. ${sh[0]} 1개를 만드는 데 성냥개비 ${sh[1]}개가 필요하고, 2개를 만드는 데 ${sh[1] + step}개, 3개를 만드는 데 ${sh[1] + 2 * step}개가 필요합니다. ${sh[0]} ${n}개를 만들려면 성냥개비는 모두 몇 개 필요할까요?`,
      cards: [mcard(sh[3], '만들 모양의 수', n, '개', 'icons'), mcard('🪵', '1개일 때 성냥개비', sh[1], '개', 'icons')],
      pre: [{ q: `${sh[0]}이 1개 늘어날 때마다 성냥개비는 □개씩 늘어나요`, ans: S(step) }, { q: `1개일 때: ${sh[1]} = ${step} × 1 + □`, ans: '1' }],
      eq: { tokens: [S(step), '×', S(n), '+', '1'], tray: [S(step), S(n), '1', S(sh[1])] }, calc: { type: 'steps' }, prep: [{ q: `${step} × ${n} = □`, ans: S(step * n) }],
      final: { type: 'num', ans: S(step * n + 1), unit: '개' }, sentence: '성냥개비는 모두 {a} 필요합니다.', explain: `모양이 하나 늘 때마다 ${step}개씩 늘어나므로 (개수 × ${step}) + 1 이에요.` };
  } });
  R({ id: 'equal-sign', grades: [4], domain: 'rel', std: ['4수02-03'], gen() {
    const [n1, n2] = two(), a = ri(10, 40), b = ri(10, 40), c = ri(5, a + b - 6), x = a + b - c;
    return { kind: 'equal', text: `${eun(n1)} 사탕 ${a}개와 초콜릿 ${b}개를 가지고 있고, ${eun(n2)} 사탕 ${c}개와 초콜릿 □개를 가지고 있습니다. 두 사람이 가진 간식의 수가 같을 때, □는 얼마일까요?`,
      cards: [mcard('🍬', `사탕(${n1})`, a, '개'), mcard('🍫', `초콜릿(${n1})`, b, '개'), mcard('🍬', `사탕(${n2})`, c, '개')],
      eq: { tokens: [S(a), '+', S(b), '−', S(c)] }, calc: { type: 'steps' }, prep: [{ q: `${n1}의 간식 수: ${a} + ${b} = □`, ans: S(a + b) }, { q: `${a + b} = ${c} + □ 이므로 □ = ${a + b} − ${c} = □`, ans: S(x) }],
      final: { type: 'num', ans: S(x), unit: '개' }, sentence: '□는 {a}입니다. (등호의 양쪽은 같아요)', explain: `${a} + ${b} = ${c} + □` };
  } });
  R({ id: 'corr-table', grades: [5], domain: 'rel', std: ['6수02-01'], gen() {
    const it = pk([['자전거', '🚲', '바퀴', 2, '대'], ['세발자전거', '🛺', '바퀴', 3, '대'], ['의자', '🪑', '다리', 4, '개'], ['정삼각형 모양 표지판', '⚠️', '변', 3, '개'], ['문어', '🐙', '다리', 8, '마리']]), k = it[3], n = ri(11, 25);
    return { kind: 'corr', text: `${it[0]}의 수(○)와 ${it[2]}의 수(△)가 아래 표와 같습니다. ${iga(it[0])} ${n}${it[4]}일 때 ${it[2]}는 모두 몇 개일까요?`,
      cards: [mcard(it[1], it[0] + ' 수', n, it[4], 'icons')], figure: { type: 'xy', x: [1, 2, 3, 4], y: [k, 2 * k, 3 * k, 4 * k], xl: it[0], yl: it[2] },
      pre: [{ q: `${iga(it[0])} 1${it[4]} 늘어날 때마다 ${it[2]}는 □개씩 늘어나요`, ans: S(k) }],
      eq: { tokens: [S(n), '×', S(k)], tray: [S(n), S(k), '1'] }, calc: { type: 'col', op: '×', a: S(n), b: S(k) }, final: { type: 'num', ans: S(n * k), unit: '개' },
      sentence: '△ = ○ × ' + k + ' 이므로 {a}입니다.', explain: `표에서 ${k}배씩 늘어나는 규칙을 식으로 나타내요: △ = ○ × ${k}` };
  } });
  R({ id: 'ratio-rate', grades: [6], domain: 'rel', std: ['6수02-02', '6수02-03'], gen() {
    const b = pk([4, 5, 8, 10, 20, 25, 40, 50]), a = ri(1, b - 1), t = ri(0, 2), [n1] = two();
    if (t === 0) { const A = pk([[12, 8], [15, 10], [9, 6], [20, 12], [14, 8]]);
      return { kind: 'ratio', text: `우리 반 남학생은 ${A[0]}명, 여학생은 ${A[1]}명입니다. 여학생 수에 대한 남학생 수의 비율을 기약분수로 나타내 보세요.`, cards: [mcard('👦', '비교하는 양 (남학생)', A[0], '명', 'icons'), mcard('👧', '기준량 (여학생)', A[1], '명', 'icons')],
        eq: { tokens: [S(A[0]), '÷', S(A[1])] }, calc: { type: 'steps' }, prep: [{ q: '비율 = (비교하는 양) ÷ (기준량). 기준량은 □', ans: S(A[1]) }],
        final: { type: 'frac', ans: `${A[0]}/${A[1]}`, reduce: true }, sentence: '비율은 {a}입니다.', explain: '기준량이 분모, 비교하는 양이 분자예요.' }; }
    if (t === 1) { const r = F.make(a, b);
      return { kind: 'ratio', text: `${eun(n1)} 농구공을 ${b}번 던져서 ${a}번 넣었습니다. 던진 횟수에 대한 성공한 횟수의 비율을 소수로 나타내면 얼마일까요?`,
        cards: [mcard('🏀', '던진 횟수(기준량)', b, '번', 'icons'), mcard('🥅', '성공한 횟수(비교하는 양)', a, '번', 'icons')], eq: { tokens: [S(a), '÷', S(b)] }, calc: { type: 'steps' },
        prep: [{ q: `${a} ÷ ${b} = □/${b} → 이 분수를 소수로 나타내면 □`, ans: F.toDec(r) }], final: { type: 'num', ans: F.toDec(r) }, sentence: '비율은 {a}입니다.', explain: '비율은 분수·소수 어느 것으로도 나타낼 수 있어요.' }; }
    const pc = F.make(a * 100, b);
    return { kind: 'ratio', text: `소금물 ${b} g에 소금이 ${a} g 들어 있습니다. 소금물의 양에 대한 소금의 양의 비율을 백분율로 나타내면 몇 %일까요?`,
      cards: [mcard('🧂', '소금물의 양(기준량)', b, 'g', 'bar'), mcard('🧂', '소금의 양(비교하는 양)', a, 'g', 'bar')], eq: { tokens: [S(a), '÷', S(b), '×', '100'] }, calc: { type: 'steps' },
      prep: [{ q: `${a} ÷ ${b} 를 소수로 나타내면 □`, ans: F.toDec(F.make(a, b)) }, { q: '백분율은 비율에 100을 곱해요. □%', ans: S(pc.n / pc.d) }],
      final: { type: 'num', ans: S(pc.n / pc.d), unit: '%' }, sentence: '백분율로 {a}입니다.', explain: '비율 × 100 = 백분율(%)' };
  } });
  R({ id: 'prop-eq', grades: [6], domain: 'rel', std: ['6수02-04'], gen() {
    const a = ri(2, 6), k = ri(20, 60) * 5 / 5, b = a * ri(15, 50), c = ri(a + 2, 20) ; const x = (b / a) * c;
    return { kind: 'prop', text: `빵 ${a}개를 만드는 데 밀가루가 ${b} g 필요합니다. 같은 비율로 빵 ${c}개를 만들려면 밀가루는 몇 g 필요할까요?`,
      cards: [mcard('🍞', '빵', a, '개', 'icons'), mcard('🌾', '필요한 밀가루', b, 'g', 'bar'), mcard('🍞', '더 만들 빵', c, '개', 'icons')],
      eq: { tokens: [S(b), '×', S(c), '÷', S(a)] }, calc: { type: 'steps' }, prep: [{ q: `비례식 ${a} : ${b} = ${c} : □ 에서 외항의 곱 = 내항의 곱. ${b} × ${c} = □`, ans: S(b * c) }, { q: `□ = ${b * c} ÷ ${a}`, ans: S(x) }],
      final: { type: 'num', ans: S(x), unit: 'g' }, sentence: '밀가루는 {a} 필요합니다.', explain: '비례식에서 외항의 곱과 내항의 곱은 같아요.' };
  } });
  R({ id: 'prop-share', grades: [6], domain: 'rel', std: ['6수02-05'], gen() {
    const a = ri(2, 5), b = pk([2, 3, 4, 5, 6].filter((x) => x !== a)), t = a + b, N = t * ri(4, 12), o = pk([['사탕', '🍬', '개'], ['색종이', '🟦', '장']]), [n1, n2] = two(); const x = (N * a) / t;
    return { kind: 'share', text: `${o[0]} ${J(String(N) + o[2], '을/를')} ${J(n1, '과/와')} ${iga(n2)} ${a} : ${J(String(b), '으로/로')} 나누어 가지려고 합니다. ${iga(n1)} 가지는 ${eun(o[0])} 몇 ${o[2]}일까요?`,
      cards: [mcard(o[1], '전체', N, o[2], 'blocks'), mcard('🔢', n1 + '의 비', a, '', 'num'), mcard('🔢', n2 + '의 비', b, '', 'num')],
      eq: { tokens: [S(N), '×', S(a), '÷', '(', S(a), '+', S(b), ')'], tray: [S(N), S(a), S(b)] }, calc: { type: 'steps' }, prep: [{ q: `비의 합: ${a} + ${b} = □`, ans: S(t) }, { q: `비 1에 해당하는 양: ${N} ÷ ${t} = □`, ans: S(N / t) }],
      final: { type: 'num', ans: S(x), unit: o[2] }, sentence: `${iga(n1)} 가지는 양은 {a}입니다.`, explain: '전체를 비의 합으로 나눈 값에 각자의 비를 곱해요.' };
  } });
  R({ id: 'discount', grades: [6], domain: 'rel', std: ['6수02-03'], gen() {
    const price = pk([8000, 12000, 15000, 20000, 25000, 40000]), pc = pk([10, 20, 25, 30, 40, 50]), disc = (price * pc) / 100, th = pk([['운동화', '👟'], ['가방', '🎒'], ['책상', '🪑']]);
    return { kind: 'ratio', text: `정가가 ${price}원인 ${eul(th[0])} ${pc}% 할인해서 판다고 합니다. 할인되는 금액은 얼마일까요?`,
      cards: [mcard(th[1], '정가', price, '원', 'blocks'), mcard('🏷️', '할인율', pc, '%', 'num')], eq: { tokens: [S(price), '×', S(pc), '÷', '100'] }, calc: { type: 'steps' },
      prep: [{ q: `${pc}%를 소수로 나타내면 □`, ans: dec(pc, 2) }, { q: `${price} × ${dec(pc, 2)} = □`, ans: S(disc) }], final: { type: 'num', ans: S(disc), unit: '원' }, sentence: '할인 금액은 {a}입니다.', explain: '할인 금액 = 정가 × 할인율' };
  } });

  /* =================== 도형과 측정 =================== */
  const US = [
    { g: [2, 3], u: ['m', 'cm'], base: 100, std: '2수03-13', add: (n, X, Y) => `${n}${'은는'[U.batchim(n) ? 0 : 1]} 길이가 ${X}인 색 테이프와 ${Y}인 색 테이프를 이어 붙였습니다. 이어 붙인 색 테이프의 전체 길이는 몇 m 몇 cm일까요?`, sub: (n, X, Y) => `길이가 ${X}인 끈에서 ${Y}를 잘라 사용했습니다. 남은 끈의 길이는 몇 m 몇 cm일까요?`, e: '🎞️', lab: ['첫째 테이프', '둘째 테이프', '처음 끈', '사용한 길이'] },
    { g: [3], u: ['cm', 'mm'], base: 10, std: '4수03-16', add: (n, X, Y) => `연필의 길이는 ${X}이고, 지우개의 길이는 ${Y}입니다. 둘을 한 줄로 이어 놓으면 몇 cm 몇 mm일까요?`, sub: (n, X, Y) => `길이가 ${X}인 철사 중 ${Y}를 구부려 사용했습니다. 남은 철사의 길이는 몇 cm 몇 mm일까요?`, e: '✏️', lab: ['연필', '지우개', '철사', '사용한 길이'] },
    { g: [3, 4], u: ['km', 'm'], base: 1000, std: '4수03-16', add: (n, X, Y) => `${n}${'은는'[U.batchim(n) ? 0 : 1]} 오전에 ${X}를 걷고 오후에 ${Y}를 걸었습니다. 모두 몇 km 몇 m를 걸었을까요?`, sub: (n, X, Y) => `집에서 공원까지의 거리는 ${X}입니다. ${Y}를 왔다면 남은 거리는 몇 km 몇 m일까요?`, e: '🚶', lab: ['오전에 걸은 거리', '오후에 걸은 거리', '집~공원 거리', '온 거리'] },
    { g: [3, 4], u: ['L', 'mL'], base: 1000, std: '4수03-19', add: (n, X, Y) => `물통에 물이 ${X} 들어 있습니다. 여기에 물 ${Y}를 더 부으면 물은 모두 몇 L 몇 mL가 될까요?`, sub: (n, X, Y) => `주스가 ${X} 있었습니다. 그 중 ${Y}를 마셨다면 남은 주스는 몇 L 몇 mL일까요?`, e: '💧', lab: ['처음 물', '더 부은 물', '처음 주스', '마신 양'] },
    { g: [3, 4], u: ['kg', 'g'], base: 1000, std: '4수03-23', add: (n, X, Y) => `감자가 ${X}, 고구마가 ${Y} 있습니다. 감자와 고구마의 무게는 모두 몇 kg 몇 g일까요?`, sub: (n, X, Y) => `쌀이 ${X} 있었습니다. 그 중 ${Y}를 밥을 짓는 데 사용했다면 남은 쌀은 몇 kg 몇 g일까요?`, e: '⚖️', lab: ['감자', '고구마', '처음 쌀', '사용한 쌀'] },
    { g: [3], u: ['시간', '분'], base: 60, std: '4수03-14', add: (n, X, Y) => `${n}${'은는'[U.batchim(n) ? 0 : 1]} 독서를 ${X} 동안, 운동을 ${Y} 동안 했습니다. 독서와 운동을 한 시간은 모두 몇 시간 몇 분일까요?`, sub: (n, X, Y) => `영화는 모두 ${X} 동안 상영합니다. 지금까지 ${Y}가 지났다면 영화가 끝날 때까지 남은 시간은 얼마일까요?`, e: '⏰', lab: ['독서한 시간', '운동한 시간', '영화 상영 시간', '지난 시간'] },
    { g: [4], u: ['분', '초'], base: 60, std: '4수03-14', add: (n, X, Y) => `${n}${'은는'[U.batchim(n) ? 0 : 1]} 첫째 구간을 ${X}에, 둘째 구간을 ${Y}에 달렸습니다. 두 구간을 달린 시간은 모두 몇 분 몇 초일까요?`, sub: (n, X, Y) => `작년 달리기 기록은 ${X}이고 올해 기록은 ${Y}입니다. 올해 몇 분 몇 초를 줄였을까요?`, e: '⏱️', lab: ['첫째 구간', '둘째 구간', '작년 기록', '올해 기록'] },
  ];
  function parts(M, m, u) { return `${M}${u[0]} ${m}${u[1]}`; }
  R({ id: 'unit-addsub', grades: [2, 3, 4], domain: 'geo', std: ['2수03-13', '4수03-14', '4수03-16', '4수03-19', '4수03-23'], gen(g) {
    const cands = US.filter((s) => s.g.includes(g)), s = cands.length ? pk(cands) : pk(US), [n1] = two(), add = ri(0, 1), base = s.base;
    const mr = () => ri(Math.max(1, Math.floor(base * 0.2)), base - 1);
    const Mx = s.u[0] === 'cm' ? ri(2, 19) : s.u[0] === '시간' ? ri(1, 5) : ri(1, 9);
    let x, y, ans;
    if (add) { x = [Mx, mr()]; y = [ri(1, Math.max(1, Mx)), mr()]; const tot = (x[0] + y[0]) * base + x[1] + y[1]; ans = [Math.floor(tot / base), tot % base]; }
    else { x = [Mx + ri(1, 4), mr()]; y = [ri(1, Mx), mr()]; if (ri(0, 1)) { y[1] = Math.min(base - 1, x[1] + ri(1, 9)); } let d = (x[0] * base + x[1]) - (y[0] * base + y[1]); if (d <= 0) { y = [1, 1]; d = x[0] * base + x[1] - base - 1; } ans = [Math.floor(d / base), d % base]; }
    const X = parts(x[0], x[1], s.u), Y = parts(y[0], y[1], s.u), op = add ? '+' : '−';
    const std = s.std;
    return { std: [std], kind: add ? 'unit_add' : 'unit_sub', text: (add ? s.add : s.sub)(n1, X, Y),
      cards: [mcard(s.e, add ? s.lab[0] : s.lab[2], X, '', 'bar'), mcard(s.e, add ? s.lab[1] : s.lab[3], Y, '', 'bar')],
      eq: { tokens: [X, op, Y], tray: [X, Y] }, calc: { type: 'units', op, units: s.u, base, a: x, b: y },
      final: { type: 'units', units: s.u, ans }, sentence: '답은 {a}입니다.', explain: `${s.u[1]}끼리 ${add ? '더해' : '빼서'} ${base}${s.u[1]}가 ${add ? '넘으면 1' + s.u[0] + '으로 받아올림' : '모자라면 1' + s.u[0] + '을 받아내림'}해요.` };
  } });
  const CONV = [
    { g: [2], M: '시간', m: '분', b: 60, std: '2수03-08', e: '⏰', w: '숙제를 하는 데 걸린 시간은' },
    { g: [2], M: '주일', m: '일', b: 7, std: '2수03-09', e: '📅', w: '여행을 다녀온 기간은' },
    { g: [2], M: '년', m: '개월', b: 12, std: '2수03-09', e: '🗓️', w: '공사를 한 기간은' },
    { g: [2, 3], M: 'm', m: 'cm', b: 100, std: '2수03-11', e: '📏', w: '리본의 길이는' },
    { g: [3], M: 'cm', m: 'mm', b: 10, std: '4수03-16', know: '4수03-15', e: '📏', w: '연필의 길이는' },
    { g: [3, 4], M: 'km', m: 'm', b: 1000, std: '4수03-16', know: '4수03-15', e: '🛣️', w: '집에서 학교까지의 거리는' },
    { g: [3, 4], M: 'L', m: 'mL', b: 1000, std: '4수03-18', know: '4수03-17', e: '🥤', w: '물통의 들이는' },
    { g: [3, 4], M: 'kg', m: 'g', b: 1000, std: '4수03-21', know: '4수03-20', e: '🍉', w: '수박의 무게는' },
    { g: [4], M: 't', m: 'kg', b: 1000, std: '4수03-22', e: '🚚', w: '트럭에 실은 짐의 무게는' },
    { g: [3, 4], M: '분', m: '초', b: 60, std: '4수03-13', e: '⏱️', w: '달리기 기록은' },
  ];
  R({ id: 'unit-conv', grades: [2, 3, 4], domain: 'geo', std: ['2수03-08', '2수03-09', '2수03-11', '4수03-13', '4수03-16', '4수03-18', '4수03-21', '4수03-22'], gen(g) {
    const c = pk(CONV.filter((x) => x.g.includes(g)) .concat(CONV.filter((x) => x.g.includes(g)))), a = c.b <= 12 ? ri(1, 4) : ri(1, 9), bb = c.b <= 12 ? ri(1, c.b - 1) : ri(Math.max(1, Math.floor(c.b * 0.1)), c.b - 1);
    return { std: [c.std].concat(c.know ? [c.know] : []), kind: 'unit_conv', text: `${c.w} ${a}${c.M} ${bb}${c.m}입니다. 이것은 모두 몇 ${c.m}일까요?`,
      cards: [mcard(c.e, c.M, a, c.M, 'num'), mcard(c.e, c.m, bb, c.m, 'num')], pre: [{ q: `1${c.M} = □${c.m}`, ans: S(c.b) }],
      eq: { tokens: [S(a), '×', S(c.b), '+', S(bb)], tray: [S(a), S(c.b), S(bb)] }, calc: { type: 'steps' }, prep: [{ q: `${a}${c.M} = ${a} × ${c.b} = □${c.m}`, ans: S(a * c.b) }],
      final: { type: 'num', ans: S(a * c.b + bb), unit: c.m }, sentence: '모두 {a}입니다.', explain: `1${c.M}=${c.b}${c.m} 이므로 ${a}${c.M}을 ${c.m}로 바꾼 뒤 ${bb}${c.m}를 더해요.` };
  } });
  R({ id: 'length-compare', grades: [2], domain: 'geo', std: ['2수03-06', '2수03-10', '2수03-12'], gen() {
    const a = ri(25, 95), b = ri(8, a - 6), th = pk([['끈', '🧵'], ['리본', '🎀'], ['막대', '📏']]), c = pk([['빨간', '파란'], ['노란', '초록']]);
    return { kind: 'sub_diff', text: `${c[0]} ${th[0]}의 길이는 ${a} cm이고, ${c[1]} ${th[0]}의 길이는 ${b} cm입니다. ${c[0]} ${th[0]}${'은는'[U.batchim(th[0]) ? 0 : 1]} ${c[1]} ${th[0]}보다 몇 cm 더 길까요?`,
      cards: [mcard(th[1], c[0] + ' ' + th[0], a, 'cm', 'bar'), mcard(th[1], c[1] + ' ' + th[0], b, 'cm', 'bar')], eq: { tokens: [S(a), '−', S(b)] }, calc: { type: 'col', op: '−', a: S(a), b: S(b) },
      final: { type: 'num', ans: S(a - b), unit: 'cm' }, sentence: '{a} 더 깁니다.', explain: '길이를 비교하면 큰 수 − 작은 수로 차를 구해요.' };
  } });
  R({ id: 'angle-sum', grades: [4], domain: 'geo', std: ['4수03-24', '4수03-25'], gen() {
    const t = ri(0, 2);
    if (t === 0) { const a = ri(3, 8) * 10, b = ri(3, 8) * 10;
      return { kind: 'angle', text: `삼각형의 세 각 중 두 각의 크기가 ${a}°와 ${b}°입니다. 나머지 한 각의 크기는 몇 도일까요?`, cards: [mcard('📐', '첫째 각', a, '°', 'num'), mcard('📐', '둘째 각', b, '°', 'num')], figure: { type: 'angles', kind: 'tri', vals: [a, b, '□'] },
        pre: [{ q: '삼각형의 세 각의 크기의 합은 □°', ans: '180' }], eq: { tokens: ['180', '−', S(a), '−', S(b)], tray: ['180', S(a), S(b)] }, calc: { type: 'steps' }, prep: [{ q: `180 − ${a} − ${b} = □`, ans: S(180 - a - b) }], final: { type: 'num', ans: S(180 - a - b), unit: '°' }, sentence: '나머지 한 각은 {a}입니다.', explain: '삼각형의 세 각의 합은 180°예요.' }; }
    if (t === 1) { const a = ri(6, 12) * 10, b = ri(6, 12) * 10, c = ri(6, 11) * 10; if (a + b + c >= 340) return P.templates({ tpl: 'angle-sum' })[0].gen(4);
      return { kind: 'angle', text: `사각형의 네 각 중 세 각의 크기가 ${a}°, ${b}°, ${c}°입니다. 나머지 한 각의 크기는 몇 도일까요?`, cards: [mcard('📐', '첫째 각', a, '°', 'num'), mcard('📐', '둘째 각', b, '°', 'num'), mcard('📐', '셋째 각', c, '°', 'num')], figure: { type: 'angles', kind: 'quad', vals: [a, b, c, '□'] },
        pre: [{ q: '사각형의 네 각의 크기의 합은 □°', ans: '360' }], eq: { tokens: ['360', '−', S(a), '−', S(b), '−', S(c)], tray: ['360', S(a), S(b), S(c)] }, calc: { type: 'steps' }, prep: [{ q: `${a} + ${b} + ${c} = □`, ans: S(a + b + c) }, { q: `360 − ${a + b + c} = □`, ans: S(360 - a - b - c) }], final: { type: 'num', ans: S(360 - a - b - c), unit: '°' }, sentence: '나머지 한 각은 {a}입니다.', explain: '사각형의 네 각의 합은 360°예요.' }; }
    const a = ri(2, 15) * 10;
    return { kind: 'angle', text: `한 직선 위에 두 각이 이어져 있습니다. 한 각이 ${a}°라면 다른 한 각은 몇 도일까요?`, cards: [mcard('📐', '한 각', a, '°', 'num')], figure: { type: 'angles', kind: 'line', vals: [a, '□'] },
      pre: [{ q: '한 직선이 이루는 각(평각)은 □°', ans: '180' }], eq: { tokens: ['180', '−', S(a)], tray: ['180', S(a), '90'] }, calc: { type: 'col', op: '−', a: '180', b: S(a) }, final: { type: 'num', ans: S(180 - a), unit: '°' }, sentence: '다른 각은 {a}입니다.', explain: '한 직선이 이루는 각은 180°예요.' };
  } });
  R({ id: 'circle-basic', grades: [4], domain: 'geo', std: ['4수03-06', '4수03-08'], gen() {
    const t = ri(0, 2);
    if (t === 0) { const d = ri(3, 20) * 2;
      return { kind: 'circle', text: `원의 지름이 ${d} cm입니다. 이 원의 반지름은 몇 cm일까요?`, cards: [mcard('⭕', '지름', d, 'cm', 'bar')], figure: { type: 'circle', d },
        pre: [{ q: '원의 지름은 반지름의 □배', ans: '2' }], eq: { tokens: [S(d), '÷', '2'], tray: [S(d), '2', '3'] }, calc: { type: 'steps' }, prep: [{ q: `${d} ÷ 2 = □`, ans: S(d / 2) }], final: { type: 'num', ans: S(d / 2), unit: 'cm' }, sentence: '반지름은 {a}입니다.', explain: '지름은 반지름의 2배예요.' }; }
    if (t === 1) { const r = ri(2, 9), n = ri(3, 7);
      return { kind: 'circle', text: `반지름이 ${r} cm인 원 ${n}개를 겹치지 않게 한 줄로 이어 붙였습니다. 이어 붙인 길이는 모두 몇 cm일까요?`, cards: [mcard('⭕', '원의 반지름', r, 'cm', 'bar'), mcard('🔢', '원의 개수', n, '개', 'icons')],
        pre: [{ q: `반지름이 ${r} cm인 원 1개의 지름은 □ cm`, ans: S(2 * r) }], eq: { tokens: [S(n), '×', S(r), '×', '2'], tray: [S(n), S(r), '2'] }, calc: { type: 'steps' }, prep: [{ q: `원 1개의 지름 × 개수: ${2 * r} × ${n} = □`, ans: S(2 * r * n) }], final: { type: 'num', ans: S(2 * r * n), unit: 'cm' }, sentence: '길이는 모두 {a}입니다.', explain: '원을 한 줄로 놓으면 지름이 이어져요.' }; }
    const a = ri(4, 15);
    return { kind: 'perimeter', text: `정삼각형의 한 변의 길이가 ${a} cm입니다. 세 변의 길이의 합은 몇 cm일까요?`, cards: [mcard('🔺', '한 변', a, 'cm', 'bar')], figure: { type: 'tri', b: a, h: a, label: 'eq' },
      pre: [{ q: '정삼각형은 길이가 같은 변이 □개', ans: '3' }], eq: { tokens: [S(a), '×', '3'], tray: [S(a), '3', '2'] }, calc: { type: 'col', op: '×', a: S(a), b: '3' }, final: { type: 'num', ans: S(a * 3), unit: 'cm' }, sentence: '세 변의 길이의 합은 {a}입니다.', explain: '정삼각형은 세 변의 길이가 모두 같아요.' };
  } });

  /* 5~6학년: 둘레·넓이·부피 */
  R({ id: 'perimeter', grades: [5], domain: 'geo', std: ['6수03-11'], gen() {
    if (ri(0, 1)) { const a = ri(6, 25), b = ri(3, a - 1);
      return { kind: 'perimeter', text: `가로가 ${a} cm, 세로가 ${b} cm인 직사각형 모양의 카드가 있습니다. 이 카드의 둘레는 몇 cm일까요?`, cards: [mcard('↔️', '가로', a, 'cm', 'bar'), mcard('↕️', '세로', b, 'cm', 'bar')], figure: { type: 'rect', w: a, h: b, unit: 'cm' },
        eq: { tokens: ['(', S(a), '+', S(b), ')', '×', '2'], tray: [S(a), S(b), '2'] }, calc: { type: 'steps' }, prep: [{ q: `가로 + 세로 = □ (둘레의 반)`, ans: S(a + b) }], final: { type: 'num', ans: S(2 * (a + b)), unit: 'cm' }, sentence: '둘레는 {a}입니다.', explain: '직사각형의 둘레 = (가로 + 세로) × 2' }; }
    const n = pk([[5, '정오각형'], [6, '정육각형'], [8, '정팔각형']]), a = ri(4, 15);
    return { kind: 'perimeter', text: `한 변이 ${a} cm인 ${n[1]}의 둘레는 몇 cm일까요?`, cards: [mcard('⬠', '한 변', a, 'cm', 'bar')],
      pre: [{ q: `${n[1]}의 변은 □개`, ans: S(n[0]) }], eq: { tokens: [S(a), '×', S(n[0])], tray: [S(a), S(n[0]), '2'] }, calc: { type: 'col', op: '×', a: S(a), b: S(n[0]) }, final: { type: 'num', ans: S(a * n[0]), unit: 'cm' }, sentence: '둘레는 {a}입니다.', explain: '정다각형은 모든 변의 길이가 같아요: (한 변) × (변의 수)' };
  } });
  R({ id: 'area-rect', grades: [5], domain: 'geo', std: ['6수03-13', '6수03-12'], gen() {
    const t = ri(0, 2);
    if (t === 2) { const a = ri(2, 9);
      return { kind: 'area', text: `넓이가 ${a} m²인 벽에 색칠을 하려고 합니다. ${a} m²는 몇 cm²일까요?`, cards: [mcard('🧱', '벽의 넓이', a, 'm²', 'num')], pre: [{ q: '1 m = 100 cm 이므로 1 m² = 100 × 100 = □ cm²', ans: '10000' }],
        eq: { tokens: [S(a), '×', '10000'], tray: [S(a), '10000', '100'] }, calc: { type: 'col', op: '×', a: S(a), b: '10000' }, final: { type: 'num', ans: S(a * 10000), unit: 'cm²' }, sentence: '{a}입니다.', explain: '1 m² = 10000 cm²' }; }
    const sq = t === 1, a = ri(4, 25), b = sq ? a : ri(3, 25);
    return { kind: 'area', text: sq ? `한 변이 ${a} cm인 정사각형 모양의 색종이가 있습니다. 이 색종이의 넓이는 몇 cm²일까요?` : `가로가 ${a} cm, 세로가 ${b} cm인 직사각형 모양의 도화지가 있습니다. 이 도화지의 넓이는 몇 cm²일까요?`,
      cards: sq ? [mcard('🟦', '한 변', a, 'cm', 'bar')] : [mcard('↔️', '가로', a, 'cm', 'bar'), mcard('↕️', '세로', b, 'cm', 'bar')], figure: { type: 'rect', w: a, h: b, unit: 'cm' },
      eq: { tokens: [S(a), '×', S(b)], tray: [S(a), S(b), '2'] }, calc: { type: 'col', op: '×', a: S(a), b: S(b) }, final: { type: 'num', ans: S(a * b), unit: 'cm²' }, sentence: '넓이는 {a}입니다.', explain: sq ? '정사각형의 넓이 = 한 변 × 한 변' : '직사각형의 넓이 = 가로 × 세로' };
  } });
  R({ id: 'area-shapes', grades: [5], domain: 'geo', std: ['6수03-14'], gen() {
    const t = ri(0, 3);
    if (t === 0) { const b = ri(4, 16), h = ri(3, 12); return { kind: 'area', text: `밑변이 ${b} cm, 높이가 ${h} cm인 평행사변형의 넓이는 몇 cm²일까요?`, cards: [mcard('▱', '밑변', b, 'cm', 'bar'), mcard('↕️', '높이', h, 'cm', 'bar')], figure: { type: 'para', b, h },
      eq: { tokens: [S(b), '×', S(h)], tray: [S(b), S(h), '2'] }, calc: { type: 'col', op: '×', a: S(b), b: S(h) }, final: { type: 'num', ans: S(b * h), unit: 'cm²' }, sentence: '넓이는 {a}입니다.', explain: '평행사변형을 잘라 붙이면 직사각형! 넓이 = 밑변 × 높이' }; }
    if (t === 1) { const b = ri(3, 10) * 2, h = ri(3, 12); return { kind: 'area', text: `밑변이 ${b} cm, 높이가 ${h} cm인 삼각형의 넓이는 몇 cm²일까요?`, cards: [mcard('🔺', '밑변', b, 'cm', 'bar'), mcard('↕️', '높이', h, 'cm', 'bar')], figure: { type: 'tri', b, h },
      pre: [{ q: '삼각형 2개를 붙이면 평행사변형이 돼요. 삼각형의 넓이는 평행사변형의 넓이의 1/□', ans: '2' }], eq: { tokens: [S(b), '×', S(h), '÷', '2'], tray: [S(b), S(h), '2'] }, calc: { type: 'steps' }, prep: [{ q: `${b} × ${h} = □`, ans: S(b * h) }], final: { type: 'num', ans: S((b * h) / 2), unit: 'cm²' }, sentence: '넓이는 {a}입니다.', explain: '삼각형의 넓이 = 밑변 × 높이 ÷ 2' }; }
    if (t === 2) { const a = ri(3, 9), b = a + ri(2, 8), h = ri(2, 8) * (((a + b) % 2) ? 2 : 1); return { kind: 'area', text: `윗변이 ${a} cm, 아랫변이 ${b} cm, 높이가 ${h} cm인 사다리꼴의 넓이는 몇 cm²일까요?`, cards: [mcard('⏢', '윗변', a, 'cm', 'bar'), mcard('⏢', '아랫변', b, 'cm', 'bar'), mcard('↕️', '높이', h, 'cm', 'bar')], figure: { type: 'trap', a, b, h },
      eq: { tokens: ['(', S(a), '+', S(b), ')', '×', S(h), '÷', '2'], tray: [S(a), S(b), S(h), '2'] }, calc: { type: 'steps' }, prep: [{ q: `(윗변 + 아랫변) = ${a} + ${b} = □`, ans: S(a + b) }, { q: `${a + b} × ${h} = □`, ans: S((a + b) * h) }], final: { type: 'num', ans: S(((a + b) * h) / 2), unit: 'cm²' }, sentence: '넓이는 {a}입니다.', explain: '사다리꼴의 넓이 = (윗변 + 아랫변) × 높이 ÷ 2' }; }
    const d1 = ri(3, 12) * 2, d2 = ri(3, 12); return { kind: 'area', text: `두 대각선의 길이가 ${d1} cm와 ${d2} cm인 마름모의 넓이는 몇 cm²일까요?`, cards: [mcard('◆', '한 대각선', d1, 'cm', 'bar'), mcard('◆', '다른 대각선', d2, 'cm', 'bar')], figure: { type: 'rhomb', d1, d2 },
      eq: { tokens: [S(d1), '×', S(d2), '÷', '2'], tray: [S(d1), S(d2), '2'] }, calc: { type: 'steps' }, prep: [{ q: `${d1} × ${d2} = □`, ans: S(d1 * d2) }], final: { type: 'num', ans: S((d1 * d2) / 2), unit: 'cm²' }, sentence: '넓이는 {a}입니다.', explain: '마름모의 넓이 = 한 대각선 × 다른 대각선 ÷ 2' };
  } });
  R({ id: 'circle-area', grades: [6], domain: 'geo', std: ['6수03-15', '6수03-16'], gen() {
    const t = ri(0, 2);
    if (t === 0) { const d = ri(4, 30), ans = numStr3(d, 3.14); return { kind: 'circle', text: `지름이 ${d} cm인 원 모양의 접시가 있습니다. 이 접시의 둘레(원주)는 몇 cm일까요? (원주율: 3.14)`, cards: [mcard('🍽️', '지름', d, 'cm', 'bar'), mcard('π', '원주율', '3.14', '', 'num')], figure: { type: 'circle', d },
      pre: [{ q: '원주 = 지름 × □ (원주율)', ans: '3.14' }], eq: { tokens: [S(d), '×', '3.14'] }, calc: { type: 'steps' }, prep: [{ q: `${d} × 3.14 = □`, ans: ans }], final: { type: 'num', ans, unit: 'cm' }, sentence: '원주는 {a}입니다.', explain: '원주 = 지름 × 원주율' }; }
    if (t === 1) { const r = ri(2, 15), ans = numStr3(r * 2, 3.14); return { kind: 'circle', text: `반지름이 ${r} cm인 원 모양의 시계가 있습니다. 시계의 둘레(원주)는 몇 cm일까요? (원주율: 3.14)`, cards: [mcard('🕒', '반지름', r, 'cm', 'bar'), mcard('π', '원주율', '3.14', '', 'num')], figure: { type: 'circle', r },
      pre: [{ q: `지름은 반지름의 2배: □ cm`, ans: S(2 * r) }], eq: { tokens: [S(r), '×', '2', '×', '3.14'] }, calc: { type: 'steps' }, prep: [{ q: `${2 * r} × 3.14 = □`, ans }], final: { type: 'num', ans, unit: 'cm' }, sentence: '원주는 {a}입니다.', explain: '원주 = 반지름 × 2 × 원주율' }; }
    const r = ri(2, 12), ans = F.toDec(val([S(r), '×', S(r), '×', '3.14']));
    return { kind: 'circle', text: `반지름이 ${r} cm인 원 모양의 피자가 있습니다. 이 피자의 넓이는 몇 cm²일까요? (원주율: 3.14)`, cards: [mcard('🍕', '반지름', r, 'cm', 'bar'), mcard('π', '원주율', '3.14', '', 'num')], figure: { type: 'circle', r },
      eq: { tokens: [S(r), '×', S(r), '×', '3.14'] }, calc: { type: 'steps' }, prep: [{ q: `${r} × ${r} = □`, ans: S(r * r) }, { q: `${r * r} × 3.14 = □`, ans }], final: { type: 'num', ans, unit: 'cm²' }, sentence: '넓이는 {a}입니다.', explain: '원의 넓이 = 반지름 × 반지름 × 원주율' };
  } });
  function numStr3(a, b) { return F.toDec(val([S(a), '×', S(b)])); }
  R({ id: 'volume-box', grades: [6], domain: 'geo', std: ['6수03-17', '6수03-18', '6수03-19', '6수03-09'], gen() {
    const t = ri(0, 3);
    if (t === 0) { const l = ri(3, 15), w = ri(2, 10), h = ri(2, 10); return { kind: 'volume', text: `가로 ${l} cm, 세로 ${w} cm, 높이 ${h} cm인 직육면체 모양의 상자가 있습니다. 이 상자의 부피는 몇 cm³일까요?`, cards: [mcard('↔️', '가로', l, 'cm', 'bar'), mcard('↕️', '세로', w, 'cm', 'bar'), mcard('⬆️', '높이', h, 'cm', 'bar')], figure: { type: 'box', l, w, h },
      eq: { tokens: [S(l), '×', S(w), '×', S(h)] }, calc: { type: 'steps' }, prep: [{ q: `밑면의 넓이 ${l} × ${w} = □`, ans: S(l * w) }, { q: `${l * w} × ${h} = □`, ans: S(l * w * h) }], final: { type: 'num', ans: S(l * w * h), unit: 'cm³' }, sentence: '부피는 {a}입니다.', explain: '직육면체의 부피 = 가로 × 세로 × 높이' }; }
    if (t === 1) { const l = ri(3, 12), w = ri(2, 9), h = ri(2, 9), A = l * w + l * h + w * h; return { kind: 'volume', text: `가로 ${l} cm, 세로 ${w} cm, 높이 ${h} cm인 직육면체의 겉넓이는 몇 cm²일까요?`, cards: [mcard('↔️', '가로', l, 'cm', 'bar'), mcard('↕️', '세로', w, 'cm', 'bar'), mcard('⬆️', '높이', h, 'cm', 'bar')], figure: { type: 'box', l, w, h },
      pre: [{ q: '직육면체는 서로 합동인 면이 □쌍(짝)이에요', ans: '3' }], eq: { tokens: ['(', S(l), '×', S(w), '+', S(l), '×', S(h), '+', S(w), '×', S(h), ')', '×', '2'], tray: [S(l), S(w), S(h), '2'] }, calc: { type: 'steps' },
      prep: [{ q: `세 면의 넓이의 합: ${l}×${w} + ${l}×${h} + ${w}×${h} = □`, ans: S(A) }], final: { type: 'num', ans: S(2 * A), unit: 'cm²' }, sentence: '겉넓이는 {a}입니다.', explain: '겉넓이 = (세 면의 넓이의 합) × 2' }; }
    if (t === 2) { const a = ri(2, 9); return { kind: 'volume', text: `한 모서리가 ${a} m인 정육면체 모양의 상자가 있습니다. 이 상자의 부피는 몇 m³일까요?`, cards: [mcard('🧊', '한 모서리', a, 'm', 'bar')], figure: { type: 'box', l: a, w: a, h: a },
      eq: { tokens: [S(a), '×', S(a), '×', S(a)], tray: [S(a), '6', '3'] }, calc: { type: 'steps' }, prep: [{ q: `${a} × ${a} = □`, ans: S(a * a) }], final: { type: 'num', ans: S(a ** 3), unit: 'm³' }, sentence: '부피는 {a}입니다.', explain: '정육면체의 부피 = 한 모서리 × 한 모서리 × 한 모서리' }; }
    const f = [ri(2, 5), ri(2, 5), ri(1, 4)].sort((x, y) => y - x);
    return { kind: 'volume', text: `쌓기나무로 계단 모양을 만들었습니다. 1층에 ${f[0]}개, 2층에 ${f[1]}개, 3층에 ${f[2]}개를 쌓았습니다. 사용한 쌓기나무는 모두 몇 개일까요?`, cards: [mcard('🧊', '1층', f[0], '개', 'icons'), mcard('🧊', '2층', f[1], '개', 'icons'), mcard('🧊', '3층', f[2], '개', 'icons')],
      eq: { tokens: [S(f[0]), '+', S(f[1]), '+', S(f[2])] }, calc: { type: 'steps' }, prep: [{ q: `${f[0]} + ${f[1]} = □`, ans: S(f[0] + f[1]) }], final: { type: 'num', ans: S(f[0] + f[1] + f[2]), unit: '개' }, sentence: '쌓기나무는 모두 {a}입니다.', explain: '층별로 센 쌓기나무의 개수를 모두 더해요.' };
  } });
  R({ id: 'shape-prop', grades: [6], domain: 'geo', std: ['6수03-01', '6수03-03', '6수03-05'], gen() {
    const t = ri(0, 2);
    if (t === 0) { const a = ri(4, 12), b = ri(4, 12), c = ri(4, 12); return { kind: 'shape', text: `삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㅂ은 서로 합동입니다. 삼각형 ㄱㄴㄷ의 세 변의 길이는 ${a} cm, ${b} cm, ${c} cm입니다. 삼각형 ㄹㅁㅂ의 세 변의 길이의 합은 몇 cm일까요?`, cards: [mcard('🔺', '변 ㄱㄴ', a, 'cm', 'bar'), mcard('🔺', '변 ㄴㄷ', b, 'cm', 'bar'), mcard('🔺', '변 ㄷㄱ', c, 'cm', 'bar')],
      pre: [{ q: '합동인 도형은 대응변의 길이가 (같다=1 / 다르다=0)', ans: '1' }], eq: { tokens: [S(a), '+', S(b), '+', S(c)] }, calc: { type: 'steps' }, prep: [{ q: `${a} + ${b} + ${c} = □`, ans: S(a + b + c) }], final: { type: 'num', ans: S(a + b + c), unit: 'cm' }, sentence: '세 변의 길이의 합은 {a}입니다.', explain: '합동인 도형은 대응변의 길이가 같아서 둘레도 같아요.' }; }
    if (t === 1) { const l = ri(3, 12), w = ri(2, 9), h = ri(2, 9); return { kind: 'shape', text: `직육면체 모양 상자의 가로가 ${l} cm, 세로가 ${w} cm, 높이가 ${h} cm입니다. 이 상자의 모든 모서리의 길이의 합은 몇 cm일까요?`, cards: [mcard('↔️', '가로', l, 'cm', 'bar'), mcard('↕️', '세로', w, 'cm', 'bar'), mcard('⬆️', '높이', h, 'cm', 'bar')], figure: { type: 'box', l, w, h },
      pre: [{ q: '직육면체에서 길이가 같은 모서리는 □개씩 3묶음이에요', ans: '4' }], eq: { tokens: ['(', S(l), '+', S(w), '+', S(h), ')', '×', '4'], tray: [S(l), S(w), S(h), '4'] }, calc: { type: 'steps' }, prep: [{ q: `${l} + ${w} + ${h} = □`, ans: S(l + w + h) }], final: { type: 'num', ans: S(4 * (l + w + h)), unit: 'cm' }, sentence: '모서리의 길이의 합은 {a}입니다.', explain: '모서리는 12개 → 가로·세로·높이가 각각 4개씩!' }; }
    const n = ri(3, 8), kind = ri(0, 1);
    return { kind: 'shape', text: `${n}각기둥의 ${kind ? '모서리' : '꼭짓점'}는 모두 몇 개일까요?`, cards: [mcard('🔷', '밑면의 변의 수', n, '개', 'icons')], pre: [{ q: kind ? `각기둥의 모서리는 (위 밑면 ${n}개) + (아래 밑면 ${n}개) + (옆 모서리 ${n}개). 같은 수의 묶음이 □개` : '각기둥은 밑면이 위·아래 □개 있어요', ans: kind ? '3' : '2' }],
      eq: { tokens: [kind ? '3' : '2', '×', S(n)], tray: [S(n), '2', '3'] }, calc: { type: 'col', op: '×', a: kind ? '3' : '2', b: S(n) }, final: { type: 'num', ans: S((kind ? 3 : 2) * n), unit: '개' }, sentence: '모두 {a}입니다.', explain: kind ? 'n각기둥의 모서리는 3×n개' : 'n각기둥의 꼭짓점은 2×n개' };
  } });

  /* =================== 자료와 가능성 =================== */
  R({ id: 'table-count', grades: [1, 2], domain: 'data', std: ['2수04-01', '2수04-02', '2수04-03'], gen(g) {
    const sets = [[['딸기', '🍓'], ['바나나', '🍌'], ['포도', '🍇'], ['사과', '🍎']], [['강아지', '🐶'], ['고양이', '🐱'], ['토끼', '🐰'], ['햄스터', '🐹']], [['축구', '⚽'], ['피구', '🏐'], ['줄넘기', '🪢'], ['술래잡기', '🏃']]], baseSet = pk(sets), set = U.sample(baseSet, 3);
    const top = g === 1 ? 9 : 15; let v; do { v = U.sample(U.range(2, top), 3); } while (new Set(v).size < 3);
    const sum = ri(0, 1), mx = Math.max(...v), mn = Math.min(...v), imx = v.indexOf(mx), imn = v.indexOf(mn), tot = v[0] + v[1] + v[2], what = baseSet === sets[2] ? '좋아하는 놀이' : '좋아하는 것';
    const desc = set.map((s, i) => `${s[0]} ${v[i]}명`).join(', ');
    return { kind: sum ? 'data_sum' : 'data_diff', text: `우리 반 친구들이 ${what}을 조사하여 표로 나타냈습니다. ${desc}입니다. ${sum ? '조사에 참여한 학생은 모두 몇 명일까요?' : `가장 많은 학생이 좋아하는 것과 가장 적은 학생이 좋아하는 것의 차는 몇 명일까요?`}`,
      cards: set.map((s, i) => mcard(s[1], s[0], v[i], '명', 'icons')), figure: { type: 'table', head: ['종류', '학생 수(명)'], rows: set.map((s, i) => [s[1] + ' ' + s[0], v[i]]) },
      eq: sum ? { tokens: [S(v[0]), '+', S(v[1]), '+', S(v[2])] } : { tokens: [S(mx), '−', S(mn)], tray: v.map(S) }, calc: sum ? { type: 'steps' } : { type: 'col', op: '−', a: S(mx), b: S(mn) },
      prep: sum ? [{ q: `${v[0]} + ${v[1]} = □`, ans: S(v[0] + v[1]) }] : undefined, final: { type: 'num', ans: S(sum ? tot : mx - mn), unit: '명' }, sentence: '답은 {a}입니다.', explain: sum ? '표의 수를 모두 더해요.' : '가장 큰 수에서 가장 작은 수를 빼요.' };
  } });
  R({ id: 'graph-read', grades: [3, 4], domain: 'data', std: ['4수04-01', '4수04-02', '4수04-03'], gen(g) {
    const t = ri(0, 2);
    if (t === 0 && g === 3) { const x = ri(2, 6), y = ri(1, 9), vil = pk(['가', '나', '다']);
      return { kind: 'graph', text: `그림그래프에서 ${vil} 마을의 학생 수를 ◎ ${x}개, ○ ${y}개로 나타냈습니다. ◎는 10명, ○는 1명을 나타냅니다. ${vil} 마을의 학생은 모두 몇 명일까요?`, cards: [mcard('◎', '◎의 개수', x, '개', 'num'), mcard('○', '○의 개수', y, '개', 'num')], figure: { type: 'picto', rows: [{ label: vil + ' 마을', big: x, small: y }] },
        pre: [{ q: '◎ 1개는 □명', ans: '10' }], eq: { tokens: [S(x), '×', '10', '+', S(y)], tray: [S(x), S(y), '10', '1'] }, calc: { type: 'steps' }, prep: [{ q: `${x} × 10 = □`, ans: S(x * 10) }], final: { type: 'num', ans: S(x * 10 + y), unit: '명' }, sentence: '학생은 모두 {a}입니다.', explain: '큰 그림은 10명, 작은 그림은 1명으로 세요.' }; }
    if (t <= 1) { const mon = pk([['3월', '4월', '5월', '6월'], ['1반', '2반', '3반', '4반']]), unit = mon[0].endsWith('월') ? '권' : '개', v = U.sample(U.range(4, 20).map((i) => i * 5), 4), mx = Math.max(...v), mn = Math.min(...v), topic = mon[0].endsWith('월') ? '월별 도서관 대출 책의 수' : '반별 모은 우유갑의 수';
      return { kind: 'data_diff', text: `${topic}를 막대그래프로 나타냈습니다. ${mon.map((m, i) => m + ' ' + v[i] + unit).join(', ')}입니다. 가장 많은 것과 가장 적은 것의 차는 몇 ${unit}일까요?`, cards: mon.map((m, i) => mcard('📊', m, v[i], unit, 'bar')), figure: { type: 'bars', labels: mon, values: v, unit },
        eq: { tokens: [S(mx), '−', S(mn)], tray: v.map(S) }, calc: { type: 'col', op: '−', a: S(mx), b: S(mn) }, final: { type: 'num', ans: S(mx - mn), unit }, sentence: '차는 {a}입니다.', explain: '막대의 길이가 가장 긴 것과 가장 짧은 것의 차를 구해요.' }; }
    const hrs = ['오전 9시', '오전 11시', '오후 1시', '오후 3시'], v = [ri(8, 14), ri(14, 20)]; const w = [v[0], v[1], v[1] + ri(2, 6), v[1] + ri(0, 3)];
    return { kind: 'data_diff', text: `하루의 기온을 꺾은선그래프로 나타냈습니다. 오전 9시는 ${w[0]}°C, 오전 11시는 ${w[1]}°C, 오후 1시는 ${w[2]}°C, 오후 3시는 ${w[3]}°C였습니다. 오전 9시부터 오후 1시까지 기온은 몇 °C 올랐을까요?`, cards: [mcard('🌡️', '오전 9시', w[0], '°C', 'num'), mcard('🌡️', '오후 1시', w[2], '°C', 'num')], figure: { type: 'line', labels: hrs, values: w, unit: '°C' },
      eq: { tokens: [S(w[2]), '−', S(w[0])], tray: w.map(S) }, calc: { type: 'col', op: '−', a: S(w[2]), b: S(w[0]) }, final: { type: 'num', ans: S(w[2] - w[0]), unit: '°C' }, sentence: '{a} 올랐습니다.', explain: '꺾은선이 오른 만큼(변화량) = 나중 값 − 처음 값' };
  } });
  R({ id: 'average', grades: [5], domain: 'data', std: ['6수04-01'], gen() {
    const n = pk([4, 5]), m = ri(20, 80), dv = U.range(1, n - 1).map(() => ri(-9, 9)); dv.push(-dv.reduce((a, b) => a + b, 0)); const vs = U.shuffle(dv).map((d) => m + d);
    if (vs.some((x) => x <= 0)) return P.templates({ tpl: 'average' })[0].gen(5);
    const th = pk([['윗몸일으키기 횟수', '🏋️', '회'], ['읽은 책의 쪽수', '📖', '쪽'], ['모은 칭찬 스티커 수', '🌟', '개']]);
    return { kind: 'avg', text: `모둠 친구 ${n}명의 ${th[0]}는 ${vs.join(', ')}${th[2]}입니다. ${th[0]}의 평균은 몇 ${th[2]}일까요?`, cards: vs.map((v, i) => mcard(th[1], `${i + 1}번째 친구`, v, th[2], 'bar')).concat([mcard('👥', '친구 수', n, '명', 'icons')]),
      eq: { tokens: ['('].concat(vs.flatMap((v, i) => (i ? ['+', S(v)] : [S(v)])), [')', '÷', S(n)]) }, calc: { type: 'steps' }, prep: [{ q: `자료의 합: ${vs.join(' + ')} = □`, ans: S(vs.reduce((a, b) => a + b, 0)) }],
      final: { type: 'num', ans: S(m), unit: th[2] }, sentence: '평균은 {a}입니다.', explain: '평균 = (자료의 합) ÷ (자료의 수). 들쭉날쭉한 값을 고르게 한 값이에요.' };
  } });
  R({ id: 'chance', grades: [5, 6], domain: 'data', std: ['6수04-04', '6수04-05', '6수04-06'], gen() {
    const t = ri(0, 2);
    if (t === 0) { const r = ri(1, 7), b = ri(1, 7), tt = r + b, f = F.make(r, tt);
      return { kind: 'chance', text: `상자 안에 빨간 공 ${r}개와 파란 공 ${b}개가 들어 있습니다. 상자에서 공 한 개를 꺼낼 때, 빨간 공이 나올 가능성을 분수로 나타내면 얼마일까요? (기약분수)`, cards: [mcard('🔴', '빨간 공', r, '개', 'icons'), mcard('🔵', '파란 공', b, '개', 'icons')],
        eq: { tokens: [S(r), '÷', '(', S(r), '+', S(b), ')'], tray: [S(r), S(b)] }, calc: { type: 'steps' }, prep: [{ q: `전체 공의 수 ${r} + ${b} = □`, ans: S(tt) }], final: { type: 'frac', ans: F.toStr(f), reduce: true }, sentence: '가능성은 {a}입니다.', explain: '가능성 = (일어나는 경우의 수) ÷ (모든 경우의 수)' }; }
    if (t === 1) { const ev = pk([['짝수', 3, '짝수의 눈'], ['3 이하', 3, '3 이하의 눈'], ['5 이상', 2, '5 이상의 눈'], ['6의 약수', 4, '6의 약수인 눈'], ['1', 1, '1의 눈']]), f = F.make(ev[1], 6);
      return { kind: 'chance', text: `주사위 한 개를 한 번 던질 때, ${ev[2]}이 나올 가능성을 분수로 나타내면 얼마일까요? (기약분수)`, cards: [mcard('🎲', '모든 경우', 6, '가지', 'icons'), mcard('✅', '조건에 맞는 경우', ev[1], '가지', 'icons')],
        eq: { tokens: [S(ev[1]), '÷', '6'], tray: [S(ev[1]), '6', '3'] }, calc: { type: 'steps' }, prep: [{ q: `주사위의 눈은 1부터 6까지 모두 □가지`, ans: '6' }], final: { type: 'frac', ans: F.toStr(f), reduce: true }, sentence: '가능성은 {a}입니다.', explain: '주사위 눈 6가지 중에서 조건에 맞는 경우의 수를 세요.' }; }
    const n = pk([20, 40]), big = pk([100, 200]); let h; do { h = n === 20 ? ri(8, 12) : ri(17, 23); } while ((h * big) % n !== 0);
    const ans = (h * big) / n;
    return { kind: 'chance', text: `동전을 ${n}번 던졌더니 그림 면이 ${h}번 나왔습니다. 같은 동전을 ${big}번 던지면 그림 면은 약 몇 번 나올 것으로 예상할 수 있을까요?`, cards: [mcard('🪙', '던진 횟수', n, '번', 'icons'), mcard('✅', '그림 면이 나온 횟수', h, '번', 'icons'), mcard('🔁', '다시 던질 횟수', big, '번', 'blocks')],
      eq: { tokens: [S(h), '÷', S(n), '×', S(big)] }, calc: { type: 'steps' }, prep: [{ q: `${h} ÷ ${n} = □ (그림 면이 나온 비율, 소수)`, ans: F.toDec(F.make(h, n)) }], final: { type: 'num', ans: S(ans), unit: '번' }, sentence: '약 {a} 나올 것으로 예상해요.', explain: '자료로 가능성을 예상할 수 있어요: 비율 × 전체 횟수' };
  } });
  R({ id: 'pie-graph', grades: [6], domain: 'data', std: ['6수04-02', '6수04-03'], gen() {
    if (ri(0, 1)) { const a = ri(2, 4) * 10, b = ri(1, 3) * 10, c = ri(1, 2) * 10, rest = 100 - a - b - c; if (rest <= 0) return P.templates({ tpl: 'pie-graph' })[0].gen(6);
      return { kind: 'graph', text: `우리 학교 학생들이 좋아하는 취미를 조사하여 원그래프로 나타냈습니다. 독서 ${a}%, 운동 ${b}%, 게임 ${c}%입니다. 나머지 기타가 차지하는 비율은 몇 %일까요?`, cards: [mcard('📖', '독서', a, '%', 'num'), mcard('⚽', '운동', b, '%', 'num'), mcard('🎮', '게임', c, '%', 'num')], figure: { type: 'pie', items: [{ label: '독서', pct: a }, { label: '운동', pct: b }, { label: '게임', pct: c }, { label: '기타', pct: rest, q: 1 }] },
        pre: [{ q: '원그래프에서 전체는 □%', ans: '100' }], eq: { tokens: ['100', '−', S(a), '−', S(b), '−', S(c)], tray: ['100', S(a), S(b), S(c)] }, calc: { type: 'steps' }, prep: [{ q: `${a} + ${b} + ${c} = □`, ans: S(a + b + c) }], final: { type: 'num', ans: S(rest), unit: '%' }, sentence: '기타는 {a}입니다.', explain: '각 항목의 비율을 모두 더하면 100%예요.' }; }
    const N = pk([200, 300, 400, 500, 250]), p = pk([10, 20, 25, 30, 40]), x = (N * p) / 100;
    return { kind: 'graph', text: `전체 ${N}명의 학생이 좋아하는 간식을 조사하여 띠그래프로 나타냈습니다. 떡볶이를 좋아하는 학생이 ${p}%라면, 떡볶이를 좋아하는 학생은 몇 명일까요?`, cards: [mcard('👥', '전체 학생', N, '명', 'blocks'), mcard('🌶️', '떡볶이 비율', p, '%', 'num')], figure: { type: 'band', items: [{ label: '떡볶이', pct: p }, { label: '기타', pct: 100 - p }] },
      eq: { tokens: [S(N), '×', S(p), '÷', '100'] }, calc: { type: 'steps' }, prep: [{ q: `${p}%를 분수로 나타내면 □/100 → 분자는`, ans: S(p) }, { q: `${N} × ${p} ÷ 100 = □`, ans: S(x) }], final: { type: 'num', ans: S(x), unit: '명' }, sentence: '떡볶이를 좋아하는 학생은 {a}입니다.', explain: '(전체) × (백분율) ÷ 100 으로 구해요.' };
  } });

  /* =================== 보강: 시계 · 소수 크기 · 전개도 · 대칭 =================== */
  R({ id: 'clock-read', grades: [2], domain: 'geo', std: ['2수03-07', '2수03-08'], gen() {
    const h = ri(1, 12), m = pk([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]), [n1] = two();
    return { kind: 'unit_conv', text: `${eun(n1)} 시계를 보았습니다. 짧은바늘은 ${h}와 ${h === 12 ? 1 : h + 1} 사이에 있고, 긴바늘은 ${m / 5}를 가리키고 있습니다. 지금은 몇 시 몇 분일까요?`,
      cards: [mcard('🕐', '짧은바늘(시)', h, '시', 'num'), mcard('🕐', '긴바늘(분)', m / 5, '', 'num')], figure: { type: 'clock', h, m },
      eq: null, pre: [], calc: { type: 'steps' }, prep: [{ q: `긴바늘이 ${m / 5}를 가리키면 ${m / 5} × 5 = □분`, ans: S(m) }],
      final: { type: 'units', units: ['시', '분'], ans: [h, m] }, sentence: '지금은 {a}입니다.', explain: '짧은바늘은 시, 긴바늘은 분을 나타내요. 긴바늘이 숫자 1칸 가면 5분!' };
  } });
  R({ id: 'dec-compare', grades: [4], domain: 'num', std: ['4수01-14', '4수01-13'], gen() {
    const a = ri(11, 99) / 100, b = ri(1, 9) / 10, A = String(a), B = String(b); if (a === b) return P.templates({ tpl: 'dec-compare' })[0].gen(4);
    const big = Math.max(a, b), th = pk([['리본', '🎀', 'm'], ['끈', '🧵', 'm'], ['물', '💧', 'L']]), bigS = String(big);
    return { kind: 'sub_diff', text: `${th[0]}${'이가'[U.batchim(th[0]) ? 0 : 1]} 가 ${A} ${th[2]}, 나 ${B} ${th[2]} 있습니다. 더 많은(긴) 쪽은 몇 ${th[2]}일까요?`,
      cards: [mcard(th[1], '가', A, th[2], 'bar'), mcard(th[1], '나', B, th[2], 'bar')], eq: null, calc: { type: 'steps' },
      prep: [{ q: `${B}를 소수 둘째 자리까지 맞추어 쓰면 □ (예: 0.5 → 0.50)`, ans: (b).toFixed(2) }, { q: `${A}와 ${(b).toFixed(2)} 중 더 큰 수는? □`, ans: bigS }],
      final: { type: 'num', ans: bigS, unit: th[2] }, sentence: '더 많은 쪽은 {a}입니다.', explain: '소수의 크기는 자릿수를 맞추어 높은 자리부터 비교해요.' };
  } });
  R({ id: 'solid-net', grades: [6], domain: 'geo', std: ['6수03-04', '6수03-06', '6수03-08'], gen() {
    const t = ri(0, 2);
    if (t === 0) { const a = ri(2, 12); return { kind: 'shape', text: `한 모서리가 ${a} cm인 정육면체의 전개도를 그렸습니다. 전개도를 이루는 정사각형 6개의 넓이의 합은 몇 cm²일까요?`, cards: [mcard('🧊', '한 모서리', a, 'cm', 'bar'), mcard('🟦', '정사각형 면의 수', 6, '개', 'icons')],
      eq: { tokens: ['6', '×', S(a), '×', S(a)], tray: ['6', S(a), '4'] }, calc: { type: 'steps' }, prep: [{ q: `정사각형 한 면의 넓이 ${a} × ${a} = □`, ans: S(a * a) }], final: { type: 'num', ans: S(6 * a * a), unit: 'cm²' }, sentence: '넓이의 합은 {a}입니다.', explain: '전개도의 넓이 = 겉넓이 = 한 면의 넓이 × 6' }; }
    if (t === 1) { const n = ri(3, 8); return { kind: 'shape', text: `${n}각기둥의 전개도에는 밑면 2개와 옆면이 그려집니다. 전개도에 그려진 면은 모두 몇 개일까요?`, cards: [mcard('🔷', '밑면의 변의 수', n, '개', 'icons')],
      pre: [{ q: `${n}각기둥의 옆면은 □개 (밑면의 변의 수와 같아요)`, ans: S(n) }], eq: { tokens: [S(n), '+', '2'], tray: [S(n), '2', '3'] }, calc: { type: 'col', op: '+', a: S(n), b: '2' }, final: { type: 'num', ans: S(n + 2), unit: '개' }, sentence: '전개도의 면은 모두 {a}입니다.', explain: 'n각기둥은 옆면 n개 + 밑면 2개 = (n+2)개의 면이에요.' }; }
    const d = ri(2, 10) * 2, ans = F.toDec(val([S(d), '×', '3.14']));
    return { kind: 'circle', text: `밑면의 지름이 ${d} cm인 원기둥의 전개도를 그렸습니다. 옆면(직사각형)의 가로는 밑면의 둘레와 같습니다. 옆면의 가로는 몇 cm일까요? (원주율: 3.14)`, cards: [mcard('🥫', '밑면의 지름', d, 'cm', 'bar'), mcard('π', '원주율', '3.14', '', 'num')],
      eq: { tokens: [S(d), '×', '3.14'] }, calc: { type: 'steps' }, prep: [{ q: `${d} × 3.14 = □`, ans }], final: { type: 'num', ans, unit: 'cm' }, sentence: '옆면의 가로는 {a}입니다.', explain: '원기둥 전개도의 옆면 가로 = 밑면의 원주' };
  } });
  R({ id: 'symmetry', grades: [6], domain: 'geo', std: ['6수03-02'], gen() {
    const a = ri(2, 12);
    return { kind: 'shape', text: `선대칭도형에서 점 ㄱ과 대응점 ㄱ'은 대칭축에서 같은 거리에 있습니다. 점 ㄱ에서 대칭축까지의 거리가 ${a} cm일 때, 점 ㄱ과 대응점 ㄱ' 사이의 거리는 몇 cm일까요?`,
      cards: [mcard('🦋', '점 ㄱ에서 대칭축까지', a, 'cm', 'bar')], figure: { type: 'sym', a }, pre: [{ q: '대응점은 대칭축에서 같은 거리 → 축 양쪽의 거리를 더해요. 양쪽의 거리는 각각 □ cm', ans: S(a) }],
      eq: { tokens: [S(a), '+', S(a)], tray: [S(a), '2'] }, calc: { type: 'col', op: '+', a: S(a), b: S(a) }, final: { type: 'num', ans: S(2 * a), unit: 'cm' }, sentence: '두 점 사이의 거리는 {a}입니다.', explain: '선대칭도형에서 대응점을 이은 선분은 대칭축과 수직이고, 축에서 같은 거리에 있어요.' };
  } });
})();

