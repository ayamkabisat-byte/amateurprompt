// =============================================================================
// VIDEO MOTION SELECTOR
// Combines shot type + location + mood to produce non-monotonous video direction.
// =============================================================================

// ---------------------------------------------------------------------------
// Pick a camera movement that fits the shot's mood and energy
// ---------------------------------------------------------------------------
function selectCameraMotion(shotType, locData, customScenario) {
    const styleKey = (shotType.styleKey || "").toUpperCase();
    const env = (locData?.env || "").toUpperCase();

    // Hard rules: certain shot styles dictate the camera movement
    if (styleKey.startsWith("SELFIE_") || styleKey === "ANGLE_POV" || styleKey === "EXTREME_FISHEYE") {
        return cameraMotions.POV_HANDHELD ? { key: "POV_HANDHELD", ...cameraMotions.POV_HANDHELD } : firstMotion();
    }
    if (styleKey.startsWith("MIRROR_")) {
        return chance(0.5)
            ? { key: "STATIC_LOCKED", ...cameraMotions.STATIC_LOCKED }
            : { key: "HANDHELD_LOOSE", ...cameraMotions.HANDHELD_LOOSE };
    }
    if (styleKey === "EXTREME_CCTV") {
        return { key: "STATIC_LOCKED", ...cameraMotions.STATIC_LOCKED };
    }
    if (styleKey === "ACCIDENTAL") {
        return { key: "HANDHELD_LOOSE", ...cameraMotions.HANDHELD_LOOSE };
    }

    // Soft rules: match by mood tags
    const moodTags = [];

    if (styleKey.includes("CANDID")) moodTags.push("candid", "documentary", "observational");
    if (styleKey === "PORTRAIT_CLOSE_UP" || styleKey === "FRAMING_MEDIUM") moodTags.push("portrait", "intimate");
    if (styleKey === "FRAMING_LONG" || styleKey === "FRAMING_WIDE") moodTags.push("scale", "establishing", "isolation");
    if (styleKey.startsWith("POSED_") || styleKey.startsWith("ANGLE_")) moodTags.push("hero", "showcase", "fashion");

    // Location-based tag enrichment
    if (env.match(/CONCERT|STAGE|CLUB|FESTIVAL/)) moodTags.push("energetic", "club", "concert");
    if (env.match(/BEACH|PANTAI|POOLSIDE/))       moodTags.push("dance", "showcase");
    if (env.match(/STREET|JALAN|ALLEY/))          moodTags.push("walking", "street");
    if (env.match(/BEDROOM|KAMAR|KOS/))           moodTags.push("intimate", "introspective");

    // Custom scenario hints
    if (customScenario) {
        const cs = customScenario.toLowerCase();
        if (cs.match(/walk|jalan/))            moodTags.push("walking", "follow");
        if (cs.match(/sit|duduk/))             moodTags.push("portrait", "intimate");
        if (cs.match(/dance|nari|nge.?dance/)) moodTags.push("hero", "showcase", "energetic");
    }

    // Build candidate pool from tags
    const candidates = new Set();
    moodTags.forEach(tag => {
        Object.entries(cameraMotions).forEach(([key, m]) => {
            if (m.bestFor.includes(tag)) candidates.add(key);
        });
    });

    // Fallback if no candidates
    if (candidates.size === 0) {
        const all = Object.keys(cameraMotions);
        const k = getRandom(all);
        return { key: k, ...cameraMotions[k] };
    }

    const k = getRandom([...candidates]);
    return { key: k, ...cameraMotions[k] };
}

function firstMotion() {
    const k = Object.keys(cameraMotions)[0];
    return { key: k, ...cameraMotions[k] };
}

// ---------------------------------------------------------------------------
// Pick subject motion layers (always 1 micro, often 1 gesture, sometimes 1 narrative)
// ---------------------------------------------------------------------------
function selectSubjectMotion(shotType, locData) {
    const env = (locData?.env || "").toUpperCase();
    const result = {
        micro: getRandom(subjectMotionLibrary.micro),
        gesture: null,
        narrative: null
    };

    // Pick gesture pool by location
    let gestureKey = "general";
    if (env.match(/CAFE|STARBUCKS|J\.CO|EXCELSO|KEDAI KOPI/))                     gestureKey = "cafe";
    else if (env.match(/BEDROOM|KAMAR|KOS|BATHTUB/))                              gestureKey = "bedroom_kos";
    else if (env.match(/STREET|JALAN|ALLEY|GANG|CROSSWALK|JEMBATAN|TROTOAR/))     gestureKey = "street";
    else if (env.match(/CLUB|NIGHTCLUB|CONCERT|STAGE|FESTIVAL/))                  gestureKey = "club_concert";
    else if (env.match(/BEACH|PANTAI|POOL|YACHT/))                                gestureKey = "beach_pool";
    else if (env.match(/CAR|MOBIL|TAXI|GRAB|GOJEK|VESPA|MERCEDES|ALPHARD/))       gestureKey = "car";
    else if (env.match(/MOSQUE|MASJID|PURA|TEMPLE|GEDUNG|WEDDING/))               gestureKey = "formal_event";

    const gesturePool = subjectMotionLibrary.gesture[gestureKey] || subjectMotionLibrary.gesture.general;
    result.gesture = getRandom(gesturePool);

    // 35% chance to add a narrative beat — except for static observational shots
    if ((shotType.styleKey || "").toUpperCase() !== "EXTREME_CCTV" && chance(0.35)) {
        result.narrative = getRandom(subjectMotionLibrary.narrative);
    }

    return result;
}

// ---------------------------------------------------------------------------
// Pick a pacing pattern based on shot energy and mood
// ---------------------------------------------------------------------------
function selectPacing(shotType, cameraMotion) {
    const energy = shotType.energyTag || cameraMotion.energy || "medium";
    const styleKey = (shotType.styleKey || "").toUpperCase();

    // Hard rules
    if (styleKey === "ACCIDENTAL")    return { key: "SNAP", ...pacingPatterns.SNAP };
    if (styleKey === "EXTREME_CCTV")  return { key: "LINGER", ...pacingPatterns.LINGER };
    if (styleKey.startsWith("MIRROR_")) return { key: "REAL_TIME", ...pacingPatterns.REAL_TIME };

    // Weighted pick based on energy
    const r = Math.random();
    if (energy === "low") {
        if (r < 0.35) return wrap("SLOW_BURN");
        if (r < 0.65) return wrap("LINGER");
        if (r < 0.85) return wrap("REAL_TIME");
        return wrap("FREEZE_BREAK");
    }
    if (energy === "high") {
        if (r < 0.30) return wrap("SNAP");
        if (r < 0.55) return wrap("SPEED_RAMP");
        if (r < 0.80) return wrap("REAL_TIME");
        return wrap("SLOWMO");
    }
    // Medium
    if (r < 0.35) return wrap("REAL_TIME");
    if (r < 0.55) return wrap("SLOW_BURN");
    if (r < 0.75) return wrap("SLOWMO");
    if (r < 0.90) return wrap("SPEED_RAMP");
    return wrap("FREEZE_BREAK");

    function wrap(k) { return { key: k, ...pacingPatterns[k] }; }
}

// ---------------------------------------------------------------------------
// Pick layered ambient sounds (2-3 from the right pool)
// ---------------------------------------------------------------------------
function selectAmbientSounds(locData, timeData, weatherData) {
    const pool = pickAmbientForEnv(locData?.env || "");
    const layers = getRandomN(pool, Math.min(3, pool.length));

    const extras = [];
    if (weatherData?.tag === "raining") extras.push("steady rain pattering on surfaces, occasional thunder rumble");
    if (timeData?.tag === "night")      extras.push("crickets and night insects in the background");
    if (timeData?.tag === "morning")    extras.push("first roosters or bird calls in the distance");

    return [...layers, ...extras];
}

// ---------------------------------------------------------------------------
// Master video direction builder
// ---------------------------------------------------------------------------
function buildVideoDirection(shotType, locData, customScenario, timeData, weatherData) {
    const camera   = selectCameraMotion(shotType, locData, customScenario);
    const motion   = selectSubjectMotion(shotType, locData);
    const pacing   = selectPacing(shotType, camera);
    const ambient  = selectAmbientSounds(locData, timeData, weatherData);

    return { camera, motion, pacing, ambient };
}
