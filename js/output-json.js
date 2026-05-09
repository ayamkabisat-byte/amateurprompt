// =============================================================================
// JSON OUTPUT BUILDERS
// Developer-friendly JSON schema for downstream pipelines
// =============================================================================

function buildPhotoJson(ctx) {
    const { shotType, subjects, locData, lighting, aesData, compData, timeData, weatherData,
            activeHoliday, customScenario, eraLabel, strictMode } = ctx;

    return {
        meta: {
            generator: "Indonesian Amateur Shot Generator",
            version: "5.0",
            output_type: "photo"
        },
        shot: {
            style_key: shotType.styleKey,
            type: shotType.type,
            camera_model: shotType.cameraModel,
            focal_length: shotType.focal,
            angle: shotType.angle,
            vibe: shotType.vibe,
            energy: shotType.energyTag
        },
        location: {
            environment: locData.env,
            architecture: locData.arch,
            props: locData.props,
            era: eraLabel,
            holiday: activeHoliday || null
        },
        subjects: subjects.map(s => ({
            index: s.index,
            name: s.name || null,
            description: s.subjectPhrase,
            demographic: s.demographic,
            gender: s.genderId,
            wardrobe: s.wardrobe
        })),
        action: {
            pose: shotType.pose || null,
            gaze: shotType.gaze || null,
            scenario: customScenario || null
        },
        lighting: {
            source: lighting.source,
            direction: lighting.dir,
            quality: lighting.qual,
            time_of_day: timeData ? { tag: timeData.tag, description: timeData.desc } : null,
            weather: weatherData ? { tag: weatherData.tag, description: weatherData.desc } : null
        },
        aesthetic: aesData ? {
            key: aesData.key,
            label: aesData.label,
            render: aesData.render,
            camera_cue: aesData.cameraType
        } : null,
        composition: compData ? { key: compData.key, rule: compData.text } : null,
        face_lock: strictMode.face
            ? { enabled: true, weight: strictMode.weight }
            : { enabled: false },
        hair_acc_lock: strictMode.hair
    };
}

function buildVideoJson(ctx, video) {
    const photoBase = buildPhotoJson(ctx);
    photoBase.meta.output_type = "video";

    const { camera, motion, pacing, ambient } = video;

    photoBase.motion = {
        camera: {
            key: camera.key,
            label: camera.label,
            description: camera.description,
            energy: camera.energy
        },
        subject: {
            micro: motion.micro,
            gesture: motion.gesture,
            narrative: motion.narrative
        },
        pacing: {
            key: pacing.key,
            label: pacing.label,
            duration_seconds: pacing.duration,
            tempo: pacing.tempo,
            sound_cue: pacing.soundCue
        }
    };

    photoBase.sound_design = {
        ambient_layers: ambient,
        pacing_cue: pacing.soundCue
    };

    return photoBase;
}
