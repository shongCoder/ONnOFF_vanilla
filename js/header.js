const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
let isOpen = false;

menuToggle.addEventListener("click", () => {
    isOpen = !isOpen;
    if (isOpen) {
        navMenu.classList.add("max-h-[300px]", "opacity-100");
        navMenu.classList.remove("max-h-0", "opacity-0");
    } else {
        navMenu.classList.remove("max-h-[300px]", "opacity-100");
        navMenu.classList.add("max-h-0", "opacity-0");
    }
});
