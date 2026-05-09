// =============================================================================
// UI: ADVANCED PANEL
// Per-subject customization (name, gender, age, demographic) with state preservation
// =============================================================================

function toggleAdvanced(triggerGenerateFn) {
    const panel  = document.getElementById("advancedPanel");
    const toggle = document.getElementById("advancedToggle");
    if (toggle.checked) {
        panel.classList.remove("hidden");
        renderAdvancedRows(triggerGenerateFn);
    } else {
        panel.classList.add("hidden");
    }
    if (triggerGenerateFn) triggerGenerateFn(300);
}

function onNumOrGenderChange(triggerGenerateFn) {
    const toggle = document.getElementById("advancedToggle");
    if (toggle?.checked) {
        renderAdvancedRows(triggerGenerateFn);
    }
    if (triggerGenerateFn) triggerGenerateFn();
}

function renderAdvancedRows(triggerGenerateFn) {
    const numEl    = document.getElementById("numSelect");
    const genderEl = document.getElementById("genderSelect");
    const container = document.getElementById("characterRows");
    if (!numEl || !genderEl || !container) return;

    const numVal = numEl.value;
    const genderVal = genderEl.value;
    let num = numVal === "RANDOM" ? Math.floor(Math.random() * 6) + 1 : parseInt(numVal);
    if (isNaN(num) || num < 1) num = 1;
    if (genderVal === "COUPLE") num = 2;

    // Save state before rebuild
    const saved = [];
    for (let i = 0; i < container.children.length; i++) {
        const s = {};
        ["name", "gender", "age", "demo"].forEach(f => {
            const el = document.getElementById(`adv_${f}_${i}`);
            if (el) s[f] = { value: el.value, locked: isLocked(`adv_${f}_${i}`) };
        });
        saved.push(s);
    }

    if (container.children.length === num) return;

    container.innerHTML = "";

    const demoOptions = (typeof demographics !== "undefined")
        ? demographics.map(d => `<option value="${d}">${d}</option>`).join("")
        : "";

    for (let i = 0; i < num; i++) {
        const defaultGender = genderVal === "COUPLE"
            ? (i === 0 ? "MALE" : "FEMALE")
            : (genderVal !== "RANDOM" ? genderVal : "RANDOM");

        const s = saved[i] || {};
        const nameVal    = s.name?.value   || "";
        const genVal     = s.gender?.value || defaultGender;
        const ageVal     = s.age?.value    || "RANDOM";
        const demoVal    = s.demo?.value   || "RANDOM";
        const nameLocked = s.name?.locked  || false;
        const genLocked  = s.gender?.locked || false;
        const ageLocked  = s.age?.locked   || false;
        const demoLocked = s.demo?.locked  || false;

        const lockIcon = locked => locked
            ? `<i class="fa-solid fa-lock text-red-500 lock-icon locked cursor-pointer hover:text-white"></i>`
            : `<i class="fa-solid fa-lock-open text-slate-500 lock-icon unlocked cursor-pointer hover:text-white"></i>`;

        container.innerHTML += `
        <div class="bg-slate-900/80 p-3 rounded border border-slate-600 shadow-md flex flex-col gap-2 transition-all duration-200 hover:border-red-500/50">
            <div class="font-bold text-red-400 border-b border-slate-700 pb-1">Orang ${i + 1}</div>
            <div class="flex gap-2 items-center">
                <input type="text" id="adv_name_${i}" value="${nameVal}" oninput="handleAdvancedNameInput(${i})"
                    placeholder="Nama Artis" aria-label="Nama ${i + 1}"
                    class="flex-1 min-w-0 bg-slate-800 text-green-300 border ${nameLocked ? 'border-red-500' : 'border-green-700'} rounded p-1.5 text-xs outline-none placeholder-slate-500 transition-colors">
                <span onclick="toggleAdvLock('adv_name_${i}',this)">${lockIcon(nameLocked)}</span>
            </div>
            <div class="flex gap-2 items-center">
                <select id="adv_gender_${i}" onchange="triggerGenerate()"
                    class="flex-1 min-w-0 bg-slate-800 text-slate-200 border ${genLocked ? 'border-red-500' : 'border-slate-600'} rounded p-1.5 text-xs outline-none transition-colors">
                    <option value="RANDOM" ${genVal === "RANDOM" ? "selected" : ""}>🎲 Acak</option>
                    <option value="MALE"   ${genVal === "MALE"   ? "selected" : ""}>Pria</option>
                    <option value="FEMALE" ${genVal === "FEMALE" ? "selected" : ""}>Wanita</option>
                </select>
                <span onclick="toggleAdvLock('adv_gender_${i}',this)">${lockIcon(genLocked)}</span>
            </div>
            <div class="flex gap-2 items-center">
                <select id="adv_age_${i}" onchange="triggerGenerate()"
                    class="flex-1 min-w-0 bg-slate-800 text-slate-200 border ${ageLocked ? 'border-red-500' : 'border-slate-600'} rounded p-1.5 text-xs outline-none transition-colors">
                    <option value="RANDOM"      ${ageVal === "RANDOM"      ? "selected" : ""}>🎲 Acak</option>
                    <option value="TEENAGER"    ${ageVal === "TEENAGER"    ? "selected" : ""}>Remaja</option>
                    <option value="YOUNG_ADULT" ${ageVal === "YOUNG_ADULT" ? "selected" : ""}>Dewasa Muda</option>
                    <option value="ADULT"       ${ageVal === "ADULT"       ? "selected" : ""}>Dewasa</option>
                    <option value="MATURE"      ${ageVal === "MATURE"      ? "selected" : ""}>Paruh Baya</option>
                </select>
                <span onclick="toggleAdvLock('adv_age_${i}',this)">${lockIcon(ageLocked)}</span>
            </div>
            <div class="flex gap-2 items-center">
                <select id="adv_demo_${i}" onchange="triggerGenerate()"
                    class="flex-1 min-w-0 bg-slate-800 text-slate-200 border ${demoLocked ? 'border-red-500' : 'border-slate-600'} rounded p-1.5 text-xs outline-none transition-colors">
                    <option value="RANDOM" ${demoVal === "RANDOM" ? "selected" : ""}>🎲 Acak</option>
                    ${demoOptions}
                </select>
                <span onclick="toggleAdvLock('adv_demo_${i}',this)">${lockIcon(demoLocked)}</span>
            </div>
        </div>`;

        if (nameLocked) lockState[`adv_name_${i}`]   = true;
        if (genLocked)  lockState[`adv_gender_${i}`] = true;
        if (ageLocked)  lockState[`adv_age_${i}`]    = true;
        if (demoLocked) lockState[`adv_demo_${i}`]   = true;
    }
}

function handleAdvancedNameInput(i) {
    const nameEl = document.getElementById(`adv_name_${i}`);
    const hasName = nameEl && nameEl.value.trim().length > 0;
    ["age", "demo"].forEach(f => {
        const el = document.getElementById(`adv_${f}_${i}`);
        if (el) {
            el.disabled = hasName;
            el.style.opacity = hasName ? "0.5" : "";
        }
    });
    triggerGenerate(800);
}
