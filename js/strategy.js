// strategy.js — React StrategyComponent를 바닐라로 재현
(function () {
    // ---------- 데이터 ----------
    const contents = {
        special: [
            { type: "학교/기숙사", title: "세종공동캠퍼스점", body: "무인이라 인건비 부담 없이<br />혼자 운영해도 충분해서 좋습니다" },
            { type: "병·의원",     title: "전병원점",         body: "직원없이도 24시간 매장이 돌아갑니다.<br />관리도 훨씬 수월해졌어요" },
            { type: "회사구내",     title: "SK아카데미점",     body: "점심시간만 잠깐 체크하면 되니 정말 편해요.<br />매장은 모바일로 관리하고 있어요" },
            { type: "캠핑장",       title: "평화누리캠핑장점",  body: "24시간 고객이용이 가능하고 캠핑장 용품도<br />사입이 가능하니 일석이조에요!" },
            { type: "숙박업소",     title: "리치다이아몬드호텔점", body: "프론트 옆에 두고 직원없이<br />운영하니 효율적이에요" },
        ],
        conversion: [
            { type: "대기업편의점에서", title: "광명IC점",      body: "인건비 부담에 적자였는데 무인 전환 후<br />인건비가 0원!드디어 흑자 전환했어요" },
            { type: "대기업편의점에서", title: "송도아메리칸점", body: "직원 구하기도 힘들고 관리도 어려웠는데<br />무인 전환 후 완전히 해방됐어요" },
            { type: "대기업편의점에서", title: "한국IT전문학교점", body: "인건비는 줄고, 운영 효율은 좋아지니<br />자연스럽게 수익도 올라갔습니다" },
        ],
        twojobs: [
            { type: "직장인+편의점",  title: "일산삼성화재점", body: "퇴근후 1시간만 체크하면 되니 부담이 없어요.<br />본업과 병행하기 딱 좋아요" },
            { type: "구내식당+편의점", title: "코푸스낵점",     body: "식당한켠에 무인편의점을 열었는데<br />손님도 좋아하고 수익도 좋아요!" },
            { type: "주부+편의점",    title: "둔포점",         body: "공실로 그냥 둘 바엔 무인편의점이<br />훨씬 낫죠. 관리도 간단하고 편해요" },
        ],
        vacancy: [
            { type: "신축", title: "대라수점", body: "유인은 고민도 안했어요.<br />무인이 요즘 트렌드이고 현재 너무 만족합니다" },
            { type: "신축", title: "동패점",   body: "요즘같은 시대는 무인이 정답이에요.<br />시작부터 잘 풀리고 있어요" },
            { type: "신축", title: "대사로점", body: "처음부터 무인으로 시작하길 잘했죠.<br />운영도 여유롭고 수익도 만족하고 있어요!" },
        ],
    };

    // ---------- 상태 ----------
    let menu = "special";
    let openIndex = 0;

    // ---------- DOM ----------
    const wrap   = document.getElementById("strategyTrackWrap");
    const track  = document.getElementById("strategyTrack");
    const menuEl = document.getElementById("strategyMenu");
    if (!wrap || !track || !menuEl) return;

    // ---------- 카드 렌더 ----------
    const CARD_W = 420; // w-[26.25rem] * 16px
    const GAP    = 24;  // mx-3 좌우 합
    const STEP   = CARD_W + GAP;

    function makeCard(item, realIdx) {
        const outer = document.createElement("div");
        outer.className = "shrink-0 mx-3";

        const card = document.createElement("div");
        card.className = "w-[26.25rem] relative bg-[#003E810A] md:px-5 px-4 md:pt-5 pt-4 pb-6 rounded-[1.5rem] border";
        card.style.border = "1px solid rgba(0,62,129,0.08)";
        card.setAttribute("data-idx", String(realIdx));

        // 이미지
        const imgBox = document.createElement("div");
        imgBox.className = "w-full h-[14.7rem] rounded-[1rem] bg-cover border";
        imgBox.style.border = "1px solid rgba(0,62,129,0.08)";
        imgBox.style.backgroundImage = `url('./img/strategy/${menu}/${realIdx + 1}.png')`;

        // 라벨
        const label = document.createElement("div");
        label.className = "absolute top-[14.5rem] left-1/2 -translate-x-1/2 bg-[#5200E9] shadow-[inset_4px_4px_14px_0_rgba(255,255,255,0.2)] lg:text-[1.125rem] md:text-[1rem] text-[0.875rem] font-bold text-white py-[6px] px-3 rounded-[1.25rem]";
        label.textContent = item.type;

        // 타이틀 버튼
        const titleBtn = document.createElement("button");
        titleBtn.type = "button";
        titleBtn.className = "lg:text-[1.5rem] text-[1.25rem] font-bold mb-1 text-[#282828]";
        titleBtn.textContent = item.title;

        // 본문
        const bodyWrap = document.createElement("div");
        bodyWrap.className = "text-center mt-7";
        const bodyGrid = document.createElement("div");
        bodyGrid.className = "grid transition-all duration-300 ease-out";
        const bodyInnerWrap = document.createElement("div");
        bodyInnerWrap.className = "overflow-hidden";
        const bodyP = document.createElement("p");
        bodyP.className = "lg:text-[1.125rem] text-[0.875rem] text-[#898D99] mt-2";
        bodyP.innerHTML = item.body;

        // 조립
        bodyInnerWrap.appendChild(bodyP);
        bodyGrid.appendChild(bodyInnerWrap);
        bodyWrap.appendChild(titleBtn);
        bodyWrap.appendChild(bodyGrid);

        card.appendChild(imgBox);
        card.appendChild(label);
        card.appendChild(bodyWrap);
        outer.appendChild(card);

        // 클릭/키보드로 열기
        function openThis() {
            openIndex = realIdx;
            highlight();
        }
        card.addEventListener("click", openThis);
        titleBtn.addEventListener("click", (e) => { e.stopPropagation(); openThis(); });
        card.tabIndex = 0;
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openThis(); }
        });

        return outer;
    }

    function buildTrack() {
        track.innerHTML = "";
        const items = contents[menu] || [];
        // 두 번 이어붙여 무한처럼 보이게
        const all = items.concat(items);
        all.forEach((item, idx) => {
            const realIdx = idx % items.length;
            track.appendChild(makeCard(item, realIdx));
        });
        highlight();
    }

    // 선택 카드 하이라이트(인라인 스타일로 처리: safelist 불필요)
    function highlight() {
        const cards = Array.from(track.querySelectorAll("[data-idx]"));
        cards.forEach((el) => {
            const isOpen = Number(el.getAttribute("data-idx")) === openIndex;
            el.style.transform = isOpen ? "translateY(-2px)" : "translateY(0)";
            el.style.transition = "transform 200ms";
            const box = el; // outer div
            const card = el.firstElementChild; // inner card
            if (card) {
                card.style.boxShadow = isOpen ? "0 10px 30px rgba(0,0,0,0.06)" : "none";
                card.style.borderColor = isOpen ? "#E1E1E1" : "rgba(0,62,129,0.08)";
            }
        });
    }

    // ---------- 메뉴 변경 ----------
    function setMenu(type) {
        if (!contents[type]) return;
        menu = type;
        openIndex = 0;
        lastPick = -1;
        pos = 0;
        track.style.transform = "translateX(0px)";
        // 버튼 스타일
        menuEl.querySelectorAll("button").forEach(btn => {
            const on = btn.getAttribute("data-type") === type;
            btn.classList.toggle("checked_button_style", on);
        });
        buildTrack();
    }

    menuEl.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-type]");
        if (!btn) return;
        setMenu(btn.getAttribute("data-type"));
    });

    // ---------- 자동 흐름 & 중앙 카드 픽 ----------
    let rafId = 0;
    let pos = 0;          // translateX(px)
    const speed = 0.5;    // 흐름 속도
    let lastCheckTs = 0;
    let lastPick = -1;

    function tick(ts) {
        const items = contents[menu] || [];
        if (!items.length) return;

        pos -= speed;

        // 두 배 길이에서 절반 지점마다 리셋
        const resetAt = track.scrollWidth / 2;
        if (Math.abs(pos) >= resetAt) pos = 0;

        track.style.transform = `translateX(${pos}px)`;

        // 120ms 간격으로 중앙 카드 선정
        if (!lastCheckTs || ts - lastCheckTs > 120) {
            lastCheckTs = ts;

            const wrapLeft = document.getElementById("strategyTrackWrap").getBoundingClientRect().left;
            const viewportCenter = window.innerWidth / 2;
            const centerInTrack = (viewportCenter - wrapLeft) - pos;

            let idx = Math.round((centerInTrack - CARD_W / 2) / STEP);
            // items.length 기준으로 정규화
            idx = ((idx % items.length) + items.length) % items.length;

            if (idx !== lastPick) {
                lastPick = idx;
                openIndex = idx;
                highlight();
            }
        }

        rafId = requestAnimationFrame(tick);
    }

    function startLoop() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
    }

    // ---------- 초기화 ----------
    function init() {
        setMenu("special");
        // SectionWrapper 애니메이션과 충돌 피하려 약간 지연
        setTimeout(startLoop, 100);
        window.addEventListener("visibilitychange", () => {
            if (document.hidden) { if (rafId) cancelAnimationFrame(rafId); }
            else { startLoop(); }
        });
        window.addEventListener("resize", () => { /* 중앙 계산은 매 프레임 계산됨 */ });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
