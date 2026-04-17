a// =============================================================================
// DATABASE: AESTHETICS, FILTERS, LIGHTING, COMPOSITIONS
// Indonesian Amateur Shot Generator
// =============================================================================

const aestheticFilters = {
    // --- PORTRAIT & CASUAL ---
    "SOFT_PORTRAIT": {
        label:      "Soft Portrait",
        lighting:   "SOFT DIFFUSED WINDOW LIGHTING, GENTLE HIGHLIGHTS, SUBTLE FILL",
        render:     "SOFT WARM COLOR CAST, NATURAL SKIN TONES, CANDID AND PERSONAL VIBE, LUMINOUS QUALITY",
        cameraType: "MEDIUM CLOSE-UP PORTRAIT LENS (85MM EQUIV)"
    },
    "VIBRANT_CASUAL": {
        label:      "Vibrant Casual",
        lighting:   "BRIGHT NATURAL OVERCAST DAYLIGHT, SOFT DIFFUSED SHADOWS",
        render:     "CASUAL VIBRANT AESTHETIC, BRIGHT COLORS CONTRASTING, REALISTIC DIGITAL PHOTOGRAPHY",
        cameraType: "STANDARD LENS WITH SHALLOW DEPTH OF FIELD"
    },
    "CLEAN_EDITORIAL": {
        label:      "Clean Editorial",
        lighting:   "SOFT STUDIO BOX LIGHT, EVEN FRONTAL ILLUMINATION",
        render:     "HIGH FASHION EDITORIAL CLEAN LOOK, CRISP WHITES, MINIMAL SHADOWS, GLOSSY MAGAZINE QUALITY",
        cameraType: "MEDIUM FORMAT EDITORIAL LENS"
    },

    // --- FILM & ANALOG ---
    "ANALOG_AIRY": {
        label:      "Analog Airy",
        lighting:   "NATURAL DAYLIGHT MIXED WITH WARM ARTIFICIAL FACADE LIGHTS",
        render:     "ANALOG FILM PHOTOGRAPHY, CANDID STREET STYLE, SOFT FOCUS, VIBRANT BUT NATURAL COLOR PALETTE, LIGHT AND AIRY",
        cameraType: "35MM ANALOG CAMERA (KODAK GOLD 200)"
    },
    "FUJIFILM_GRAIN": {
        label:      "Fujifilm Grain",
        lighting:   "WARM TUNGSTEN MIXED WITH COOL DAYLIGHT SPILL",
        render:     "FUJIFILM SUPERIA 400 FILM LOOK, SLIGHT OVERSATURATION IN GREENS AND YELLOWS, VISIBLE FILM GRAIN, NOSTALGIC COLOR SCIENCE",
        cameraType: "35MM COMPACT FILM CAMERA"
    },
    "LOMOGRAPHY": {
        label:      "Lomography",
        lighting:   "ANY MIXED AMBIENT LIGHT SOURCE",
        render:     "HEAVY VIGNETTE, CROSS-PROCESSED COLORS, DISTORTED EDGES, LIGHT LEAKS, SATURATED CENTER, UNPREDICTABLE EXPOSURE",
        cameraType: "LOMOGRAPHY LOMO LC-A STYLE CAMERA"
    },
    "DISPOSABLE_FLASH": {
        label:      "Disposable Flash",
        lighting:   "HARSH DIRECT DISPOSABLE CAMERA FLASH, FLAT FRONTAL",
        render:     "NOSTALGIC 90S-00S DISPOSABLE CAMERA LOOK, RED-EYE, WASHED OUT FLASH EXPOSURE ON FACE, GREENISH BACKGROUND, GRAINY",
        cameraType: "KODAK FUNSAVER DISPOSABLE CAMERA"
    },
    "STREET_PHOTOGRAPHY": {
        label:      "Street Photography",
        lighting:   "NATURAL AMBIENT STREET LIGHT",
        render:     "DOCUMENTARY STYLE, CINEMATIC COLOR GRADING, AUTHENTIC TEXTURES, DECISIVE MOMENT FEEL, HENRI CARTIER-BRESSON VIBE",
        cameraType: "35MM PRIME LENS CANDID (LEICA OR RICOH STYLE)"
    },

    // --- DIGITAL / SOCIAL ---
    "DIFFUSED_OCEAN": {
        label:      "Diffused Ocean",
        lighting:   "DIFFUSED COASTAL LIGHT, GENTLE OVERCAST SHADOWS",
        render:     "SOFT BLUE-TEAL COLOR CAST, SERENE COASTAL AESTHETIC, CLEAN DIGITAL QUALITY",
        cameraType: "HIGH-QUALITY DIGITAL SENSOR (SONY A7 STYLE)"
    },
    "DESATURATED_STREET": {
        label:      "Desaturated Street",
        lighting:   "BRIGHT NATURAL DAYLIGHT, SUBTLE DIFFUSED SHADOWS",
        render:     "SLIGHTLY DESATURATED COLOR PALETTE WITH POPS OF RED AND ORANGE, REALISTIC RENDERING, CASUAL STREET AESTHETIC",
        cameraType: "OVERHEAD DIGITAL CAMERA (RICOH GR STYLE)"
    },
    "CINEMATIC_TEAL_ORANGE": {
        label:      "Cinematic Teal & Orange",
        lighting:   "WARM GOLDEN BACKLIGHT WITH COOL SHADOW FILL",
        render:     "BLOCKBUSTER CINEMATIC COLOR GRADE, TEAL SHADOWS, WARM ORANGE MIDTONES AND HIGHLIGHTS, CINEMATIC ASPECT RATIO BARS, MOVIE STILL QUALITY",
        cameraType: "ANAMORPHIC WIDE LENS (35MM CINEMA)"
    },
    "MOODY_UNDEREXPOSED": {
        label:      "Moody Underexposed",
        lighting:   "DIM AMBIENT LIGHT, MOSTLY SHADOWS",
        render:     "HEAVILY UNDEREXPOSED, LIFTED SHADOWS, DARK AND MOODY ATMOSPHERE, SHADOW DETAIL BARELY VISIBLE, INTROSPECTIVE VIBE",
        cameraType: "FULL FRAME MIRRORLESS PUSHED IN ISO"
    },

    // --- ERA-SPECIFIC ---
    "Y2K_STUDIO": {
        label:      "Y2K Studio",
        lighting:   "HARSH STUDIO KEY LIGHT WITH WHITE SEAMLESS BACKGROUND",
        render:     "GLOSSY Y2K AESTHETIC, EARLY 2000S MAGAZINE COVER, METALLIC HINTS, SHARP CONTRASTY BEAUTY",
        cameraType: "STUDIO SHOT WITH SLIGHT WIDE LENS (28MM)"
    },
    "SWAG_ERA": {
        label:      "Swag Era (2010s)",
        lighting:   "HIGH CONTRAST STREET LIGHTING, SLIGHT UNDEREXPOSURE",
        render:     "2010S TUMBLR/INSTAGRAM SWAG AESTHETIC, SLIGHTLY DESATURATED, VIGNETTE, INSTAGRAM VALENCIA FILTER LOOK",
        cameraType: "IPHONE 4S OR SAMSUNG GALAXY S3 CAMERA STYLE"
    },
    "Y2K_STREET": {
        label:      "Y2K Street",
        lighting:   "OVERCAST DAYLIGHT OR HARSH NIGHT FLASH",
        render:     "RAW Y2K STREET CULT AESTHETIC, NOSTALGIC 2000S VIBE, SLIGHT GLARE, SLIGHTLY WASHED OUT",
        cameraType: "CANDID POINT AND SHOOT SNAPSHOT (OLYMPUS STYLUS)"
    },
    "OLD_SMARTPHONE": {
        label:      "Old Smartphone (2012 Era)",
        lighting:   "POOR LOW-LIGHT WITH WEAK LED PHONE FLASH",
        render:     "HEAVY DIGITAL COMPRESSION, PIXELATED, EARLY 2010S UPLOAD ARTIFACTS, INSTAGRAM X-PRO II FILTER",
        cameraType: "SAMSUNG GALAXY S2 / IPHONE 4 FRONT CAMERA"
    },

    // --- FLASH & PAPARAZZI ---
    "FLASH_EDITORIAL": {
        label:      "Flash Editorial",
        lighting:   "DIRECT PAPARAZZI FLASH, HARSH SHADOWS",
        render:     "HIGH FASHION FLASH EDITORIAL, GLOSSY SKIN, DEEP BLACK PITCH BACKGROUND, STARK AND BOLD",
        cameraType: "PAPARAZZI STYLE TELEPHOTO WITH FLASH (85MM)"
    },
    "NIGHTCLUB_FLASH": {
        label:      "Nightclub Flash",
        lighting:   "PARTY STROBE AND DIRECT POINT AND SHOOT FLASH",
        render:     "NIGHTCLUB PHOTOGRAPHY AESTHETIC, OVEREXPOSED FACES, SATURATED BACKGROUND LIGHTS, CHAOS IN BACKGROUND, SWEATY GLOSSY SKIN",
        cameraType: "POINT AND SHOOT COMPACT WITH HARSH FLASH"
    },

    // --- NICHE ---
    "GOLDEN_HOUR_WARM": {
        label:      "Golden Hour Warm",
        lighting:   "DIRECT GOLDEN HOUR SUNLIGHT, BACKLIT OR SIDE-LIT",
        render:     "WARM AMBER AND HONEY TONES, GLOWING SKIN, LONG DRAMATIC SHADOWS, LENS FLARE, DREAMY OUTDOOR FEEL",
        cameraType: "WIDE APERTURE PRIME LENS (50MM F/1.4)"
    },
    "BLUE_HOUR_COLD": {
        label:      "Blue Hour Cold",
        lighting:   "BLUE HOUR DUSK LIGHT, COOL AMBIENT, WARM ARTIFICIAL WINDOW LIGHTS",
        render:     "TWILIGHT BLUE HOUR, DEEP COOL BLUES, WARM POCKETS OF LIGHT FROM BUILDINGS, CINEMATIC NIGHT TRANSITION",
        cameraType: "WIDE ANGLE URBAN LENS (24MM)"
    },
    "INFRARED_DREAM": {
        label:      "Infrared Dream",
        lighting:   "HARSH BRIGHT SUNLIGHT (INFRARED SENSITIVE)",
        render:     "INFRARED PHOTOGRAPHY SIMULATION, WHITE GLOWING FOLIAGE, DARK DRAMATIC SKY, SURREAL AND DREAMY, HIGH CONTRAST",
        cameraType: "MODIFIED INFRARED DIGITAL CAMERA"
    }
};

// =============================================================================
// LIGHTING SITUATIONS
// =============================================================================

const lightings = [
    {
        source: "HARSH DIRECT ON-CAMERA FLASH",
        dir:    "FRONTAL",
        qual:   "FLATTENING, RED-EYE POTENTIAL, HARSH SHADOW BEHIND SUBJECT, BLOWN HIGHLIGHTS ON FACE"
    },
    {
        source: "DIM ROOM ILLUMINATED BY PC MONITOR SCREEN OR RGB NEON STRIP",
        dir:    "SIDE LIGHTING FROM THE SCREEN",
        qual:   "LOW-LIGHT, BLUE/RGB GLOW ON SKIN, NOISY SHADOWS, COOL ATMOSPHERE"
    },
    {
        source: "FLUORESCENT OVERHEAD STORE LIGHTING",
        dir:    "TOP-DOWN",
        qual:   "UNFLATTERING BRIGHT, HARSH TROPICAL VIBE, SLIGHTLY GREENISH CAST"
    },
    {
        source: "HARSH TROPICAL AFTERNOON SUNLIGHT (2-4PM)",
        dir:    "DIRECTIONAL, HARSH SIDE OR TOP",
        qual:   "HIGH CONTRAST, DEEP DARK SHADOWS, SWEATY VIBE, BLOWN HIGHLIGHTS"
    },
    {
        source: "GOLDEN HOUR SUNSET SUNLIGHT",
        dir:    "BACKLIT OR SIDE LIGHT",
        qual:   "WARM AMBER GLOW, LENS FLARE, BEAUTIFUL DEPTH, GLOWING SKIN"
    },
    {
        source: "WARM RESTROOM VANITY LIGHTING (LED MIRROR BULBS)",
        dir:    "FRONT-FACING DIFFUSED",
        qual:   "FLATTERING, YELLOWISH WARM GLOW, EVEN SOFT SHADOWS"
    },
    {
        source: "SOFT DIFFUSED NATURAL DAYLIGHT (WINDOW LIGHT, OVERCAST)",
        dir:    "FRONT AND SIDE WRAP",
        qual:   "GENTLE HIGHLIGHTS, EVEN ILLUMINATION, FLATTERING SOFT SHADOWS"
    },
    {
        source: "SINGLE BARE TUNGSTEN BULB (BOHLAM EXPOSED)",
        dir:    "OVERHEAD WITH HARSH DROP-OFF",
        qual:   "WARM ORANGE CAST, INDUSTRIAL MOODY, STRONG SHADOWS BELOW"
    },
    {
        source: "BLUE HOUR AMBIENT STREET LIGHT MIX",
        dir:    "OMNIDIRECTIONAL LOW",
        qual:   "COOL BLUE DOMINANT, WARM POCKETS FROM SODIUM STREET LAMPS, CINEMATIC SPLIT TONE"
    },
    {
        source: "NEON SIGN BACKLIGHT (MERAH ATAU BIRU)",
        dir:    "BACKLIGHT AND SIDE SPILL",
        qual:   "DRAMATIC RIM LIGHTING IN RED OR BLUE, DARK FRONT, COLORFUL ATMOSPHERE"
    },
    {
        source: "CANDLE OR SMALL LAMP WARM LIGHT",
        dir:    "CLOSE FRONTAL OR SIDE",
        qual:   "INTIMATE WARM GLOW, SLIGHT FLICKER SUGGESTION, VERY SOFT SHADOWS"
    },
    {
        source: "OVERCAST DIFFUSED CLOUDY SKY",
        dir:    "OMNIDIRECTIONAL SOFT",
        qual:   "FLAT EVEN LIGHTING, NO HARSH SHADOWS, SLIGHTLY DESATURATED MOOD"
    }
];

// =============================================================================
// COMPOSITION RULES
// =============================================================================

const compositionsRules = {
    "GOLDEN_RATIO":    "Golden Ratio composition, Fibonacci spiral layout, directing viewer eye naturally through a curve, organic and mathematically pleasing balance",
    "RULE_OF_THIRDS":  "Rule of Thirds composition, subject placed on the intersecting grid lines, asymmetrical visual balance, dynamic tension",
    "SYMMETRY":        "Perfect Symmetry and Balance, subject dead center, mirrored elements on left and right or top and bottom, graphic and bold",
    "GOLDEN_TRIANGLE": "Golden Triangle composition, strong diagonal lines creating intersecting triangle zones in the frame, classic portrait feel",
    "DIAGONAL":        "Dynamic diagonal composition, angled leading lines creating a sense of motion and depth, kinetic energy",
    "FILL_FRAME":      "Fill the frame completely, extreme close-up or tight framing, subject dominates the entire image with almost no background, intense and immediate",
    "NEGATIVE_SPACE":  "Vast negative space, minimalist composition, small subject placed in a large empty surrounding area to emphasize scale or isolation",
    "LEADING_LINES":   "Strong leading lines guiding the viewer's eye towards the main subject, intense depth perspective, architectural or natural lines used",
    "FRAMING":         "Natural framing within the image, subject framed by environmental elements (windows, branches, doors, archways) adding context and depth",
    "CENTERED_BOLD":   "Dead-center bold composition, subject perfectly centered in frame, symmetrical and commanding, graphic design aesthetic"
};
