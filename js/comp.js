/* 공용 컴포넌트: 분수 표기, 키워드 강조, 그림카드, 시각 모형, 세로식 칸, 단계별 입력 */
window.MD = window.MD || {};
(function () {
  const U = MD.util, h = U.h, F = U.frac, P = MD.problems;
  const C = (MD.comp = {});

  /* ---------- 분수/토큰 표기 ---------- */
  C.frac = (n, d) => h('span', { class: 'frac' }, h('i', null, n), h('i', null, d));
  C.tok = function (t) {
    let m;
    if ((m = /^(\d+)\/(\d+)$/.exec(t))) return C.frac(m[1], m[2]);
    if ((m = /^(\d+) (\d+)\/(\d+)$/.exec(t))) return h('span', { class: 'mixed' }, m[1], C.frac(m[2], m[3]));
    return document.createTextNode(t);
  };
  C.tokens = (arr) => { const f = document.createDocumentFragment(); arr.forEach((t, i) => { if (i) f.append(' '); f.append(/^[+−×÷()]$/.test(t) ? h('span', { class: 'op' }, t) : C.tok(t)); }); return f; };

  /* ---------- 문제 글 강조 ---------- */
  C.hlText = function (text, kw, focusQuestion) {
    const marks = [];
    (kw || []).forEach((k) => { let i = text.indexOf(k); while (i >= 0) { marks.push([i, i + k.length]); i = text.indexOf(k, i + k.length); } });
    marks.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    const merged = [];
    marks.forEach((m) => { const l = merged[merged.length - 1]; if (l && m[0] <= l[1]) l[1] = Math.max(l[1], m[1]); else merged.push(m.slice()); });
    const frag = document.createDocumentFragment();
    const plain = (s) => s.split(/(\d+(?:\.\d+)?(?:\/\d+)?)/).forEach((x, i) => { if (i % 2) frag.append(h('b', { class: 'num' }, x)); else if (x) frag.append(x); });
    let pos = 0;
    merged.forEach(([a, b]) => { plain(text.slice(pos, a)); frag.append(h('mark', { class: 'kw' }, text.slice(a, b))); pos = b; });
    plain(text.slice(pos));
    return frag;
  };
  C.findKw = (text, kind) => (MD.std.KINDS[kind].keywords || []).filter((k) => text.includes(k));

  /* ---------- 그림카드 ---------- */
  C.gcard = function (c, grade, opts) {
    opts = opts || {};
    const el = h('button', { class: 'gcard' + (opts.cls ? ' ' + opts.cls : ''), style: { '--gc': MD.std.GRADE_COLOR[grade] || '#1c7ed6' }, 'aria-label': `${c.label} ${c.value}${c.unit}`, onclick: opts.onclick },
      h('span', { class: 'gl' }, c.label), h('span', { class: 'ge' }, c.e), h('span', { class: 'gv' }, C.tok(c.value), h('small', null, c.unit)));
    return el;
  };

  /* ---------- 시각 모형 ---------- */
  function blocks(n) {
    const hh = Math.floor(n / 100), t = Math.floor((n % 100) / 10), o = n % 10;
    return h('div', { class: 'btb' },
      hh ? h('div', { class: 'bg' }, Array.from({ length: hh }, () => h('i', { class: 'bt-h' }))) : null,
      t ? h('div', { class: 'bg' }, Array.from({ length: t }, () => h('i', { class: 'bt-t' }))) : null,
      o ? h('div', { class: 'bg' }, Array.from({ length: o }, () => h('i', { class: 'bt-o' }))) : null);
  }
  C.blocks = blocks;
  C.visEl = function (c, ctx) {
    const v = String(c.value), n = parseFloat(v);
    let vis = c.vis;
    if (vis === 'icons' && (!/^\d+$/.test(v) || n > 30)) vis = /^\d+$/.test(v) && n < 1000 ? 'blocks' : 'bar';
    if (vis === 'blocks' && (!/^\d+$/.test(v) || n >= 1000)) vis = 'num';
    if (vis === 'icons') { const g = h('div', { class: 'icons' }); for (let i = 0; i < n; i++) g.append(h('span', { class: i && i % 5 === 0 ? 'gap5' : '' }, c.e)); return g; }
    if (vis === 'blocks') return h('div', { class: 'vblocks' }, blocks(n), h('small', null, `${n}`));
    if (vis === 'frac') {
      let m, W = 220, parts = 0, sh = 0, whole = 0;
      if ((m = /^(\d+)\/(\d+)$/.exec(v))) { sh = +m[1]; parts = +m[2]; }
      else if ((m = /^(\d+) (\d+)\/(\d+)$/.exec(v))) { whole = +m[1]; sh = +m[2]; parts = +m[3]; }
      else if (/^\d+$/.test(v)) { parts = n; sh = 0; }
      if (!parts) return h('div', { class: 'vnum' }, v);
      const bar = (s) => h('div', { class: 'fbar' }, Array.from({ length: parts }, (_, i) => h('i', { class: i < s ? 'sh' : '' })));
      const out = h('div', { class: 'fbars' });
      for (let i = 0; i < whole; i++) out.append(bar(parts));
      out.append(bar(sh)); return out;
    }
    if (vis === 'bar') {
      const mx = (ctx && ctx.max) || n || 1; const pct = Math.max(6, Math.min(100, (Math.abs(n) / mx) * 100));
      const fv = /\//.test(v) ? F.val(F.parse(v)) : n; const p2 = /\//.test(v) ? Math.max(6, Math.min(100, (fv / ((ctx && ctx.max) || fv || 1)) * 100)) : pct;
      return h('div', { class: 'vbar' }, h('i', { style: { width: p2 + '%' } }));
    }
    return h('div', { class: 'vnum' }, C.tok(v), h('small', null, c.unit));
  };

  /* ---------- 세로식 격자 ---------- */
  const sp = (s) => { s = String(s); const [i, d = ''] = s.split('.'); return { i, d, dot: s.includes('.') }; };
  C.layout = function (op, a, b, res) {
    const A = sp(a), B = sp(b), R = sp(res), dec = op !== '×';
    const I = Math.max(A.i.length, B.i.length, R.i.length), D = dec ? Math.max(A.d.length, B.d.length, R.d.length) : 0;
    const cols = I + (D ? D + 1 : 0);
    const place = (s) => { const x = sp(s), arr = Array(cols).fill(''); for (let k = 0; k < x.i.length; k++) arr[I - x.i.length + k] = x.i[k]; if (D) { if (x.dot) arr[I] = '.'; for (let k = 0; k < x.d.length; k++) arr[I + 1 + k] = x.d[k]; } return arr; };
    return { I, D, cols, A: place(a), B: place(b), R: place(res), decStart: D ? I : -1 };
  };
  function wire(inputs) {
    inputs.forEach((e, i) => {
      e.addEventListener('input', () => { e.value = e.value.replace(/[^0-9.]/g, '').slice(-1); e.classList.remove('wrong'); if (e.value && inputs[i + 1]) inputs[i + 1].focus(); });
      e.addEventListener('keydown', (ev) => {
        if (ev.key === 'Backspace' && !e.value && inputs[i - 1]) { inputs[i - 1].focus(); inputs[i - 1].value = ''; ev.preventDefault(); }
        if (ev.key === 'ArrowLeft' && inputs[i - 1]) inputs[i - 1].focus();
        if (ev.key === 'ArrowRight' && inputs[i + 1]) inputs[i + 1].focus();
      });
      e.addEventListener('focus', () => e.select());
    });
  }
  /* mode 4: 두 수를 써 넣기 / mode 5: 결과 계산 / mode 'view': 정답까지 모두 표시 */
  C.colForm = function (p, mode) {
    const c = p.calc, L = C.layout(c.op, c.a, c.b, p.final.ans);
    const el = h('div', { class: 'vform', style: { '--cols': L.cols } });
    const ins = { A: [], B: [], R: [], M: [] };
    const cellRow = (vals, key, editable, cls) => {
      const row = h('div', { class: 'vrow ' + (cls || '') }, h('span', { class: 'vop' }, key === 'B' ? c.op : ''));
      vals.forEach((v, i) => {
        if (editable) { const e = h('input', { class: 'vc' + (v === '.' ? ' dotc' : ''), inputmode: 'decimal', maxlength: 1, 'aria-label': `${key === 'R' ? '답' : key === 'A' ? '위' : '아래'} ${i + 1}번째 칸` }); ins[key].push(e); row.append(e); }
        else row.append(h('span', { class: 'vc st' + (v === '.' ? ' dotc' : '') }, v));
      });
      if (editable) wire(ins[key]);
      return row;
    };
    if (mode === 5 || mode === 'view') {
      const memo = h('div', { class: 'vrow memo' }, h('span', { class: 'vop' }));
      for (let i = 0; i < L.cols; i++) { if (mode === 5) { const e = h('input', { class: 'vc mm', maxlength: 2, placeholder: '·', 'aria-label': '받아올림 메모' }); ins.M.push(e); memo.append(e); } else memo.append(h('span', { class: 'vc mm' })); }
      el.append(memo);
    }
    el.append(cellRow(L.A, 'A', mode === 4, mode === 4 ? '' : ''));
    el.append(cellRow(L.B, 'B', mode === 4, ''));
    el.append(h('div', { class: 'vline' }));
    el.append(mode === 5 ? cellRow(L.R, 'R', true, 'res') : mode === 'view' ? cellRow(L.R, 'R', false, 'res') : h('div', { class: 'vrow res' }, h('span', { class: 'vop' }), Array.from({ length: L.cols }, () => h('span', { class: 'vc st' }))));
    /* 검사 */
    const ok4 = () => {
      let good = true;
      ['A', 'B'].forEach((k) => ins[k].forEach((e, i) => {
        const exp = L[k][i], got = e.value.trim(), dpos = L.D && i > L.I; // 소수 부분 끝자리 0 허용
        const okc = got === exp || (!exp && got === '0' && dpos) ;
        e.classList.toggle('wrong', !okc); if (!okc) good = false;
      }));
      return good;
    };
    const readRes = () => ins.R.map((e) => e.value.trim()).join('');
    return { el, ins, L, ok4, readRes, fill4() { ['A', 'B'].forEach((k) => ins[k].forEach((e, i) => (e.value = L[k][i]))); }, fill5() { ins.R.forEach((e, i) => (e.value = L.R[i])); }, firstInput() { return (mode === 4 ? ins.A : ins.R).find((x) => x); } };
  };
  C.unitsForm = function (p, mode) {
    const c = p.calc, n = c.units.length, el = h('div', { class: 'vform units', style: { '--cols': n } });
    const ins = { A: [], B: [], R: [], M: [] };
    const hdr = h('div', { class: 'vrow uh' }, h('span', { class: 'vop' }), c.units.map((u) => h('span', { class: 'vc uhd' }, u)));
    el.append(hdr);
    if (mode === 5) { const m = h('div', { class: 'vrow memo' }, h('span', { class: 'vop' })); c.units.forEach(() => { const e = h('input', { class: 'vc mm', maxlength: 2, placeholder: c.op === '+' ? '+1' : '−1', 'aria-label': '받아올림·받아내림 메모' }); ins.M.push(e); m.append(e); }); el.append(m); }
    const row = (vals, key, editable, cls) => {
      const r = h('div', { class: 'vrow ' + (cls || '') }, h('span', { class: 'vop' }, key === 'B' ? c.op : ''));
      vals.forEach((v, i) => { if (editable) { const e = h('input', { class: 'vc wide', inputmode: 'numeric', maxlength: 3, 'aria-label': `${c.units[i]} 칸` }); e.addEventListener('input', () => { e.value = e.value.replace(/\D/g, ''); e.classList.remove('wrong'); }); ins[key].push(e); r.append(e); } else r.append(h('span', { class: 'vc st wide' }, String(v))); });
      return r;
    };
    el.append(row(c.a, 'A', mode === 4)); el.append(row(c.b, 'B', mode === 4)); el.append(h('div', { class: 'vline' }));
    el.append(mode === 5 ? row(p.final.ans, 'R', true, 'res') : mode === 'view' ? row(p.final.ans, 'R', false, 'res') : row(c.a.map(() => ''), 'R', false, 'res'));
    return {
      el, ins,
      ok4() { let g = true; ['A', 'B'].forEach((k) => ins[k].forEach((e, i) => { const okc = +e.value === (k === 'A' ? c.a : c.b)[i] && e.value !== ''; e.classList.toggle('wrong', !okc); if (!okc) g = false; })); return g; },
      readParts() { return ins.R.map((e) => e.value); },
      fill4() { ins.A.forEach((e, i) => (e.value = c.a[i])); ins.B.forEach((e, i) => (e.value = c.b[i])); }, fill5() { ins.R.forEach((e, i) => (e.value = p.final.ans[i])); },
      firstInput() { return (mode === 4 ? ins.A : ins.R)[0]; },
    };
  };

  /* ---------- 단계별 입력 (□ 채우기) ---------- */
  C.fillList = function (steps, opts) {
    opts = opts || {};
    const wrap = h('div', { class: 'fills' });
    const rows = [], tries = steps.map(() => 0);
    let done = 0;
    const unlock = (i) => { if (rows[i]) rows[i].el.classList.remove('lock'); if (rows[i] && rows[i].input) setTimeout(() => rows[i].input.focus(), 30); };
    steps.forEach((s, i) => {
      const input = h('input', { type: 'text', inputmode: s.type === 'list' ? 'text' : 'decimal', placeholder: s.type === 'list' ? '예: 1, 2, 3' : '', class: 'fin', 'aria-label': '답 입력' });
      const msg = h('span', { class: 'fmsg' });
      const btn = h('button', { class: 'btn sm', onclick: () => check() }, '확인');
      const show = h('button', { class: 'btn w sm hidden', onclick: () => { input.value = Array.isArray(s.ans) ? s.ans.join(', ') : s.ans; check(true); } }, '정답 보기');
      const q = String(s.q), at = q.lastIndexOf('□');
      const qEl = h('span', { class: 'fq' }, at >= 0 ? [q.slice(0, at), input, q.slice(at + 1)] : [q, ' ', input]);
      const el = h('div', { class: 'fill' + (i ? ' lock' : '') }, h('span', { class: 'fn' }, String(i + 1)), qEl, btn, show, msg);
      const check = (auto) => {
        if (el.classList.contains('okd')) return;
        if (P.checkPrep(s, input.value)) {
          el.classList.add('okd'); input.disabled = true; btn.classList.add('hidden'); show.classList.add('hidden'); msg.textContent = '✓ 맞아요!'; msg.className = 'fmsg ok';
          done++; opts.onStep && opts.onStep(i);
          if (done === steps.length) opts.onDone && opts.onDone(); else unlock(i + 1);
        } else {
          tries[i]++; msg.textContent = input.value.trim() ? '다시 생각해 볼까요?' : '답을 써 보세요.'; msg.className = 'fmsg bad'; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
          opts.onWrong && opts.onWrong(); if (tries[i] >= 2) show.classList.remove('hidden');
        }
      };
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
      rows.push({ el, input, check });
      wrap.append(el);
    });
    return { el: wrap, solveAll() { rows.forEach((r, i) => { const s = steps[i]; r.input.value = Array.isArray(s.ans) ? s.ans.join(', ') : s.ans; r.el.classList.remove('lock'); r.check(true); }); }, count: steps.length, focus() { if (rows[0]) rows[0].input.focus(); } };
  };

  /* ---------- 최종 답 입력 ---------- */
  C.finalInput = function (p, opts) {
    const f = p.final, el = h('div', { class: 'finput' });
    let read;
    const lbl = (t) => h('span', { class: 'unitlbl' }, t || '');
    if (f.type === 'num') { const i = h('input', { type: 'text', inputmode: 'decimal', class: 'fin big', 'aria-label': '답' }); el.append(h('span', { class: 'ans-l' }, '답:'), i, lbl(f.unit)); read = () => ({ v: i.value }); i.addEventListener('keydown', (e) => e.key === 'Enter' && opts.onSubmit()); el.fill = () => (i.value = f.ans); }
    else if (f.type === 'frac') {
      const w = h('input', { type: 'text', inputmode: 'numeric', class: 'fin sm', 'aria-label': '자연수 부분(없으면 비워요)', placeholder: '' }), n = h('input', { type: 'text', inputmode: 'numeric', class: 'fin sm', 'aria-label': '분자' }), d = h('input', { type: 'text', inputmode: 'numeric', class: 'fin sm', 'aria-label': '분모' });
      el.append(h('span', { class: 'ans-l' }, '답:'), h('span', { class: 'fwhole' }, w, h('small', null, '자연수')), h('span', { class: 'fstack' }, n, h('i', { class: 'fl' }), d), lbl(f.unit));
      read = () => ({ w: w.value, n: n.value, d: d.value }); el.fill = () => { const m = F.toMixed(F.parse(f.ans)); w.value = m.w || ''; n.value = m.n; d.value = m.d; if (!m.n) { n.value = 0; } };
      [w, n, d].forEach((x) => x.addEventListener('keydown', (e) => e.key === 'Enter' && opts.onSubmit()));
    } else if (f.type === 'qr') {
      const q = h('input', { type: 'text', inputmode: 'numeric', class: 'fin sm', 'aria-label': '몫' }), r = h('input', { type: 'text', inputmode: 'numeric', class: 'fin sm', 'aria-label': '나머지' });
      el.append(h('span', { class: 'ans-l' }, '몫:'), q, lbl(f.unit), h('span', { class: 'ans-l' }, '나머지:'), r, lbl(f.unit2 || f.unit)); read = () => ({ q: q.value, r: r.value }); el.fill = () => { q.value = f.q; r.value = f.r; };
      [q, r].forEach((x) => x.addEventListener('keydown', (e) => e.key === 'Enter' && opts.onSubmit()));
    } else {
      const ins = f.units.map((u) => { const i = h('input', { type: 'text', inputmode: 'numeric', class: 'fin sm', 'aria-label': u }); i.addEventListener('keydown', (e) => e.key === 'Enter' && opts.onSubmit()); return [i, u]; });
      el.append(h('span', { class: 'ans-l' }, '답:'), ins.map(([i, u]) => [i, lbl(u)])); read = () => ({ parts: ins.map(([i]) => i.value) }); el.fill = () => ins.forEach(([i], k) => (i.value = f.ans[k]));
    }
    el.read = read; return el;
  };
})();
