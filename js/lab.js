/* 조작 놀이터 — 2022 개정 초등 수학 전 영역을 위한 11가지 확장 교구 */
(function () {
  const U = MD.util, h = U.h, F = U.frac;
  const META = {
    bignum: { title: '큰 수 읽기판', icon: '🔢', desc: '네 자리씩 끊어 만·억·조 단위까지 읽고, 두 수의 크기를 비교해요.', grade: '2~4학년' },
    array: { title: '곱셈·나눗셈 배열판', icon: '🟦', desc: '점 배열로 곱셈을 보고, 똑같이 묶어 나눗셈과 나머지를 알아봐요.', grade: '2~4학년' },
    fraction: { title: '분수판', icon: '🍕', desc: '분수 막대로 크기 비교, 덧셈·뺄셈, 통분·약분을 눈으로 확인해요.', grade: '3~6학년' },
    decimal: { title: '소수 모형(100칸)', icon: '🔟', desc: '100칸 모눈으로 소수 두 자리 수를 만들고 비교·덧셈·뺄셈을 해요.', grade: '3~5학년' },
    clock: { title: '시계 · 시간', icon: '🕒', desc: '시계 바늘로 시각을 읽고, 시간을 더하고 빼는 활동을 해요.', grade: '2~4학년' },
    angle: { title: '각도기', icon: '📐', desc: '각도기로 각을 만들고 예각·직각·둔각을 구별해요. 삼각형 세 각의 합도!', grade: '4학년' },
    area: { title: '넓이판', icon: '▭', desc: '직사각형·평행사변형·삼각형·사다리꼴·마름모·원의 넓이와 둘레를 구해요.', grade: '5~6학년' },
    graph: { title: '그래프 · 평균', icon: '📊', desc: '막대·꺾은선·원·띠그래프를 만들고 평균을 ‘고르게’ 만들어 봐요.', grade: '2~6학년' },
    chance: { title: '가능성 실험실', icon: '🎲', desc: '동전·주사위·주머니 실험으로 가능성을 말과 수로 나타내요.', grade: '5~6학년' },
    ratio: { title: '비율 막대', icon: '⚖️', desc: '비, 비율, 비례식, 비례배분을 이중 수직선과 막대로 봐요.', grade: '6학년' },
    rule: { title: '규칙·대응 기계', icon: '🔁', desc: '입력과 출력의 규칙을 찾아 표와 식으로 나타내요.', grade: '2~6학년' },
  };
  MD.labs = { META };

  /* ---------- 공용 ---------- */
  const stp = (label, get, min, max, on, step) => {
    const out = h('output', { class: 'stv' }, String(get()));
    const mk = (d) => h('button', { class: 'btn w sm', 'aria-label': label + (d > 0 ? ' 늘리기' : ' 줄이기'), onclick: () => { const v = Math.min(max, Math.max(min, +(get() + d * (step || 1)).toFixed(4))); on(v); out.textContent = v; } }, d > 0 ? '＋' : '－');
    const w = h('span', { class: 'stp' }, h('b', null, label), mk(-1), out, mk(1)); w.set = (v) => (out.textContent = v); return w;
  };
  const panel = (title, ...kids) => h('div', { class: 'card lab-card' }, title ? h('h3', null, title) : null, ...kids);
  const COLS = ['#e63946', '#1c7ed6', '#f2b705', '#2f9e44', '#7048e8', '#f76707', '#0c8599', '#c2255c'];
  const svgh = (w, hh, body) => `<svg class="fig" viewBox="0 0 ${w} ${hh}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

  /* ================= 1. 큰 수 읽기판 ================= */
  const PLACE = ['일', '십', '백', '천', '만', '십만', '백만', '천만', '억', '십억', '백억', '천억', '조', '십조', '백조', '천조'];
  const KD = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  function bignum(box) {
    let a = '305402000', b = '305420000';
    const view = h('div'), cmp = h('div');
    const grid = (n) => {
      const s = n.padStart(16, '0'), g = [];
      for (let k = 0; k < 4; k++) {
        const part = s.slice(k * 4, k * 4 + 4), unit = ['조', '억', '만', ''][k];
        g.push(h('div', { class: 'bg4' }, h('div', { class: 'bg4h' }, unit || '일'), h('div', { class: 'bg4c' }, [0, 1, 2, 3].map((j) => { const e = 15 - (k * 4 + j), d = part[j], lead = /^0*$/.test(s.slice(0, k * 4 + j + 1)); return h('div', { class: 'bcell' + (lead ? ' lead' : ''), style: { '--pc': ['#ff8787', '#ffa94d', '#69db7c', '#ffd43b'][j] } }, h('small', null, ['천', '백', '십', '일'][j]), h('b', null, d)); }))));
      }
      return h('div', { class: 'bgrid' }, g);
    };
    const draw = () => {
      const n = a.replace(/^0+(?=\d)/, '') || '0';
      const parts = []; for (let i = 0; i < n.length; i++) { const d = +n[i], e = n.length - 1 - i; if (d) parts.push(`${d} → ${d === 1 && e % 4 ? '' : KD[d]}${PLACE[e] === '일' ? '' : PLACE[e]} (${d}${'0'.repeat(e)})`); }
      view.replaceChildren(grid(n), h('div', { class: 'readk' }, h('b', null, '읽기: '), U.readKorean(n)), h('ul', { class: 'plist' }, parts.map((p) => h('li', null, p))));
      const A = a.replace(/^0+(?=\d)/, '') || '0', B = b.replace(/^0+(?=\d)/, '') || '0'; let msg;
      if (A === B) msg = '두 수는 같아요.'; else if (A.length !== B.length) msg = `${A.length > B.length ? '왼쪽' : '오른쪽'} 수가 ${Math.abs(A.length - B.length)}자리 더 많으니까 더 커요. (자릿수 비교)`; else { let i = 0; while (A[i] === B[i]) i++; msg = `높은 자리부터 비교하면 ${PLACE[A.length - 1 - i]}의 자리에서 ${A[i]}와 ${B[i]}가 달라요. → ${+A[i] > +B[i] ? '왼쪽' : '오른쪽'} 수가 더 커요.`; }
      cmp.replaceChildren(h('p', { class: 'mnote' }, `${A} ${A === B ? '=' : BigInt(A) > BigInt(B) ? '>' : '<'} ${B}`), h('p', null, msg));
    };
    const inp = (get, set, label) => h('input', { type: 'text', inputmode: 'numeric', maxlength: 16, value: get(), 'aria-label': label, class: 'bigin', oninput: (e) => { e.target.value = e.target.value.replace(/\D/g, ''); set(e.target.value || '0'); draw(); } });
    box.append(panel('① 수를 써 넣고 읽어 봐요', h('div', { class: 'row' }, inp(() => a, (v) => (a = v), '수'), h('button', { class: 'btn y sm', onclick: () => { a = String(U.int(1, 9)) + Array.from({ length: U.int(4, 12) }, () => U.int(0, 9)).join(''); box.querySelector('.bigin').value = a; draw(); } }, '🎲 랜덤')), view),
      panel('② 두 수의 크기를 비교해요', h('div', { class: 'row' }, h('span', { class: 'muted' }, '왼쪽 수는 위 칸의 수:'), h('span', null, '오른쪽 수 →'), inp(() => b, (v) => (b = v), '비교할 수')), cmp));
    draw();
  }

  /* ================= 2. 곱셈·나눗셈 배열판 ================= */
  function arrayLab(box) {
    let mode = 'mul', r = 3, c = 4, N = 17, g = 5, show = false;
    const body = h('div'), tabs = h('div', { class: 'tabsmall' });
    const dots = (rows, cols, mark) => h('div', { class: 'dots', style: { '--c': cols } }, Array.from({ length: rows * cols }, (_, i) => h('i', { style: { background: COLS[Math.floor(i / cols) % 8] }, class: mark && mark(i) ? 'm' : '' })));
    const draw = () => {
      tabs.replaceChildren(...[['mul', '곱셈 (배열)'], ['div', '나눗셈 (묶기)']].map(([k, t]) => h('button', { class: mode === k ? 'on' : '', onclick: () => { mode = k; draw(); } }, t)));
      body.replaceChildren();
      if (mode === 'mul') {
        body.append(h('div', { class: 'row' }, stp('한 줄에', () => c, 1, 12, (v) => { c = v; draw(); }), stp('줄 수', () => r, 1, 12, (v) => { r = v; draw(); }), h('label', { class: 'chip' }, h('input', { type: 'checkbox', checked: show || null, onchange: (e) => { show = e.target.checked; draw(); } }), ' 뛰어 세기 표시')),
          dots(r, c, show ? (i) => (i + 1) % c === 0 : null), h('p', { class: 'bigeq' }, `${c} × ${r} = ${c * r}`), h('p', null, `${c}씩 ${r}묶음 → `, U.range(1, r).map((k) => k * c).join(', '), ` (${c}씩 뛰어 세기)`), h('p', { class: 'muted' }, `${r} × ${c} = ${r * c} 도 같아요. (곱셈의 교환법칙: 줄과 칸을 바꿔도 점의 수는 같아요)`));
      } else {
        const q = Math.floor(N / g), rem = N % g;
        const grp = h('div', { class: 'groups' }, Array.from({ length: q }, (_, k) => h('div', { class: 'grp', style: { '--gc': COLS[k % 8] } }, Array.from({ length: g }, () => h('i')))), rem ? h('div', { class: 'grp rest' }, Array.from({ length: rem }, () => h('i'))) : null);
        body.append(h('div', { class: 'row' }, stp('전체', () => N, 1, 60, (v) => { N = v; draw(); }), stp('한 묶음', () => g, 1, 12, (v) => { g = v; draw(); })), grp,
          h('p', { class: 'bigeq' }, `${N} ÷ ${g} = ${q}${rem ? ' … ' + rem : ''}`), h('p', null, `${g}씩 덜어 내면 ${q}묶음이 되고 ${rem ? rem + '개가 남아요. (나머지는 나누는 수 ' + g + '보다 작아요)' : '남는 것이 없어요. (나누어떨어져요)'}`), h('p', { class: 'chk' }, `🔁 확인: ${g} × ${q}${rem ? ' + ' + rem : ''} = ${N}`));
      }
    };
    box.append(panel(null, tabs, body)); draw();
  }

  /* ================= 3. 분수판 ================= */
  function fractionLab(box) {
    let op = 'cmp', A = { w: 0, n: 1, d: 2 }, B = { w: 0, n: 1, d: 3 };
    const body = h('div'), tabs = h('div', { class: 'tabsmall' });
    const val = (x) => F.make(x.w * x.d + x.n, x.d);
    const bar = (n, d, color, label) => h('div', { class: 'fbarw' }, h('div', { class: 'fb2' }, Array.from({ length: d }, (_, i) => h('i', { style: i < n ? { background: color } : null }))), label ? h('small', null, label) : null);
    const wholeBars = (v, d, color) => { const w = Math.floor(v.n / v.d), r = v.n - w * v.d, lim = d; const out = h('div', { class: 'wb' }); for (let i = 0; i < w; i++) out.append(bar(d, d, color)); out.append(bar(Math.round((r * d) / v.d), d, color)); return out; };
    const draw = () => {
      tabs.replaceChildren(...[['cmp', '크기 비교'], ['add', '＋ 덧셈'], ['sub', '－ 뺄셈'], ['red', '약분·통분']].map(([k, t]) => h('button', { class: op === k ? 'on' : '', onclick: () => { op = k; draw(); } }, t)));
      const ctl = (X, name, color) => h('div', { class: 'row fctl' }, h('b', { style: { color } }, name), stp('자연수', () => X.w, 0, 3, (v) => { X.w = v; draw(); }), stp('분자', () => X.n, 0, 12, (v) => { X.n = v; draw(); }), stp('분모', () => X.d, 1, 12, (v) => { X.d = v; if (X.n > v) X.n = v; draw(); }));
      const fa = val(A), fb = val(B), L = U.lcm(A.d, B.d), fm = (x) => F.toStr(x);
      body.replaceChildren(ctl(A, '첫째 분수', COLS[0]), op === 'red' ? null : ctl(B, '둘째 분수', COLS[1]));
      if (op === 'red') {
        const g = U.gcd(A.n + A.w * A.d, A.d), im = A.w * A.d + A.n, ks = [2, 3, 4].map((k) => `${im * k}/${A.d * k}`);
        body.append(bar(A.n, A.d, COLS[0], `${F.toStr(F.make(A.w * A.d + A.n, A.d))}`), h('p', null, h('b', null, '크기가 같은 분수: '), `${im}/${A.d} = ${ks.join(' = ')} …`), h('p', null, `분모와 분자에 같은 수를 곱하면 크기가 같은 분수가 돼요. (통분의 바탕)`), h('p', null, `${im}과 ${A.d}의 최대공약수는 ${g} → 약분하면 ${im / g}/${A.d / g}${g === 1 ? ' (이미 기약분수예요)' : ''}`), h('p', { class: 'muted' }, `분수 ${A.d}와 ${B.d}를 통분하려면 최소공배수 ${L}로 → ${A.n * (L / A.d) + A.w * L}/${L}, ${B.n * (L / B.d) + B.w * L}/${L}`));
        body.append(bar(Math.round((A.n * L) / A.d), L, COLS[0], `통분 ${A.n * (L / A.d)}/${L}`), bar(Math.round((B.n * L) / B.d), L, COLS[1], `통분 ${B.n * (L / B.d)}/${L}`)); return;
      }
      body.append(h('div', { class: 'cmpbars' }, wholeBars(fa, A.d, COLS[0]), wholeBars(fb, B.d, COLS[1])));
      if (op === 'cmp') { const c = fa.n * fb.d - fb.n * fa.d; body.append(h('p', { class: 'bigeq' }, `${fm(fa)} ${c > 0 ? '>' : c < 0 ? '<' : '='} ${fm(fb)}`), h('p', null, `통분하면 ${fa.n * (L / A.d)}/${L} 과 ${fb.n * (L / B.d)}/${L} → 분자가 ${c > 0 ? '왼쪽이 더 커요' : c < 0 ? '오른쪽이 더 커요' : '같아요'}.`)); }
      else {
        const r = op === 'add' ? F.add(fa, fb) : F.sub(fa, fb);
        if (op === 'sub' && r.n < 0) body.append(h('p', { class: 'msg bad' }, '빼어지는 수가 더 커야 해요. 분수를 바꿔 보세요.'));
        else body.append(h('div', { class: 'row' }, h('span', null, '공통분모 ' + L + ' 로 통분 →'), h('b', null, `${fa.n * (L / fa.d)}/${L}`), h('b', null, op === 'add' ? '＋' : '－'), h('b', null, `${fb.n * (L / fb.d)}/${L}`)), wholeBars(r, L > 12 ? 12 : L, COLS[3]), h('p', { class: 'bigeq' }, `${fm(fa)} ${op === 'add' ? '+' : '−'} ${fm(fb)} = ${fm(r)}`), h('p', { class: 'muted' }, F.toDec(r) ? `소수로는 ${F.toDec(r)}` : '무한소수가 되는 분수예요.'));
      }
    };
    box.append(panel(null, tabs, body)); draw();
  }

  /* ================= 4. 소수 모형 ================= */
  function decimalLab(box) {
    let x = 125, y = 80, op = 'cmp'; // 백분의 일 단위 정수
    const body = h('div'), tabs = h('div', { class: 'tabsmall' });
    const grid = (v, color) => { const wholes = Math.floor(v / 100), rest = v % 100, out = h('div', { class: 'dgrids' }); for (let k = 0; k <= wholes; k++) { const n = k < wholes ? 100 : rest; if (k === wholes && n === 0 && wholes > 0) break; out.append(h('div', { class: 'g100' }, Array.from({ length: 100 }, (_, i) => h('i', { style: i < n ? { background: i < Math.floor(n / 10) * 10 ? color : color + 'aa' } : null })))); } return out; };
    const fmt = (v) => (v / 100).toFixed(2).replace(/0$/, '').replace(/\.$/, '');
    const draw = () => {
      tabs.replaceChildren(...[['cmp', '크기 비교'], ['add', '＋ 덧셈'], ['sub', '－ 뺄셈']].map(([k, t]) => h('button', { class: op === k ? 'on' : '', onclick: () => { op = k; draw(); } }, t)));
      const ctl = (get, set, name, color) => h('div', { class: 'row' }, h('b', { style: { color } }, name), stp('일', () => Math.floor(get() / 100), 0, 3, (v) => { set(v * 100 + (get() % 100)); draw(); }), stp('소수 첫째', () => Math.floor((get() % 100) / 10), 0, 9, (v) => { set(Math.floor(get() / 100) * 100 + v * 10 + (get() % 10)); draw(); }), stp('소수 둘째', () => get() % 10, 0, 9, (v) => { set(Math.floor(get() / 10) * 10 + v); draw(); }), h('b', { class: 'bigeq' }, fmt(get())));
      body.replaceChildren(ctl(() => x, (v) => (x = v), '첫째 수', '#e63946'), ctl(() => y, (v) => (y = v), '둘째 수', '#1c7ed6'), h('div', { class: 'row gg' }, grid(x, '#e63946'), grid(y, '#1c7ed6')));
      if (op === 'cmp') body.append(h('p', { class: 'bigeq' }, `${fmt(x)} ${x > y ? '>' : x < y ? '<' : '='} ${fmt(y)}`), h('p', null, '높은 자리부터 비교해요. 일의 자리 → 소수 첫째 자리 → 소수 둘째 자리 순서로 살펴봐요.'));
      else if (op === 'add') body.append(h('div', { class: 'row gg' }, grid(x + y, '#2f9e44')), h('p', { class: 'bigeq' }, `${fmt(x)} + ${fmt(y)} = ${fmt(x + y)}`), h('p', null, `100칸 모눈으로 ${x + y}칸 → 소수점의 위치를 맞추어 같은 자리끼리 더해요.`));
      else body.append(x >= y ? h('div', { class: 'row gg' }, grid(x - y, '#2f9e44')) : h('p', { class: 'msg bad' }, '빼어지는 수가 더 커야 해요.'), x >= y ? h('p', { class: 'bigeq' }, `${fmt(x)} − ${fmt(y)} = ${fmt(x - y)}`) : null);
    };
    box.append(panel(null, tabs, body)); draw();
  }

  /* ================= 5. 시계 ================= */
  function clockSvg(hh, mm, ss, showSec) {
    const cx = 100, cy = 85, r = 66; let b = `<circle cx="${cx}" cy="${cy}" r="${r}" class="clockface"/>`;
    for (let i = 1; i <= 12; i++) { const a = (i * Math.PI) / 6 - Math.PI / 2; b += `<text x="${cx + (r - 14) * Math.cos(a)}" y="${cy + (r - 14) * Math.sin(a) + 4}" text-anchor="middle" class="cn">${i}</text>`; }
    for (let i = 0; i < 60; i++) { const a = (i * Math.PI) / 30 - Math.PI / 2, r2 = i % 5 ? r - 3 : r - 6; b += `<line x1="${cx + r * Math.cos(a)}" y1="${cy + r * Math.sin(a)}" x2="${cx + r2 * Math.cos(a)}" y2="${cy + r2 * Math.sin(a)}" class="tickl"/>`; }
    const ha = ((hh % 12) + mm / 60) * (Math.PI / 6) - Math.PI / 2, ma = mm * (Math.PI / 30) - Math.PI / 2, sa = ss * (Math.PI / 30) - Math.PI / 2;
    b += `<line x1="${cx}" y1="${cy}" x2="${cx + 36 * Math.cos(ha)}" y2="${cy + 36 * Math.sin(ha)}" class="hand h"/><line x1="${cx}" y1="${cy}" x2="${cx + 54 * Math.cos(ma)}" y2="${cy + 54 * Math.sin(ma)}" class="hand m"/>`;
    if (showSec) b += `<line x1="${cx}" y1="${cy}" x2="${cx + 58 * Math.cos(sa)}" y2="${cy + 58 * Math.sin(sa)}" class="hand s"/>`;
    return svgh(200, 170, b + `<circle cx="${cx}" cy="${cy}" r="4" class="dot"/>`).replace('class="fig"', 'class="fig clock"');
  }
  function clockLab(box) {
    let hr = 3, mi = 25, sec = 0, showSec = false, dh = 1, dm = 40;
    const view = h('div');
    const two = (n) => String(n).padStart(2, '0');
    const draw = () => {
      const total = ((hr % 12) * 60 + mi + dh * 60 + dm), eh = Math.floor(total / 60) % 12 || 12, em = total % 60, crossed = total >= 720;
      view.replaceChildren(
        h('div', { class: 'row' }, stp('시', () => hr, 1, 12, (v) => { hr = v; draw(); }), stp('분', () => mi, 0, 59, (v) => { mi = v; draw(); }), h('button', { class: 'btn w sm', onclick: () => { mi = Math.min(59, mi + 5); draw(); } }, '+5분'), h('button', { class: 'btn w sm', onclick: () => { mi = (mi + 55) % 60; draw(); } }, '−5분'), h('label', { class: 'chip' }, h('input', { type: 'checkbox', checked: showSec || null, onchange: (e) => { showSec = e.target.checked; draw(); } }), ' 초침'), showSec ? stp('초', () => sec, 0, 59, (v) => { sec = v; draw(); }) : null),
        h('div', { class: 'clockrow' }, h('div', { html: clockSvg(hr, mi, sec, showSec) }), h('div', null, h('p', { class: 'bigeq' }, `${hr}시 ${mi}분${showSec ? ' ' + sec + '초' : ''}`), h('p', { class: 'digital' }, `${two(hr)}:${two(mi)}${showSec ? ':' + two(sec) : ''}`), h('p', null, `긴바늘이 ${Math.floor(mi / 5) || 12}을(를) 가리키면 ${mi}분 → 숫자 1칸은 5분!`), h('p', { class: 'muted' }, '1시간 = 60분, 1분 = 60초'))),
        h('h3', { style: { marginTop: '14px' } }, '시간 더하기'), h('div', { class: 'row' }, stp('걸린 시간 시간', () => dh, 0, 11, (v) => { dh = v; draw(); }), stp('분', () => dm, 0, 59, (v) => { dm = v; draw(); })),
        h('div', { class: 'clockrow' }, h('div', { html: clockSvg(eh, em, 0, false) }), h('div', null, h('p', { class: 'bigeq' }, `${hr}시 ${mi}분 + ${dh}시간 ${dm}분 = ${eh}시 ${em}분`), h('p', null, `분끼리: ${mi} + ${dm} = ${mi + dm}${mi + dm >= 60 ? ' → 60분은 1시간으로 받아올림!' : ''}`), crossed ? h('p', { class: 'muted' }, '12시를 넘어가서 오전↔오후가 바뀌어요.') : null)));
    };
    box.append(panel(null, view)); draw();
  }

  /* ================= 6. 각도기 ================= */
  function angleLab(box) {
    let deg = 60, mode = 'free', a2 = 50, b2 = 60, guess = null, target = U.int(10, 17) * 10;
    const view = h('div'), tabs = h('div', { class: 'tabsmall' });
    const proto = (d) => { const cx = 150, cy = 140, R = 120; let s = `<path d="M${cx - R},${cy} A${R},${R} 0 0 1 ${cx + R},${cy}" class="sh2"/>`; for (let i = 0; i <= 180; i += 10) { const a = (Math.PI * (180 - i)) / 180, r2 = i % 30 === 0 ? R - 16 : R - 9; s += `<line x1="${cx + R * Math.cos(a)}" y1="${cy - R * Math.sin(a)}" x2="${cx + r2 * Math.cos(a)}" y2="${cy - r2 * Math.sin(a)}" class="ln"/>`; if (i % 30 === 0) s += `<text x="${cx + (R - 28) * Math.cos(a)}" y="${cy - (R - 28) * Math.sin(a) + 4}" text-anchor="middle" class="tick">${i}</text>`; } const a = (Math.PI * (180 - d)) / 180; s += `<line x1="${cx - R - 14}" y1="${cy}" x2="${cx + R + 14}" y2="${cy}" class="ln"/><line x1="${cx}" y1="${cy}" x2="${cx + (R + 12) * Math.cos(a)}" y2="${cy - (R + 12) * Math.sin(a)}" class="dash" style="stroke-width:3.5"/><circle cx="${cx}" cy="${cy}" r="4" class="dot"/>`; return svgh(300, 156, s); };
    const kind = (d) => (d === 90 ? '직각' : d < 90 ? '예각' : d === 180 ? '평각' : '둔각');
    const tri = () => { const c = 180 - a2 - b2; if (c <= 0) return h('p', { class: 'msg bad' }, '두 각의 합이 180°보다 작아야 삼각형이 돼요.'); const A = [40, 130], B = [260, 130], ang = (a2 * Math.PI) / 180; const len = (220 * Math.sin((b2 * Math.PI) / 180)) / Math.sin((c * Math.PI) / 180), C = [A[0] + len * Math.cos(ang), A[1] - len * Math.sin(ang)]; const sc = Math.min(1, 110 / (A[1] - C[1])), Cy = A[1] - (A[1] - C[1]) * sc, Cx = A[0] + (C[0] - A[0]) * sc; return h('div', { html: svgh(300, 150, `<polygon points="${A} ${B} ${Cx},${Cy}" class="sh2"/><text x="${A[0] + 26}" y="${A[1] - 8}" class="tick">${a2}°</text><text x="${B[0] - 40}" y="${B[1] - 8}" class="tick">${b2}°</text><text x="${Cx}" y="${Cy + 22}" text-anchor="middle" class="qq">${c}°</text>`) }); };
    const draw = () => {
      tabs.replaceChildren(...[['free', '각도기로 만들기'], ['guess', '각도 어림하기'], ['tri', '삼각형 세 각의 합']].map(([k, t]) => h('button', { class: mode === k ? 'on' : '', onclick: () => { mode = k; guess = null; draw(); } }, t)));
      view.replaceChildren();
      if (mode === 'free') view.append(h('div', { class: 'row' }, h('input', { type: 'range', min: 0, max: 180, value: deg, 'aria-label': '각도', class: 'rng', oninput: (e) => { deg = +e.target.value; draw(); } }), stp('', () => deg, 0, 180, (v) => { deg = v; draw(); }, 5)), h('div', { html: proto(deg) }), h('p', { class: 'bigeq' }, `${deg}° → ${kind(deg)}`), h('p', null, '직각(90°)보다 작으면 예각, 크면 둔각이에요. 한 직선(180°)은 평각!'));
      else if (mode === 'guess') view.append(h('div', { html: proto(target).replace(/<line [^>]*class="dash"[^>]*\/>/, (m) => m) }), h('div', { class: 'row' }, h('input', { type: 'number', min: 0, max: 180, placeholder: '몇 도일까요?', value: guess == null ? '' : guess, id: 'gin' }), h('button', { class: 'btn', onclick: () => { guess = +document.getElementById('gin').value; draw(); } }, '확인'), h('button', { class: 'btn w', onclick: () => { target = U.int(3, 17) * 10; guess = null; draw(); } }, '다른 각')), guess != null ? h('p', { class: Math.abs(guess - target) <= 10 ? 'msg ok' : 'msg bad' }, `정답은 ${target}° (${kind(target)}) — 내 어림은 ${guess}° (차이 ${Math.abs(guess - target)}°)`) : h('p', { class: 'muted' }, '각도기의 눈금을 보고 각의 크기를 어림해 보세요.'));
      else view.append(h('div', { class: 'row' }, stp('첫째 각', () => a2, 10, 150, (v) => { a2 = v; draw(); }, 5), stp('둘째 각', () => b2, 10, 150, (v) => { b2 = v; draw(); }, 5)), tri(), h('p', { class: 'bigeq' }, `${a2}° + ${b2}° + □ = 180° → □ = ${180 - a2 - b2}°`), h('p', { class: 'muted' }, '삼각형의 세 각의 크기의 합은 180°, 사각형은 360°예요.'));
    };
    box.append(panel(null, tabs, view)); draw();
  }

  /* ================= 7. 넓이판 ================= */
  function areaLab(box) {
    let shape = 'rect', w = 6, hh = 4, w2 = 8, pi = 3.14;
    const view = h('div'), tabs = h('div', { class: 'tabsmall' });
    const draw = () => {
      const shapes = [['rect', '직사각형'], ['para', '평행사변형'], ['tri', '삼각형'], ['trap', '사다리꼴'], ['rhomb', '마름모'], ['circle', '원']];
      tabs.replaceChildren(...shapes.map(([k, t]) => h('button', { class: shape === k ? 'on' : '', onclick: () => { shape = k; draw(); } }, t)));
      const ctl = [];
      const L1 = { rect: '가로', para: '밑변', tri: '밑변', trap: '윗변', rhomb: '대각선1', circle: '반지름' }[shape];
      ctl.push(stp(L1, () => w, 1, 12, (v) => { w = v; draw(); }));
      if (shape !== 'circle') ctl.push(stp({ rect: '세로', para: '높이', tri: '높이', trap: '높이', rhomb: '대각선2' }[shape], () => hh, 1, 10, (v) => { hh = v; draw(); }));
      if (shape === 'trap') ctl.push(stp('아랫변', () => w2, 1, 14, (v) => { w2 = v; draw(); }));
      let fig, formula, area, peri = '';
      if (shape === 'rect') { const cell = 24; fig = h('div', { html: svgh(w * cell + 30, hh * cell + 30, `<g transform="translate(15,10)">${Array.from({ length: w * hh }, (_, i) => `<rect x="${(i % w) * cell}" y="${Math.floor(i / w) * cell}" width="${cell}" height="${cell}" class="sh2" style="stroke-width:1.2"/>`).join('')}</g>`) }); area = w * hh; formula = `${w} × ${hh} = ${area} (cm²)`; peri = `둘레 = (${w} + ${hh}) × 2 = ${(w + hh) * 2} cm`; }
      else if (shape === 'para') { fig = h('div', { html: MD.fig.render({ type: 'para', b: w, h: hh }) }); area = w * hh; formula = `밑변 × 높이 = ${w} × ${hh} = ${area}`; }
      else if (shape === 'tri') { fig = h('div', { html: MD.fig.render({ type: 'tri', b: w, h: hh }) }); area = (w * hh) / 2; formula = `밑변 × 높이 ÷ 2 = ${w} × ${hh} ÷ 2 = ${area}`; }
      else if (shape === 'trap') { fig = h('div', { html: MD.fig.render({ type: 'trap', a: w, b: w2, h: hh }) }); area = ((w + w2) * hh) / 2; formula = `(윗변 + 아랫변) × 높이 ÷ 2 = (${w} + ${w2}) × ${hh} ÷ 2 = ${area}`; }
      else if (shape === 'rhomb') { fig = h('div', { html: MD.fig.render({ type: 'rhomb', d1: w, d2: hh }) }); area = (w * hh) / 2; formula = `한 대각선 × 다른 대각선 ÷ 2 = ${w} × ${hh} ÷ 2 = ${area}`; }
      else { fig = h('div', { html: MD.fig.render({ type: 'circle', r: w }) }); area = +(w * w * pi).toFixed(4); formula = `반지름 × 반지름 × 원주율 = ${w} × ${w} × ${pi} = ${area}`; peri = `원주 = 지름 × 원주율 = ${w * 2} × ${pi} = ${+(w * 2 * pi).toFixed(4)} cm`; ctl.push(h('label', { class: 'chip' }, '원주율 ', h('select', { onchange: (e) => { pi = +e.target.value; draw(); } }, [3, 3.1, 3.14].map((p) => h('option', { value: p, selected: p === pi || null }, p))))); }
      view.replaceChildren(h('div', { class: 'row' }, ctl), fig, h('p', { class: 'bigeq' }, `넓이 = ${area} cm²`), h('p', null, formula), peri ? h('p', { class: 'muted' }, peri) : null, shape === 'para' ? h('p', { class: 'muted' }, '평행사변형의 한 쪽을 잘라 반대쪽에 붙이면 직사각형이 돼요. 그래서 밑변 × 높이!') : shape === 'tri' ? h('p', { class: 'muted' }, '똑같은 삼각형 2개를 붙이면 평행사변형이 돼요. 그래서 삼각형의 넓이는 그 반!') : null, h('p', { class: 'muted' }, '1 m² = 10000 cm² (100 cm × 100 cm)'));
    };
    box.append(panel(null, tabs, view)); draw();
  }

  /* ================= 8. 그래프 · 평균 ================= */
  function graphLab(box) {
    let vals = [12, 20, 8, 16, 19], labs = ['가', '나', '다', '라', '마'], type = 'bar', level = false;
    const view = h('div'), tabs = h('div', { class: 'tabsmall' });
    const draw = () => {
      const n = vals.length, sum = vals.reduce((a, b) => a + b, 0), avg = sum / n, show = level ? vals.map(() => avg) : vals;
      tabs.replaceChildren(...[['bar', '막대'], ['line', '꺾은선'], ['pie', '원그래프'], ['band', '띠그래프']].map(([k, t]) => h('button', { class: type === k ? 'on' : '', onclick: () => { type = k; draw(); } }, t)));
      const W = 340, H = 200, mx = Math.max(24, ...vals) * 1.1, bw = 36, gap = (W - 50 - bw * n) / (n + 1);
      let svg;
      if (type === 'bar') { let b = `<line x1="40" y1="10" x2="40" y2="${H - 30}" class="ln"/><line x1="40" y1="${H - 30}" x2="${W - 6}" y2="${H - 30}" class="ln"/>`; show.forEach((v, i) => { const x = 40 + gap * (i + 1) + bw * i, hhh = (v / mx) * (H - 50); b += `<rect x="${x}" y="${H - 30 - hhh}" width="${bw}" height="${hhh}" rx="3" fill="${COLS[i % 8]}" style="transition:all .6s"/><text x="${x + bw / 2}" y="${H - 34 - hhh}" text-anchor="middle">${+v.toFixed(1)}</text><text x="${x + bw / 2}" y="${H - 14}" text-anchor="middle" class="tick">${labs[i]}</text>`; }); const ay = H - 30 - (avg / mx) * (H - 50); b += `<line x1="40" y1="${ay}" x2="${W - 6}" y2="${ay}" class="dash"/><text x="${W - 8}" y="${ay - 4}" text-anchor="end" class="qq" style="font-size:12px">평균 ${+avg.toFixed(1)}</text>`; svg = svgh(W, H, b); }
      else if (type === 'line') svg = MD.fig.render({ type: 'line', labels: labs, values: vals, unit: '' });
      else if (type === 'pie') svg = MD.fig.render({ type: 'pie', items: vals.map((v, i) => ({ label: labs[i], pct: +((v / sum) * 100).toFixed(1) })) });
      else svg = MD.fig.render({ type: 'band', items: vals.map((v, i) => ({ label: labs[i], pct: +((v / sum) * 100).toFixed(1) })) });
      const ctl = h('div', { class: 'row' }, vals.map((v, i) => stp(labs[i], () => vals[i], 1, 40, (x) => { vals[i] = x; draw(); })));
      view.replaceChildren(ctl, h('div', { html: svg, class: 'gfig' }),
        h('div', { class: 'row' }, h('button', { class: 'btn y', onclick: () => { level = !level; draw(); } }, level ? '↩ 원래대로' : '⚖️ 고르게 하기'), h('span', { class: 'muted' }, '많은 쪽에서 덜어 적은 쪽을 채우면 모두 같아져요.')),
        h('p', { class: 'bigeq' }, `평균 = (${vals.join(' + ')}) ÷ ${n} = ${sum} ÷ ${n} = ${+avg.toFixed(2)}`),
        type === 'pie' || type === 'band' ? h('p', { class: 'muted' }, `각 항목의 비율(%) = 항목 ÷ 전체 × 100 → ${vals.map((v, i) => labs[i] + ' ' + ((v / sum) * 100).toFixed(1) + '%').join(', ')}`) : null);
    };
    box.append(panel(null, tabs, view)); draw();
  }

  /* ================= 9. 가능성 실험실 ================= */
  function chanceLab(box) {
    let kind = 'coin', bag = { r: 3, b: 2, y: 1 }, counts = {}, total = 0;
    const view = h('div'), tabs = h('div', { class: 'tabsmall' });
    const pop = () => (kind === 'coin' ? [['앞', '#f2b705', 1], ['뒤', '#868e96', 1]] : kind === 'dice' ? U.range(1, 6).map((i) => [String(i), COLS[i - 1], 1]) : [['빨강', '#e63946', bag.r], ['파랑', '#1c7ed6', bag.b], ['노랑', '#f2b705', bag.y]].filter((x) => x[2] > 0));
    const words = (p) => (p === 0 ? '불가능하다' : p < 0.3 ? '~아닐 것 같다' : p <= 0.7 ? (p === 0.5 ? '반반이다' : '비슷하다') : p < 1 ? '~일 것 같다' : '확실하다');
    const run = (n) => { const P = pop(), tot = P.reduce((s, x) => s + x[2], 0); if (!tot) return; for (let i = 0; i < n; i++) { let r = Math.random() * tot, k = 0; while ((r -= P[k][2]) >= 0) k++; counts[P[k][0]] = (counts[P[k][0]] || 0) + 1; total++; } draw(); };
    const draw = () => {
      tabs.replaceChildren(...[['coin', '🪙 동전'], ['dice', '🎲 주사위'], ['bag', '👝 주머니']].map(([k, t]) => h('button', { class: kind === k ? 'on' : '', onclick: () => { kind = k; counts = {}; total = 0; draw(); } }, t)));
      const P = pop(), tot = P.reduce((s, x) => s + x[2], 0);
      view.replaceChildren(
        kind === 'bag' ? h('div', { class: 'row' }, stp('빨강', () => bag.r, 0, 9, (v) => { bag.r = v; counts = {}; total = 0; draw(); }), stp('파랑', () => bag.b, 0, 9, (v) => { bag.b = v; counts = {}; total = 0; draw(); }), stp('노랑', () => bag.y, 0, 9, (v) => { bag.y = v; counts = {}; total = 0; draw(); })) : null,
        kind === 'bag' ? h('div', { class: 'balls' }, P.flatMap(([n, c, k]) => Array.from({ length: k }, () => h('i', { style: { background: c } })))) : null,
        h('div', { class: 'row' }, [1, 10, 100, 1000].map((n) => h('button', { class: 'btn' + (n > 1 ? ' y' : ''), onclick: () => run(n) }, n + '번 ' + (kind === 'coin' ? '던지기' : kind === 'dice' ? '굴리기' : '꺼내기'))), h('button', { class: 'btn w', onclick: () => { counts = {}; total = 0; draw(); } }, '처음으로')),
        h('table', { class: 'map' }, h('thead', null, h('tr', null, ['결과', '나온 횟수', '실험 비율', '이론적 가능성', '말로'].map((t) => h('th', null, t)))),
          h('tbody', null, P.map(([n, c, k]) => { const f = F.make(k, tot), cnt = counts[n] || 0; return h('tr', null, h('td', null, h('i', { class: 'dotc2', style: { background: c } }), n), h('td', null, String(cnt)), h('td', null, total ? (cnt / total).toFixed(3) + ` (${((cnt / total) * 100).toFixed(1)}%)` : '-'), h('td', null, F.toStr(f), ' = ', ((k / tot) * 100).toFixed(1) + '%'), h('td', null, words(k / tot))); }))),
        h('div', { class: 'cbars' }, P.map(([n, c, k]) => { const cnt = counts[n] || 0; return h('div', { class: 'cb' }, h('i', { style: { height: (total ? (cnt / total) * 100 : 0) + '%', background: c } }), h('small', null, n)); })),
        h('p', { class: 'muted' }, `총 ${total}번 실험했어요. 실험 횟수가 많아질수록 실험 비율이 이론적 가능성에 가까워져요!`));
    };
    box.append(panel(null, tabs, view)); draw();
  }

  /* ================= 10. 비율 막대 ================= */
  function ratioLab(box) {
    let mode = 'rate', a = 3, b = 5, c = 12, N = 24;
    const view = h('div'), tabs = h('div', { class: 'tabsmall' });
    const hbar = (parts, cls) => h('div', { class: 'hbar ' + (cls || '') }, parts.map(([w, col, t]) => h('i', { style: { flex: w, background: col } }, t)));
    const draw = () => {
      tabs.replaceChildren(...[['rate', '비 · 비율'], ['prop', '비례식'], ['share', '비례배분']].map(([k, t]) => h('button', { class: mode === k ? 'on' : '', onclick: () => { mode = k; draw(); } }, t)));
      view.replaceChildren();
      if (mode === 'rate') { const f = F.make(a, b);
        view.append(h('div', { class: 'row' }, stp('비교하는 양', () => a, 1, 40, (v) => { a = v; draw(); }), stp('기준량', () => b, 1, 40, (v) => { b = v; draw(); })), h('div', { class: 'dnl' }, hbar([[b, '#e9ecef', `기준량 ${b}`]]), hbar([[Math.min(a, b * 1.5), '#1c7ed6', `비교하는 양 ${a}`], [Math.max(0, b * 1.5 - a), 'transparent', '']])),
          h('p', { class: 'bigeq' }, `${a} : ${b}  →  비율 = ${a}/${b}${f.d !== b || f.n !== a ? ' = ' + F.toStr(f) : ''} = ${F.toDec(f, 4) || (a / b).toFixed(3)} = ${+((a / b) * 100).toFixed(1)}%`), h('p', { class: 'muted' }, '비율 = (비교하는 양) ÷ (기준량). 백분율은 비율에 100을 곱해 %로 나타내요.')); }
      else if (mode === 'prop') { const x = (b * c) / a;
        view.append(h('div', { class: 'row' }, stp('a', () => a, 1, 12, (v) => { a = v; draw(); }), stp('b', () => b, 1, 40, (v) => { b = v; draw(); }), stp('c', () => c, 1, 40, (v) => { c = v; draw(); })), h('div', { class: 'dnl2' }, h('div', { class: 'nl' }, h('b', null, '양 ①'), [a, c].map((v) => h('span', null, v))), h('div', { class: 'nl' }, h('b', null, '양 ②'), [b, h('b', { class: 'qq2' }, +x.toFixed(2))].map((v) => (v.nodeType ? v : h('span', null, v))))),
          h('p', { class: 'bigeq' }, `${a} : ${b} = ${c} : □`), h('p', null, `외항의 곱 = 내항의 곱 → ${a} × □ = ${b} × ${c} → □ = ${b * c} ÷ ${a} = ${+x.toFixed(3)}`), h('p', { class: 'muted' }, `비의 값으로도 같아요: ${a}/${b} = ${c}/${+x.toFixed(3)}`)); }
      else { const t = a + b, p1 = (N * a) / t, p2 = (N * b) / t;
        view.append(h('div', { class: 'row' }, stp('전체', () => N, 2, 100, (v) => { N = v; draw(); }), stp('앞의 비', () => a, 1, 9, (v) => { a = v; draw(); }), stp('뒤의 비', () => b, 1, 9, (v) => { b = v; draw(); })), h('div', { class: 'hbar split' }, Array.from({ length: t }, (_, i) => h('i', { style: { flex: 1, background: i < a ? '#e63946' : '#1c7ed6' } }, i + 1))),
          h('p', { class: 'bigeq' }, `${N}을(를) ${a} : ${b}로 나누면 ${+p1.toFixed(2)} 과 ${+p2.toFixed(2)}`), h('p', null, `전체 비의 합 ${a} + ${b} = ${t} → 비 1에 해당하는 양 = ${N} ÷ ${t} = ${+(N / t).toFixed(3)} → ${a}에 해당: ${+p1.toFixed(2)}, ${b}에 해당: ${+p2.toFixed(2)}`)); }
    };
    box.append(panel(null, tabs, view)); draw();
  }

  /* ================= 11. 규칙·대응 기계 ================= */
  function ruleLab(box) {
    let k = 3, c = 1, hide = false, q = 7;
    const view = h('div');
    const draw = () => {
      const xs = U.range(1, 8), ys = xs.map((x) => k * x + c);
      const W = 300, H = 170, mx = Math.max(...ys) * 1.1;
      const plot = svgh(W, H, `<line x1="30" y1="10" x2="30" y2="${H - 25}" class="ln"/><line x1="30" y1="${H - 25}" x2="${W - 6}" y2="${H - 25}" class="ln"/>` + xs.map((x, i) => `<circle cx="${30 + x * 30}" cy="${H - 25 - (ys[i] / mx) * (H - 45)}" r="5" class="pd"/><text x="${30 + x * 30}" y="${H - 8}" text-anchor="middle" class="tick">${x}</text>`).join(''));
      view.replaceChildren(
        h('div', { class: 'row' }, stp('곱하는 수', () => k, 0, 9, (v) => { k = v; draw(); }), stp('더하는 수', () => c, 0, 9, (v) => { c = v; draw(); }), h('label', { class: 'chip' }, h('input', { type: 'checkbox', checked: hide || null, onchange: (e) => { hide = e.target.checked; draw(); } }), ' 규칙 숨기기(맞혀 보기)')),
        h('div', { class: 'machine' }, h('div', { class: 'mi' }, '입력 ○'), h('div', { class: 'mb' }, hide ? '❓' : `× ${k}${c ? ' + ' + c : ''}`), h('div', { class: 'mi o' }, '출력 △')),
        h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'map xy' }, h('tbody', null, h('tr', null, [h('th', null, '○')].concat(xs.map((x) => h('td', null, String(x))))), h('tr', null, [h('th', null, '△')].concat(xs.map((x, i) => h('td', null, hide && x > 3 ? '?' : String(ys[i])))))))),
        h('div', { html: plot, class: 'gfig' }), h('p', { class: 'bigeq' }, hide ? '△ = ○ × □ + □ ... 규칙을 찾아 보세요!' : `△ = ○ × ${k}${c ? ' + ' + c : ''}`),
        hide ? h('div', { class: 'row' }, h('span', null, `○ = ${q} 일 때 △는?`), h('input', { type: 'number', id: 'rin', style: { width: '90px' } }), h('button', { class: 'btn', onclick: () => { const v = +document.getElementById('rin').value; U.toast(v === k * q + c ? '🎉 맞았어요! 규칙: ○ × ' + k + (c ? ' + ' + c : '') : '아직 아니에요. 표의 처음 세 칸으로 규칙을 찾아봐요.', v === k * q + c ? 'ok' : 'bad'); } }, '확인'), h('button', { class: 'btn w', onclick: () => { q = U.int(5, 15); draw(); } }, '다른 수')) : null);
    };
    box.append(panel(null, view)); draw();
  }

  const MODS = { bignum, array: arrayLab, fraction: fractionLab, decimal: decimalLab, clock: clockLab, angle: angleLab, area: areaLab, graph: graphLab, chance: chanceLab, ratio: ratioLab, rule: ruleLab };

  MD.pages.lab = {
    title: '조작 놀이터',
    render(root, params) {
      const m = params.m;
      if (m && MODS[m]) {
        const M = META[m], box = h('div', { class: 'labbox' });
        root.append(h('div', { class: 'row', style: { marginBottom: '12px' } }, h('a', { class: 'btn w sm', href: '#/lab' }, '← 놀이터'), h('h1', { style: { margin: 0, fontSize: '1.7rem' } }, M.icon + ' ' + M.title), h('span', { class: 'pill' }, M.grade)),
          h('p', { class: 'muted' }, M.desc), h('div', { class: 'row', style: { marginBottom: '10px' } }, h('span', { class: 'muted' }, '관련 성취기준:'), (MD.LAB_STD[m] || []).map((c) => h('span', { class: 'pill', title: MD.std.byCode[c] ? MD.std.byCode[c].text : '' }, c))), box);
        MODS[m](box); return;
      }
      root.append(h('h1', null, '🧪 조작 놀이터'), h('p', { class: 'muted' }, '연산판과 조작판의 원리를 2022 개정 교육과정의 모든 영역으로 넓힌 11가지 가상 교구예요. 직접 만지며 개념을 확인해 보세요.'),
        h('div', { class: 'tools' }, Object.entries(META).map(([k, M]) => h('a', { class: 'card tool labtool', href: '#/lab?m=' + k }, h('div', { class: 'tx' }, h('div', { class: 'big' }, M.icon), h('h3', null, M.title), h('p', { class: 'muted', style: { margin: 0, fontSize: '.9rem' } }, M.desc), h('div', { class: 'meta' }, h('span', { class: 'pill' }, M.grade), (MD.LAB_STD[k] || []).slice(0, 3).map((c) => h('span', { class: 'pill', style: { background: '#fff4c2', color: '#8a6d00' } }, c))))))));
    },
  };
})();
