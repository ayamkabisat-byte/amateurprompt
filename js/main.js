// =============================================================================
// MAIN ORCHESTRATOR
// Wires resolver → wardrobe → shot type → motion → output builders.
// Handles UI events: generate, copy, reset, init.
// =============================================================================

// ---------------------------------------------------------------------------
// Debounced trigger
// ---------------------------------------------------------------------------
const _debounceGen = makeDebouncer();

function triggerGenerate(delay = 150) {
    _debounceGen(generatePromptCore, delay);
}

function generatePromptNow() {
    generatePromptCore();
}

// ---------------------------------------------------------------------------
// Strict mode panel toggle
// ---------------------------------------------------------------------------
function toggleStrictLevel() {
    const v = getVal("strictSelect");
    document.getElementById("strictLevelContainer")?.classList.toggle("hidden", v !== "STRICT");
}

// ---------------------------------------------------------------------------
// Global custom name handler — disables age select if name set
// ---------------------------------------------------------------------------
function handleGlobalNameInput() {
    const nameEl = document.getElementById("customNameGlobal");
    const hasName = nameEl && nameEl.value.trim().length > 0;
    const ageEl = document.getElementById("ageSelect");
    if (ageEl) {
        ageEl.disabled = hasName;
        ageEl.style.opacity = hasName ? "0.5" : "";
    }
    triggerGenerate(500);
}

// ---------------------------------------------------------------------------
// CORE GENERATE
// ---------------------------------------------------------------------------
function generatePromptCore() {
    try {
        _generate();
    } catch (e) {
        console.error("Generate error:", e);
        const out = document.getElementById("textVeoPhoto");
        if (out) out.textContent = `⚠️ Error: ${e.message}\n\nCek console untuk detail.`;
    }
}

function _generate() {
    // ---- READ INPUTS ----
    const numVal       = getVal("numSelect");
    const ageVal       = getVal("ageSelect");
    const bodyTypeVal  = getVal("bodyTypeSelect");
    const genderVal    = getVal("genderSelect");
    const eraVal       = getVal("eraSelect");
    const locVal       = getVal("locSelect");
    const camVal       = getVal("cameraSelect") || "RANDOM";
    const aesVal       = getVal("aestheticSelect");
    const compVal      = getVal("compSelect");
    const holidayVal   = getVal("holidaySelect");
    const timeVal      = getVal("timeSelect");
    const weatherVal   = getVal("weatherSelect");
    const hairAccVal   = getVal("hairAccSelect");
    const strictVal    = getVal("strictSelect");
    const strictWeight = parseFloat(getVal("strictWeight") || "1.0");
    const customName   = (document.getElementById("customNameGlobal")?.value || "").trim();
    const customScen   = (document.getElementById("customScenarioInput")?.value || "").trim();

    // ---- RESOLVE SCENE PARAMETERS ----
    let numSubjects = numVal === "RANDOM" ? Math.floor(Math.random() * 6) + 1 : parseInt(numVal);
    if (isNaN(numSubjects) || numSubjects < 1) numSubjects = 1;
    if (genderVal === "COUPLE") numSubjects = 2;

    const resolvedEra   = resolveEra(eraVal);
    const activeHoliday = resolveHoliday(holidayVal);
    const locData       = resolveLocation(locVal, resolvedEra, activeHoliday);
    const aesData       = resolveAesthetic(aesVal);
    const lighting      = resolveLighting(aesData);
    const timeData      = resolveTime(timeVal);
    const weatherData   = resolveWeather(weatherVal);
    const compData      = resolveComposition(compVal);

    // ---- SHOT TYPE ----
    const shotType = getShotTypeData(resolvedEra, camVal, numSubjects, genderVal, customScen, locData.env);

    // ---- BUILD SUBJECTS ----
    const advancedActive = document.getElementById("advancedToggle")?.checked;
    const subjects = [];

    for (let i = 0; i < numSubjects; i++) {
        let forcedGender, forcedAge, forcedDemo, forcedName;

        if (advancedActive) {
            forcedName   = (document.getElementById(`adv_name_${i}`)?.value || "").trim();
            forcedGender = document.getElementById(`adv_gender_${i}`)?.value || "RANDOM";
            forcedAge    = document.getElementById(`adv_age_${i}`)?.value    || "RANDOM";
            forcedDemo   = document.getElementById(`adv_demo_${i}`)?.value   || "RANDOM";
        } else {
            forcedName   = (i === 0) ? customName : "";
            forcedGender = (genderVal === "COUPLE") ? (i === 0 ? "MALE" : "FEMALE") : genderVal;
            forcedAge    = ageVal;
            forcedDemo   = "RANDOM";
        }

        const subj = resolveSubject(forcedGender, forcedAge, bodyTypeVal);
        const demographic = (forcedDemo === "RANDOM" || !forcedDemo)
            ? (typeof demographics !== "undefined" ? getRandom(demographics) : "INDONESIAN")
            : forcedDemo;
        const wardrobe = buildWardrobe(subj.genderId, resolvedEra, activeHoliday, locData.env, forcedName);

        subjects.push({
            index: i + 1,
            name: forcedName || null,
            genderId: subj.genderId,
            subjectPhrase: subj.subjectPhrase,
            agePrefix: subj.agePrefix,
            demographic,
            wardrobe
        });
    }

    // ---- BUILD VIDEO DIRECTION ----
    const videoDirection = buildVideoDirection(shotType, locData, customScen, timeData, weatherData);

    // ---- ERA LABEL ----
    const eraLabel = (typeof eraLabels !== "undefined" && eraLabels[resolvedEra]) ? eraLabels[resolvedEra] : resolvedEra;

    // ---- ASSEMBLE CONTEXT ----
    const ctx = {
        shotType,
        subjects,
        locData,
        lighting,
        aesData,
        compData,
        timeData,
        weatherData,
        activeHoliday,
        customScenario: customScen,
        eraLabel,
        strictMode: {
            face: strictVal === "STRICT",
            weight: strictWeight,
            hair: hairAccVal === "MATCH_STRICT"
        }
    };

    // ---- BUILD ALL OUTPUTS ----
    const veoPhoto    = buildVeoPhotoPrompt(ctx);
    const veoVideo    = buildVeoVideoPrompt(ctx, videoDirection);
    const soulPhoto   = buildSoulPhotoPrompt(ctx);
    const soulVideo   = buildSoulVideoPrompt(ctx, videoDirection);
    const jsonPhoto   = buildPhotoJson(ctx);
    const jsonVideo   = buildVideoJson(ctx, videoDirection);

    // ---- WRITE TO DOM ----
    setTextContent("textVeoPhoto",   veoPhoto);
    setTextContent("textVeoVideo",   veoVideo);
    setTextContent("textSoulPhoto",  soulPhoto);
    setTextContent("textSoulVideo",  soulVideo);
    setTextContent("jsonOutputPhoto", JSON.stringify(jsonPhoto, null, 2));
    setTextContent("jsonOutputVideo", JSON.stringify(jsonVideo, null, 2));
}

function setTextContent(id, content) {
    const el = document.getElementById(id);
    if (el) el.textContent = content;
}

// ---------------------------------------------------------------------------
// RESET ALL
// ---------------------------------------------------------------------------
function resetAndGenerate() {
    const selects = [
        "numSelect", "ageSelect", "holidaySelect", "eraSelect", "compSelect",
        "genderSelect", "timeSelect", "weatherSelect", "bodyTypeSelect", "hairAccSelect", "strictSelect"
    ];
    selects.forEach(id => {
        if (isLocked(id)) return;
        const el = document.getElementById(id);
        if (!el) return;
        if (id === "holidaySelect")       el.value = "RANDOM_HOLIDAY";
        else if (id === "compSelect")     el.value = "NONE";
        else if (id === "bodyTypeSelect") el.value = "MATCH";
        else if (id === "strictSelect")   el.value = "FLEXIBLE";
        else                              el.value = "RANDOM";
    });

    if (!isLocked("aestheticSelect")) setVal("aestheticSelect", "DEFAULT");
    if (!isLocked("locSelect"))       setVal("locSelect", "RANDOM");
    if (!isLocked("cameraSelect"))    setVal("cameraSelect", "RANDOM");

    if (!isLocked("customNameGlobal")) {
        setVal("customNameGlobal", "");
        handleGlobalNameInput();
    }
    if (!isLocked("customScenarioInput")) {
        setVal("customScenarioInput", "");
    }

    toggleStrictLevel();

    // Reset advanced rows
    const advToggle = document.getElementById("advancedToggle");
    if (advToggle?.checked) {
        const container = document.getElementById("characterRows");
        if (container) {
            const count = container.children.length;
            for (let i = 0; i < count; i++) {
                ["name", "gender", "age", "demo"].forEach(f => {
                    if (isLocked(`adv_${f}_${i}`)) return;
                    const el = document.getElementById(`adv_${f}_${i}`);
                    if (el) {
                        el.value = f === "name" ? "" : "RANDOM";
                        el.disabled = false;
                        el.style.opacity = "";
                    }
                });
            }
        }
    }

    if (!isLocked("locSelect"))       renderLocationList();
    if (!isLocked("cameraSelect"))    renderCameraList();
    if (!isLocked("aestheticSelect")) renderAestheticList();

    generatePromptNow();
}

// ---------------------------------------------------------------------------
// COPY TO CLIPBOARD
// ---------------------------------------------------------------------------
async function copyToClipboard(targetId, btnId) {
    const content = document.getElementById(targetId)?.textContent || "";
    if (!content || content.startsWith("//") || content.startsWith("⚠️")) return;

    const success = () => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin!';
        btn.classList.replace("bg-slate-700", "bg-emerald-600");
        btn.classList.replace("hover:bg-slate-600", "hover:bg-emerald-500");
        setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.replace("bg-emerald-600", "bg-slate-700");
            btn.classList.replace("hover:bg-emerald-500", "hover:bg-slate-600");
        }, 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(content);
            success();
        } catch (e) {
            console.error(e);
        }
    } else {
        const ta = document.createElement("textarea");
        ta.value = content;
        ta.style.cssText = "position:fixed;left:-9999px;top:-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand("copy");
            success();
        } catch (e) {
            console.error(e);
        }
        document.body.removeChild(ta);
    }
}

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
    setupListDelegation("locListContainer",    "locSelect",       triggerGenerate);
    setupListDelegation("cameraListContainer", "cameraSelect",    triggerGenerate);
    setupListDelegation("aesListContainer",    "aestheticSelect", triggerGenerate);

    renderLocationList();
    renderCameraList();
    renderAestheticList();

    generatePromptNow();
});
