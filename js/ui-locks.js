// =============================================================================
// UI: LOCK STATE
// Centralized lock toggling. Locking a field excludes it from "ACAK SEMUA".
// =============================================================================

const lockState = {};

function isLocked(id) {
    return lockState[id] === true;
}

function applyLockVisual(id, locked) {
    const el = document.getElementById(id);
    if (!el) return;

    // For inputs and selects, change border color and opacity
    if (el.tagName === "SELECT" || (el.tagName === "INPUT" && el.type !== "hidden")) {
        if (locked) {
            el.style.borderColor = "#ef4444";
            el.style.opacity = "0.85";
        } else {
            el.style.borderColor = "";
            el.style.opacity = "";
        }
    }
}

/** Generic lock toggle — used for select/input fields with their own icon. */
function toggleLock(id, iconEl) {
    lockState[id] = !lockState[id];
    const locked = lockState[id];

    if (iconEl) {
        iconEl.classList.toggle("fa-lock", locked);
        iconEl.classList.toggle("fa-lock-open", !locked);
        iconEl.classList.toggle("locked", locked);
        iconEl.classList.toggle("unlocked", !locked);
    }
    applyLockVisual(id, locked);
}

/** Lock toggle for list-based hidden inputs (location/camera/aesthetic). */
function toggleListLock(hiddenId, iconId, containerId) {
    const iconEl = document.getElementById(iconId);
    const container = document.getElementById(containerId);
    lockState[hiddenId] = !lockState[hiddenId];
    const locked = lockState[hiddenId];

    if (iconEl) {
        iconEl.classList.toggle("fa-lock", locked);
        iconEl.classList.toggle("fa-lock-open", !locked);
        iconEl.classList.toggle("locked", locked);
        iconEl.classList.toggle("unlocked", !locked);
    }
    if (container) container.classList.toggle("locked-border", locked);
}

/** Lock toggle for advanced panel rows. */
function toggleAdvLock(id, spanEl) {
    lockState[id] = !lockState[id];
    const locked = lockState[id];

    const icon = spanEl?.querySelector("i");
    if (icon) {
        icon.classList.toggle("fa-lock", locked);
        icon.classList.toggle("fa-lock-open", !locked);
        icon.classList.toggle("text-red-500", locked);
        icon.classList.toggle("text-slate-500", !locked);
        icon.classList.toggle("locked", locked);
        icon.classList.toggle("unlocked", !locked);
    }
    applyLockVisual(id, locked);
}

// Convenience wrappers used directly from HTML attributes
function toggleLocLock() { toggleListLock("locSelect", "locLockIcon", "locListContainer"); }
function toggleCamLock() { toggleListLock("cameraSelect", "camLockIcon", "cameraListContainer"); }
function toggleAesLock() { toggleListLock("aestheticSelect", "aesLockIcon", "aesListContainer"); }
