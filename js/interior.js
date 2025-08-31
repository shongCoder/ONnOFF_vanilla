// interior.js — InteriorComponent01 바닐라 구현
(function () {
    const speed = 0.6; // px/frame
    let rafId = 0;
    let pos = 0;

    const mq = window.matchMedia('(min-width: 768px)');
    const reduceMotion = () =>
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const track = document.getElementById('interiorTrack');
    if (!track) return;

    // 한 번만 자식들을 복제하여 자연스러운 루프 구성(원본 * 2)
    function duplicateOnce() {
        if (track.dataset.duped) return;
        track.innerHTML = track.innerHTML + track.innerHTML;
        track.dataset.duped = '1';
    }

    function step() {
        const singleWidth = track.scrollWidth / 2; // 원본 길이
        pos -= speed;
        if (Math.abs(pos) >= singleWidth) pos = 0;
        track.style.transform = `translateX(${pos}px)`;
        rafId = requestAnimationFrame(step);
    }

    function start() {
        if (reduceMotion()) return;           // 사용자가 모션 줄이기 설정한 경우 비활성
        cancel();                              // 중복 루프 방지
        duplicateOnce();                       // 루프용 복제
        pos = 0;                               // 시작 위치(원하면 -첫카드/2로 변경 가능)
        rafId = requestAnimationFrame(step);
    }

    function cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
    }

    function check() {
        if (mq.matches) start();
        else cancel();
    }

    // 탭 비가시 시 일시정지/재개
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancel();
        else check();
    });

    // 미디어쿼리 변화 감지(브라우저 호환)
    if (mq.addEventListener) mq.addEventListener('change', check);
    else mq.addListener(check);

    // 초기 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', check);
    } else {
        check();
    }
})();