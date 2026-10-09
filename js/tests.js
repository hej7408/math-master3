(function () {
  const out = []; const log = (...a) => out.push(a.join(' '));
  const U = MD.util, F = U.frac, P = MD.problems;
  let bad = 0, total = 0; const seen = {};
  const err = (t, m, p) => { bad++; const k = t + m.slice(0, 30); if (seen[k]) return; seen[k] = 1; if (bad < 12) log('✗', t, m, '\n    ', p && p.text); };
  for (const d of P.T) {
    for (const g of d.grades) {
      for (let i = 0; i < 200; i++) {
        let p; total++;
        try { p = P.make({ tpl: d.id, grade: g }); } catch (e) { err(d.id + '/g' + g, 'THROW ' + e.message + ' ' + (e.stack || '').split('\n')[1]); break; }
        if (/undefined|NaN|\[object|\(가\)|\(는\)|\(을\)|\(과\)/.test(p.text + p.sentenceDone)) { err(d.id, 'text bad', p); continue; }
        if (!p.cards.length || !p.final) { err(d.id, 'no cards/final', p); continue; }
        const f = p.final;
        if (p.eq) {
          if (!p.eq.val) { err(d.id, 'eq not evaluable ' + p.eq.show, p); continue; }
          if (f.type === 'num' || f.type === 'frac') {
            const a = F.parse(f.ans);
            if (f.unit === '%' && d.id === 'ratio-rate') { } else if (!a || !F.eq(a, p.eq.val)) { err(d.id, 'eq val ' + p.eq.show + ' = ' + F.toStr(p.eq.val) + ' vs ans ' + f.ans, p); continue; }
          }
          if (f.type === 'qr' && f.q * f.b + f.r !== f.a) err(d.id, 'qr');
          const r = P.checkEq(p, p.eq.tokens); if (!r.ok) err(d.id, 'checkEq canon fails ' + p.eq.show, p);
        }
        let r;
        if (f.type === 'num') r = P.checkFinal(p, { v: f.ans });
        else if (f.type === 'frac') { const v = F.parse(f.ans); const m = F.toMixed(v); r = P.checkFinal(p, { w: m.w || '', n: m.n, d: m.d }); }
        else if (f.type === 'qr') r = P.checkFinal(p, { q: f.q, r: f.r }); else r = P.checkFinal(p, { parts: f.ans });
        if (!r.ok) err(d.id, 'final self-check fail ' + JSON.stringify(f) + ' ' + r.msg, p);
        (p.prep || []).forEach((s) => { if (!P.checkPrep(s, s.type === 'list' ? s.ans.join(',') : s.ans)) err(d.id, 'prep self fail ' + s.q, p); });
        (p.pre || []).forEach((s) => { if (!P.checkPrep(s, s.type === 'list' ? s.ans.join(',') : s.ans)) err(d.id, 'pre self fail ' + s.q, p); });
        if (p.calc && p.calc.type === 'col') { const r2 = U.evalTokens([p.calc.a, p.calc.op, p.calc.b]); const a = F.parse(f.ans); if (!r2 || !a || !F.eq(r2, a)) err(d.id, 'col vs ans ' + p.calc.a + p.calc.op + p.calc.b + ' ' + f.ans, p); }
        if (p.calc && p.calc.type === 'units') { const c = p.calc; const A = c.a[0] * c.base + c.a[1], B = c.b[0] * c.base + c.b[1]; const R = c.op === '+' ? A + B : A - B; if (R !== f.ans[0] * c.base + f.ans[1]) err(d.id, 'units math', p); if (!U.evalTokens(p.eq.tokens)) err(d.id, 'units eq', p); }
        if (p.choices.length < 3) err(d.id, 'choices ' + p.choices, p);
        if (p.cards.length + p.decoys.length > 9) err(d.id, 'too many cards', p);
      }
    }
  }
  log('templates', P.T.length, 'generated', total, 'problems; bad', bad);
  const c = P.coverage(), std = MD.std.list, un = std.filter((s) => !c[s.code]).map((s) => s.code);
  log('standards covered', std.length - un.length, '/', std.length); log('uncovered:', un.join(' '));
  U.seed(7);
  ['add-merge', 'frac-diff', 'unit-addsub', 'mixed-change', 'average', 'prop-share', 'ratio-rate'].forEach((id) => { const p = P.make({ tpl: id }); log('\n[' + id + '/g' + p.grade + '] ' + p.text + '\n  식 ' + (p.eq && p.eq.show) + '  답 ' + p.ansText + '\n  ' + p.sentenceDone); });
  document.getElementById('out').textContent = out.join('\n'); window.__done = true;
})();
