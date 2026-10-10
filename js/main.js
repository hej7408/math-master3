/* 시작 */
(function () {
  function go() {
    MD.start();
    if (MD.quest) MD.quest.touch(); // 연속 출석 체크
    // 배포 환경(https, localhost 제외)에서만 오프라인 캐시를 켭니다.
    if ('serviceWorker' in navigator && location.protocol === 'https:' && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
