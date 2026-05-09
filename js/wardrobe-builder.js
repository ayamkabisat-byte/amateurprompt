// =============================================================================
// WARDROBE BUILDER
// Builds wardrobe pool from era + holiday + context (location-aware augmentation)
// =============================================================================

// ---------------------------------------------------------------------------
// CONTEXT AUGMENTATION RULES
// Each rule: { match: regex, male: {...}, female: {...} }
// Adds to the pool BEFORE random pick. Doesn't override era base, only enriches.
// ---------------------------------------------------------------------------

const CONTEXT_AUGMENTATIONS = [

    // ---- CONCERT / STAGE ----
    {
        match: /CONCERT|STAGE|BACKSTAGE|GIG/,
        all: {
            acc: ["holding a microphone", "holding a backstage VIP lanyard pass"]
        },
        male: {
            tops: ["BLACK SLEEVELESS BAND SHIRT", "OPEN LEATHER JACKET WITH NO SHIRT", "OVERSIZED VINTAGE BAND T-SHIRT"],
            acc: ["SILVER CHAIN NECKLACE", "ELECTRIC GUITAR SLUNG OVER SHOULDER"]
        },
        female: {
            tops: ["EDGY CROP TOP WITH FISHNET ACCENTS", "OVERSIZED BAND T-SHIRT AS DRESS", "BLACK LEATHER CORSET"],
            bottoms: ["BLACK CARGO PANTS WITH CHAINS", "PLEATED PLAID SKIRT WITH FISHNETS"],
            acc: ["CHUNKY SILVER CHAIN NECKLACE"]
        }
    },

    // ---- BEACH / POOL / WATERPARK ----
    {
        match: /BEACH|PANTAI|POOL|POOLSIDE|WATERPARK|YACHT|PIER/,
        male: {
            tops: ["OPEN LINEN SHIRT OVER BARE CHEST", "PLAIN WHITE TANK TOP DAMP FROM SEA", "TROPICAL PRINT SHORT SLEEVE BUTTON-UP"],
            bottoms: ["SWIM TRUNKS (CORAL OR NAVY)", "LINEN BEACH SHORTS"],
            shoes: ["LEATHER SANDALS", "BAREFOOT WITH SAND"],
            acc: ["AVIATOR SUNGLASSES", "STRAW FEDORA HAT", "HOLDING A COLD BINTANG BOTTLE"]
        },
        female: {
            tops: ["TRIANGLE BIKINI TOP UNDER SHEER COVER-UP", "FLOWY KAFTAN OVER SWIMWEAR", "WHITE LINEN CROP SHIRT TIED AT WAIST"],
            bottoms: ["HIGH-CUT BIKINI BOTTOM", "FLOWY MAXI BEACH SKIRT", "LINEN BEACH SHORTS (CREAM)"],
            shoes: ["FLAT LEATHER SANDALS", "BAREFOOT WITH WET SAND ON ANKLES"],
            acc: ["OVERSIZED OVAL SUNGLASSES", "WIDE-BRIM STRAW HAT", "GOLD ANKLET", "HOLDING A YOUNG COCONUT WITH STRAW"]
        }
    },

    // ---- CLUB / NIGHTCLUB ----
    {
        match: /CLUB|NIGHTCLUB|TECHNO|SUPERCLUB/,
        male: {
            tops: ["MESH OR SHEER BLACK SHIRT", "TIGHT BLACK TANK TOP", "UNBUTTONED SATIN SHIRT"],
            acc: ["HOLDING A WHISKEY GLASS WITH ICE", "SILVER GRILLZ", "SMOKING THIN VAPE"]
        },
        female: {
            tops: ["RHINESTONE STRAPPY TOP", "MICRO TUBE TOP WITH GLITTER", "SHEER MESH LONG SLEEVE WITH BRA UNDERNEATH"],
            bottoms: ["MICRO LEATHER MINI SKIRT", "TIGHT BODYCON MINI"],
            shoes: ["STRAPPY STILETTO HEELS", "PATENT LEATHER PLATFORM HEELS"],
            acc: ["TINY METALLIC HANDBAG", "GLOSSY DARK LIPSTICK", "HOLDING SPARKLER OR LED BOTTLE"]
        }
    },

    // ---- CAFE / COFFEE ----
    {
        match: /CAFE|STARBUCKS|J\.CO|EXCELSO|BREWERY|KEDAI KOPI|BOOK CAFE/,
        all: {
            acc: ["holding an iced coffee with name written on the cup", "with a paperback book in hand", "with an open laptop visible"]
        }
    },

    // ---- WARUNG / STREET FOOD ----
    {
        match: /WARUNG|WARTEG|WARMINDO|MIE GACOAN|GEROBAK|KAKI LIMA|LESEHAN/,
        all: {
            acc: ["holding a small bowl of bakso", "with chopsticks mid-bite", "holding a glass of es teh"]
        }
    },

    // ---- MALL / SHOPPING ----
    {
        match: /MALL|ITC|GRAND INDONESIA|CENTRAL PARK|TIMEZONE|FUN WORLD/,
        all: {
            acc: ["carrying multiple paper shopping bags", "holding a designer crossbody on the shoulder"]
        }
    },

    // ---- GYM / SPORTS ----
    {
        match: /BASKETBALL|TENNIS|GBK|FUTSAL|BADMINTON|GOR/,
        male: {
            tops: ["SLEEVELESS DRI-FIT BASKETBALL JERSEY", "MOIST GYM TANK TOP"],
            bottoms: ["BASKETBALL SHORTS (KNEE LENGTH)", "ATHLETIC SHORTS (NIKE OR ADIDAS)"],
            shoes: ["BASKETBALL HIGH-TOPS (NIKE)", "RUNNING SHOES"],
            acc: ["GYM TOWEL ON SHOULDER", "HOLDING A WATER BOTTLE", "WIRELESS EARBUDS"]
        },
        female: {
            tops: ["SPORTS BRA WITH OVERSIZED MESH JERSEY", "FITTED ACTIVEWEAR TANK"],
            bottoms: ["BIKER SHORTS (BLACK)", "ATHLETIC LEGGINGS"],
            shoes: ["RUNNING SHOES", "BASKETBALL HIGH-TOPS"],
            acc: ["HAIR PULLED INTO TIGHT PONYTAIL", "HOLDING A WATER BOTTLE", "FITNESS TRACKER ON WRIST"]
        }
    },

    // ---- BEDROOM / KOS MORNING ----
    {
        match: /BEDROOM|KAMAR|KOS|BATHTUB/,
        male: {
            tops: ["PLAIN WHITE OVERSIZED T-SHIRT (SLEEPWEAR)", "BARE CHEST WITH BLANKET PARTIALLY COVERING"],
            bottoms: ["BOXER SHORTS", "PLAID SLEEP SHORTS", "LOOSE SWEATPANTS"],
            shoes: ["BAREFOOT", "SOCKS ONLY"],
            acc: ["MESSY HAIR JUST WOKE UP", "HOLDING SMARTPHONE LOOKING AT SCREEN"]
        },
        female: {
            tops: ["OVERSIZED HOODIE AS SLEEPWEAR", "RIBBED CAMI TANK", "BUTTON-UP MEN'S SHIRT WORN LOOSELY"],
            bottoms: ["SOFT COTTON SHORTS", "BAGGY SWEATPANTS", "BARE LEGS UNDER LONG SHIRT"],
            shoes: ["BAREFOOT", "FLUFFY SLIPPERS"],
            acc: ["MESSY BUN HAIR", "HOLDING A MUG", "PHONE IN HAND CLOSE TO FACE"]
        }
    },

    // ---- CAR INTERIOR ----
    {
        match: /CAR|MOBIL|TAXI|GRAB|GOJEK|ALPHARD|INNOVA|MERCEDES|BMW/,
        all: {
            acc: ["seatbelt visible across torso", "holding phone with maps app open"]
        }
    },

    // ---- VESPA / MOTORCYCLE ----
    {
        match: /VESPA|MOTORCYCLE|MOTOCYCLE|JDM|SCOOTER/,
        all: {
            acc: ["holding a vintage helmet under one arm", "leather jacket draped on shoulder"]
        }
    },

    // ---- TRAIN / MRT / BUS ----
    {
        match: /KRL|MRT|TRAIN|STASIUN|TRANSJAKARTA|BUS|TRAM/,
        all: {
            acc: ["wired earphones in ears, cable visible", "small backpack on one shoulder"]
        }
    },

    // ---- ROOFTOP / OUTDOOR HEIGHT ----
    {
        match: /ROOFTOP|BALCONY/,
        all: {
            acc: ["a glass of wine in hand", "hair shifting in the open air"]
        }
    },

    // ---- COWORKING / OFFICE ----
    {
        match: /CO-WORKING|COWORKING|OFFICE/,
        all: {
            acc: ["holding a MacBook under one arm", "lanyard around neck", "AirPods in ears"]
        }
    },

    // ---- BATHROOM / VANITY ----
    {
        match: /BATHROOM|VANITY|RESTROOM|TOILET/,
        all: {
            acc: ["holding phone up to mirror", "lipstick or product in free hand"]
        }
    },

    // ---- WEDDING / FORMAL EVENT ----
    {
        match: /WEDDING|KONDANGAN/,
        male: {
            tops: ["BATIK FORMAL LENGAN PANJANG (LONG SLEEVE)", "WHITE KEMEJA WITH BLAZER"],
            bottoms: ["TAILORED BLACK TROUSERS"],
            shoes: ["LEATHER OXFORD SHOES (BLACK)"],
            acc: ["WHITE POCKET SQUARE", "SIMPLE WEDDING INVITATION CARD IN HAND"]
        },
        female: {
            tops: ["ELEGANT KEBAYA MODERN", "BROCADE BLOUSE WITH GOLD THREAD", "SATIN BLOUSE WITH PUFFY SLEEVES"],
            bottoms: ["BATIK MIDI SKIRT", "ELEGANT SARONG (KAIN)"],
            shoes: ["BLOCK HEELS (NUDE)", "POINTED FLATS (METALLIC)"],
            acc: ["DELICATE GOLD EARRINGS", "ELEGANT CLUTCH BAG", "HAIR IN ELEGANT UPDO WITH BUN"]
        }
    },

    // ---- MARKET / PASAR ----
    {
        match: /PASAR|MARKET|BAZAAR|THRIFT/,
        all: {
            acc: ["holding a woven shopping basket", "carrying a vintage thrifted jacket"]
        }
    },

    // ---- RICE FIELD / RURAL ----
    {
        match: /SAWAH|RICE FIELD|VILLAGE|TEA PLANTATION/,
        all: {
            acc: ["wide woven straw hat", "holding a single fresh stalk"]
        }
    },

    // ---- AIRPORT / TRAVEL ----
    {
        match: /AIRPORT|JET|GARUDA|BUSINESS CLASS/,
        all: {
            acc: ["holding a passport in hand", "carry-on roller bag visible", "boarding pass tucked in pocket"]
        }
    },

    // ---- SKATE / SKATEPARK ----
    {
        match: /SKATEPARK|SKATE/,
        all: {
            acc: ["holding a skateboard under one arm", "knee or elbow pad partially visible"]
        }
    }
];

// ---------------------------------------------------------------------------
// Apply augmentations to a pool object
// ---------------------------------------------------------------------------
function applyContextAugmentations(pool, envName, genderId) {
    if (!envName) return;
    const env = envName.toUpperCase();
    const gKey = genderId === "FEMALE" ? "female" : "male";

    for (const rule of CONTEXT_AUGMENTATIONS) {
        if (!rule.match.test(env)) continue;

        // Generic (gender-neutral) additions
        if (rule.all) {
            for (const [field, items] of Object.entries(rule.all)) {
                if (pool[field]) pool[field].push(...items);
            }
        }

        // Gender-specific additions
        if (rule[gKey]) {
            for (const [field, items] of Object.entries(rule[gKey])) {
                if (pool[field]) pool[field].push(...items);
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Main wardrobe builder
// ---------------------------------------------------------------------------
function buildWardrobe(genderId, eraId, activeHoliday, envName, customName /*, shotType */) {
    let pool = { hair: [], tops: [], bottoms: [], shoes: [], acc: [] };

    // 1. Base pool from era OR holiday
    if (activeHoliday && typeof holidayWardrobeDB !== "undefined" && holidayWardrobeDB[activeHoliday]?.[genderId]) {
        const h = holidayWardrobeDB[activeHoliday][genderId];
        pool.hair    = [...(h.hair    || [])];
        pool.tops    = [...(h.tops    || [])];
        pool.bottoms = [...(h.bottoms || [])];
        pool.shoes   = [...(h.shoes   || [])];
        pool.acc     = [...(h.acc     || [])];
    } else {
        const eraData = (typeof wardrobeDB !== "undefined" && wardrobeDB[eraId])
            || (typeof wardrobeDB !== "undefined" ? wardrobeDB.MODERN_2020S : null)
            || { MALE: {}, FEMALE: {} };
        const g = eraData[genderId] || eraData.MALE || {};
        pool.hair    = [...(g.hair    || [])];
        pool.tops    = [...(g.tops    || [])];
        pool.bottoms = [...(g.bottoms || [])];
        pool.shoes   = [...(g.shoes   || [])];
        pool.acc     = [...(g.acc     || [])];
    }

    // 2. Augment with context-aware items
    applyContextAugmentations(pool, envName, genderId);

    // 3. Safety fallbacks
    if (!pool.tops.length)    pool.tops    = ["PLAIN T-SHIRT"];
    if (!pool.bottoms.length) pool.bottoms = ["PLAIN PANTS"];
    if (!pool.shoes.length)   pool.shoes   = ["CASUAL SNEAKERS"];
    if (!pool.hair.length)    pool.hair    = ["NATURAL HAIR"];
    if (!pool.acc.length)     pool.acc     = ["NONE"];

    // 4. Custom name → likely a celebrity, drop hijab options
    if (customName) {
        const nonHijab = pool.hair.filter(h => !h.includes("HIJAB") && !h.includes("PASHMINA"));
        if (nonHijab.length) pool.hair = nonHijab;
    }

    // 5. Pick one of each
    const w = {
        hair:   getRandom(pool.hair),
        top:    getRandom(pool.tops),
        bottom: getRandom(pool.bottoms),
        shoe:   getRandom(pool.shoes),
        acc:    getRandom(pool.acc)
    };

    // 6. Hijab consistency — if hair is hijab, force modest top/bottom
    if (w.hair && (w.hair.includes("HIJAB") || w.hair.includes("PASHMINA"))) {
        if (!activeHoliday) {
            w.top    = getRandom([
                "OVERSIZED LONG SLEEVE SHIRT",
                "KNIT CARDIGAN OVER LONG SLEEVE TOP",
                "LONG TUNIC",
                "FLANNEL BUTTONED UP COMPLETELY"
            ]);
            w.bottom = getRandom([
                "BAGGY MOM JEANS",
                "WIDE-LEG CULOTTES",
                "LONG PLEATED SKIRT",
                "MAXI SKIRT"
            ]);
        }
    }

    return w;
}
