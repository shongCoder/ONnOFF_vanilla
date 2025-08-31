// why.js — WhyComponent02 바닐라 구현 (경로 자동 보정 + 로드 확인)
(function () {
    function init() {
        const section = document.getElementById('why2');
        if (!section) return console.warn('[why] #why2 없음');

        const list   = section.querySelector('#why2List');
        const imgBox = section.querySelector('#why2Image');
        if (!list || !imgBox) return console.warn('[why] 리스트/이미지 요소 없음');

        // 우선순위: data-base > ./img/... > /img/...
        const bases = [];
        const dataBase = imgBox.getAttribute('data-base');
        if (dataBase) bases.push(dataBase.endsWith('/') ? dataBase : dataBase + '/');
        bases.push('./img/why/detail1/');
        bases.push('/img/why/detail1/');

        const items = Array.from(list.querySelectorAll('[data-num]'));
        let imgNum = 1;

        function preloadAndSet(urls) {
            if (!urls.length) return;
            const url = urls[0];
            const probe = new Image();
            probe.onload = () => {
                imgBox.style.backgroundImage = `url("${url}")`;
            };
            probe.onerror = () => {
                // 다음 후보로 시도
                preloadAndSet(urls.slice(1));
            };
            probe.src = url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now(); // 캐시 무시
        }

        function setActive(num) {
            imgNum = num;
            const candidates = bases.map(b => `${b}img${imgNum}.png`);
            preloadAndSet(candidates);
            items.forEach(it => it.classList.toggle('is-active', Number(it.dataset.num) === imgNum));
        }

        // 클릭/키보드
        list.addEventListener('click', (e) => {
            const el = e.target.closest('[data-num]');
            if (!el) return;
            setActive(Number(el.dataset.num));
        });
        list.addEventListener('keydown', (e) => {
            const el = e.target.closest('[data-num]');
            if (!el) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(Number(el.dataset.num));
            }
        });

        // 초기
        setActive(1);
        console.log('[why] init ok');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


// why3.js — WhyComponent03 바닐라 구현 (경로 자동 보정 + 키보드 접근성)
(function () {
    function initWhy3() {
        const section = document.getElementById('why3');
        if (!section) return;

        const list   = section.querySelector('#why3List');
        const imgBox = section.querySelector('#why3Image');
        if (!list || !imgBox) return;

        // 경로 후보: data-base > ./img/... > /img/...
        const bases = [];
        const dataBase = imgBox.getAttribute('data-base');
        if (dataBase) bases.push(dataBase.endsWith('/') ? dataBase : dataBase + '/');
        bases.push('./img/why/detail2/', '/img/why/detail2/');

        const items = Array.from(list.querySelectorAll('[data-num]'));
        let imgNum = 1;

        function preloadAndSet(urls) {
            if (!urls.length) return;
            const url = urls[0];
            const probe = new Image();
            probe.onload = () => { imgBox.style.backgroundImage = `url("${url}")`; };
            probe.onerror = () => preloadAndSet(urls.slice(1));
            // 캐시 무시용 쿼리
            probe.src = url + (url.includes('?') ? '&' : '?') + 'v=' + Date.now();
        }

        function setActive(num) {
            imgNum = num;
            const candidates = bases.map(b => `${b}img${imgNum}.png`);
            preloadAndSet(candidates);
            items.forEach(it => it.classList.toggle('is-active', Number(it.dataset.num) === imgNum));
        }

        // 클릭
        list.addEventListener('click', (e) => {
            const el = e.target.closest('[data-num]');
            if (!el) return;
            setActive(Number(el.dataset.num));
        });

        // 키보드
        list.addEventListener('keydown', (e) => {
            const el = e.target.closest('[data-num]');
            if (!el) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActive(Number(el.dataset.num));
            }
        });

        // 초기
        setActive(1);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhy3);
    } else {
        initWhy3();
    }
})();


// why4.js — WhyComponent04: 제목이 화면 50% 보이면 표 행들 순차 등장
(function () {
    function initWhy4() {
        const sec   = document.getElementById('why4');
        const title = document.getElementById('why4Title');
        if (!sec || !title) return;

        // IO 없으면 즉시 적용
        if (!('IntersectionObserver' in window)) {
            sec.classList.add('is-animate');
            return;
        }

        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                sec.classList.add('is-animate'); // 한 번만
                io.disconnect();
            }
        }, { threshold: 0.5 });

        io.observe(title);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhy4);
    } else {
        initWhy4();
    }
})();