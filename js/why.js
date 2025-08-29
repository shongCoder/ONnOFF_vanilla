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
