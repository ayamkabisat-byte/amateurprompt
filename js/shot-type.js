// =============================================================================
// SHOT TYPE RESOLVER
// Translates camera-style selection into a full shot description.
// =============================================================================

const ALL_SHOT_STYLES = [
    "SELFIE_STANDARD", "SELFIE_05X_TOPDOWN_POV", "SELFIE_HIGH_ANGLE", "SELFIE_LOW_ANGLE",
    "SELFIE_WIDE", "SELFIE_CLOSEUP", "ANGLE_POV",
    "MIRROR_STANDARD", "MIRROR_WIDE", "MIRROR_FACELESS",
    "PORTRAIT_CLOSE_UP", "FRAMING_MEDIUM", "FRAMING_LONG", "FRAMING_WIDE",
    "POSED_EYE_LEVEL", "POSED_HIGH_ANGLE", "POSED_LOW_ANGLE", "ANGLE_BIRD_EYE", "ANGLE_FROG_EYE", "ANGLE_DUTCH",
    "CANDID_UNAWARE", "CANDID_INTENTIONAL", "CANDID_OTS", "CANDID_TELEPHOTO", "ACCIDENTAL",
    "EXTREME_CCTV", "EXTREME_FISHEYE"
];

function getShotTypeData(eraId, cameraStyle, numSubjects, genderVal, customScenario, envName) {
    const mirrorOk = isMirrorFriendly(envName);
    const allowed = ALL_SHOT_STYLES.filter(s => mirrorOk || !s.includes("MIRROR"));

    let selected = cameraStyle;

    // RANDOM weighted toward common shots
    if (selected === "RANDOM") {
        const r = Math.random() * 100;
        if      (r < 12) selected = "CANDID_UNAWARE";
        else if (r < 22) selected = "SELFIE_STANDARD";
        else if (r < 32) selected = "SELFIE_05X_TOPDOWN_POV";
        else if (r < 42) selected = "POSED_EYE_LEVEL";
        else if (r < 52) selected = "FRAMING_MEDIUM";
        else if (r < 62) selected = "PORTRAIT_CLOSE_UP";
        else             selected = getRandom(allowed);
    } else if (selected.includes("MIRROR") && !mirrorOk) {
        // User picked mirror but environment doesn't support it
        selected = "SELFIE_STANDARD";
    }

    const d = {
        styleKey:    selected,
        type:        "POSED_SCENARIO",
        cameraModel: "smartphone camera",
        focal:       "standard phone lens (24mm equiv)",
        angle:       "eye-level",
        pose:        "",
        gaze:        "",
        vibe:        "",
        energyTag:   "medium" // used by motion selector
    };

    // Era-aware camera model fallback
    if (eraId === "Y2K_2000S")    d.cameraModel = "early digicam or flip phone camera";
    if (eraId === "GRUNGE_1990S") d.cameraModel = "disposable film camera";

    // ---- SELFIE FAMILY ----
    if (selected === "SELFIE_05X_TOPDOWN_POV") {
        Object.assign(d, {
            type: "POV_ULTRAWIDE_SELFIE",
            focal: "0.5x ultra-wide selfie lens with strong distortion",
            angle: "first-person POV looking down at own body, extreme high-angle",
            pose:  "sitting or standing, legs extending forward and down into background, both arms reaching up to hold the camera, oversized-shoe foreshortening",
            gaze:  "looking up directly into the lens with a playful smirk",
            vibe:  "trendy Gen-Z 0.5x ultrawide selfie, exaggerated foreshortening",
            energyTag: "high"
        });
    } else if (selected.startsWith("SELFIE_") || selected === "ANGLE_POV") {
        d.type = "FRONT_CAMERA_SELFIE";
        d.vibe = "casual first-person front-camera shot";
        d.gaze = "direct eye contact with the lens";
        d.energyTag = "high";

        if (selected === "SELFIE_STANDARD") {
            d.angle = "eye-level straight-on selfie";
            d.focal = "front-facing selfie lens";
            d.pose  = getRandom([
                "throwing a peace sign close to the face",
                "smiling warmly into the lens",
                "playful duck-face pout",
                "blowing a kiss toward the camera"
            ]);
        } else if (selected === "SELFIE_HIGH_ANGLE") {
            d.angle = "high-angle POV looking down at face";
            d.focal = "front-facing selfie lens";
            d.pose  = "holding camera high overhead, looking up playfully";
        } else if (selected === "SELFIE_LOW_ANGLE") {
            d.angle = "low-angle chin POV, slightly looking up";
            d.pose  = "looking down at the camera with a cool expression";
        } else if (selected === "SELFIE_WIDE") {
            d.angle = "high-angle wide selfie, arms extended";
            d.focal = "0.5x ultra-wide lens distortion";
            d.pose  = "holding camera high, friends squeezing into frame";
        } else if (selected === "SELFIE_CLOSEUP") {
            d.type  = "CLOSE_UP_SELFIE";
            d.angle = "extreme close-up portrait";
            d.focal = "smartphone portrait macro lens";
            d.pose  = "face filling most of the frame, skin texture visible";
        } else if (selected === "ANGLE_POV") {
            d.type  = "FIRST_PERSON_POV";
            d.angle = "first-person POV";
            d.focal = "wide angle 24mm";
            d.pose  = "photographed from the viewer's perspective, subject's hands may reach into the scene";
        }

    // ---- MIRROR FAMILY ----
    } else if (selected.startsWith("MIRROR_")) {
        d.type = "MIRROR_SELFIE";
        d.vibe = "classic aesthetic mirror selfie";
        d.angle = "straight-on mirror reflection";
        d.gaze = "looking at the phone screen reflected in the mirror";
        d.energyTag = "low";

        if (selected === "MIRROR_STANDARD") {
            d.pose = "holding phone showing entire outfit in the mirror";
        } else if (selected === "MIRROR_WIDE") {
            d.pose = "mirror selfie capturing the entire room behind";
            d.focal = "0.5x ultra-wide lens";
        } else if (selected === "MIRROR_FACELESS") {
            d.pose = "phone fully covering the face, shy faceless aesthetic";
        }

    // ---- FRAMING / PORTRAIT ----
    } else if (selected === "PORTRAIT_CLOSE_UP" || selected.startsWith("FRAMING_")) {
        d.type = "POSED_SCENARIO";
        d.vibe = "well-framed, intentional photograph";
        d.gaze = "looking at the camera";
        d.energyTag = "medium";

        if (selected === "PORTRAIT_CLOSE_UP") {
            d.angle = "eye-level close-up";
            d.pose  = "framing from shoulders up, intimate portrait";
            d.focal = "portrait lens with shallow depth of field";
        } else if (selected === "FRAMING_MEDIUM") {
            d.angle = "eye-level medium shot";
            d.pose  = "framing from waist up, casual standing or sitting";
            d.focal = "standard 35mm to 50mm lens";
        } else if (selected === "FRAMING_LONG") {
            d.angle = "eye-level long shot";
            d.pose  = "full body head-to-toe, showing entire outfit";
            d.focal = "standard to wide lens";
        } else if (selected === "FRAMING_WIDE") {
            d.angle = "extreme long shot";
            d.pose  = "subject appears small, environment dominates the frame";
            d.focal = "ultra-wide 14mm to 24mm lens";
            d.energyTag = "low";
        }

    // ---- POSED ANGLES ----
    } else if (selected.startsWith("POSED_") || ["ANGLE_BIRD_EYE", "ANGLE_FROG_EYE", "ANGLE_DUTCH"].includes(selected)) {
        d.type = "CREATIVE_ANGLE_SHOT";
        d.vibe = "dynamic creative perspective";
        d.pose = "posing for the camera with the angle in mind";
        d.energyTag = "medium";

        if (selected === "POSED_EYE_LEVEL") {
            d.angle = "eye-level"; d.pose = "standing or sitting naturally, perfectly centered"; d.gaze = "direct eye contact";
        } else if (selected === "POSED_HIGH_ANGLE") {
            d.angle = "high angle, looking down at subject"; d.pose = "looking up slightly toward the camera"; d.gaze = "looking up at the lens";
        } else if (selected === "POSED_LOW_ANGLE") {
            d.angle = "low angle, looking up at subject"; d.pose = "standing tall in a powerful stance"; d.gaze = "looking down at the camera";
        } else if (selected === "ANGLE_BIRD_EYE") {
            d.angle = "bird's eye view, directly overhead 90 degrees";
            d.pose = "lying down or sitting on ground, captured from directly above";
            d.focal = "wide angle looking straight down";
            d.energyTag = "low";
        } else if (selected === "ANGLE_FROG_EYE") {
            d.angle = "worm's eye view, extreme low angle";
            d.pose = "camera resting on the ground, shooting dramatically upward";
            d.focal = "wide angle exaggerating height";
        } else if (selected === "ANGLE_DUTCH") {
            d.angle = "Dutch / canted angle, intentionally tilted";
            d.vibe = "edgy, disorienting, dynamic street vibe";
            d.pose = "casual pose but horizon line is tilted";
            d.energyTag = "high";
        }

    // ---- CANDID FAMILY ----
    } else if (selected.startsWith("CANDID_") || selected === "ACCIDENTAL") {
        d.type = "CANDID_UNAWARE";
        d.angle = "eye-level from a distance";
        d.vibe = "true candid, unaware of camera";
        d.gaze = "averting gaze, focused on something else";
        d.energyTag = "low";

        if (selected === "CANDID_UNAWARE") {
            d.pose = "deep in thought or focused on an activity";
        } else if (selected === "CANDID_TELEPHOTO") {
            d.angle = "telephoto paparazzi shot from far away";
            d.focal = "telephoto zoom 85mm or longer with high compression";
            d.pose = "walking or sitting naturally, oblivious to being photographed";
        } else if (selected === "CANDID_OTS") {
            d.angle = "over-the-shoulder";
            d.pose = "captured from behind another person's shoulder, looking at main subject";
            d.vibe = "voyeuristic, conversational perspective";
        } else if (selected === "CANDID_INTENTIONAL") {
            d.type = "CANDID_INTENTIONAL";
            d.pose = "laughing playfully while looking away, planned candid pose";
            d.vibe = "planned candid, aesthetic outfit shot";
            d.energyTag = "medium";
        } else if (selected === "ACCIDENTAL") {
            d.type = "ACCIDENTAL_AWKWARD_SHOT";
            d.angle = "tilted Dutch angle, shaky blur";
            d.pose = "blurry mid-movement like the camera was bumped";
            d.vibe = "accidentally captured, raw, chaotic, nostalgic";
            d.gaze = "uncoordinated";
            d.energyTag = "high";
        }

    // ---- EXTREMES ----
    } else if (selected === "EXTREME_CCTV") {
        Object.assign(d, {
            type: "CANDID_UNAWARE",
            angle: "security camera CCTV POV, high-angle wide corner shot",
            focal: "CCTV wide-angle lens",
            pose: "walking or standing naturally, caught on tape",
            vibe: "raw security footage aesthetic",
            gaze: "unaware",
            energyTag: "low"
        });
    } else if (selected === "EXTREME_FISHEYE") {
        Object.assign(d, {
            type: "CREATIVE_ANGLE_SHOT",
            angle: "extreme fisheye distortion, bulging center",
            focal: "8mm fisheye action-cam lens",
            pose: "leaning very close to the bulging lens playfully",
            gaze: "looking directly at the lens",
            energyTag: "high"
        });
    }

    // ---- MULTI-PERSON OVERRIDE ----
    if (numSubjects > 1 && !customScenario && !selected.includes("SELFIE") && !selected.includes("MIRROR")) {
        if (genderVal === "COUPLE") {
            d.pose = "couple standing close, arm around each other or hugging, smiling at camera";
        } else {
            d.pose = `group of ${numSubjects} hanging out, posing together casually`;
        }
    }

    // ---- CUSTOM SCENARIO OVERRIDE ----
    if (customScenario) {
        d.pose = customScenario;
        d.gaze = "engaged in the specific scenario";
    }

    return d;
}
