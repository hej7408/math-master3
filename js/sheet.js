/* 활동지 만들기 — 연산판 6단계 칸이 있는 인쇄용 학습지 */
(function () {
  const U = MD.util, h = U.h, P = MD.problems, S = MD.std, C = MD.comp;
  MD.pages.sheet = {
    title: '활동지',
    render(root, params) {
      const o = { grade: +params.grade || MD.state.grade || 2, domain: params.domain || MD.state.domain || 'all', std: 'all', count: 6, seed: +params.seed || U.int(1, 99999), key: true, boxes: true };
      const ctl = h('div', { class: 'card sheet-ctl noprint' }), out = h('div', { class: 'sheet-print' });
      root.append(h('h1', { class: 'noprint' }, '🖨️ 활동지 만들기'), ctl, out);

      function build() {
        U.seed(o.seed);
        const list = [], used = new Set();
        for (let i = 0; i < o.count; i++) {
          let p = null;
          for (let t = 0; t < 12; t++) { p = P.make({ grade: o.grade, domain: o.domain === 'all' ? undefined : o.domain, std: o.std === 'all' ? undefined : o.std }); if (!used.has(p.tpl) || t > 8) break; }
          used.add(p.tpl); list.push(p);
        }
        U.seed(null);
        return list;
      }
      function drawCtl() {
        const stdOpts = P.stdsFor(o.grade, o.domain).filter((c) => S.byCode[c]);
        if (o.std !== 'all' && !stdOpts.includes(o.std)) o.std = 'all';
        ctl.replaceChildren(
          h('div', { class: 'row' }, h('b', null, '학년'), MD.ui.gradeChips(o.grade, (g) => { o.grade = g; drawCtl(); drawSheet(); })),
          h('select', { 'aria-label': '영역', onchange: (e) => { o.domain = e.target.value; o.std = 'all'; drawCtl(); drawSheet(); } }, [['all', '🌈 전 영역']].concat(Object.values(S.DOMAINS).map((d) => [d.id, d.icon + ' ' + d.name])).map(([v, t]) => h('option', { value: v, selected: v === o.domain || null }, t))),
          h('select', { 'aria-label': '성취기준', onchange: (e) => { o.std = e.target.value; drawSheet(); } }, h('option', { value: 'all' }, '성취기준: 모두'), stdOpts.map((c) => h('option', { value: c, selected: c === o.std || null }, `[${c}] ${S.byCode[c].text.slice(0, 26)}…`))),
          h('label', null, '문제 수 ', h('select', { onchange: (e) => { o.count = +e.target.value; drawSheet(); } }, [3, 4, 6, 8, 9, 12].map((n) => h('option', { value: n, selected: n === o.count || null }, n + '문제')))),
          h('label', { class: 'chip' }, h('input', { type: 'checkbox', checked: o.boxes || null, onchange: (e) => { o.boxes = e.target.checked; drawSheet(); } }), ' 6단계 칸'),
          h('label', { class: 'chip' }, h('input', { type: 'checkbox', checked: o.key || null, onchange: (e) => { o.key = e.target.checked; drawSheet(); } }), ' 정답지'),
          h('button', { class: 'btn w', onclick: () => { o.seed = U.int(1, 99999); drawSheet(); } }, '🔀 문제 섞기'), h('button', { class: 'btn', onclick: () => window.print() }, '🖨️ 인쇄'),
          h('span', { class: 'muted', style: { fontSize: '.82rem' } }, '같은 번호(' + o.seed + ')면 같은 문제가 나와요. 주소를 공유해도 됩니다.'));
      }
      function drawSheet() {
        const list = build(), d = o.domain === 'all' ? '전 영역' : S.DOMAINS[o.domain].name, per = o.boxes ? 3 : 5;
        history.replaceState(null, '', `#/sheet?grade=${o.grade}&domain=${o.domain}&seed=${o.seed}`);
        out.replaceChildren();
        for (let pg = 0; pg * per < list.length; pg++) {
          const paper = h('div', { class: 'paper' }, h('div', { class: 'meta' }, h('h2', null, `수학박사 활동지 · ${o.grade}학년 ${d}`), h('span', null, '이름: ____________  날짜: ______')));
          list.slice(pg * per, pg * per + per).forEach((p, k) => {
            const n = pg * per + k + 1;
            paper.append(h('div', { class: 'wprob' }, h('p', { class: 'wt' }, h('span', { class: 'pn' }, String(n)), C.hlText(p.text, [])), p.figure ? h('div', { class: 'pfig', style: { background: '#fff' }, html: MD.fig.render(p.figure) }) : null,
              o.boxes ? h('div', { class: 'wsteps' },
                h('div', { class: 'grid4 tall' }, h('b', null, '① 그림 그리기·붙이기')),
                h('div', null, h('b', null, '② 어떤 계산일까요?'), h('div', null, p.choices.map((c) => h('div', { style: { fontSize: '.78rem' } }, '☐ ' + S.KINDS[c].label)))),
                h('div', null, h('b', null, '③ 식 세우기'), h('div', { style: { marginTop: '18px' } }, '식: ', h('span', { class: 'ansline' }, ''))),
                h('div', { class: 'grid4 span2 tall' }, h('b', null, '④ 세로식(계산식) 쓰기 · ⑤ 계산하기')),
                h('div', null, h('b', null, '⑥ 답'), h('div', { style: { marginTop: '28px' } }, h('span', { class: 'ansline', style: { minWidth: '100px' } }, ''), ' ' + (p.final.unit || '')))) : h('div', { style: { marginTop: '6px' } }, '식: ', h('span', { class: 'ansline' }, ''), '   답: ', h('span', { class: 'ansline' }, ''))));
          });
          paper.append(h('div', { class: 'muted', style: { fontSize: '.72rem', textAlign: 'right' } }, '수학박사 master 3.0 · 2022 개정 교육과정 ' + [...new Set(list.slice(pg * per, pg * per + per).flatMap((p) => p.std))].join(', ')));
          out.append(paper);
        }
        if (o.key) out.append(h('div', { class: 'paper' }, h('div', { class: 'meta' }, h('h2', null, '정답 및 풀이 (교사용)'), h('span', null, `번호 ${o.seed}`)), h('ol', { class: 'akey' }, list.map((p) => h('li', null, h('b', null, S.KINDS[p.kind].label), p.eq ? ' · 식: ' + p.eq.show : '', ' → ', h('b', null, p.ansText), h('div', { class: 'muted', style: { fontSize: '.84rem' } }, p.explain || ''))))));
      }
      drawCtl(); drawSheet();
    },
  };
})();
