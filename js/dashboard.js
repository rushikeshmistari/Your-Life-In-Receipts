document.addEventListener("DOMContentLoaded", async function () {
    const $ = function (selector) { return document.querySelector(selector); };
    const $$ = function (selector) { return document.querySelectorAll(selector); };
    const receiptGrid = $("#receipt-grid");
    const receiptStatus = $("#receipt-status");
    const searchInput = $("#receipt-search");
    const floatingReceipts = $("#floating-receipts");
    const canvas = $("#background-canvas");
    const context = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let receipts = [];
    let activeFilter = "all";
    let currentStory = 0;
    let lastFocusedElement = null;
    let storyPatterns = fallbackPatterns();
    let storyFrames = fallbackFrames();

    function formatNumber(value) {
        return new Intl.NumberFormat("en-IN").format(value || 0);
    }

    function escapeHtml(value) {
        const element = document.createElement("div");
        element.textContent = String(value || "A recorded moment");
        return element.innerHTML;
    }

    function hourFrom(value) {
        const match = String(value || "").match(/(?:T|\s)(\d{1,2}):\d{2}/);
        return match ? Number(match[1]) : null;
    }

    function topValue(records, key, fallback) {
        const counts = {};
        records.forEach(function (record) {
            const value = String(record[key] || "Unclassified").trim();
            counts[value] = (counts[value] || 0) + 1;
        });
        const result = Object.entries(counts).sort(function (a, b) { return b[1] - a[1]; })[0];
        return result ? result[0] : fallback;
    }

    function activeHour(records) {
        const counts = new Array(24).fill(0);
        records.forEach(function (record) {
            const hour = hourFrom(record.ts);
            if (hour !== null) counts[hour] += 1;
        });
        const hour = counts.indexOf(Math.max(...counts));
        return `${hour % 12 || 12} ${hour >= 12 ? "PM" : "AM"}`;
    }

    function sample(records, amount) {
        if (records.length <= amount) return records;
        const step = Math.floor(records.length / amount);
        return Array.from({ length: amount }, function (_, index) { return records[index * step]; });
    }

    function buildReceipts(data) {
        const music = sample(data.spotifyHistory, 55).map(function (record) {
            return { type: "music", label: "MUSIC", icon: "🎵", title: record.track_name || "Unknown track", detail: `${record.artist_name || "Unknown artist"} · ${record.ts || "Saved listening"}`, note: "One listening receipt. Its story value comes from the repeated listening patterns shown in Guided Story Mode." };
        });
        const household = sample(data.householdTransactions, 45).map(function (record) {
            return { type: "household", label: "HOUSEHOLD", icon: "🏠", title: record.Category || record.Subcategory || "Daily expense", detail: `${record.Note || record.Subcategory || "Household routine"} · ₹${record.Amount || "—"}`, note: "One household receipt. Similar categories recur, which is why this contributes to a daily-routine pattern." };
        });
        const purchases = sample(data.transactions, 55).map(function (record) {
            return { type: "purchases", label: "PURCHASE", icon: "🧾", title: record.merchant || record.category || "Purchase record", detail: `${record.category || "Everyday purchase"} · ₹${record.amt || "—"}${record.city ? ` · ${record.city}` : ""}`, note: "One purchase receipt. It supports category-level observations, not a claim that it occurred alongside a specific music or household record." };
        });
        const result = [];
        for (let index = 0; index < Math.max(music.length, household.length, purchases.length); index += 1) {
            if (music[index]) result.push(music[index]);
            if (household[index]) result.push(household[index]);
            if (purchases[index]) result.push(purchases[index]);
        }
        return result;
    }

    function renderReceipts() {
        const query = searchInput.value.trim().toLowerCase();
        const visible = receipts.filter(function (receipt) {
            return (activeFilter === "all" || receipt.type === activeFilter) && `${receipt.title} ${receipt.detail} ${receipt.label}`.toLowerCase().includes(query);
        }).slice(0, 12);
        receiptGrid.innerHTML = visible.map(function (receipt) {
            return `<article class="receipt-card" tabindex="0" role="button" data-receipt-index="${receipts.indexOf(receipt)}" aria-label="Open ${escapeHtml(receipt.title)} receipt details"><span class="receipt-type">${receipt.icon} ${receipt.label}</span><h3>${escapeHtml(receipt.title)}</h3><p>${escapeHtml(receipt.detail)}</p></article>`;
        }).join("");
        receiptStatus.textContent = `${visible.length} moments shown from the supplied archive. Select a card for context.`;
    }

    function selectFilter(filter, scroll) {
        activeFilter = filter;
        $$(".filter-button").forEach(function (button) {
            const selected = button.dataset.filter === filter;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
        renderReceipts();
        if (scroll) $("#explorer").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }

    function fallbackFrames() {
        return [
            { kicker: "OPENING FRAME", count: "162,588", title: "Small moments become a living archive.", copy: "This guided reading turns repeated behavior in the supplied records into an interpretable story. It is an evidence-led lens, not a claim about a real person.", evidence: ["149,860 music receipts", "2,461 household receipts", "10,267 purchase receipts"], filter: "all" },
            { kicker: "CHAPTER 01 · TIME", count: "…", title: "A night-time rhythm is emerging.", copy: "Music records are being read for late-night listening patterns.", evidence: ["Listening timestamps", "Repeated hours"], filter: "music" },
            { kicker: "CHAPTER 02 · ROUTINE", count: "…", title: "Repeated choices can form a ritual.", copy: "Household and purchase categories are being read as separate, recurring routines.", evidence: ["Household categories", "Purchase categories"], filter: "household" },
            { kicker: "CHAPTER 03 · SOUND", count: "…", title: "A recurring artist can become a soundtrack.", copy: "Music receipts are being read for the artists that return most often.", evidence: ["Artists", "Track plays"], filter: "music" }
        ];
    }

    function fallbackPatterns() {
        return {
            night: { kicker: "CHAPTER 01 · A TIME-BASED CONNECTION", title: "Night Owl Era", copy: "The archive is checking how often listening returns to the quietest hours.", steps: ["🌙 Midnight to 5 AM", "🎵 Listening moments"], filter: "music", storyIndex: 1 },
            rituals: { kicker: "CHAPTER 02 · A REPEATED ROUTINE", title: "Daily Rituals", copy: "The archive is mapping repeated household choices into an everyday rhythm.", steps: ["🏠 Household moments", "🧾 Purchases"], filter: "household", storyIndex: 2 },
            soundtrack: { kicker: "CHAPTER 03 · A RECURRING SOUNDTRACK", title: "Your Soundtrack", copy: "The archive is identifying the artists and tracks that return most often.", steps: ["🎧 Artists", "🎵 Listening history"], filter: "music", storyIndex: 3 }
        };
    }

    function renderStory(index) {
        currentStory = Math.max(0, Math.min(index, storyFrames.length - 1));
        const frame = storyFrames[currentStory];
        $("#story-kicker").textContent = frame.kicker;
        $("#story-count").textContent = frame.count;
        $("#story-title").textContent = frame.title;
        $("#story-copy").textContent = frame.copy;
        $("#story-evidence").innerHTML = frame.evidence.map(function (item) { return `<span class="evidence-chip">${escapeHtml(item)}</span>`; }).join("");
        $("#story-position").textContent = `${currentStory + 1} / ${storyFrames.length}`;
        $("#story-previous").disabled = currentStory === 0;
        $("#story-next").textContent = currentStory === storyFrames.length - 1 ? "Read again ↺" : "Next chapter →";
        $$(".story-dot").forEach(function (dot, dotIndex) {
            const selected = dotIndex === currentStory;
            dot.classList.toggle("active", selected);
            dot.setAttribute("aria-current", selected ? "step" : "false");
        });
    }

    function openChapter(name) {
        const chapter = storyPatterns[name];
        if (!chapter) return;
        $("#chapter-viewer-kicker").textContent = chapter.kicker;
        $("#chapter-viewer-title").textContent = chapter.title;
        $("#chapter-viewer-copy").textContent = chapter.copy;
        $("#chapter-thread").innerHTML = chapter.steps.map(function (step) { return `<span class="thread-step">${escapeHtml(step)}</span>`; }).join("");
        $("#viewer-action").dataset.filter = chapter.filter;
        $("#viewer-action").hidden = false;
        $("#chapter-viewer").classList.add("is-open");
        renderStory(chapter.storyIndex);
        $("#story-mode").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }

    function openReceipt(receipt) {
        if (!receipt) return;
        lastFocusedElement = document.activeElement;
        $("#receipt-dialog-type").textContent = `${receipt.icon} ${receipt.label} RECEIPT`;
        $("#receipt-dialog-title").textContent = receipt.title;
        $("#receipt-dialog-detail").textContent = receipt.detail;
        $("#receipt-dialog-note").textContent = receipt.note;
        $("#receipt-modal").classList.add("is-open");
        $("#receipt-modal").setAttribute("aria-hidden", "false");
        $("#receipt-close").focus();
    }

    function closeReceipt() {
        $("#receipt-modal").classList.remove("is-open");
        $("#receipt-modal").setAttribute("aria-hidden", "true");
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    $$(".filter-button").forEach(function (button) {
        button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
        button.addEventListener("click", function () { selectFilter(button.dataset.filter, false); });
    });
    $$(".chapter-button").forEach(function (button) {
        button.addEventListener("click", function (event) { event.stopPropagation(); openChapter(button.closest(".chapter-card").dataset.chapter); });
    });
    $$(".chapter-card").forEach(function (card) {
        card.addEventListener("click", function () { openChapter(card.dataset.chapter); });
        card.addEventListener("keydown", function (event) { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openChapter(card.dataset.chapter); } });
    });
    $("#viewer-action").addEventListener("click", function () { selectFilter($("#viewer-action").dataset.filter, true); });
    $("#start-story").addEventListener("click", function () { renderStory(0); $("#story-mode").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); });
    $$(".story-dot").forEach(function (dot) { dot.addEventListener("click", function () { renderStory(Number(dot.dataset.storyIndex)); }); });
    $("#story-previous").addEventListener("click", function () { renderStory(currentStory - 1); });
    $("#story-next").addEventListener("click", function () { renderStory(currentStory === storyFrames.length - 1 ? 0 : currentStory + 1); });
    $("#story-explore").addEventListener("click", function () { selectFilter(storyFrames[currentStory].filter, true); });
    searchInput.addEventListener("input", renderReceipts);
    receiptGrid.addEventListener("click", function (event) { const card = event.target.closest(".receipt-card"); if (card) openReceipt(receipts[Number(card.dataset.receiptIndex)]); });
    receiptGrid.addEventListener("keydown", function (event) { const card = event.target.closest(".receipt-card"); if (card && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openReceipt(receipts[Number(card.dataset.receiptIndex)]); } });
    $("#receipt-close").addEventListener("click", closeReceipt);
    $("#receipt-modal").addEventListener("click", function (event) { if (event.target === $("#receipt-modal")) closeReceipt(); });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && $("#receipt-modal").classList.contains("is-open")) closeReceipt(); });

    ["🎵 A song at 2:14 AM", "🛒 A small purchase", "🏠 A daily ritual", "📝 A saved thought", "🎧 Played again", "☕ A quiet pause"].forEach(function (text, index) {
        const chip = document.createElement("span");
        chip.className = "floating-chip";
        chip.textContent = text;
        chip.style.left = `${5 + ((index * 15) % 82)}%`;
        chip.style.setProperty("--float-duration", `${17 + (index % 4) * 4}s`);
        chip.style.setProperty("--float-delay", `${-index * 2.7}s`);
        chip.style.setProperty("--drift", index % 2 === 0 ? "72px" : "-72px");
        chip.style.setProperty("--rotation", index % 2 === 0 ? "5deg" : "-5deg");
        floatingReceipts.appendChild(chip);
    });

    const orbs = [{ x: 0.16, y: 0.2, radius: 0.43, color: "#7d1e3d", speedX: 0.000055, speedY: 0.00004 }, { x: 0.84, y: 0.64, radius: 0.35, color: "#bd8950", speedX: -0.00005, speedY: 0.000055 }, { x: 0.5, y: 0.88, radius: 0.28, color: "#76527a", speedX: 0.00004, speedY: -0.00004 }];
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function drawBackground() {
        const base = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        base.addColorStop(0, "#10070d"); base.addColorStop(0.55, "#240c19"); base.addColorStop(1, "#0d0609");
        context.fillStyle = base; context.fillRect(0, 0, canvas.width, canvas.height);
        orbs.forEach(function (orb) {
            if (!reduceMotion) { orb.x += orb.speedX; orb.y += orb.speedY; if (orb.x < 0 || orb.x > 1) orb.speedX *= -1; if (orb.y < 0 || orb.y > 1) orb.speedY *= -1; }
            const x = orb.x * canvas.width; const y = orb.y * canvas.height; const radius = Math.max(canvas.width, canvas.height) * orb.radius;
            const glow = context.createRadialGradient(x, y, 0, x, y, radius);
            glow.addColorStop(0, `${orb.color}58`); glow.addColorStop(0.52, `${orb.color}1e`); glow.addColorStop(1, `${orb.color}00`);
            context.fillStyle = glow; context.fillRect(0, 0, canvas.width, canvas.height);
        });
        if (!reduceMotion) requestAnimationFrame(drawBackground);
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    drawBackground();
    renderStory(0);

    try {
        const data = await loadAllData();
        const insights = analyzeLifeReceipts(data);
        const savedName = localStorage.getItem("demoName") || "Alex";
        const lateSongs = data.spotifyHistory.filter(function (record) { const hour = hourFrom(record.ts); return hour !== null && hour < 5; });
        const lateRecord = lateSongs[0] || data.spotifyHistory[0] || {};
        const artist = topValue(data.spotifyHistory, "artist_name", "your favourite artists");
        const household = topValue(data.householdTransactions, "Category", "daily expenses");
        const purchase = topValue(data.transactions, "category", "everyday purchases");
        const artistRecord = data.spotifyHistory.find(function (record) { return record.artist_name === artist; }) || {};
        $("#welcome-name").textContent = savedName.charAt(0).toUpperCase() + savedName.slice(1).toLowerCase();
        $("#songs-count").textContent = formatNumber(insights.spotifyCount);
        $("#active-hour").textContent = activeHour(data.spotifyHistory);
        $("#household-count").textContent = formatNumber(insights.householdCount);
        $("#purchase-count").textContent = formatNumber(insights.transactionCount);
        receipts = buildReceipts(data);
        storyFrames = [
            { kicker: "OPENING FRAME · THE ARCHIVE", count: formatNumber(insights.totalReceipts), title: "The story begins with a pattern, not a single event.", copy: `This fictional memory archive contains ${formatNumber(insights.spotifyCount)} music plays, ${formatNumber(insights.householdCount)} household records, and ${formatNumber(insights.transactionCount)} purchase records. The chapters keep each dataset's evidence separate while making repetition visible.`, evidence: [`${formatNumber(insights.spotifyCount)} music`, `${formatNumber(insights.householdCount)} household`, `${formatNumber(insights.transactionCount)} purchases`], filter: "all" },
            { kicker: "CHAPTER 01 · NIGHT OWL ERA", count: formatNumber(lateSongs.length), title: "When the day quiets down, the music continues.", copy: `${formatNumber(lateSongs.length)} music receipts fall between midnight and 5 AM. That makes late listening a chapter: not one isolated 2 AM song, but a habit that repeatedly returns to the same quiet hours.`, evidence: ["Midnight–5 AM", `${formatNumber(lateSongs.length)} late plays`, `${lateRecord.track_name || "A late track"} · ${lateRecord.artist_name || "Unknown artist"}`], filter: "music" },
            { kicker: "CHAPTER 02 · DAILY RITUALS", count: household, title: "Ordinary choices are the rhythm underneath the bigger moments.", copy: `In the household dataset, ${household} occurs most often. In the separate purchase dataset, ${purchase} is the most common category. This is an interpretive routine: recurring practical choices, rather than disconnected lines in a spreadsheet.`, evidence: [`Household: ${household}`, `Purchases: ${purchase}`, "Category-level interpretation"], filter: "household" },
            { kicker: "CHAPTER 03 · YOUR SOUNDTRACK", count: artist, title: "A returning artist gives the archive a familiar voice.", copy: `${artist} appears most often in the listening history. A favorite does not explain every mood, but its repeated return creates a musical thread visitors can investigate through the music receipts.`, evidence: [`Most frequent artist: ${artist}`, artistRecord.track_name || "A repeated track", `${formatNumber(insights.spotifyCount)} total plays`], filter: "music" }
        ];
        storyPatterns = {
            night: { kicker: "CHAPTER 01 · A TIME-BASED CONNECTION", title: "Night Owl Era", copy: storyFrames[1].copy, steps: storyFrames[1].evidence, filter: "music", storyIndex: 1 },
            rituals: { kicker: "CHAPTER 02 · A REPEATED ROUTINE", title: "Daily Rituals", copy: storyFrames[2].copy, steps: storyFrames[2].evidence, filter: "household", storyIndex: 2 },
            soundtrack: { kicker: "CHAPTER 03 · A RECURRING SOUNDTRACK", title: "Your Soundtrack", copy: storyFrames[3].copy, steps: storyFrames[3].evidence, filter: "music", storyIndex: 3 }
        };
        renderStory(currentStory);
        renderReceipts();
    } catch (error) {
        console.error(error);
        receiptStatus.textContent = "The receipt data could not load. Open the project through Live Server and check the data file names.";
    }
});
