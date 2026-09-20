"use strict";

document.addEventListener("DOMContentLoaded", async function () {
    const status = document.getElementById("data-status");
    const canvas = document.getElementById("home-canvas");
    const context = canvas.getContext("2d");
    const floatLayer = document.getElementById("home-float-layer");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function formatNumber(value) {
        return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    const orbs = [
        { x: 0.15, y: 0.24, radius: 0.44, color: "#651126", speedX: 0.000055, speedY: 0.00004 },
        { x: 0.85, y: 0.7, radius: 0.36, color: "#a44659", speedX: -0.000045, speedY: 0.00006 },
        { x: 0.53, y: 0.9, radius: 0.28, color: "#95602e", speedX: 0.00004, speedY: -0.00004 }
    ];

    function paintBackground() {
        const width = canvas.width;
        const height = canvas.height;
        const base = context.createLinearGradient(0, 0, width, height);
        base.addColorStop(0, "#14090e");
        base.addColorStop(0.52, "#260c16");
        base.addColorStop(1, "#12070b");
        context.fillStyle = base;
        context.fillRect(0, 0, width, height);

        orbs.forEach(function (orb) {
            orb.x += orb.speedX;
            orb.y += orb.speedY;
            if (orb.x < 0 || orb.x > 1) orb.speedX *= -1;
            if (orb.y < 0 || orb.y > 1) orb.speedY *= -1;

            const x = orb.x * width;
            const y = orb.y * height;
            const radius = Math.max(width, height) * orb.radius;
            const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `${orb.color}58`);
            gradient.addColorStop(0.5, `${orb.color}1c`);
            gradient.addColorStop(1, `${orb.color}00`);
            context.fillStyle = gradient;
            context.fillRect(0, 0, width, height);
        });

        if (!reduceMotion) requestAnimationFrame(paintBackground);
    }

    ["🎵 A song at 2:14 AM", "🛒 A small purchase", "☕ A familiar ritual", "📍 A place remembered", "📝 A thought saved", "🎧 Played again"].forEach(function (text, index) {
        const chip = document.createElement("span");
        chip.className = "home-floating-chip";
        chip.textContent = text;
        chip.style.left = `${5 + ((index * 16) % 82)}%`;
        chip.style.setProperty("--duration", `${18 + index * 2}s`);
        chip.style.setProperty("--delay", `${-index * 3}s`);
        chip.style.setProperty("--drift", index % 2 === 0 ? "60px" : "-60px");
        chip.style.setProperty("--rotation", index % 2 === 0 ? "5deg" : "-5deg");
        floatLayer.appendChild(chip);
    });

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    paintBackground();

    try {
        const data = await loadAllData();
        const insights = analyzeLifeReceipts(data);
        document.getElementById("home-total").textContent = formatNumber(insights.totalReceipts);
        document.getElementById("home-music").textContent = formatNumber(insights.spotifyCount);
        document.getElementById("home-spend").textContent = formatNumber(insights.householdCount + insights.transactionCount);
        status.textContent = `${new Intl.NumberFormat("en-IN").format(insights.totalReceipts)} real dataset records are ready to explore.`;
    } catch (error) {
        console.error(error);
        status.textContent = "Start this project with Live Server to read the dataset.";
    }
});
