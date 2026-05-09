// =============================================================================
// DATABASE: VIDEO MOTION SYSTEM
// Indonesian Amateur Shot Generator V5.0
// Camera movements, subject motion, pacing patterns, ambient sound design.
// =============================================================================

// ---------------------------------------------------------------------------
// CAMERA MOVEMENT LIBRARY
// Each entry includes:
//  - label / description (for prompt output)
//  - energy: low | medium | high  (used by selector to match shot mood)
//  - bestFor: tags this movement plays well with
// ---------------------------------------------------------------------------

const cameraMotions = {
    STATIC_LOCKED: {
        label: "Static Locked Shot",
        description: "camera completely still, locked-off tripod feel, subject moves within frame",
        energy: "low",
        bestFor: ["candid", "portrait", "cctv", "observational", "tense"]
    },
    SLOW_DOLLY_IN: {
        label: "Slow Dolly In",
        description: "camera glides slowly toward subject, building intimacy and emotional weight",
        energy: "medium",
        bestFor: ["portrait", "emotional", "reveal", "introspective"]
    },
    SLOW_DOLLY_OUT: {
        label: "Slow Dolly Out",
        description: "camera retreats backward, gradually revealing wider context and isolation",
        energy: "medium",
        bestFor: ["reveal", "isolation", "scale", "ending"]
    },
    PAN_LEFT: {
        label: "Pan Left",
        description: "camera rotates horizontally to the left, sweeping across the scene",
        energy: "medium",
        bestFor: ["reveal", "transition", "environment"]
    },
    PAN_RIGHT: {
        label: "Pan Right",
        description: "camera rotates horizontally to the right, following motion or revealing space",
        energy: "medium",
        bestFor: ["reveal", "follow", "environment"]
    },
    TILT_UP: {
        label: "Tilt Up",
        description: "camera angle rises vertically, revealing height or sky",
        energy: "medium",
        bestFor: ["reveal", "scale", "architecture", "dramatic"]
    },
    TILT_DOWN: {
        label: "Tilt Down",
        description: "camera angle descends vertically, revealing ground or detail",
        energy: "medium",
        bestFor: ["reveal", "intimate", "detail"]
    },
    ORBIT_CW: {
        label: "Clockwise Orbit",
        description: "camera circles the subject clockwise at constant distance, hero-shot energy",
        energy: "high",
        bestFor: ["hero", "fashion", "showcase", "portrait"]
    },
    ORBIT_CCW: {
        label: "Counter-Clockwise Orbit",
        description: "camera arcs around the subject counter-clockwise, dynamic showcase",
        energy: "high",
        bestFor: ["hero", "fashion", "showcase", "dance"]
    },
    WHIP_PAN: {
        label: "Whip Pan",
        description: "rapid horizontal swing creating motion blur, transitional energy",
        energy: "high",
        bestFor: ["transition", "energetic", "club", "concert"]
    },
    HANDHELD_FOLLOW: {
        label: "Handheld Follow",
        description: "operator-style handheld camera tracking with subject, organic micro-shake",
        energy: "medium",
        bestFor: ["candid", "documentary", "street", "walking"]
    },
    HANDHELD_LOOSE: {
        label: "Loose Handheld",
        description: "noticeable handheld shake, raw amateur vlog feel, breathing-with-the-camera",
        energy: "high",
        bestFor: ["selfie", "vlog", "candid", "chaos"]
    },
    CRANE_UP: {
        label: "Crane Up",
        description: "camera rises smoothly into the air, expansive lifting reveal",
        energy: "medium",
        bestFor: ["reveal", "establishing", "epic", "ending"]
    },
    CRANE_DOWN: {
        label: "Crane Down",
        description: "camera descends smoothly toward subject, intimate approach",
        energy: "medium",
        bestFor: ["reveal", "approach", "establishing"]
    },
    PUSH_PULL: {
        label: "Push-Pull (Dolly Zoom)",
        description: "Hitchcockian vertigo effect, camera pushes in while zoom pulls out",
        energy: "high",
        bestFor: ["dramatic", "psychological", "tension"]
    },
    RACK_FOCUS: {
        label: "Rack Focus",
        description: "focus shifts from foreground to background object or vice versa",
        energy: "low",
        bestFor: ["portrait", "intimate", "reveal", "detail"]
    },
    LATERAL_TRACKING: {
        label: "Lateral Tracking",
        description: "camera moves sideways parallel to subject, smooth dolly track",
        energy: "medium",
        bestFor: ["walking", "fashion", "showcase", "passing"]
    },
    SLOW_ZOOM_IN: {
        label: "Slow Zoom In",
        description: "lens slowly compresses toward subject, cinematic tightening",
        energy: "low",
        bestFor: ["intimate", "portrait", "reveal"]
    },
    SNAP_ZOOM: {
        label: "Snap Zoom",
        description: "sudden quick zoom punch, found-footage punctuation",
        energy: "high",
        bestFor: ["dramatic", "candid", "documentary", "comedic"]
    },
    ARCING_LOW: {
        label: "Low Arc",
        description: "camera arcs around subject from a low angle, hero rising energy",
        energy: "high",
        bestFor: ["hero", "fashion", "powerful"]
    },
    POV_HANDHELD: {
        label: "POV Handheld",
        description: "first-person handheld POV, subject's view, hand or arm may enter frame",
        energy: "high",
        bestFor: ["selfie", "vlog", "pov"]
    },
    LOCKED_WIDE_OBSERVATION: {
        label: "Locked Wide Observation",
        description: "wide static frame, subject occupies small portion, life-around-them feel",
        energy: "low",
        bestFor: ["candid", "documentary", "isolation", "scale"]
    }
};

// ---------------------------------------------------------------------------
// SUBJECT MOTION LAYERS
// Three layers can stack: micro (always-on), gesture (mid-action), narrative (story-beat)
// ---------------------------------------------------------------------------

const subjectMotionLibrary = {

    // Always-on tiny life signs that make the subject feel alive
    micro: [
        "subtle breathing, chest rising and falling almost imperceptibly",
        "blinking slowly, lashes lowering once mid-frame",
        "hair shifting gently in the ambient air",
        "fingers fidgeting with the edge of a phone case",
        "lips parting slightly mid-thought",
        "subtle weight shift from one foot to the other",
        "eyes drifting then refocusing on a point off-camera",
        "shoulders rising and falling with a quiet sigh",
        "a single eyebrow micro-lifting in thought",
        "slow dry swallow, throat moving once",
        "tongue grazing the inside of the cheek",
        "knuckles whitening briefly on a held object",
        "head tilting one degree as a thought lands"
    ],

    // Mid-action gestures appropriate for casual scenes
    gesture: {
        cafe: [
            "lifting a coffee cup slowly to lips, taking a careful sip",
            "tracing the rim of the cup with a fingertip",
            "stirring drink absently, the spoon clinking once",
            "tearing open a sugar packet with teeth"
        ],
        bedroom_kos: [
            "stretching arms overhead with a slow yawn",
            "pulling a blanket higher across the lap",
            "scrolling endlessly through phone with a thumb",
            "rolling onto side to face the camera"
        ],
        street: [
            "tucking a strand of hair behind the ear",
            "pulling phone from pocket and glancing at screen",
            "adjusting a backpack strap on the shoulder",
            "lighting a kretek and exhaling smoke into the frame",
            "fixing a sneaker lace with a quick downward glance"
        ],
        club_concert: [
            "raising a hand above the head, swaying with the music",
            "shouting something inaudible to a friend, leaning in",
            "throwing back the rest of a drink in one motion",
            "wiping sweat off the brow with the back of a wrist"
        ],
        beach_pool: [
            "running fingers through wet hair, water dripping",
            "shielding eyes from glare with the back of a hand",
            "stepping into shallow water, kicking up a splash",
            "lifting sunglasses to the top of the head"
        ],
        car: [
            "resting head against the window, watching streets blur past",
            "tapping fingers on the steering wheel to a song",
            "glancing at the rearview mirror briefly",
            "lowering the window an inch to feel the air"
        ],
        formal_event: [
            "smoothing the front of an outfit with both hands",
            "adjusting a hijab pin with delicate fingers",
            "bringing hands together in a small respectful gesture",
            "exchanging a brief nod with someone off-camera"
        ],
        general: [
            "checking the time on a wrist watch",
            "biting the inside of the lower lip",
            "running a hand through the hair, pushing it back",
            "exhaling a long breath visible in the cool air"
        ]
    },

    // Story-beat motions that add narrative tension
    narrative: [
        "walks into frame from the left, pauses, then turns toward the lens",
        "looks up from the phone at the last second, locking eyes with the camera",
        "freezes mid-laugh, the smile slowly fading into a thoughtful look",
        "breaks pose, glances off-camera as if hearing a name called, then returns",
        "takes one step forward, hesitates, takes another",
        "starts to speak, then changes mind and looks away",
        "head turns sharply toward an off-camera sound, then relaxes",
        "lifts gaze from a held object directly into the lens for one beat",
        "begins as a frozen tableau, then suddenly inhales and the scene comes alive",
        "ends with a slow blink, the moment landing"
    ]
};

// ---------------------------------------------------------------------------
// PACING / RHYTHM PATTERNS
// Controls duration and tempo of the video clip
// ---------------------------------------------------------------------------

const pacingPatterns = {
    SLOW_BURN: {
        label: "Slow Burn",
        duration: 8,
        tempo: "slow contemplative pacing, every micro-movement allowed to breathe",
        soundCue: "ambient swell builds gradually"
    },
    REAL_TIME: {
        label: "Real-Time Observation",
        duration: 6,
        tempo: "natural realtime pacing, life unfolding as it happens",
        soundCue: "naturalistic ambient mix"
    },
    SNAP: {
        label: "Snap",
        duration: 3,
        tempo: "punchy quick clip, in-and-out quickly, almost a flash",
        soundCue: "single sharp ambient hit"
    },
    FREEZE_BREAK: {
        label: "Freeze Break",
        duration: 5,
        tempo: "frozen tableau for the first second, then sudden burst of motion",
        soundCue: "silence, then full ambient drop-in"
    },
    SLOWMO: {
        label: "Slow Motion",
        duration: 7,
        tempo: "0.5x slow motion throughout, every gesture exaggerated and deliberate",
        soundCue: "muffled and stretched ambient"
    },
    SPEED_RAMP: {
        label: "Speed Ramp",
        duration: 6,
        tempo: "starts in slow motion, ramps up to real-time at the climax",
        soundCue: "ambient builds from muffled to full"
    },
    LINGER: {
        label: "Linger",
        duration: 9,
        tempo: "static long take, scene allowed to play out without cut",
        soundCue: "full naturalistic ambient with all environmental texture"
    }
};

// ---------------------------------------------------------------------------
// AMBIENT SOUND LIBRARY (CONTEXT-AWARE)
// Picked dynamically based on environment keywords.
// Each set returns 2–4 sounds that get layered.
// ---------------------------------------------------------------------------

const ambientSoundLibrary = {
    warung: [
        "sizzling wok and clattering of metal spatula in distance",
        "clinking glassware on plastic tabletops",
        "muffled Indonesian conversations and casual laughter",
        "small TV in the corner playing dangdut faintly",
        "occasional honks from motorbikes on the street outside"
    ],
    beach: [
        "rhythmic ocean waves crashing on shore",
        "distant seagull calls",
        "wind moving through palm fronds overhead",
        "fading laughter from a group somewhere down the beach",
        "a foot pressing into wet sand"
    ],
    pool_resort: [
        "gentle pool water lapping at the tile edge",
        "muffled lounge music from poolside speakers",
        "ice clinking in a tropical drink",
        "distant splash of someone diving in"
    ],
    nightclub: [
        "heavy bass thump felt more than heard, muffled through walls",
        "faint crowd chatter and shouts of recognition",
        "ice clinking inside a drink glass close to the camera",
        "intermittent cheer when a beat drops"
    ],
    bedroom_kos: [
        "faint ceiling fan whirring overhead",
        "muffled traffic from outside the window",
        "a phone notification ping cutting through the quiet",
        "neighbor's TV faint through the thin wall",
        "creaking of the wooden bed frame"
    ],
    cafe: [
        "espresso machine hissing in the background",
        "low indie playlist drifting from a speaker",
        "soft chatter and the click of laptop keys",
        "ceramic cup setting down on a saucer"
    ],
    street_night: [
        "distant motorbike engines passing",
        "a Gojek driver shouting his arrival further down the gang",
        "neon sign humming at low frequency",
        "footsteps on wet concrete",
        "occasional crickets and night insects"
    ],
    street_day: [
        "constant flow of motorbike traffic",
        "tukang ojek calls and street vendor calls overlapping",
        "horns punctuating the soundscape",
        "the slap of sandals on hot pavement"
    ],
    mall: [
        "hollow ambient mall echo from the high atrium",
        "distant Indomaret jingle from a shop entrance",
        "a faint pop song from an overhead speaker",
        "shopping bags rustling against a leg"
    ],
    car_interior: [
        "gentle hum of the engine",
        "soft radio playing local FM with intermittent ads",
        "tires on asphalt, occasional bump",
        "a turn signal clicking rhythmically"
    ],
    concert: [
        "overwhelming crowd cheer rising and falling",
        "live amplified guitar bleed",
        "kick drum thump felt in the chest",
        "screams and singalong from fans nearby"
    ],
    rural_nature: [
        "rooster crow in the distance",
        "wind through rice paddy stalks",
        "cicadas in chorus",
        "a single moped passing on a dirt road"
    ],
    mosque_eid: [
        "muffled takbir echoing from a nearby loudspeaker",
        "footsteps on cool tile",
        "soft greetings exchanged off-camera",
        "the rustle of mukena and prayer mats being folded"
    ],
    bali_temple: [
        "gamelan tones drifting from somewhere unseen",
        "incense crackling faintly",
        "barefoot steps on stone",
        "wind chimes from a temple offering"
    ],
    train_mrt: [
        "rhythmic clatter of train on rails",
        "automated station announcement in Bahasa and English",
        "passengers murmuring softly",
        "the hiss of pneumatic doors"
    ],
    bathroom_mirror: [
        "tap water running into a sink",
        "fluorescent buzz overhead",
        "muffled mall noise through the door",
        "the click of a lipstick cap"
    ],
    rooftop: [
        "wind moving freely at altitude",
        "muffled city traffic far below",
        "distant azan or church bell",
        "fabric of clothing shifting in the breeze"
    ],
    default: [
        "ambient room tone",
        "faint Indonesian street life in the distance",
        "subtle environmental presence and breathing space"
    ]
};

// ---------------------------------------------------------------------------
// ENVIRONMENT-TO-SOUND ROUTING
// Function-style mapping based on keywords in env name
// ---------------------------------------------------------------------------

function pickAmbientForEnv(envName) {
    const env = (envName || "").toUpperCase();
    if (env.match(/WARUNG|WARTEG|WARMINDO|WARKOP|MIE GACOAN|GEROBAK|KAKI LIMA|LESEHAN/)) return ambientSoundLibrary.warung;
    if (env.match(/POOL|POOLSIDE|WATERPARK/)) return ambientSoundLibrary.pool_resort;
    if (env.match(/BEACH|PANTAI|OCEAN|SEA|PIER|DERMAGA|YACHT|PHINISI|PADDLEBOARD/)) return ambientSoundLibrary.beach;
    if (env.match(/CLUB|NIGHTCLUB|TECHNO|SUPERCLUB/)) return ambientSoundLibrary.nightclub;
    if (env.match(/CONCERT|STAGE|FESTIVAL|GIG|BACKSTAGE/)) return ambientSoundLibrary.concert;
    if (env.match(/CAFE|STARBUCKS|J\.CO|EXCELSO|BREWERY/)) return ambientSoundLibrary.cafe;
    if (env.match(/MOSQUE|MASJID|MUSHOLA|EID/)) return ambientSoundLibrary.mosque_eid;
    if (env.match(/PURA|TEMPLE|GALUNGAN|NYEPI/)) return ambientSoundLibrary.bali_temple;
    if (env.match(/MRT|KRL|TRAIN|STASIUN|BUS|TRAM/)) return ambientSoundLibrary.train_mrt;
    if (env.match(/CAR|MOBIL|TAXI|GRAB|GOJEK|ALPHARD|INNOVA|MERCEDES|VESPA|VINTAGE.*SCOOTER/)) return ambientSoundLibrary.car_interior;
    if (env.match(/MALL|TIMEZONE|FUN WORLD|ITC/)) return ambientSoundLibrary.mall;
    if (env.match(/RESTROOM|BATHROOM|TOILET|VANITY/)) return ambientSoundLibrary.bathroom_mirror;
    if (env.match(/ROOFTOP|BALCONY/)) return ambientSoundLibrary.rooftop;
    if (env.match(/SAWAH|RICE FIELD|TEA PLANTATION|MOUNTAIN|HUTAN PINUS|VILLAGE/)) return ambientSoundLibrary.rural_nature;
    if (env.match(/BEDROOM|KAMAR|KOS-KOSAN|KOS|BED|BATHTUB/)) return ambientSoundLibrary.bedroom_kos;
    if (env.match(/STREET|JALAN|ALLEY|GANG|JEMBATAN|TROTOAR|CROSSWALK|ZEBRA/)) {
        return env.match(/NIGHT|MALAM|NEON/) ? ambientSoundLibrary.street_night : ambientSoundLibrary.street_day;
    }
    return ambientSoundLibrary.default;
}

// ---------------------------------------------------------------------------
// ENERGY-TO-CAMERA ROUTING
// Helps the selector pick a movement that matches the shot's mood/energy
// ---------------------------------------------------------------------------

function getCameraMotionsByEnergy(energyLevel) {
    return Object.entries(cameraMotions)
        .filter(([_, m]) => m.energy === energyLevel)
        .map(([key, m]) => ({ key, ...m }));
}

function getCameraMotionsByTag(tag) {
    return Object.entries(cameraMotions)
        .filter(([_, m]) => m.bestFor.includes(tag))
        .map(([key, m]) => ({ key, ...m }));
}
