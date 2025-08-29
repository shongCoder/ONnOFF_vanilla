import { closeMenu } from "./header.js";

const HEADER_OFFSET_PX = 70; // active 판정 보정용

// 1) 해시/메뉴 클릭 → 부드러운 스크롤
function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    // scroll-margin-top 클래스가 있어 scrollIntoView로 충분
    el.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("click", (e) => {
    const li = e.target.closest("#navMenu li");
    if (!li) return;
    const id = li.dataset.id;
    if (id) {
        e.preventDefault();
        scrollToId(id);
        closeMenu();
    }
});

// 2) 섹션 활성(nav active)
const sections = [...document.querySelectorAll("section[id]")];
const navItems = [...document.querySelectorAll("#navMenu li")];

const activeObserver = new IntersectionObserver(
    (entries) => {
        // 화면 상단 근처(헤더 보정)에서 가장 먼저 걸리는 섹션을 active로
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const currentId = visible[0].target.id;

        navItems.forEach(li => {
            const on = li.dataset.id === currentId;
            li.classList.toggle("text-[#5200E9]", on);
            li.classList.toggle("font-bold", on);
            li.classList.toggle("text-on_black", !on);
            li.classList.toggle("font-semibold", !on);
        });

        // 주소창 해시 갱신(선택)
        if (location.hash !== `#${currentId}`) {
            history.replaceState(null, "", `#${currentId}`);
        }
    },
    { root: null, rootMargin: `-${HEADER_OFFSET_PX}px 0px 0px 0px`, threshold: 0.1 }
);

sections.forEach(s => activeObserver.observe(s));

// 3) 섹션 입장 애니메이션 재트리거
// React의 key 리렌더 대신: 클래스 제거→강제 리플로우→추가
const animMap = new WeakMap(); // wasIntersecting 상태 저장
const animObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
            const was = animMap.get(target) || false;

            if (isIntersecting && !was) {
                const name = target.dataset.animate || "fadeInUp";
                const cls = `animate-${name}`;
                target.classList.remove(cls);
                // 강제 리플로우로 애니메이션 재시작 가능하게
                // eslint-disable-next-line no-unused-expressions
                target.offsetWidth;
                target.classList.add(cls);
                animMap.set(target, true);
            } else if (!isIntersecting) {
                animMap.set(target, false); // 다시 나갔으면 다음에 또 재트리거
            }
        });
    },
    { threshold: 0.3, rootMargin: "0px 0px -120px 0px" }
);

const animTargets = document.querySelectorAll("[data-animate]");
animTargets.forEach(el => animObserver.observe(el));
