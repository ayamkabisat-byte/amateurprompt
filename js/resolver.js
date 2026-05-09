// =============================================================================
// RESOLVER
// Converts raw form values into resolved scene parameters.
// All RANDOM/AUTO logic lives here. No DOM mutation.
// =============================================================================

// ---------------------------------------------------------------------------
// ERA
// ---------------------------------------------------------------------------
function resolveEra(eraVal) {
    return eraVal === "RANDOM" ? getWeightedEra() : eraVal;
}

// ---------------------------------------------------------------------------
// HOLIDAY (only ~25% chance to roll holiday on RANDOM_HOLIDAY)
// ---------------------------------------------------------------------------
function resolveHoliday(holidayVal) {
    if (holidayVal === "RANDOM_HOLIDAY") {
        if (chance(0.25) && typeof holidayLocationDB !== "undefined") {
            return getRandom(Object.keys(holidayLocationDB));
        }
        return null;
    }
    if (!holidayVal || holidayVal === "NONE") return null;
    return holidayVal;
}

// ---------------------------------------------------------------------------
// LOCATION
// Priority: explicit holiday → explicit index → era-filtered random → fallback
// ---------------------------------------------------------------------------
function resolveLocation(locVal, resolvedEra, activeHoliday) {
    // Holiday takes priority
    if (activeHoliday && typeof holidayLocationDB !== "undefined" && holidayLocationDB[activeHoliday]) {
        return getRandom(holidayLocationDB[activeHoliday]);
    }

    // Explicit index
    if (locVal && locVal !== "RANDOM") {
        const idx = parseInt(locVal);
        if (typeof settings !== "undefined" && !isNaN(idx) && settings[idx]) {
            return settings[idx];
        }
    }

    // Era-filtered random
    if (typeof settings !== "undefined") {
        const filtered = settings.filter(s => resolvedEra === "RANDOM" || s.era_id === resolvedEra);
        if (filtered.length) return getRandom(filtered);
        return getRandom(settings);
    }

    return { env: "GENERIC LOCATION", arch: "GENERIC ARCHITECTURE", props: "NONE", era_id: resolvedEra };
}

// ---------------------------------------------------------------------------
// TIME OF DAY
// ---------------------------------------------------------------------------
const TIME_DESCRIPTORS = {
    MORNING:     { tag: "morning",      desc: "soft morning light around 8 to 10 AM, the day still young" },
    AFTERNOON:   { tag: "afternoon",    desc: "harsh midday tropical light, shadows hard and short, between 12 and 3 PM" },
    GOLDEN_HOUR: { tag: "golden hour",  desc: "the last hour before sunset, light low and amber, long warm shadows" },
    NIGHT:       { tag: "night",        desc: "after dark, ambient light dominated by artificial sources" }
};

function resolveTime(timeVal) {
    if (timeVal === "RANDOM") {
        const keys = Object.keys(TIME_DESCRIPTORS);
        return TIME_DESCRIPTORS[getRandom(keys)];
    }
    return TIME_DESCRIPTORS[timeVal] || null;
}

// ---------------------------------------------------------------------------
// WEATHER
// ---------------------------------------------------------------------------
const WEATHER_DESCRIPTORS = {
    CLEAR:    { tag: "clear",    desc: "clear sky, no precipitation, normal atmospheric clarity" },
    OVERCAST: { tag: "overcast", desc: "thick gray overcast sky, diffused light, moody flat tones" },
    RAINING:  { tag: "raining",  desc: "rain falling steadily, wet reflective surfaces, raindrops on glass and skin" }
};

function resolveWeather(weatherVal) {
    if (weatherVal === "RANDOM") {
        const keys = Object.keys(WEATHER_DESCRIPTORS);
        return WEATHER_DESCRIPTORS[getRandom(keys)];
    }
    return WEATHER_DESCRIPTORS[weatherVal] || null;
}

// ---------------------------------------------------------------------------
// COMPOSITION
// ---------------------------------------------------------------------------
function resolveComposition(compVal) {
    if (!compVal || compVal === "NONE") return null;
    if (typeof compositionsRules === "undefined") return null;
    if (compVal === "RANDOM") {
        const keys = Object.keys(compositionsRules);
        return { key: getRandom(keys), text: compositionsRules[getRandom(keys)] };
    }
    return compositionsRules[compVal] ? { key: compVal, text: compositionsRules[compVal] } : null;
}

// ---------------------------------------------------------------------------
// AESTHETIC FILTER
// ---------------------------------------------------------------------------
function resolveAesthetic(aesVal) {
    if (!aesVal || aesVal === "DEFAULT") return null;
    if (typeof aestheticFilters === "undefined") return null;
    if (aesVal === "RANDOM") {
        const keys = Object.keys(aestheticFilters);
        const k = getRandom(keys);
        return { key: k, ...aestheticFilters[k] };
    }
    return aestheticFilters[aesVal] ? { key: aesVal, ...aestheticFilters[aesVal] } : null;
}

// ---------------------------------------------------------------------------
// LIGHTING
// Aesthetic filter overrides ambient lighting if present
// ---------------------------------------------------------------------------
function resolveLighting(aesData) {
    if (aesData) {
        return {
            source: aesData.lighting,
            dir: "as described by aesthetic preset",
            qual: aesData.render
        };
    }
    if (typeof lightings !== "undefined") {
        return getRandom(lightings);
    }
    return { source: "NATURAL DAYLIGHT", dir: "FRONTAL", qual: "EVEN" };
}

// ---------------------------------------------------------------------------
// SUBJECT
// ---------------------------------------------------------------------------
function resolveSubject(forcedGender, forcedAge, bodyTypeVal) {
    // Age
    let agePrefix = "young";
    if (forcedAge === "TEENAGER")         agePrefix = "teenage";
    else if (forcedAge === "YOUNG_ADULT") agePrefix = "young adult";
    else if (forcedAge === "ADULT")       agePrefix = "30-year-old";
    else if (forcedAge === "MATURE")      agePrefix = "middle-aged";
    else {
        const r = Math.random() * 100;
        if (r < 40)      agePrefix = "young";
        else if (r < 70) agePrefix = "teenage";
        else if (r < 88) agePrefix = "30-year-old";
        else             agePrefix = "middle-aged";
    }

    // Gender
    let genderId = forcedGender;
    if (!genderId || genderId === "RANDOM") {
        genderId = chance(0.5) ? "FEMALE" : "MALE";
    }

    // Body type
    let bodyDesc = "";
    if (bodyTypeVal && bodyTypeVal !== "MATCH" && bodyTypeVal !== "RANDOM") {
        bodyDesc = bodyTypeVal.toLowerCase();
    } else if (bodyTypeVal === "RANDOM") {
        bodyDesc = getRandom([
            "slim and petite",
            "thick and curvy",
            "muscular and toned",
            "chubby",
            ""
        ]);
    }

    // Gender word resolution
    const genderWord = genderId === "FEMALE"
        ? (agePrefix === "teenage" ? "girl" : "woman")
        : (agePrefix === "teenage" ? "boy" : "man");

    const subjectPhrase = [
        "a",
        agePrefix,
        bodyDesc,
        genderWord
    ].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

    return { genderId, subjectPhrase, agePrefix, bodyDesc, genderWord };
}
