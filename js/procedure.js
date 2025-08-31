// procedure-embla.js — Embla(바닐라)로 창업 절차 슬라이더 완전판
(function () {
    function initProcedureEmbla() {
        const root = document.getElementById('procEmbla');
        if (!root || typeof EmblaCarousel === 'undefined') return;

        const options = {
            align: 'start',
            loop: false,
            containScroll: 'trimSnaps',
            dragFree: false
        };

        // Autoplay 플러그인(선택): 기본 off. 켜고 싶으면 playOnInit: true로.
        const autoplay = (typeof EmblaCarouselAutoplay !== 'undefined')
            ? EmblaCarouselAutoplay({ playOnInit: false, delay: 4000 })
            : undefined;

        const embla = EmblaCarousel(root, options, autoplay ? [autoplay] : []);

        const cards = Array.from(root.querySelectorAll('.embla__slide .proc-card'));

        // 활성/비활성 스타일 세트
        const ACTIVE_ADD = [
            '-translate-y-10',
            'shadow-[0_20px_20px_rgba(82,0,233,0.04)]',
            'bg-[linear-gradient(135deg,#ffffff_0%,#ffffff_10%,#f8f5fe_100%)]',
            'border-[rgba(152,132,189,0.2)]',
        ];
        const ACTIVE_REMOVE = ['border-[rgba(82,0,233,0.08)]'];

        function setActive(idx) {
            cards.forEach((card, i) => {
                const on = i === idx;
                const title = card.querySelector('.proc-title');
                ACTIVE_ADD.forEach(c => card.classList.toggle(c, on));
                ACTIVE_REMOVE.forEach(c => card.classList.toggle(c, !on));
                if (title) {
                    title.classList.toggle('text-[#5200E9]', on);
                    title.classList.toggle('text-[#052236]', !on);
                }
            });
        }

        function onSelect() {
            setActive(embla.selectedScrollSnap());
        }

        // 초기 및 변화 이벤트 바인딩
        embla.on('select', onSelect);
        embla.on('reInit', onSelect);
        onSelect();

        // 카드 클릭 시 해당 슬라이드로 이동
        root.addEventListener('click', (e) => {
            const card = e.target.closest('.embla__slide');
            if (!card) return;
            const idx = Array.from(root.querySelectorAll('.embla__slide')).indexOf(card);
            if (idx >= 0) embla.scrollTo(idx);
        });

        // 휠 → 좌우 이동 (터치패드/마우스 모두 대응)
        function onWheel(e) {
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(delta) < 1) return;
            e.preventDefault();
            if (delta > 0) embla.scrollNext();
            else embla.scrollPrev();
        }
        root.addEventListener('wheel', onWheel, { passive: false });

        // 키보드 좌/우 이동 (포커스 루트 기준)
        root.setAttribute('tabindex', '0');
        root.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') return embla.scrollNext();
            if (e.key === 'ArrowLeft')  return embla.scrollPrev();
        });

        // 리사이즈 시 재초기화
        window.addEventListener('resize', () => {
            embla.reInit();
            onSelect();
        }, { passive: true });

        // 페이지 숨김/표시 시 자동재생 제어(선택)
        if (autoplay) {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) autoplay.stop();
                else autoplay.play();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProcedureEmbla);
    } else {
        initProcedureEmbla();
    }
})();