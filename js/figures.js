/* 문제에 함께 나오는 그림(도형·표·그래프) — SVG/HTML 문자열을 돌려줍니다 */
window.MD = window.MD || {};
(function () {
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const num = (v) => parseFloat(v);
  const svg = (w, h, body, cls) => `<svg class="fig ${cls || ''}" viewBox="0 0 ${w} ${h}" role="img" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const T = (x, y, s, o) => `<text x="${x}" y="${y}" text-anchor="${(o && o.a) || 'middle'}" class="${(o && o.c) || ''}">${esc(s)}</text>`;
  const L = (x1, y1, x2, y2, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c || 'ln'}"/>`;
  const COL = ['#e63946', '#1c7ed6', '#f2b705', '#2f9e44', '#7048e8', '#f76707', '#0c8599', '#c2255c'];

  function scaleBox(w, h, W, H) { const s = Math.min(W / w, H / h); return [w * s, h * s]; }

  const R = {
    fracbar({ n, d }) {
      const W = 280, H = 56, cw = W / d; let b = '';
      for (let i = 0; i < d; i++) b += `<rect x="${i * cw + 2}" y="8" width="${cw - 2}" height="38" rx="4" class="${i < n ? 'sh' : 'un'}"/>`;
      return svg(W + 4, H, b);
    },
    rect({ w, h, unit }) {
      const [rw, rh] = scaleBox(num(w), num(h), 200, 110), x = 50, y = 18;
      return svg(300, 150, `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" class="sh2"/>${T(x + rw / 2, y + rh + 18, w + ' ' + unit)}${T(x - 8, y + rh / 2 + 4, h + ' ' + unit, { a: 'end' })}`);
    },
    para({ b, h }) {
      const [rw, rh] = scaleBox(num(b) + 4, num(h), 220, 100), s = 30, x = 40, y = 18, top = y, bot = y + rh, bw = rw - s;
      return svg(310, 150, `<polygon points="${x + s},${top} ${x + s + bw},${top} ${x + bw},${bot} ${x},${bot}" class="sh2"/>${L(x + s, top, x + s, bot, 'dash')}${T(x + bw / 2, bot + 18, '밑변 ' + b + ' cm')}${T(x + s - 6, (top + bot) / 2 + 4, '높이 ' + h + ' cm', { a: 'end' })}`);
    },
    tri({ b, h, label }) {
      const [rw, rh] = scaleBox(num(b), num(h), 200, 100), x = 50, y = 18, bot = y + rh, ap = x + rw * 0.35;
      return svg(300, 150, `<polygon points="${ap},${y} ${x + rw},${bot} ${x},${bot}" class="sh2"/>` + (label === 'eq' ? T((x + rw / 2), bot + 18, `한 변 ${b} cm`) : `${L(ap, y, ap, bot, 'dash')}${T(x + rw / 2, bot + 18, '밑변 ' + b + ' cm')}${T(ap - 6, (y + bot) / 2 + 4, '높이 ' + h + ' cm', { a: 'end' })}`));
    },
    trap({ a, b, h }) {
      const mx = Math.max(a, b), [rw, rh] = scaleBox(mx + 4, num(h), 220, 100), wa = (rw * a) / (mx + 4), wb = (rw * b) / (mx + 4), x = 40, y = 18, bot = y + rh, off = 14;
      return svg(310, 150, `<polygon points="${x + off},${y} ${x + off + wa},${y} ${x + wb},${bot} ${x},${bot}" class="sh2"/>${L(x + off, y, x + off, bot, 'dash')}${T(x + off + wa / 2, y - 4, '윗변 ' + a + ' cm')}${T(x + wb / 2, bot + 18, '아랫변 ' + b + ' cm')}${T(x + off - 6, (y + bot) / 2 + 4, '높이 ' + h, { a: 'end' })}`);
    },
    rhomb({ d1, d2 }) {
      const [rw, rh] = scaleBox(num(d1), num(d2), 200, 100), cx = 150, cy = 70;
      return svg(300, 150, `<polygon points="${cx},${cy - rh / 2} ${cx + rw / 2},${cy} ${cx},${cy + rh / 2} ${cx - rw / 2},${cy}" class="sh2"/>${L(cx - rw / 2, cy, cx + rw / 2, cy, 'dash')}${L(cx, cy - rh / 2, cx, cy + rh / 2, 'dash')}${T(cx + rw / 4, cy - 5, d1 + ' cm')}${T(cx + 6, cy + rh / 4, d2 + ' cm', { a: 'start' })}`);
    },
    circle({ r, d }) {
      const R0 = 54, cx = 150, cy = 72;
      return svg(300, 150, `<circle cx="${cx}" cy="${cy}" r="${R0}" class="sh2"/><circle cx="${cx}" cy="${cy}" r="2.5" class="dot"/>` + (d ? `${L(cx - R0, cy, cx + R0, cy, 'dash')}${T(cx, cy - 6, '지름 ' + d + ' cm')}` : `${L(cx, cy, cx + R0, cy, 'dash')}${T(cx + R0 / 2, cy - 6, '반지름 ' + r + ' cm')}`));
    },
    box({ l, w, h }) {
      const mx = Math.max(l, w, h), k = 90 / mx, fl = Math.max(30, l * k), fh = Math.max(24, h * k), dw = Math.max(18, w * k * 0.6), x = 50, y = 40 + 20;
      return svg(300, 160, `<polygon points="${x},${y} ${x + fl},${y} ${x + fl + dw},${y - dw * 0.7} ${x + dw},${y - dw * 0.7}" class="sh3"/><rect x="${x}" y="${y}" width="${fl}" height="${fh}" class="sh2"/><polygon points="${x + fl},${y} ${x + fl + dw},${y - dw * 0.7} ${x + fl + dw},${y - dw * 0.7 + fh} ${x + fl},${y + fh}" class="sh4"/>${T(x + fl / 2, y + fh + 16, '가로 ' + l)}${T(x + fl + dw + 8, y + fh / 2 - 6, '높이 ' + h, { a: 'start' })}${T(x + fl + dw / 2 + 8, y - dw * 0.35 - 6, '세로 ' + w, { a: 'start' })}`);
    },
    angles({ kind, vals }) {
      const q = (v) => (v === '□' ? '□' : v + '°');
      if (kind === 'tri') return svg(300, 150, `<polygon points="150,18 262,128 38,128" class="sh2"/>${T(150, 56, q(vals[2]), { c: 'qq' })}${T(76, 118, q(vals[0]))}${T(224, 118, q(vals[1]))}`);
      if (kind === 'quad') return svg(300, 150, `<polygon points="60,22 250,34 270,128 36,118" class="sh2"/>${T(78, 50, q(vals[0]))}${T(228, 56, q(vals[1]))}${T(246, 116, q(vals[2]), {})}${T(66, 106, q(vals[3]), { c: 'qq' })}`);
      return svg(300, 130, `${L(20, 100, 280, 100, 'ln')}${L(110, 100, 190, 20, 'ln')}${T(140, 92, q(vals[0]))}${T(220, 92, q(vals[1]), { c: 'qq' })}`);
    },
    seq({ terms }) {
      return `<div class="seqchips">${terms.map((t, i) => `<span class="chip ${t === '□' ? 'qq' : ''}">${esc(t)}</span>`).join('<span class="arrow">→</span>')}</div>`;
    },
    table({ head, rows }) {
      return `<table class="ftable"><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    },
    xy({ x, y, xl, yl }) {
      return `<table class="ftable"><tbody><tr><th>${esc(xl)} 수 (○)</th>${x.map((v) => `<td>${v}</td>`).join('')}<td>…</td></tr><tr><th>${esc(yl)} 수 (△)</th>${y.map((v) => `<td>${v}</td>`).join('')}<td>…</td></tr></tbody></table>`;
    },
    picto({ rows }) {
      return `<div class="picto">${rows.map((r) => `<div class="prow"><b>${esc(r.label)}</b><span>${'<i class="big">◎</i>'.repeat(r.big)}${'<i class="small">○</i>'.repeat(r.small)}</span></div>`).join('')}<div class="legend"><i class="big">◎</i> 10명 &nbsp; <i class="small">○</i> 1명</div></div>`;
    },
    bars({ labels, values, unit }) {
      const W = 300, H = 170, mx = Math.max(...values) * 1.15, bw = 40, gap = (W - 50 - bw * values.length) / (values.length + 1);
      let b = L(40, 20, 40, 140) + L(40, 140, W - 6, 140);
      [0, 0.5, 1].forEach((f) => { const yy = 140 - 120 * f * (Math.max(...values) / mx); b += L(37, yy, 42, yy) + T(34, yy + 4, Math.round(Math.max(...values) * f), { a: 'end', c: 'tick' }); });
      values.forEach((v, i) => { const x = 40 + gap * (i + 1) + bw * i, hh = (v / mx) * 120; b += `<rect x="${x}" y="${140 - hh}" width="${bw}" height="${hh}" fill="${COL[i % 8]}" rx="3"/>${T(x + bw / 2, 140 - hh - 5, v)}${T(x + bw / 2, 156, labels[i])}`; });
      return svg(W, H, b + T(14, 16, '(' + unit + ')', { a: 'start', c: 'tick' }));
    },
    line({ labels, values, unit }) {
      const W = 300, H = 170, lo = Math.min(...values) - 2, hi = Math.max(...values) + 2, n = values.length, px = (i) => 56 + (i * (W - 80)) / (n - 1), py = (v) => 140 - ((v - lo) / (hi - lo)) * 115;
      let b = L(40, 20, 40, 140) + L(40, 140, W - 6, 140), pts = values.map((v, i) => px(i) + ',' + py(v)).join(' ');
      b += `<polyline points="${pts}" class="pl"/>`;
      values.forEach((v, i) => { b += `<circle cx="${px(i)}" cy="${py(v)}" r="4" class="pd"/>${T(px(i), py(v) - 9, v)}${T(px(i), 156, labels[i], { c: 'tick' })}`; });
      return svg(W, H, b + T(14, 16, '(' + unit + ')', { a: 'start', c: 'tick' }));
    },
    pie({ items }) {
      let a0 = -Math.PI / 2, b = '';
      items.forEach((it, i) => {
        const a1 = a0 + (it.pct / 100) * Math.PI * 2, r = 60, cx = 90, cy = 80, x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        b += `<path d="M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${it.pct > 50 ? 1 : 0} 1 ${x1},${y1} Z" fill="${it.q ? '#dee2e6' : COL[i % 8]}" stroke="#fff" stroke-width="2"/>`;
        b += `<rect x="190" y="${28 + i * 24}" width="14" height="14" rx="3" fill="${it.q ? '#dee2e6' : COL[i % 8]}"/>${T(210, 40 + i * 24, it.label + ' ' + (it.q ? '□' : it.pct) + '%', { a: 'start' })}`;
        a0 = a1;
      });
      return svg(310, 160, b);
    },
    band({ items }) {
      let x = 10, b = '';
      items.forEach((it, i) => { const w = (it.pct / 100) * 280; b += `<rect x="${x}" y="30" width="${w}" height="40" fill="${COL[i % 8]}" stroke="#fff" stroke-width="2"/>${T(x + w / 2, 55, it.label + ' ' + it.pct + '%', { c: 'wt' })}`; x += w; });
      return svg(300, 100, b + T(150, 92, '전체 100%', { c: 'tick' }));
    },
    clock({ h, m }) {
      const cx = 100, cy = 85, r = 66; let b = `<circle cx="${cx}" cy="${cy}" r="${r}" class="clockface"/>`;
      for (let i = 1; i <= 12; i++) { const a = (i * Math.PI) / 6 - Math.PI / 2; b += T(cx + (r - 14) * Math.cos(a), cy + (r - 14) * Math.sin(a) + 4, i, { c: 'cn' }); }
      for (let i = 0; i < 60; i++) { const a = (i * Math.PI) / 30 - Math.PI / 2, r2 = i % 5 ? r - 3 : r - 6; b += L(cx + r * Math.cos(a), cy + r * Math.sin(a), cx + r2 * Math.cos(a), cy + r2 * Math.sin(a), 'tickl'); }
      const ha = ((h % 12) + m / 60) * (Math.PI / 6) - Math.PI / 2, ma = m * (Math.PI / 30) - Math.PI / 2;
      b += L(cx, cy, cx + 36 * Math.cos(ha), cy + 36 * Math.sin(ha), 'hand h') + L(cx, cy, cx + 54 * Math.cos(ma), cy + 54 * Math.sin(ma), 'hand m') + `<circle cx="${cx}" cy="${cy}" r="4" class="dot"/>`;
      return svg(200, 170, b, 'clock');
    },
    sym({ a }) {
      return svg(300, 130, `${L(150, 8, 150, 122, 'dash')}<circle cx="${150 - 70}" cy="62" r="5" class="dot"/><circle cx="${150 + 70}" cy="62" r="5" class="dot"/>${L(80, 62, 220, 62, 'ln')}${T(80, 50, 'ㄱ')}${T(220, 50, "ㄱ'")}${T(115, 78, a + ' cm')}${T(185, 78, a + ' cm')}${T(150, 120, '대칭축', { c: 'tick' })}`);
    },
  };
  MD.fig = { render(f) { return f && R[f.type] ? R[f.type](f) : ''; } };
})();
