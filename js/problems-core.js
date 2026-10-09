/* 문제 생성 엔진 — 템플릿 등록, 마무리(finish), 정답 검사 */
window.MD = window.MD || {};
(function () {
  const U = MD.util, F = U.frac;
  const pk = U.pick, ri = U.int;

  /* 세 수 / 단위 등 추가 분류카드 */
  Object.assign(MD.std.KINDS, {
    seq: { label: '차례로 계산 (세 수)', sym: '＋－', fam: 'add', color: '#9c36b5', desc: '앞에서부터 차례로 두 수씩 계산해요.', keywords: ['내리고', '타고', '타고 있', '더 사', '쓰고', '먹고', '그리고'] },
  });

  /* ---------- 소재 풀 ---------- */
  const NAMES = ['경민', '하늘', '지우', '서준', '민서', '도윤', '서연', '하준', '수아', '예준', '지민', '유나', '시우', '채원', '건우', '다은', '현우', '소율', '이안', '나은'];
  const OBJ = [
    { n: '사과', e: '🍎', c: '개', food: 1 }, { n: '귤', e: '🍊', c: '개', food: 1 }, { n: '딸기', e: '🍓', c: '개', food: 1 },
    { n: '바나나', e: '🍌', c: '개', food: 1 }, { n: '쿠키', e: '🍪', c: '개', food: 1 }, { n: '사탕', e: '🍬', c: '개', food: 1 },
    { n: '도넛', e: '🍩', c: '개', food: 1 }, { n: '초콜릿', e: '🍫', c: '개', food: 1 }, { n: '달걀', e: '🥚', c: '개', food: 1 },
    { n: '풍선', e: '🎈', c: '개' }, { n: '구슬', e: '🔮', c: '개' }, { n: '공', e: '⚽', c: '개' }, { n: '별', e: '⭐', c: '개' },
    { n: '블록', e: '🧱', c: '개' }, { n: '연필', e: '✏️', c: '자루' }, { n: '책', e: '📚', c: '권' }, { n: '꽃', e: '🌸', c: '송이' },
    { n: '색종이', e: '🟦', c: '장' }, { n: '스티커', e: '🏷️', c: '장' }, { n: '물고기', e: '🐟', c: '마리' }, { n: '토끼', e: '🐰', c: '마리' },
    { n: '오리', e: '🦆', c: '마리' }, { n: '나비', e: '🦋', c: '마리' }, { n: '병아리', e: '🐥', c: '마리' }, { n: '강아지', e: '🐶', c: '마리' },
    { n: '자동차', e: '🚗', c: '대' },
  ];
  const BOX = [{ n: '접시', e: '🍽️' }, { n: '봉지', e: '🛍️' }, { n: '상자', e: '📦' }, { n: '바구니', e: '🧺' }];
  const PAIRS = [
    { place: '동물원', A: '청둥오리', B: '흰뺨오리', tot: '오리', e: '🦆', c: '마리' },
    { place: '공원', A: '참새', B: '비둘기', tot: '새', e: '🐦', c: '마리' },
    { place: '연못', A: '금붕어', B: '잉어', tot: '물고기', e: '🐟', c: '마리' },
    { place: '주머니', A: '빨간 구슬', B: '파란 구슬', tot: '구슬', e: '🔮', c: '개' },
    { place: '바구니', A: '사과', B: '배', tot: '과일', e: '🍎', c: '개' },
    { place: '우리 반', A: '남학생', B: '여학생', tot: '학생', e: '🧒', c: '명' },
    { place: '책꽂이', A: '동화책', B: '과학책', tot: '책', e: '📚', c: '권' },
    { place: '꽃밭', A: '장미', B: '튤립', tot: '꽃', e: '🌷', c: '송이' },
  ];
  const names2 = () => { const a = U.sample(NAMES, 2); return a; };
  const qty = (o, n) => `${n}${o.c}`;
  const J = U.josa;

  /* ---------- 카드·오답 카드 ---------- */
  function card(o, v, extra) {
    return Object.assign({ e: o.e, label: o.n, value: String(v), unit: o.c, vis: +v <= 30 ? 'icons' : 'blocks' }, extra || {});
  }
  function mcard(e, label, v, unit, vis) {
    return { e, label, value: String(v), unit: unit || '', vis: vis || 'bar' };
  }
  function tweakVal(v) {
    v = String(v);
    let m;
    if (/^\d+$/.test(v)) {
      const n = +v; let d = ri(1, Math.max(2, Math.min(9, Math.floor(n / 3) || 2))); if (ri(0, 1)) d = -d;
      let r = n + d; if (r <= 0 || r === n) r = n + 1 + ri(0, 2); return String(r);
    }
    if ((m = v.match(/^(\d+)\.(\d+)$/))) { const dec = m[2]; const last = (+dec[dec.length - 1] + ri(1, 8)) % 10 || 3; return m[1] + '.' + dec.slice(0, -1) + last; }
    if ((m = v.match(/^(\d+)\/(\d+)$/))) { let n = +m[1], d = +m[2]; n = n + 1 < d ? n + 1 : Math.max(1, n - 1); return `${n}/${d}`; }
    if ((m = v.match(/^(\d+) (\d+)\/(\d+)$/))) return `${+m[1] + 1} ${m[2]}/${m[3]}`;
    return v;
  }
  function makeDecoys(cards, n) {
    n = n == null ? 3 : n;
    const out = [];
    const used = new Set(cards.map((c) => c.value + c.label));
    // 같은 그림 · 다른 수 (헷갈리게)
    const base = U.shuffle(cards);
    for (let i = 0; i < base.length && out.length < Math.ceil(n / 2); i++) {
      const c = base[i]; const nv = tweakVal(c.value);
      if (used.has(nv + c.label) || nv === c.value) continue;
      used.add(nv + c.label); out.push(Object.assign({}, c, { value: nv, vis: c.vis === 'icons' && +nv > 30 ? 'blocks' : c.vis }));
    }
    // 다른 그림
    const usedLabels = cards.map((c) => c.label);
    const pool = U.shuffle(OBJ.filter((o) => !usedLabels.includes(o.n)));
    let k = 0;
    while (out.length < n && k < pool.length) {
      const o = pool[k++]; const ref = pk(cards); const base0 = /^\d+$/.test(ref.value) ? +ref.value : ri(3, 20);
      let v = Math.max(2, base0 + ri(-4, 6)); if (used.has(v + o.n)) continue; used.add(v + o.n);
      out.push(card(o, v));
    }
    return out;
  }

  /* ---------- 등록/생성 ---------- */
  const T = [];
  let COV = null;
  const KIND_DOMAIN = {
    num: ['add_add', 'add_merge', 'sub_left', 'sub_diff', 'mul_equal', 'mul_times', 'div_share', 'div_group'],
    rel: ['pattern', 'corr', 'equal', 'ratio', 'prop', 'share'],
    geo: ['unit_conv', 'unit_add', 'unit_sub', 'perimeter', 'area', 'volume', 'angle', 'circle'],
    data: ['data_sum', 'data_diff', 'avg', 'chance', 'graph'],
  };
  function introduced(kind, grade) {
    if (/^mul/.test(kind)) return grade >= 2;
    if (/^div/.test(kind)) return grade >= 3;
    if (kind === 'unknown') return grade >= 2;
    if (kind === 'seq' || kind === 'place') return grade >= 2;
    if (kind === 'ratio' || kind === 'prop' || kind === 'share') return grade >= 6;
    if (kind === 'avg' || kind === 'chance') return grade >= 5;
    if (kind === 'area' || kind === 'perimeter') return grade >= 5;
    if (kind === 'volume' || kind === 'circle') return grade >= 4;
    if (kind === 'angle') return grade >= 4;
    if (kind === 'equal') return grade >= 4;
    if (kind === 'corr') return grade >= 4;
    return true;
  }
  function kindChoices(p) {
    const base = KIND_DOMAIN[p.domain] || KIND_DOMAIN.num;
    let pool = base.filter((k) => k !== p.kind && introduced(k, p.grade));
    // 같은 계열 우선
    const fam = MD.std.KINDS[p.kind].fam;
    const same = pool.filter((k) => MD.std.KINDS[k].fam === fam);
    const rest = pool.filter((k) => MD.std.KINDS[k].fam !== fam);
    let pick = U.sample(same, Math.min(2, same.length));
    pick = pick.concat(U.sample(rest, Math.max(0, 3 - pick.length)));
    if (pick.length < 3) pick = pick.concat(U.sample(pool.filter((k) => !pick.includes(k)), 3 - pick.length));
    if (pick.length < 3) { // 저학년: 같은 영역 카드가 부족하면 덧셈·뺄셈 카드로 채움
      const fill = KIND_DOMAIN.num.filter((k) => k !== p.kind && !pick.includes(k) && introduced(k, p.grade));
      pick = pick.concat(U.sample(fill, 3 - pick.length));
    }
    return U.shuffle([p.kind].concat(pick.slice(0, 3)));
  }

  const withUnit = (s, u) => (u ? s + (/^[A-Za-zμ]/.test(u) ? ' ' : '') + u : s);
  function ansText(p) {
    const f = p.final;
    if (f.type === 'num') return withUnit(f.ans, f.unit);
    if (f.type === 'frac') { const v = F.parse(f.ans); return withUnit(F.toStr(v), f.unit); }
    if (f.type === 'qr') return `몫 ${f.q}${f.unit || ''}, 나머지 ${f.r}${f.unit2 || f.unit || ''}`;
    if (f.type === 'units') return f.units.map((u, i) => f.ans[i] + u).filter((s, i) => f.ans[i] !== 0 || i === f.units.length - 1).join(' ');
    return '';
  }

  function finish(p, def, grade) {
    p.tpl = def.id; p.grade = grade; p.domain = def.domain;
    p.std = p.std || def.std.slice();
    p.cards.forEach((c, i) => (c.id = 'c' + i));
    p.decoys = (p.decoys || makeDecoys(p.cards, p.decoyN)).slice(0, 4);
    p.decoys.forEach((c, i) => (c.id = 'd' + i));
    p.id = def.id + '-' + Math.random().toString(36).slice(2, 8);
    p.choices = kindChoices(p);
    p.ansText = ansText(p);
    const f = p.final;
    p.sentenceDone = (p.sentence || '답: {a}').replace('{a}', p.ansText).replace('{q}', f.q != null ? f.q : '').replace('{r}', f.r != null ? f.r : '');
    if (p.eq) {
      const nums = [];
      p.eq.tokens.forEach((t) => { if (!/^[+−×÷()\-]$/.test(t) && !nums.includes(t)) nums.push(t); });
      p.eq.need = nums;
      if (!p.eq.tray) {
        const dec = [];
        const bump = (t) => (U.parseAtom(t) ? null : tweakVal(t));
        U.shuffle(nums).forEach((t) => { const d = bump(t); if (d && !nums.includes(d) && dec.length < 1) dec.push(d); });
        p.eq.tray = nums.concat(dec);
      }
      p.eq.tray = U.shuffle(Array.from(new Set(p.eq.tray)));
      const hasParen = p.eq.tokens.includes('(');
      p.eq.ops = p.eq.ops || ['+', '−', '×', '÷'].concat(hasParen ? ['(', ')'] : []);
      p.eq.show = p.eq.tokens.join(' ');
      p.eq.val = U.evalTokens(p.eq.tokens);
    }
    return p;
  }

  const API = (MD.problems = {
    T, KIND_DOMAIN, NAMES, OBJ, BOX, PAIRS,
    reg(def) { T.push(def); },
    /* opts: {grade, domain, std, tpl} */
    templates(opts) {
      opts = opts || {};
      return T.filter((t) => (!opts.grade || t.grades.includes(opts.grade)) && (!opts.domain || opts.domain === 'all' || t.domain === opts.domain) && (!opts.std || t.std.includes(opts.std)) && (!opts.tpl || t.id === opts.tpl));
    },
    make(opts) {
      opts = opts || {};
      let ts = API.templates(opts);
      if (!ts.length && opts.grade) ts = API.templates({ grade: opts.grade });
      if (!ts.length) ts = T;
      let def, grade, p;
      for (let attempt = 0; attempt < 16; attempt++) {
        def = pk(ts);
        if (opts.avoid && ts.length > 1) { for (let i = 0; i < 4 && def.id === opts.avoid; i++) def = pk(ts); }
        grade = opts.grade && def.grades.includes(opts.grade) ? opts.grade : pk(def.grades);
        p = def.gen(grade);
        if (!opts.std || (p.std || def.std).includes(opts.std)) break; // 학년별로 성취기준이 다른 유형은 정확히 맞는 것만
      }
      return finish(p, def, grade);
    },
    /* 성취기준 → 문제 유형 연결 (학년별 실제 생성 결과로 계산) */
    coverage() {
      if (COV) return COV;
      const m = {};
      T.forEach((t) => t.grades.forEach((g) => {
        const seen = new Set();
        for (let i = 0; i < 14; i++) { try { const q = t.gen(g); (q.std || t.std).forEach((s) => seen.add(s)); } catch (e) {} }
        seen.forEach((s) => { const o = (m[s] = m[s] || { tpls: 0, grades: new Set(), doms: new Set() }); o.tpls++; o.grades.add(g); o.doms.add(t.domain); });
      }));
      return (COV = m);
    },
    stdsFor(grade, domain) {
      const c = API.coverage();
      return Object.keys(c).filter((s) => c[s].grades.has(grade) && (!domain || domain === 'all' || c[s].doms.has(domain))).sort();
    },
    kindChoices, ansText,

    /* ---------- 검사 함수 ---------- */
    checkEq(p, tokens) {
      const v = U.evalTokens(tokens);
      if (!v) return { ok: false, msg: '식이 아직 완성되지 않았어요. 수와 기호를 번갈아 놓아 보세요.' };
      const used = tokens.filter((t) => !/^[+−×÷()]$/.test(t));
      const missing = p.eq.need.filter((n) => !used.includes(n));
      if (F.eq(v, p.eq.val) && !missing.length) return { ok: true };
      if (missing.length) return { ok: false, msg: `문제에 나온 수 ${missing.slice(0, 2).join(', ')}도 식에 사용해 보세요.` };
      return { ok: false, msg: '기호나 계산 순서를 다시 살펴봐요. 분류카드에서 고른 계산이 맞나요?' };
    },
    checkPrep(step, input) {
      const s = String(input).trim();
      if (!s) return false;
      if (step.type === 'list') {
        const got = s.split(/[\s,，、]+/).filter(Boolean).map(Number);
        const want = step.ans.slice();
        return got.length === want.length && got.slice().sort((a, b) => a - b).every((v, i) => v === want.slice().sort((a, b) => a - b)[i]);
      }
      const a = F.parse(s), b = F.parse(step.ans);
      if (a && b && F.eq(a, b)) return true;
      const m = /^(\d+)\/(\d+)$/.exec(String(step.ans)); // "□/12" 처럼 분자만 묻는 경우
      return !!(m && /□\s*\/\s*\d+/.test(step.q) && /^\d+$/.test(s) && +s === +m[1]);
    },
    /* 최종 답: input = {v} | {w,n,d} | {q,r} | {parts:[..]} */
    checkFinal(p, input) {
      const f = p.final;
      if (f.type === 'num') {
        const a = F.parse(input.v), b = F.parse(f.ans);
        if (!a) return { ok: false, msg: '숫자로 답을 써 보세요.' };
        return F.eq(a, b) ? { ok: true } : { ok: false, msg: '계산 결과가 달라요. 세로식에서 자리를 맞추어 다시 계산해 볼까요?' };
      }
      if (f.type === 'frac') {
        const n = +input.n, d = +input.d, w = input.w ? +input.w : 0;
        if (!d || isNaN(n)) return { ok: false, msg: '분자와 분모를 모두 써 보세요.' };
        const a = F.make(w * d + n, d), b = F.parse(f.ans);
        if (!F.eq(a, b)) return { ok: false, msg: '분수의 크기가 달라요. 다시 계산해 보세요.' };
        if (f.reduce && U.gcd(n, d) > 1) return { ok: false, msg: '맞아요! 이제 더 이상 약분되지 않는 분수(기약분수)로 나타내 보세요.' };
        if (f.exact && (n !== F.parse(f.ans).n * 1 && !(F.make(n, d).n === n))) return { ok: true };
        return { ok: true };
      }
      if (f.type === 'qr') {
        if (+input.q === f.q && +input.r === f.r) return { ok: true };
        if (+input.q === f.q) return { ok: false, msg: '몫은 맞아요! 나머지를 다시 구해 보세요. (나누는 수보다 작아야 해요)' };
        return { ok: false, msg: '몫 × 나누는 수 + 나머지 = 나누어지는 수 가 되는지 확인해 보세요.' };
      }
      if (f.type === 'units') {
        const ok = f.ans.every((v, i) => +input.parts[i] === v);
        return ok ? { ok: true } : { ok: false, msg: '단위끼리 계산했는지, 받아올림·받아내림이 맞는지 확인해 보세요.' };
      }
      return { ok: false };
    },
    helpers: { card, mcard, makeDecoys, tweakVal, names2, qty, J, pk, ri },
  });
})();
