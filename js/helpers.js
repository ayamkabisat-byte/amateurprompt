// =============================================================================
// HELPERS
// Pure utility functions, no DOM mutation, no business logic
// =============================================================================

/** Pick a random element from an array. Returns "" if empty. */
function getRandom(arr) {
    if (!arr || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
}

/** Pick N unique random elements from an array. */
function getRandomN(arr, n) {
    if (!arr || arr.length === 0) return [];
    const copy = [...arr];
    const result = [];
    for (let i = 0; i < n && copy.length > 0; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}

/** Read element value safely. */
function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
}

/** Read element checked state safely. */
function getChecked(id) {
    const el = document.getElementById(id);
    return el ? !!el.checked : false;
}

/** Set element value safely. */
function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

/** Check if a location environment supports mirror-selfie shots. */
function isMirrorFriendly(envName) {
    if (!envName) return false;
    const kw = ["BATHROOM", "BEDROOM", "KOS", "CAFE", "MALL", "CLUB", "RESTROOM", "TOILET", "CORNER", "ROOM", "COMPOUND", "CAR", "INNOVA", "MERCEDES", "ALPHARD", "THRIFT", "STORE", "ELEVATOR", "BED", "LAUNDROMAT", "PHOTOBOOTH", "CONVEX", "CERMIN", "WARUNG", "BARBERSHOP", "STUDIO", "KLINIK", "KTP"];
    const upper = envName.toUpperCase();
    return kw.some(k => upper.includes(k));
}

/** Pick a weighted random era using the eraWeights table. */
function getWeightedEra() {
    if (typeof eraWeights === "undefined") return "MODERN_2020S";
    const total = eraWeights.reduce((s, e) => s + e.weight, 0);
    let r = Math.random() * total;
    for (const era of eraWeights) {
        if (r < era.weight) return era.id;
        r -= era.weight;
    }
    return "MODERN_2020S";
}

/** Convert SNAKE_CASE_LIKE_THIS to "snake case like this". */
function snakeToHuman(str) {
    return (str || "").toString().replace(/_/g, " ").toLowerCase();
}

/** Capitalize first letter. */
function capFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Debounce factory. */
function makeDebouncer() {
    let timer = null;
    return function debounce(fn, delay = 150) {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
}

/** Coin flip with arbitrary probability (0-1). */
function chance(p) {
    return Math.random() < p;
}
