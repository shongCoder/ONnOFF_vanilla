// intro.js — React 없이 {count1} … {count5}를 자동 치환 + 카운트업
(function () {
    // 1) 목표값과 지속시간(밀리초): 필요하면 여기만 바꾸면 됨
    const targets = {
        count1: { to: 26, duration: 1000 },  // 년
        count2: { to: 22, duration: 1000 },  // 년
        count3: { to: 7,  duration: 1000 },  // 월
        count4: { to: 1,  duration: 1000 },  // 건
        count5: { to: 200,duration: 1000 },  // 여점포
    };

    // 2) 문서에서 {countX} 토큰을 찾아 <span data-count="countX">0</span>으로 치환
    //    (HTML 원본은 수정 없이, 런타임에서만 치환)
    function wrapPlaceholders() {
        const keys = Object.keys(targets);
        const re = new RegExp(String.raw`\{\s*(${keys.join("|")})\s*\}`, "g");

        // 텍스트 노드 순회
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const toReplace = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.nodeValue) continue;
            if (re.test(node.nodeValue)) {
                toReplace.push(node);
            }
        }

        const spans = {}; // key -> [elements]
        keys.forEach(k => (spans[k] = []));

        toReplace.forEach(node => {
            const parent = node.parentNode;
            const parts = node.nodeValue.split(re); // ["앞", "count1", "중간", "count2", "뒤"] 같은 구조
            const frag = document.createDocumentFragment();

            for (let i = 0; i < parts.length; i++) {
                const piece = parts[i];
                // 짝수 index: 일반 텍스트, 홀수 index: 캡처된 key
                if (i % 2 === 0) {
                    if (piece) frag.appendChild(document.createTextNode(piece));
                } else {
                    const key = piece.trim();
                    const span = document.createElement("span");
                    span.dataset.count = key; // data-count="count1"
                    span.textContent = "0";
                    frag.appendChild(span);
                    spans[key].push(span);
                }
            }

            parent.replaceChild(frag, node);
        });

        return spans;
    }

    // 3) 카운트업 (linear; 필요하면 easing 변경)
    function countUp(el, to, duration) {
        // 접근성: reduce-motion이면 즉시 설정
        const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce || duration <= 0) {
            el.textContent = String(to);
            return;
        }

        const start = performance.now();
        function frame(now) {
            const t = Math.min(1, (now - start) / duration);
            const value = Math.round(to * t); // 정수 카운트
            el.textContent = String(value);
            if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    // 4) 섹션 가시화되면 한 번만 카운트 시작
    function onVisibleOnce(rootEl, run) {
        // IntersectionObserver가 없으면 즉시 실행
        if (!("IntersectionObserver" in window)) {
            run();
            return;
        }
        let done = false;
        const io = new IntersectionObserver(([entry]) => {
            if (!done && entry.isIntersecting) {
                done = true;
                io.disconnect();
                run();
            }
        }, { threshold: 0.3 });
        io.observe(rootEl);
    }

    // 5) 초기화
    function init() {
        const spans = wrapPlaceholders(); // { count1: [span], … }
        // 카운터 중 하나라도 못 찾으면 그냥 종료 (HTML에 {countX}가 없을 때)
        const foundAny = Object.values(spans).some(arr => arr.length);
        if (!foundAny) return;

        // 카운트가 붙어 있는 가장 작은 공통 조상(대략 섹션) 찾기
        // 간단히 첫 번째 span의 가장 가까운 섹션/컨테이너를 root로 삼음
        const firstSpan = (Object.values(spans).find(arr => arr[0]) || [])[0];
        let rootEl = firstSpan && firstSpan.closest("section, .w-full, .container, main, body");
        if (!rootEl) rootEl = document.body;

        onVisibleOnce(rootEl, () => {
            for (const [key, cfg] of Object.entries(targets)) {
                const els = spans[key];
                els.forEach(el => countUp(el, cfg.to, cfg.duration));
            }
        });
    }

    // DOM 준비 후 실행
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();


// intro-type.js — React의 IntroComponent03을 바닐라로 재현 (HTML 수정 불필요)
(function () {
    const MIN_OPEN_PX = 120;
    const MIN_RATIO = 0.5;

    // 카드 탐색: 제목 라벨 텍스트로 식별
    function findCardByTitle(text) {
        const cards = Array.from(document.querySelectorAll('div.border.rounded-\\[1\\.25rem\\]'));
        return cards.find(card => card.querySelector('.cursor-pointer')?.textContent.includes(text));
    }

    const cards = {
        RFID:   findCardByTitle('RFID Type'),
        SELF:   findCardByTitle('SELF Type'),
        HYBRID: findCardByTitle('Hybrid Type'),
    };
    if (!cards.RFID || !cards.SELF || !cards.HYBRID) return;

    // 각 카드에서 필요한 부분 집계
    function pickParts(card) {
        const header = card.querySelector('.cursor-pointer');
        const title  = header?.querySelector('span') || null;
        const icon   = header?.querySelector('img')  || null;

        // 설명 컨테이너 내부 첫 번째 div를 접힘 영역으로 사용
        let content = null;
        const desc = card.querySelector('.text-\\[\\#919FA8\\]');
        if (desc) content = desc.querySelector('div');

        return { card, header, title, icon, content };
    }

    const parts = {
        RFID:   pickParts(cards.RFID),
        SELF:   pickParts(cards.SELF),
        HYBRID: pickParts(cards.HYBRID),
    };

    // 초기 접힘 세팅
    Object.values(parts).forEach(({ card, title, icon, content }) => {
        if (content) {
            content.style.maxHeight  = '0px';
            content.style.overflow   = 'hidden';
            content.style.transition = 'max-height 1s ease';
        }
        if (title) title.style.color = '#0E0F12';
        if (icon) {
            icon.src = './img/info/plus.svg';
            icon.style.transition = 'transform 300ms';
            icon.style.transform  = 'rotate(0deg)';
        }
        card.style.boxShadow = 'none';
        // border 기본은 원래 클래스에 맡기고, 열릴 때만 색 보정
    });

    // 상태 & 렌더
    let openType = ''; // "RFID" | "SELF" | "HYBRID" | ""
    function render() {
        for (const [type, p] of Object.entries(parts)) {
            const on = openType === type;

            // 접힘/펼침
            if (p.content) p.content.style.maxHeight = on ? '401px' : '0px';

            // 타이틀 색
            if (p.title) p.title.style.color = on ? '#5200E9' : '#0E0F12';

            // 아이콘 + 회전
            if (p.icon) {
                p.icon.src = on ? './img/info/x.svg' : './img/info/plus.svg';
                p.icon.style.transform = on ? 'rotate(90deg)' : 'rotate(0deg)';
            }

            // 카드 하이라이트
            p.card.style.boxShadow  = on ? '0 10px 30px rgba(0,0,0,0.06)' : 'none';
            p.card.style.borderColor = on ? '#E1E1E1' : ''; // 닫힘 시 원래 클래스 색으로 복귀
        }
    }

    // 클릭으로 전환 (같은 카드는 토글하지 않고 유지: React 코드와 동일한 UX)
    Object.entries(parts).forEach(([type, p]) => {
        p.header?.addEventListener('click', () => {
            openType = type;
            render();
        });
    });

    // 사용자 입력 전 자동 열림 방지(무장)
    let armed = false;
    const arm = () => { armed = true; };
    window.addEventListener('scroll', arm,    { once: true, passive: true });
    window.addEventListener('wheel', arm,     { once: true, passive: true });
    window.addEventListener('touchmove', arm, { once: true, passive: true });

    // 가시화되면 한 번씩 자동 전환
    const targets = [
        { el: parts.RFID.card,   type: 'RFID' },
        { el: parts.SELF.card,   type: 'SELF' },
        { el: parts.HYBRID.card, type: 'HYBRID' },
    ];
    const seen = new Set();

    const io = new IntersectionObserver((entries) => {
        if (!armed) return; // 초기 자동열림 방지
        for (const e of entries) {
            if (!e.isIntersecting) continue;

            const bigEnough = (e.intersectionRect.height >= MIN_OPEN_PX) || (e.intersectionRatio >= MIN_RATIO);
            if (!bigEnough) continue;

            const hit = targets.find(t => t.el === e.target);
            if (!hit) continue;

            openType = hit.type;
            render();

            if (!seen.has(hit.type)) {
                seen.add(hit.type);
                io.unobserve(e.target); // 각 타깃 1회만
            }
            if (seen.size === targets.length) io.disconnect();
        }
    }, {
        root: null,
        rootMargin: '0px',
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    });

    targets.forEach(t => t.el && io.observe(t.el));
})();
