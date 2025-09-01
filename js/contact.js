// contact.js
function openPrivacyPopup() {
    const popup = document.getElementById("privacyPopup");
    if (!popup) return;
    popup.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // 스크롤 잠금
}

function closePrivacyPopup() {
    const popup = document.getElementById("privacyPopup");
    if (!popup) return;
    popup.classList.add("hidden");
    document.body.style.overflow = ""; // 스크롤 복구
}
