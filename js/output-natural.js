// =============================================================================
// NATURAL TEXT PROMPT BUILDERS
// Two flavors:
//   - Veo / Flow:  cinematic narrative paragraph
//   - Higgsfield Soul: tag-based mood-driven phrasing
// =============================================================================

// ---------------------------------------------------------------------------
// Helper: format wardrobe into a natural phrase
// ---------------------------------------------------------------------------
function describeWardrobe(w) {
    const parts = [];
    if (w.top)    parts.push(w.top.toLowerCase());
    if (w.bottom) parts.push(w.bottom.toLowerCase());
    if (w.shoe)   parts.push(w.shoe.toLowerCase());
    let txt = "wearing " + parts.join(", paired with ");
    if (w.hair && w.hair !== "NONE")  txt += `; hair ${w.hair.toLowerCase()}`;
    if (w.acc && w.acc !== "NONE")    txt += `; accessorized with ${w.acc.toLowerCase()}`;
    return txt;
}

// ---------------------------------------------------------------------------
// Helper: describe subject in natural English
// ---------------------------------------------------------------------------
function describeSubject(subject, includeName) {
    const name = subject.name && includeName ? subject.name : null;
    const desc = subject.subjectPhrase + (name ? "" : ` of ${(subject.demographic || "Indonesian").toLowerCase()} descent`);
    return name ? `${name} (${desc})` : desc;
}

// =============================================================================
// VEO STYLE — Cinematic Narrative Paragraph
// Format: [Time/Mood opening] · [Subject + action interleaved with location] ·
//         [Camera and lens specs woven in] · [Lighting + grade] · [Optional scenario]
// =============================================================================

function buildVeoPhotoPrompt(ctx) {
    const { shotType, subjects, locData, lighting, aesData, compData, timeData, weatherData,
            activeHoliday, customScenario, eraLabel, strictMode } = ctx;

    // Opening — set the scene
    let opener = "";
    if (timeData) opener = capFirst(timeData.tag) + ". ";
    else if (weatherData) opener = capFirst(weatherData.tag) + ". ";
    if (activeHoliday) opener += `It is ${activeHoliday}. `;

    // Subject portion
    const subjectClauses = subjects.map((s, i) => {
        const name = s.name ? `${s.name}, ` : "";
        const demo = s.name ? "" : ` of ${(s.demographic || "Indonesian").toLowerCase()} descent`;
        const wardrobe = describeWardrobe(s.wardrobe);
        return `${i === 0 ? "" : "Beside them, "}${name}${s.subjectPhrase}${demo}, ${wardrobe}`;
    });
    const subjectText = subjectClauses.join(". ") + ".";

    // Location embedded as place context
    const locText = `The setting is ${locData.env.toLowerCase()} — ${locData.arch.toLowerCase()}. ${locData.props ? `In frame: ${locData.props.toLowerCase()}.` : ""}`;

    // Action / pose
    let actionText = "";
    if (shotType.pose) actionText += capFirst(shotType.pose) + ". ";
    if (shotType.gaze) actionText += capFirst(shotType.gaze) + ". ";
    if (customScenario) actionText += `Specifically: ${customScenario}. `;

    // Camera
    const cameraText = `Shot on ${shotType.cameraModel}, ${shotType.focal}, ${shotType.angle}.`;

    // Lighting + grade
    let lightingText = `Lighting: ${lighting.source.toLowerCase()} (${lighting.dir.toLowerCase()}). ${lighting.qual.toLowerCase()}.`;
    if (timeData)    lightingText += ` ${capFirst(timeData.desc)}.`;
    if (weatherData) lightingText += ` ${capFirst(weatherData.desc)}.`;

    // Aesthetic
    const aesText = aesData
        ? `Color and grade: ${aesData.label} — ${aesData.render.toLowerCase()}. Lens cue: ${aesData.cameraType.toLowerCase()}.`
        : "";

    // Composition
    const compText = compData ? `Composition: ${compData.text}.` : "";

    // Era + vibe
    const vibeText = `Era cue: ${eraLabel}. Overall vibe: ${shotType.vibe.toLowerCase()}.`;

    // Strict mode
    const strictText = strictMode.face
        ? `\n\n[FACE LOCK]: strictly preserve the exact facial features from the reference image (weight ${strictMode.weight}). Do not alter facial structure, eyes, nose, or lips.`
        : "";
    const hairLockText = strictMode.hair ? " Strictly match hair and accessories from the reference." : "";

    return [
        opener.trim(),
        subjectText,
        locText,
        actionText.trim(),
        cameraText,
        lightingText,
        aesText,
        compText,
        vibeText
    ].filter(Boolean).join(" ").replace(/\s+/g, " ").trim() + strictText + hairLockText;
}

function buildVeoVideoPrompt(ctx, video) {
    const photoPrompt = buildVeoPhotoPrompt(ctx);
    const { camera, motion, pacing, ambient } = video;

    const motionLayers = [
        motion.micro,
        motion.gesture,
        motion.narrative
    ].filter(Boolean).join("; ");

    const motionText = `\n\nMOTION: ${camera.description}. Subject motion: ${motionLayers}. Pacing: ${pacing.tempo}, total clip ${pacing.duration} seconds.`;

    const soundText = `\n\nSOUND DESIGN: ${ambient.join("; ")}. ${pacing.soundCue}.`;

    return photoPrompt + motionText + soundText;
}

// =============================================================================
// HIGGSFIELD SOUL STYLE — Tag-Based Mood Phrasing
// Format: [Mood/aesthetic | Subject | Location | Camera | Lighting | Grade]
// Pipe-separated chunks of compact descriptors.
// =============================================================================

function buildSoulPhotoPrompt(ctx) {
    const { shotType, subjects, locData, lighting, aesData, compData, timeData, weatherData,
            activeHoliday, customScenario, eraLabel, strictMode } = ctx;

    // 1. Mood / aesthetic chunk
    const moodChunks = [];
    if (aesData)        moodChunks.push(aesData.label.toLowerCase());
    if (timeData)       moodChunks.push(timeData.tag);
    if (weatherData)    moodChunks.push(weatherData.tag);
    if (activeHoliday)  moodChunks.push(activeHoliday.toLowerCase().replace(/_/g, " "));
    moodChunks.push(eraLabel.toLowerCase().replace(/[()\/]/g, "").trim());
    moodChunks.push(shotType.vibe.toLowerCase());

    // 2. Subject chunk
    const subjectChunks = subjects.map(s => {
        const name = s.name ? `${s.name}, ` : "";
        const demo = s.name ? "" : `${(s.demographic || "Indonesian").toLowerCase()}, `;
        const w = s.wardrobe;
        const wardrobeBrief = [w.top, w.bottom, w.shoe, w.hair, w.acc]
            .filter(x => x && x !== "NONE")
            .map(x => x.toLowerCase())
            .join(", ");
        return `${name}${demo}${s.subjectPhrase}, ${wardrobeBrief}`;
    });

    // 3. Location chunk
    const locChunk = `${locData.env.toLowerCase()}, ${locData.arch.toLowerCase()}${locData.props ? `, ${locData.props.toLowerCase()}` : ""}`;

    // 4. Camera chunk
    const camChunk = `${shotType.cameraModel}, ${shotType.focal}, ${shotType.angle}, ${shotType.type.replace(/_/g, " ").toLowerCase()}`;

    // 5. Lighting chunk
    const lightChunk = `${lighting.source.toLowerCase()}, ${lighting.qual.toLowerCase()}`;

    // 6. Grade / composition chunk
    const gradeChunks = [];
    if (aesData)  gradeChunks.push(aesData.render.toLowerCase());
    if (compData) gradeChunks.push(compData.text.toLowerCase());

    // 7. Action
    const actionChunks = [];
    if (shotType.pose)    actionChunks.push(shotType.pose);
    if (shotType.gaze)    actionChunks.push(shotType.gaze);
    if (customScenario)   actionChunks.push(customScenario);

    const blocks = [
        `MOOD: ${moodChunks.join(", ")}`,
        `SUBJECT: ${subjectChunks.join(" | ")}`,
        `ACTION: ${actionChunks.join(", ") || "natural pose"}`,
        `LOCATION: ${locChunk}`,
        `CAMERA: ${camChunk}`,
        `LIGHTING: ${lightChunk}`
    ];
    if (gradeChunks.length) blocks.push(`GRADE: ${gradeChunks.join(", ")}`);
    if (strictMode.face)    blocks.push(`FACE_LOCK: strict, weight ${strictMode.weight}`);
    if (strictMode.hair)    blocks.push(`HAIR_LOCK: strict`);

    return blocks.join("\n");
}

function buildSoulVideoPrompt(ctx, video) {
    const photo = buildSoulPhotoPrompt(ctx);
    const { camera, motion, pacing, ambient } = video;

    const motionBlock = `MOTION: ${camera.label.toLowerCase()} — ${camera.description}`;
    const subjectMotionBlock = `SUBJECT_MOTION: ${[motion.micro, motion.gesture, motion.narrative].filter(Boolean).join(" | ")}`;
    const pacingBlock = `PACING: ${pacing.label.toLowerCase()}, ${pacing.duration}s, ${pacing.tempo}`;
    const soundBlock = `SOUND: ${ambient.join(" | ")}`;

    return [photo, motionBlock, subjectMotionBlock, pacingBlock, soundBlock].join("\n");
}
