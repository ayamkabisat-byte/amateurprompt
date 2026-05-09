// =============================================================================
// UI: LIST RENDERERS
// Builds the radio-style list boxes for Location, Camera, Aesthetic.
// Uses event delegation for performance.
// =============================================================================

// ---------------------------------------------------------------------------
// Single radio option HTML factory
// ---------------------------------------------------------------------------
function createRadioOption(name, value, label, selectedValue, subText = "") {
    const checked = value === selectedValue ? "checked" : "";
    const bg = checked
        ? "bg-slate-700/90 border-slate-500 shadow-inner"
        : "border-transparent hover:border-slate-600 hover:bg-slate-700/50";
    const sub = subText
        ? `<div class="text-[10px] text-slate-400 leading-tight mt-1 line-clamp-2">${escapeHtml(subText)}</div>`
        : "";
    return `
    <label class="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border w-full radio-label ${bg}">
        <input type="radio" name="${name}" value="${escapeAttr(value)}" ${checked} class="mt-0.5 accent-red-500 w-4 h-4 shrink-0 cursor-pointer radio-input">
        <div class="flex flex-col flex-1 pointer-events-none">
            <span class="text-sm text-slate-200 font-semibold leading-tight">${escapeHtml(label)}</span>${sub}
        </div>
    </label>`;
}

function escapeHtml(s) {
    return (s || "").toString().replace(/[&<>"']/g, m => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[m]));
}

function escapeAttr(s) { return escapeHtml(s); }

// ---------------------------------------------------------------------------
// Event delegation for radio list containers
// ---------------------------------------------------------------------------
function setupListDelegation(containerId, hiddenId, onChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener("change", e => {
        if (!e.target.classList.contains("radio-input")) return;
        document.getElementById(hiddenId).value = e.target.value;

        // Visual update
        container.querySelectorAll(".radio-label").forEach(l => {
            l.classList.remove("bg-slate-700/90", "border-slate-500", "shadow-inner");
            l.classList.add("border-transparent", "hover:border-slate-600", "hover:bg-slate-700/50");
        });
        const parent = e.target.closest(".radio-label");
        if (parent) {
            parent.classList.add("bg-slate-700/90", "border-slate-500", "shadow-inner");
            parent.classList.remove("border-transparent", "hover:border-slate-600", "hover:bg-slate-700/50");
        }

        if (onChange) onChange();
    });
}

// ---------------------------------------------------------------------------
// LOCATION LIST
// ---------------------------------------------------------------------------
function renderLocationList() {
    if (isLocked("locSelect")) return;
    const container = document.getElementById("locListContainer");
    const locInput = document.getElementById("locSelect");
    const eraVal = getVal("eraSelect");
    if (!container || !locInput) return;

    let currentVal = locInput.value;
    let html = createRadioOption("locRadio", "RANDOM", "🎲 Acak Lokasi", currentVal, "Lokasi otomatis menyesuaikan Era");

    let validFound = (currentVal === "RANDOM");

    if (typeof settings !== "undefined") {
        settings.forEach((s, i) => {
            if (eraVal === "RANDOM" || s.era_id === eraVal) {
                const idxStr = i.toString();
                if (currentVal === idxStr) validFound = true;
                html += createRadioOption("locRadio", idxStr, s.env, currentVal, s.arch);
            }
        });
    }

    if (!validFound) {
        locInput.value = "RANDOM";
        html = html.replace(`value="RANDOM"`, `value="RANDOM" checked`);
    }

    container.innerHTML = html;
}

// ---------------------------------------------------------------------------
// CAMERA LIST
// ---------------------------------------------------------------------------
const CAMERA_SECTIONS = [
    { label: "🖼️ Image Reference", items: [
        { v: "MATCH_POSE", l: "🧍 Jiplak Pose & Angle Gambar", s: "Memaksa AI meniru pose & angle dari gambar referensi" }
    ]},
    { label: "🤳 Selfie & POV", items: [
        { v: "SELFIE_STANDARD",        l: "Selfie Standar",            s: "Sejajar wajah" },
        { v: "SELFIE_05X_TOPDOWN_POV", l: "0.5x Top-Down POV (Gen-Z)", s: "Kamera di atas kepala, foreshortening kaki" },
        { v: "SELFIE_HIGH_ANGLE",      l: "Selfie High Angle",          s: "Dari atas (estetik)" },
        { v: "SELFIE_LOW_ANGLE",       l: "Selfie Low Angle",           s: "Dari bawah dagu" },
        { v: "SELFIE_WIDE",            l: "Selfie 0.5x Wide",           s: "Lensa lebar, distorsi sudut" },
        { v: "SELFIE_CLOSEUP",         l: "Selfie Close-Up",            s: "Sangat dekat ke wajah" },
        { v: "ANGLE_POV",              l: "First-Person POV",           s: "Sudut pandang mata subjek" }
    ]},
    { label: "🪞 Mirror Selfie", items: [
        { v: "MIRROR_STANDARD", l: "Mirror Selfie",   s: "Foto lurus di depan cermin" },
        { v: "MIRROR_WIDE",     l: "Mirror Wide 0.5x", s: "Lensa ultra wide di kaca" },
        { v: "MIRROR_FACELESS", l: "Faceless Mirror", s: "HP sepenuhnya menutupi wajah" }
    ]},
    { label: "📐 Ukuran Shot (Framing)", items: [
        { v: "PORTRAIT_CLOSE_UP", l: "Portrait Close-Up", s: "Bahu/Dada ke atas" },
        { v: "FRAMING_MEDIUM",    l: "Medium Shot (MS)",  s: "Pinggang ke atas" },
        { v: "FRAMING_LONG",      l: "Long Shot (LS)",    s: "Full Body" },
        { v: "FRAMING_WIDE",      l: "Extreme Long Shot", s: "Subjek kecil, background luas" }
    ]},
    { label: "🎯 Sudut Angle (Posed)", items: [
        { v: "POSED_EYE_LEVEL",  l: "Eye Level",       s: "Sejajar rata mata subjek" },
        { v: "POSED_HIGH_ANGLE", l: "High Angle",      s: "Kamera menatap ke bawah" },
        { v: "POSED_LOW_ANGLE",  l: "Low Angle",       s: "Kamera menatap ke atas" },
        { v: "ANGLE_BIRD_EYE",   l: "Bird's Eye View", s: "Tegak lurus 90° dari atas kepala" },
        { v: "ANGLE_FROG_EYE",   l: "Frog/Worm's Eye", s: "Kamera di tanah/lantai" },
        { v: "ANGLE_DUTCH",      l: "Dutch Angle",     s: "Kamera dimiringkan sengaja" }
    ]},
    { label: "🫣 Candid & Lainnya", items: [
        { v: "CANDID_UNAWARE",     l: "Candid Asli",            s: "Aktivitas natural, tidak lihat kamera" },
        { v: "CANDID_INTENTIONAL", l: "Candid Pura-Pura",       s: "Sadar kamera, aesthetic berpaling" },
        { v: "CANDID_OTS",         l: "Over the Shoulder (OTS)", s: "Dari belakang bahu" },
        { v: "CANDID_TELEPHOTO",   l: "Telephoto Shot",         s: "Paparazzi zoom jarak jauh" },
        { v: "ACCIDENTAL",         l: "Accidental Blur",        s: "Tidak sengaja terjepret, shaky/blur" }
    ]},
    { label: "📹 Sudut Ekstrem", items: [
        { v: "EXTREME_CCTV",    l: "Kamera CCTV",        s: "Sudut tinggi pojok ruangan" },
        { v: "EXTREME_FISHEYE", l: "Action Cam Fisheye", s: "Lensa 8mm sangat cembung" }
    ]}
];

function renderCameraList() {
    if (isLocked("cameraSelect")) return;
    const container = document.getElementById("cameraListContainer");
    const camInput = document.getElementById("cameraSelect");
    if (!container || !camInput) return;
    const val = camInput.value;

    let html = createRadioOption("camRadio", "RANDOM", "🎲 Acak Gaya Kamera", val, "Otomatis menyesuaikan skenario");

    CAMERA_SECTIONS.forEach(sec => {
        html += `<div class="text-xs font-bold text-orange-400 mt-3 mb-1 px-2 border-b border-slate-700 pb-1">${sec.label}</div>`;
        sec.items.forEach(a => {
            html += createRadioOption("camRadio", a.v, a.l, val, a.s);
        });
    });

    container.innerHTML = html;
}

// ---------------------------------------------------------------------------
// AESTHETIC LIST
// ---------------------------------------------------------------------------
function renderAestheticList() {
    if (isLocked("aestheticSelect")) return;
    const container = document.getElementById("aesListContainer");
    const aesInput = document.getElementById("aestheticSelect");
    if (!container || !aesInput) return;
    const val = aesInput.value;

    let html = createRadioOption("aesRadio", "DEFAULT", "📷 Default (Bawaan)", val, "Tidak ada filter ekstra");
    html    += createRadioOption("aesRadio", "RANDOM",  "🎲 Acak Aesthetic",   val, "Biarkan AI memilih secara acak");
    html    += `<div class="text-xs font-bold text-purple-400 mt-3 mb-1 px-2 border-b border-slate-700 pb-1">Daftar Filter & Style</div>`;

    if (typeof aestheticFilters !== "undefined") {
        for (const [key, data] of Object.entries(aestheticFilters)) {
            html += createRadioOption("aesRadio", key, data.label || key.replace(/_/g, " "), val, data.cameraType);
        }
    }
    container.innerHTML = html;
}
