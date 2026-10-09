/* 수준 진단 — 보고서의 A~D 성취수준(원리 이해·계산·문제 만들기)을 짧은 문항으로 확인 */
(function () {
  const U = MD.util, h = U.h, F = U.frac, P = MD.problems, C = MD.comp;
  const CONCEPT = {
    low: [
      { q: '27 + 8 = 35를 계산할 때, 일의 자리 7 + 8 = 15에서 10은 어떻게 할까요?', o: ['십의 자리로 받아올림해요 (낱개 10개 = 십 모형 1개)', '일의 자리에 그대로 써요', '그냥 버려요'] },
      { q: '42 − 7에서 일의 자리 2에서 7을 뺄 수 없어요. 어떻게 할까요?', o: ['십의 자리에서 10을 받아내림해요', '7에서 2를 빼요', '답을 0으로 해요'] },
      { q: '34는 수 모형으로 어떻게 나타낼까요?', o: ['십 모형 3개와 낱개 4개', '십 모형 4개와 낱개 3개', '낱개 7개'] },
    ],
    mid: [
      { q: '345 + 278에서 일의 자리 5 + 8 = 13. 13은 어떻게 쓸까요?', o: ['일의 자리에 3, 십의 자리로 1 받아올림', '일의 자리에 13을 써요', '백의 자리로 1 받아올림'] },
      { q: '23 × 4를 계산하는 방법으로 알맞은 것은?', o: ['20 × 4 + 3 × 4', '2 × 4 + 3 × 4', '23 + 4'] },
      { q: '38 ÷ 5 = 7 … 3에서 나머지 3에 대해 알맞은 설명은?', o: ['나누는 수 5보다 작아야 해요', '나누는 수보다 커도 돼요', '나머지는 항상 1이에요'] },
      { q: '3/7 + 2/7을 계산하는 방법은?', o: ['분모는 그대로 두고 분자끼리 더해요', '분모끼리 더하고 분자끼리 더해요', '분자끼리 곱해요'] },
    ],
    high: [
      { q: '1/2 + 1/3을 계산할 때 가장 먼저 할 일은?', o: ['분모를 같게 통분해요', '분자끼리 더해요', '분모끼리 더해요'] },
      { q: '0.3 × 0.4를 계산하는 방법은?', o: ['3 × 4 = 12를 구하고 소수점 아래가 두 자리가 되게 찍어요', '3 + 4 = 7이라고 써요', '소수점을 없애고 12라고 써요'] },
      { q: '비율을 구하는 식으로 알맞은 것은?', o: ['(비교하는 양) ÷ (기준량)', '(기준량) ÷ (비교하는 양)', '(비교하는 양) × (기준량)'] },
      { q: '평균을 구하는 방법은?', o: ['자료의 합 ÷ 자료의 수', '자료의 합 × 자료의 수', '가장 큰 값을 골라요'] },
    ],
  };
  const LEVEL = {
    A: { c: '#2f9e44', t: '받아올림·받아내림의 원리를 이해하고 능숙하게 계산하며, 실생활 문제를 만들고 해결할 수 있어요.', rec: [['🎲', '보드게임', '#/game', '문제를 ‘놀이’로 일반화해 보세요'], ['🧪', '놀이터', '#/lab', '다른 영역으로 확장해 보세요'], ['🧲', '연산판 (한 학년 위)', '#/board', '더 어려운 문제에 도전!']] },
    B: { c: '#1c7ed6', t: '계산 원리를 이해하고 계산할 수 있어요. 문제 상황을 식으로 바꾸고 스스로 문제를 만들어 보면 더 자랄 수 있어요.', rec: [['🧲', '연산판 6단계', '#/board', '서술형 문제를 식으로 바꾸는 연습'], ['🖨️', '활동지', '#/sheet', '반복 연습'], ['🎲', '보드게임', '#/game', '재미있게 일반화']] },
    C: { c: '#f76707', t: '계산은 할 수 있지만 원리 이해가 더 필요해요. 수 모형과 조작판으로 ‘왜 그렇게 되는지’를 눈으로 확인해 보세요.', rec: [['🔢', '조작판 (안내 따라하기)', '#/place', '받아올림·받아내림을 직접 붙여 보세요'], ['🧪', '놀이터', '#/lab', '수 모형·분수판 등 시각 교구'], ['🧲', '연산판', '#/board', '그림 → 식 연결하기']] },
    D: { c: '#e03131', t: '아직 계산과 원리 모두 도움이 필요해요. 구체물(수 모형)로 천천히 시작해요. 괜찮아요, 누구나 처음엔 그래요!', rec: [['🔢', '조작판 (2자리부터)', '#/place', '‘올림·내림 없는 문제’부터 시작'], ['🧲', '연산판 (낮은 학년)', '#/board', '그림카드로 문제 이해하기'], ['🧪', '놀이터', '#/lab', '점·막대 모형 만져 보기']] },
  };

  MD.pages.diagnose = {
    title: '수준 진단',
    render(root, params) {
      let grade = +params.grade || MD.state.grade || 2, items = [], idx = 0, score = null;
      const wrap = h('div', { class: 'dq' });
      root.append(wrap);

      function start() {
        const band = grade <= 2 ? 'low' : grade <= 4 ? 'mid' : 'high';
        items = [];
        /* 계산 4문항 */
        const calc = []; let guard = 0;
        while (calc.length < 4 && guard++ < 200) {
          const p = P.make({ grade, domain: 'num' });
          if (!p.eq || p.eq.tokens.length > 5 || calc.some((c) => c.p.tpl === p.tpl)) continue;
          if (p.eq.show.length > 24) continue;
          calc.push({ type: 'calc', p });
        }
        items.push(...calc);
        const cons = U.sample(CONCEPT[band], 2).map((c) => ({ type: 'concept', q: c.q, opts: U.shuffle(c.o.map((t, i) => ({ t, ok: i === 0 }))) }));
        items.push(...cons);
        /* 식 만들기 */
        let sp = null; guard = 0; while (!sp && guard++ < 100) { const p = P.make({ grade, domain: 'num' }); if (p.eq && p.eq.tokens.length === 3 && p.eq.tokens.every((t) => t.length < 8)) sp = p; }
        if (sp) { const t = sp.eq.tokens, ops = ['+', '−', '×', '÷'].filter((o) => o !== t[1]); const d1 = [t[0], U.pick(ops), t[2]].join(' '), d2 = [t[2], t[1], t[0]].join(' ') === sp.eq.show ? [t[0], U.pick(ops), t[2]].join(' ') : [t[2], t[1], t[0]].join(' ');
          const opts = U.shuffle([{ t: sp.eq.show, ok: true }, { t: d1, ok: false }, { t: d2, ok: false }].filter((x, i, a) => a.findIndex((y) => y.t === x.t) === i)); if (opts.length >= 2) items.push({ type: 'story', p: sp, opts }); }
        /* 문제 만들기 (식에 알맞은 이야기) */
        if (grade <= 4) {
          const a = U.int(12, 60), b = U.int(5, 11), plus = U.int(0, 1), o = U.pick(P.OBJ.filter((x) => x.c === '개'));
          const sto = (k) => ({ add: `${o.n}${'이가'[U.batchim(o.n) ? 0 : 1]} ${a}개 있었는데 ${b}개를 더 샀습니다. ${o.n}${'은는'[U.batchim(o.n) ? 0 : 1]} 모두 몇 개일까요?`, sub: `${o.n}${'이가'[U.batchim(o.n) ? 0 : 1]} ${a}개 있었는데 ${b}개를 먹었습니다. 남은 ${o.n}${'은는'[U.batchim(o.n) ? 0 : 1]} 몇 개일까요?`, mul: `한 상자에 ${o.n}${'이가'[U.batchim(o.n) ? 0 : 1]} ${a}개씩 ${b}상자 있습니다. 모두 몇 개일까요?` }[k]);
          items.push({ type: 'create', eq: `${a} ${plus ? '+' : '−'} ${b}`, opts: U.shuffle([{ t: sto(plus ? 'add' : 'sub'), ok: true }, { t: sto(plus ? 'sub' : 'add'), ok: false }, { t: sto('mul'), ok: false }]) });
        }
        items.forEach((it) => (it.res = null));
        idx = 0; score = null; draw();
      }

      function draw() {
        if (score) return result();
        const it = items[idx], n = items.length;
        const card = h('div', { class: 'card dq' }, h('div', { class: 'dprog', 'aria-label': '진행' }, h('i', { style: { width: (idx / n) * 100 + '%' } })), h('div', { class: 'row' }, h('span', { class: 'pill' }, `${idx + 1} / ${n}`), h('span', { class: 'pill', style: { background: '#fff4c2', color: '#8a6d00' } }, { calc: '계산하기', concept: '원리 이해', story: '식 만들기', create: '이야기 고르기' }[it.type])));
        const nextBtn = (ok) => { it.res = ok; idx++; if (idx >= n) finish(); else draw(); };
        if (it.type === 'calc') {
          const p = it.p, inp = h('input', { type: 'text', inputmode: 'decimal', class: 'fin big', 'aria-label': '답', style: { width: '170px' } });
          const go = () => { const v = F.parse(inp.value); nextBtn(!!(v && F.eq(v, p.eq.val))); };
          inp.addEventListener('keydown', (e) => e.key === 'Enter' && go());
          card.append(h('p', { class: 'sub' }, '식의 값을 구해요. (분수는 3/4 또는 1 3/4 처럼 써요)'), h('div', { class: 'bigeq' }, C.tokens(p.eq.tokens), ' = ', inp), h('div', { class: 'row' }, h('button', { class: 'btn', onclick: go }, '다음 ▶'), h('button', { class: 'btn w', onclick: () => nextBtn(false) }, '모르겠어요')));
          setTimeout(() => inp.focus(), 50);
        } else {
          card.append(h('p', { class: 'ptext' }, it.type === 'concept' ? it.q : it.type === 'story' ? it.p.text : `「${it.eq}」에 알맞은 이야기는 어느 것일까요?`), it.type === 'story' ? h('p', { class: 'sub' }, '이 문제를 풀기 위한 알맞은 식은?') : null,
            h('div', { class: 'opts' }, it.opts.map((o) => h('button', { class: 'opt', onclick: () => nextBtn(o.ok) }, o.t))), h('button', { class: 'btn w sm', onclick: () => nextBtn(false), style: { justifySelf: 'start' } }, '모르겠어요'));
        }
        wrap.replaceChildren(h('h1', null, '🩺 수준 진단'), card);
      }
      function finish() {
        const calc = items.filter((i) => i.type === 'calc'), con = items.filter((i) => i.type === 'concept'), rest = items.filter((i) => i.type === 'story' || i.type === 'create');
        const cs = calc.filter((i) => i.res).length, ks = con.filter((i) => i.res).length, rs = rest.filter((i) => i.res).length;
        let lv = cs <= 2 ? 'D' : ks < con.length ? 'C' : rs === rest.length ? 'A' : 'B';
        score = { lv, cs, ks, rs, calcN: calc.length, conN: con.length, restN: rest.length };
        try { const d = U.store.load(); d.diag = { lv, grade, t: Date.now(), cs, ks, rs }; U.store.save(d); } catch (e) {}
        draw();
      }
      function result() {
        const L = LEVEL[score.lv];
        wrap.replaceChildren(h('h1', null, '🩺 진단 결과'), h('div', { class: 'card' }, h('div', { class: 'row', style: { gap: '18px', flexWrap: 'nowrap' } }, h('div', { class: 'lvl', style: { background: L.c } }, score.lv), h('div', null, h('h2', { style: { marginBottom: '.2em' } }, `${score.lv}단계`), h('p', null, L.t))),
          h('div', { class: 'bars2', style: { marginTop: '12px' } }, [['계산', score.cs, score.calcN, '#1c7ed6'], ['원리 이해', score.ks, score.conN, '#f76707'], ['식·이야기', score.rs, score.restN, '#2f9e44']].map(([t, a, b, c]) => h('div', { class: 'b2' }, h('span', null, t), h('div', { class: 'tr' }, h('i', { style: { width: (b ? (a / b) * 100 : 0) + '%', background: c } })), h('b', null, `${a}/${b}`))))),
          h('h2', null, '이렇게 해 보세요'), h('div', { class: 'tools' }, L.rec.map(([e, t, href, d]) => h('a', { class: 'card tool', href }, h('div', { class: 'tx' }, h('h3', null, e + ' ' + t), h('p', { class: 'muted', style: { margin: 0 } }, d))))),
          h('p', { class: 'muted', style: { fontSize: '.85rem' } }, '※ 이 진단은 짧은 안내용 검사예요. 정확한 진단은 선생님의 관찰·면담·지필평가와 함께 판단하세요. (A~D 단계 기준: 2019 보고서 ‘수학학습 부진아 적용 방안’)'),
          h('div', { class: 'row' }, h('button', { class: 'btn', onclick: start }, '다시 진단하기')));
      }

      /* 첫 화면 */
      function intro() {
        const d = U.store.load().diag;
        wrap.replaceChildren(h('h1', null, '🩺 수준 진단 (A~D 단계)'), h('div', { class: 'card' }, h('p', { class: 'lead' }, '보고서의 학습부진 지도 방안에 나오는 4단계(A~D)를 짧은 문항으로 확인해요. 계산하기 4문항 · 원리 이해 2문항 · 식 만들기와 이야기 고르기 1~2문항으로 약 3분이 걸려요.'),
          h('div', { class: 'row' }, h('b', null, '학년'), MD.ui.gradeChips(grade, (g) => { grade = g; MD.state.grade = g; MD.saveState(); intro(); })),
          d ? h('p', { class: 'muted' }, `지난 진단: ${d.grade}학년 ${d.lv}단계 (${new Date(d.t).toLocaleDateString('ko-KR')})`) : null, h('button', { class: 'btn y', style: { marginTop: '10px', fontSize: '1.15rem' }, onclick: start }, '시작하기 ▶')),
          h('div', { class: 'card', style: { marginTop: '14px' } }, h('h3', null, '단계 설명'), h('table', { class: 'map' }, h('thead', null, h('tr', null, [h('th', null, '단계'), h('th', null, '성취수준')])), h('tbody', null, Object.entries(LEVEL).map(([k, v]) => h('tr', null, h('td', null, h('b', { style: { color: v.c, fontSize: '1.4rem' } }, k)), h('td', null, v.t)))))));
      }
      intro();
    },
  };
})();
