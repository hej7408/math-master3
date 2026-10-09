/* 수학박사 master 3.0 — 공통 유틸 */
window.MD = window.MD || {};
(function () {
  const U = (MD.util = {});

  /* ---------- 난수 (seed 가능) ---------- */
  let _seed = null;
  function mulberry(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let rnd = Math.random;
  U.seed = function (s) { _seed = s; rnd = s == null ? Math.random : mulberry(s >>> 0); };
  U.rand = () => rnd();
  U.int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  U.pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  U.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  U.sample = (arr, n) => U.shuffle(arr).slice(0, n);

  /* ---------- 한글 조사 ---------- */
  /* 숫자를 읽을 때의 받침(종성 번호): 영(ㅇ) 일(ㄹ) 삼(ㅁ) 육(ㄱ) 칠(ㄹ) 팔(ㄹ) */
  const DIGIT_BATCHIM = { 0: 21, 1: 8, 2: 0, 3: 16, 4: 0, 5: 0, 6: 1, 7: 8, 8: 8, 9: 0 };
  function batchim(word) {
    const w = String(word).trim();
    const ch = w[w.length - 1];
    if (!ch) return 0;
    if (/[0-9]/.test(ch)) return DIGIT_BATCHIM[ch];
    const c = ch.charCodeAt(0);
    if (c >= 0xac00 && c <= 0xd7a3) return (c - 0xac00) % 28; // 0이면 받침 없음
    return 0;
  }
  U.batchim = batchim;
  /* josa('사과','은/는') -> '사과는' */
  U.josa = function (word, pair) {
    const [a, b] = pair.split('/');
    const bt = batchim(word);
    let j;
    if (pair === '으로/로') j = bt && bt !== 8 ? '으로' : '로';
    else j = bt ? a : b;
    return word + j;
  };
  U.J = U.josa;

  U.range = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };
  U.gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
  U.lcm = (a, b) => (a / U.gcd(a, b)) * b;

  /* ---------- 유리수 (분수·소수 정확 계산) ---------- */
  const F = (U.frac = {});
  F.make = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = U.gcd(n, d) || 1; return { n: n / g, d: d / g }; };
  F.add = (a, b) => F.make(a.n * b.d + b.n * a.d, a.d * b.d);
  F.sub = (a, b) => F.make(a.n * b.d - b.n * a.d, a.d * b.d);
  F.mul = (a, b) => F.make(a.n * b.n, a.d * b.d);
  F.div = (a, b) => (b.n === 0 ? null : F.make(a.n * b.d, a.d * b.n));
  F.eq = (a, b) => a && b && a.n === b.n && a.d === b.d;
  F.val = (a) => a.n / a.d;
  /* 문자열 → 유리수 : "12", "0.75", "3/4", "1 3/4", "1_3/4" */
  F.parse = function (s) {
    if (s == null) return null;
    s = String(s).trim().replace(/−/g, '-').replace(/,/g, '').replace(/_/g, ' ');
    let m;
    if ((m = s.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/))) {
      const w = +m[1], n = +m[2], d = +m[3]; if (!d) return null;
      return F.make(w * d + n, d);
    }
    if ((m = s.match(/^(-?\d+)\s*\/\s*(\d+)$/))) { if (!+m[2]) return null; return F.make(+m[1], +m[2]); }
    if ((m = s.match(/^(-?\d+)(?:\.(\d+))?%?$/))) {
      const dec = m[2] || '';
      const den = Math.pow(10, dec.length);
      return F.make(+(m[1] + dec) * (m[1].startsWith('-') ? 1 : 1), den);
    }
    return null;
  };
  /* 유리수 → 대분수/가분수/소수 문자열 */
  F.toMixed = (a) => { const w = Math.trunc(a.n / a.d), r = a.n - w * a.d; return { w, n: r, d: a.d }; };
  F.toStr = (a) => {
    if (a.d === 1) return String(a.n);
    const m = F.toMixed(a);
    return m.w ? `${m.w} ${m.n}/${m.d}` : `${m.n}/${m.d}`;
  };
  /* 소수 문자열 (유한소수일 때만) */
  F.toDec = (a, maxd = 6) => {
    let d = a.d, k = 0, t2 = 0, t5 = 0;
    while (d % 2 === 0) { d /= 2; t2++; } while (d % 5 === 0) { d /= 5; t5++; }
    if (d !== 1) return null; k = Math.max(t2, t5);
    const scaled = (a.n * Math.pow(10, k)) / a.d;
    let s = String(Math.abs(scaled)).padStart(k + 1, '0');
    if (k) s = s.slice(0, -k) + '.' + s.slice(-k);
    return (a.n < 0 ? '-' : '') + s;
  };

  /* ---------- 단위 원자 (예: "2시간 40분", "3m 40cm") ---------- */
  const UNITS = {
    시간: 3600, 시: 3600, 분: 60, 초: 1,
    km: 1e6, m: 1000, cm: 10, mm: 1,
    L: 1000, mL: 1,
    t: 1e6, kg: 1000, g: 1,
  };
  U.UNITS = UNITS;
  U.parseAtom = function (tok) {
    // 숫자 + 단위 한 개 이상이면 단위 값으로 합산 (정수/소수 허용)
    const re = /(\d+(?:\.\d+)?)\s*(시간|시|분|초|mL|mm|km|cm|kg|m|L|g|t)/g;
    let m, tot = F.make(0), any = false, rest = tok;
    while ((m = re.exec(tok))) {
      any = true;
      tot = F.add(tot, F.mul(F.parse(m[1]), F.make(UNITS[m[2]], 1)));
    }
    if (!any) return null;
    const left = tok.replace(re, '').trim();
    if (left) return null;
    return tot;
  };

  /* ---------- 식 계산기 (토큰 배열) ---------- */
  const PREC = { '+': 1, '−': 1, '-': 1, '×': 2, '÷': 2, '*': 2, '/': 2 };
  U.evalTokens = function (tokens) {
    const out = [], ops = [];
    const apply = (op) => {
      const b = out.pop(), a = out.pop();
      if (!a || !b) throw 0;
      let r;
      if (op === '+') r = F.add(a, b);
      else if (op === '−' || op === '-') r = F.sub(a, b);
      else if (op === '×' || op === '*') r = F.mul(a, b);
      else r = F.div(a, b);
      if (!r) throw 0;
      out.push(r);
    };
    try {
      let prevNum = false;
      for (const t of tokens) {
        if (t === '(') { ops.push(t); prevNum = false; }
        else if (t === ')') { while (ops.length && ops[ops.length - 1] !== '(') apply(ops.pop()); if (!ops.length) throw 0; ops.pop(); prevNum = true; }
        else if (PREC[t]) {
          if (!prevNum) throw 0;
          while (ops.length && ops[ops.length - 1] !== '(' && PREC[ops[ops.length - 1]] >= PREC[t]) apply(ops.pop());
          ops.push(t); prevNum = false;
        } else {
          if (prevNum) throw 0;
          const v = U.parseAtom(t) || F.parse(t);
          if (!v) throw 0; out.push(v); prevNum = true;
        }
      }
      if (!prevNum) throw 0;
      while (ops.length) { const o = ops.pop(); if (o === '(') throw 0; apply(o); }
      return out.length === 1 ? out[0] : null;
    } catch (e) { return null; }
  };

  /* ---------- 숫자 표시 ---------- */
  U.fmt = (n) => String(n);
  /* 큰 수 한글 읽기: 345600000 → 삼억 사천오백육십만 */
  const KD = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  function read4(n) {
    let s = '';
    const u = ['천', '백', '십', ''];
    const ds = String(n).padStart(4, '0');
    for (let i = 0; i < 4; i++) {
      const d = +ds[i]; if (!d) continue;
      s += (d === 1 && i < 3 ? '' : KD[d]) + u[i];
    }
    return s;
  }
  U.readKorean = function (numStr) {
    const s = String(numStr).replace(/^0+(?=\d)/, '');
    if (s === '0') return '영';
    const units = ['', '만', '억', '조', '경'];
    const parts = [];
    for (let i = s.length; i > 0; i -= 4) parts.unshift(s.slice(Math.max(0, i - 4), i));
    let r = '';
    parts.forEach((p, idx) => {
      const n = +p; if (!n) return;
      const u = units[parts.length - 1 - idx];
      r += (n === 1 && u && false ? '' : read4(n)) + u + ' ';
    });
    return r.trim();
  };
  U.won = (n) => n.toLocaleString('ko-KR') + '원';

  /* ---------- 저장소 (학습 기록) ---------- */
  const KEY = 'mathdoctor3.progress.v1';
  U.store = {
    load() { try { return JSON.parse(localStorage.getItem(KEY)) || { solved: 0, tries: 0, stars: 0, byStd: {}, byGrade: {}, log: [], diag: null, name: '' }; } catch (e) { return { solved: 0, tries: 0, stars: 0, byStd: {}, byGrade: {}, log: [], diag: null, name: '' }; } },
    save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} },
    record(std, grade, ok) {
      const d = U.store.load();
      d.tries++; if (ok) { d.solved++; d.stars++; }
      (std || []).forEach((s) => { const o = (d.byStd[s] = d.byStd[s] || { ok: 0, n: 0 }); o.n++; if (ok) o.ok++; });
      const g = (d.byGrade[grade] = d.byGrade[grade] || { ok: 0, n: 0 }); g.n++; if (ok) g.ok++;
      d.log.push({ t: Date.now(), grade, ok: ok ? 1 : 0 }); if (d.log.length > 300) d.log.shift();
      U.store.save(d); return d;
    },
    reset() { try { localStorage.removeItem(KEY); } catch (e) {} },
  };

  /* ---------- DOM 헬퍼 ---------- */
  U.h = function (tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') { for (const sk in v) { if (sk.startsWith('--')) el.style.setProperty(sk, v[sk]); else el.style[sk] = v[sk]; } }
      else el.setAttribute(k, v === true ? '' : v);
    }
    kids.flat(Infinity).forEach((c) => { if (c == null || c === false) return; el.append(c.nodeType ? c : document.createTextNode(c)); });
    return el;
  };
  U.esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  U.toast = function (msg, kind) {
    let box = document.getElementById('toast');
    if (!box) { box = U.h('div', { id: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(box); }
    box.className = 'show ' + (kind || '');
    box.textContent = msg;
    clearTimeout(U._tt); U._tt = setTimeout(() => (box.className = ''), 2200);
  };
})();
