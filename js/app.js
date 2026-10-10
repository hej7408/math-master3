/* 앱 셸: 상태, 라우터, 홈, 성취기준 */
window.MD = window.MD || {};
(function () {
  const U = MD.util, h = U.h, S = MD.std;

  /* ---------- 상태 ---------- */
  const SKEY = 'mathdoctor3.state.v1';
  const st = (MD.state = { grade: 2, domain: 'all', teacher: false });
  try { Object.assign(st, JSON.parse(localStorage.getItem(SKEY)) || {}); } catch (e) {}
  MD.saveState = () => { try { localStorage.setItem(SKEY, JSON.stringify(st)); } catch (e) {} };

  MD.pages = {};
  const NAV = [
    ['home', '🏠 홈'], ['quest', '🏆 모험'], ['board', '🧲 연산판'], ['place', '🔢 조작판'], ['lab', '🧪 놀이터'], ['game', '🎲 보드게임'],
    ['sheet', '🖨️ 활동지'], ['std', '📘 성취기준'], ['diagnose', '🩺 진단'], ['about', '📖 연구 소개'],
  ];

  /* 표준 ↔ 도구 연결 */
  MD.PLACE_STD = ['2수01-02', '2수01-05', '2수01-06', '2수01-08', '4수01-01', '4수01-03', '4수01-04', '4수01-16', '2수03-13'];
  MD.LAB_STD = {
    bignum: ['2수01-01', '2수01-02', '2수01-03', '4수01-01', '4수01-02'],
    array: ['2수01-10', '2수01-11', '4수01-04', '4수01-05', '4수01-06', '4수01-07'],
    fraction: ['4수01-09', '4수01-10', '4수01-11', '4수01-15', '6수01-06', '6수01-07', '6수01-08', '6수01-09', '6수01-10', '6수01-11', '6수01-12'],
    decimal: ['4수01-12', '4수01-13', '4수01-14', '4수01-16', '6수01-13', '6수01-14', '6수01-15', '6수01-12'],
    clock: ['2수03-07', '2수03-08', '2수03-09', '4수03-13', '4수03-14'],
    angle: ['4수03-02', '4수03-24', '4수03-25'],
    area: ['6수03-11', '6수03-12', '6수03-13', '6수03-14'],
    graph: ['2수04-01', '2수04-02', '2수04-03', '4수04-01', '4수04-02', '4수04-03', '6수04-01', '6수04-02', '6수04-03'],
    chance: ['6수04-04', '6수04-05', '6수04-06'],
    ratio: ['6수02-02', '6수02-03', '6수02-04', '6수02-05'],
    rule: ['2수02-01', '2수02-02', '4수02-01', '4수02-02', '4수02-03', '6수02-01'],
  };

  /* ---------- 라우터 ---------- */
  function parseHash() {
    const raw = decodeURIComponent((location.hash || '#/home').slice(2));
    const [path, qs] = raw.split('?');
    const params = {};
    (qs || '').split('&').filter(Boolean).forEach((kv) => { const [k, v] = kv.split('='); params[k] = v == null ? '' : v; });
    return { path: path || 'home', params };
  }
  MD.go = function (path, params) {
    const qs = params ? '?' + Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&') : '';
    const next = '#/' + path + qs;
    if (location.hash === next) route(); else location.hash = next;
  };
  let cleanup = null;
  function route() {
    const { path, params } = parseHash();
    const page = MD.pages[path] || MD.pages.home;
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    const root = document.getElementById('app');
    root.replaceChildren();
    document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('on', a.dataset.p === path));
    window.scrollTo(0, 0);
    cleanup = page.render(root, params) || null;
    document.title = (page.title ? page.title + ' · ' : '') + '수학박사 master 3.0';
  }
  MD.start = function () {
    const nav = document.getElementById('nav');
    NAV.forEach(([p, t]) => nav.append(h('a', { href: '#/' + p, 'data-p': p }, t)));
    const tg = document.getElementById('teacherTgl');
    tg.checked = !!st.teacher; document.body.classList.toggle('teacher', !!st.teacher);
    tg.addEventListener('change', () => { st.teacher = tg.checked; document.body.classList.toggle('teacher', st.teacher); MD.saveState(); route(); });
    window.addEventListener('hashchange', route);
    route();
  };

  /* ---------- 공통 선택 UI ---------- */
  MD.ui = {
    gradeChips(cur, on) {
      const w = h('div', { class: 'grades', role: 'group', 'aria-label': '학년 선택' });
      for (let g = 1; g <= 6; g++) w.append(h('button', { class: 'gchip' + (g === cur ? ' on' : ''), style: { '--c': S.GRADE_COLOR[g] }, 'aria-pressed': g === cur, title: g + '학년', onclick: () => on(g) }, String(g)));
      return w;
    },
    domainChips(cur, on, withAll) {
      const w = h('div', { class: 'domains', role: 'group', 'aria-label': '영역 선택' });
      const items = (withAll ? [{ id: 'all', name: '전 영역', icon: '🌈', color: '#868e96' }] : []).concat(Object.values(S.DOMAINS));
      items.forEach((d) => w.append(h('button', { class: 'dchip' + (d.id === cur ? ' on' : ''), style: { '--c': d.color }, onclick: () => on(d.id) }, d.icon + ' ' + d.name)));
      return w;
    },
    stdLabel(code) { const s = S.byCode[code]; return s ? `[${code}] ${s.text}` : code; },
  };

  /* =============== 홈 =============== */
  MD.pages.home = {
    title: '홈',
    render(root) {
      const P = MD.problems, cov = P.coverage(), covered = Object.keys(cov).length;
      const hero = h('section', { class: 'hero' });
      const left = h('div', null,
        h('h1', null, '수학박사 master 3.0'),
        h('p', null, '글로 된 서술형 문제를 ', h('b', null, '그림 → 분류 → 식 → 세로식 → 답'), '의 6단계로 눈에 보이게 풀어 가는 수학교구. 2019 경기도교육자료전 수상작 실물 교구를 2022 개정 교육과정 초등 수학 1~6학년 전 영역으로 확장한 웹앱입니다.'),
        h('div', { class: 'tags' }, h('span', null, '2022 개정 성취기준'), h('span', null, '1~6학년 · 4개 영역'), h('span', null, '실물 교구 → 웹 조작')),
      );
      const pick = h('div', { class: 'pick' });
      const redraw = () => {
        pick.replaceChildren(
          h('h3', null, '① 학년을 고르세요'), MD.ui.gradeChips(st.grade, (g) => { st.grade = g; MD.saveState(); redraw(); }),
          h('h3', { style: { marginTop: '12px' } }, '② 영역을 고르세요'), MD.ui.domainChips(st.domain, (d) => { st.domain = d; MD.saveState(); redraw(); }, true),
          h('div', { class: 'row', style: { marginTop: '14px' } },
            h('a', { class: 'btn', href: `#/board?grade=${st.grade}&domain=${st.domain}` }, '🧲 연산판으로 풀기'),
            h('a', { class: 'btn y', href: `#/place?grade=${st.grade}` }, '🔢 조작판으로 계산하기'),
            h('a', { class: 'btn w', href: '#/lab' }, '🧪 놀이터'),
          ),
        );
      };
      redraw();
      left.append(pick);
      hero.append(left, h('img', { class: 'mascot', src: 'assets/photos/mascot.jpg', alt: '수학박사 마스코트' }));
      root.append(hero);

      /* 교구 소개 */
      const tools = [
        ['mascot', '🏆 수학박사 모험 (게임)', '캐릭터를 꾸미고 모험 지도의 스테이지·보스를 깨요! 레벨업, 코인, 연속 출석, 배지, 60초 타임어택까지.', ['레벨·코인', '보스전', '타임어택'], 'quest'],
        ['board-all', '🧲 연산판', '서술형 문제를 읽고 그림카드를 붙이고 분류카드로 계산을 고른 뒤 숫자자석으로 식을 세우고 세로식으로 답을 구해요.', ['6단계', '전 학년', '4개 영역'], 'board'],
        ['place-all', '🔢 조작판', '숫자카드를 넘기고 받아올림·받아내림 스티커를 붙이며 자릿값을 눈으로 확인해요. 소수·큰 수까지!', ['받아올림', '받아내림', '수 모형'], 'place'],
        ['frame', '🧪 조작 놀이터', '곱셈 배열판, 분수판, 소수 모형, 시계, 각도기, 넓이판, 그래프·평균, 가능성, 비율, 규칙 — 11가지 확장 교구.', ['11개 모듈', '2022 전 영역'], 'lab'],
        ['boardgame', '🎲 수학박사 보드게임', '주사위를 굴려 문제 칸에 멈추면 서술형 문제에 도전! 친구와 번갈아 하며 일반화까지.', ['2인 대결', '문제 칸'], 'game'],
        ['graphic', '🖨️ 활동지 만들기', '학년·영역·성취기준을 골라 연산판 6단계 칸이 있는 인쇄용 활동지를 만들어요. 정답지 포함.', ['인쇄', '정답지'], 'sheet'],
        ['kids3', '🩺 수준 진단 (A~D)', '짧은 진단으로 보고서의 A~D 성취수준을 확인하고 어떤 교구부터 쓸지 추천받아요.', ['부진학생 지도', '추천 경로'], 'diagnose'],
      ];
      root.append(h('section', { class: 'sec' }, h('h2', null, '교구 한눈에 보기'),
        h('div', { class: 'tools' }, tools.map(([img, t, d, tags, to]) => h('a', { class: 'card tool', href: '#/' + to },
          h('div', { class: 'ph', style: { backgroundImage: `url(assets/photos/${img}.jpg)` } }), h('div', { class: 'tx' }, h('h3', null, t), h('p', { class: 'muted', style: { margin: 0, fontSize: '.92rem' } }, d), h('div', { class: 'meta' }, tags.map((x) => h('span', { class: 'pill' }, x))))))))
      );

      /* MASTER KEY */
      root.append(h('section', { class: 'sec' }, h('h2', null, '서술형 문제를 푸는 MASTER KEY'),
        h('div', { class: 'keygrid card' },
          h('ol', { class: 'steps6' },
            h('li', null, '서술형 문제에 있는 ', h('b', null, '그림'), '을 찾아 붙여 봐요.'),
            h('li', null, '문제를 읽고 ', h('b', null, '덧셈인지 뺄셈인지'), '(곱셈·나눗셈…) 생각해요. 양옆에 표를 봐요.'),
            h('li', null, h('b', null, '숫자 자석'), '과 ', h('b', null, '기호'), '를 붙여서 식을 세워 봐요.'),
            h('li', null, '만들어진 식을 쉬운 ', h('b', null, '세로식'), '으로 바꿔 써 봐요.'),
            h('li', null, '세로식을 계산해서 ', h('b', null, '답'), '을 구해요.'),
            h('li', null, h('b', null, 'GOOD!'), ' 참 잘했습니다. 어때요? 서술형 문제 참 쉽죠?')),
          h('img', { src: 'assets/photos/masterkey.jpg', alt: '원작 교구의 MASTER KEY 6단계 안내 그림', loading: 'lazy' }))));

      /* 현황 */
      const T = P.T.length;
      root.append(h('section', { class: 'sec' }, h('h2', null, '2022 개정 교육과정 연결 현황'),
        h('div', { class: 'stats' },
          [['6', '학년 (1~6학년)'], ['4', '영역 (수와 연산·변화와 관계·도형과 측정·자료와 가능성)'], [String(S.list.length), '2022 개정 초등 수학 성취기준'], [String(covered), '문제 연결된 성취기준'], [String(T), '문제 유형(무한 생성)']].map(([n, t]) => h('div', { class: 'card stat' }, h('b', null, n), h('span', null, t)))),
        h('p', { class: 'muted', style: { marginTop: '10px', fontSize: '.9rem' } }, '※ 도형의 모양 찾기·작도·분류처럼 실물 조작과 그리기가 핵심인 일부 성취기준은 앱 문제 없이 [성취기준] 메뉴에 표시만 됩니다.')));

      /* 내 학습 기록 */
      const d = U.store.load();
      const rec = h('section', { class: 'sec' }, h('h2', null, '내 학습 기록'));
      if (!d.tries) rec.append(h('p', { class: 'muted' }, '아직 푼 문제가 없어요. 연산판에서 첫 문제를 풀어 보세요! ⭐'));
      else {
        const lv = Math.floor(d.stars / 10) + 1, titles = ['새싹', '꿈나무', '수학 탐험가', '수학 도전자', '수학 달인', '수학 박사', '수학 마스터'];
        rec.append(h('div', { class: 'card' },
          h('div', { class: 'row' }, h('div', { class: 'stat' }, h('b', null, '⭐ ' + d.stars), h('span', null, '모은 별')), h('div', { class: 'stat' }, h('b', null, String(d.solved)), h('span', null, '푼 문제')),
            h('div', { class: 'stat' }, h('b', null, 'Lv.' + lv), h('span', null, titles[Math.min(lv - 1, titles.length - 1)])),
            h('div', { class: 'grow' }, h('div', { class: 'grades' }, [1, 2, 3, 4, 5, 6].map((g) => { const x = d.byGrade[g]; return h('div', { style: { textAlign: 'center' } }, h('div', { class: 'gchip', style: { '--c': S.GRADE_COLOR[g], cursor: 'default' } }, String(g)), h('small', { class: 'muted' }, x ? `${x.ok}/${x.n}` : '-')); })))),
          h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn w sm', onclick: () => { if (confirm('이 기기의 학습 기록을 모두 지울까요?')) { U.store.reset(); route(); } } }, '기록 지우기'))));
      }
      root.append(rec);
    },
  };

  /* =============== 성취기준 =============== */
  MD.pages.std = {
    title: '성취기준',
    render(root, params) {
      let band = +params.band || S.bandOf(st.grade), domain = params.domain || 'all', q = '', onlyApp = false, tab = params.tab || 'list';
      const body = h('div');
      const head = h('div', { class: 'row', style: { marginBottom: '10px' } }, h('h1', { style: { margin: 0 } }, '2022 개정 성취기준'));
      const tabs = h('div', { class: 'tabsmall' });
      const cov = MD.problems.coverage(), prog = U.store.load().byStd;
      const draw = () => {
        tabs.replaceChildren(...[['list', '성취기준 목록'], ['map', '2015 → 2022 대응표'], ['matrix', '문제 연결 현황']].map(([k, t]) => h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; draw(); } }, t)));
        body.replaceChildren();
        if (tab === 'list') {
          const f = h('div', { class: 'row card', style: { marginBottom: '12px' } },
            h('div', { class: 'tabsmall', style: { margin: 0 } }, [2, 4, 6].map((b) => h('button', { class: band === b ? 'on' : '', onclick: () => { band = b; draw(); } }, S.BANDS[b]))),
            MD.ui.domainChips(domain, (d) => { domain = d; draw(); }, true),
            h('input', { type: 'text', placeholder: '낱말 검색 (예: 분수, 넓이)', value: q, oninput: (e) => { q = e.target.value; list.replaceChildren(...items()); }, 'aria-label': '검색' }),
            h('label', { class: 'chip' }, h('input', { type: 'checkbox', checked: onlyApp || null, onchange: (e) => { onlyApp = e.target.checked; list.replaceChildren(...items()); } }), ' 앱 문제 있는 것만'));
          const items = () => S.list.filter((s) => s.band === band && (domain === 'all' || s.domain === domain) && (!q || s.text.includes(q) || s.code.includes(q)) && (!onlyApp || cov[s.code])).map((s) => {
            const c = cov[s.code], d = S.DOMAINS[s.domain], g0 = prog[s.code], acts = [];
            const grades = c ? Array.from(c.grades).sort() : [];
            if (c) grades.forEach((g) => acts.push(h('a', { class: 'btn sm', href: `#/board?std=${s.code}&grade=${g}` }, `🧲 ${g}학년`)));
            if (MD.PLACE_STD.includes(s.code)) acts.push(h('a', { class: 'btn y sm', href: '#/place' }, '🔢 조작판'));
            Object.entries(MD.LAB_STD).forEach(([k, arr]) => { if (arr.includes(s.code)) acts.push(h('a', { class: 'btn w sm', href: '#/lab?m=' + k }, '🧪 ' + ((MD.labs && MD.labs.META[k] && MD.labs.META[k].title) || k))); });
            return h('div', { class: 'card std' }, h('code', null, s.code), h('div', { class: 'tx' }, h('span', { class: 'pill', style: { background: d.color + '22', color: d.color, marginRight: '6px' } }, d.icon + ' ' + d.name), s.text,
              !acts.length ? h('div', { class: 'muted', style: { fontSize: '.85rem', marginTop: '4px' } }, '🧰 실물 조작·그리기·관찰 중심 성취기준입니다. 교실 활동으로 지도하세요.') : null,
              h('div', { class: 'row', style: { marginTop: '6px' } }, acts)),
              h('div', { class: 'acts' }, g0 ? h('div', { class: 'bar-prog', title: `정답 ${g0.ok}/${g0.n}` }, h('i', { style: { width: Math.round((g0.ok / g0.n) * 100) + '%' } })) : null, g0 ? h('small', { class: 'muted' }, `${g0.ok}/${g0.n}`) : null));
          });
          const list = h('div', { class: 'stdlist' }, items());
          body.append(f, list);
        } else if (tab === 'map') {
          body.append(h('div', { class: 'card' }, h('h3', null, '보고서(2015 개정)의 덧셈·뺄셈 성취기준 → 2022 개정 성취기준'),
            h('p', { class: 'muted', style: { fontSize: '.92rem' } }, '2019년 보고서 [Ⅱ-1-가]에 실린 성취기준을 2022 개정 교육과정(교육부 고시 제2022-33호) 원문과 대조한 표입니다. 번호가 바뀐 항목과 문장이 달라진 항목을 표시했어요.'),
            h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'map' }, h('thead', null, h('tr', null, ['2015 개정', '2022 개정 (원문)', '변경 내용'].map((t) => h('th', null, t)))),
              h('tbody', null, S.MAP2015.map((m) => h('tr', null, h('td', null, h('code', null, m.old), h('br'), m.oldText), h('td', null, m.now.map((c) => h('div', null, h('code', null, c), ' ', (S.byCode[c] || {}).text))), h('td', null, m.note)))))),
            h('p', { class: 'muted', style: { fontSize: '.88rem', marginTop: '10px' } }, '※ 번호가 같아도 학년군 구성과 내용 체계가 다르게 개정되었습니다. 수업 적용 전 최신 교과서와 교사용 지도서를 함께 확인하세요.')));
        } else {
          const gs = [1, 2, 3, 4, 5, 6], ds = Object.values(S.DOMAINS);
          const cnt = (g, d) => MD.problems.T.filter((t) => t.grades.includes(g) && t.domain === d).length;
          body.append(h('div', { class: 'card' }, h('h3', null, '학년 × 영역별 문제 유형 수'),
            h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'map' }, h('thead', null, h('tr', null, [h('th', null, '영역')].concat(gs.map((g) => h('th', null, g + '학년'))))),
              h('tbody', null, ds.map((d) => h('tr', null, [h('td', null, d.icon + ' ' + d.name)].concat(gs.map((g) => h('td', { style: { textAlign: 'center' } }, String(cnt(g, d.id))))))))),
            ), h('p', { class: 'muted', style: { fontSize: '.88rem', marginTop: '10px' } }, '각 문제 유형은 수·소재·문장을 바꾸어 무한히 새 문제를 만들어 냅니다. 한 유형이 여러 학년에 걸쳐 있으면 학년마다 난이도(자릿수·분모 등)가 달라집니다.')));
        }
      };
      root.append(head, tabs, body); draw();
    },
  };
})();
