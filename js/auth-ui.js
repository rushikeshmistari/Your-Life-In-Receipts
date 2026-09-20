document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const loginButton = document.getElementById("login-button");
    const googleLogin = document.getElementById("google-login");
    const loginMessage = document.getElementById("login-message");
    const accountModal = document.getElementById("account-modal");
    const modalClose = document.getElementById("modal-close");
    const accountOptions = document.querySelectorAll(".account-option");
    const createStoryButton = document.getElementById("create-story-button");
    const signupModal = document.getElementById("signup-modal");
    const signupForm = document.getElementById("signup-form");
    const signupClose = document.getElementById("signup-close");
    const canvas = document.getElementById("bg-canvas");
    const context = canvas.getContext("2d");
    const chipContainer = document.getElementById("chips");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!loginForm.checkValidity()) {
            loginForm.reportValidity();
            return;
        }

        loginButton.textContent = "Opening your receipts...";
        loginMessage.textContent = "Welcome back. Your story is ready.";

        const email = document.getElementById("email").value.trim();
        localStorage.setItem("demoAccount", email);
        localStorage.setItem("demoName", email.split("@")[0] || "Alex");

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 700);
    });

    googleLogin.addEventListener("click", function () {
        accountModal.classList.add("is-open");
        accountModal.setAttribute("aria-hidden", "false");
    });

    modalClose.addEventListener("click", function () {
        accountModal.classList.remove("is-open");
        accountModal.setAttribute("aria-hidden", "true");
    });

    accountModal.addEventListener("click", function (event) {
        if (event.target === accountModal) {
            accountModal.classList.remove("is-open");
            accountModal.setAttribute("aria-hidden", "true");
        }
    });

    accountOptions.forEach(function (accountOption) {
        accountOption.addEventListener("click", function () {
            const account = accountOption.dataset.account;
            const name = accountOption.dataset.name || "Alex";

            localStorage.setItem("demoAccount", account);
            localStorage.setItem("demoName", name);
            window.location.href = "dashboard.html";
        });
    });

    function closeSignupModal() {
        signupModal.classList.remove("is-open");
        signupModal.setAttribute("aria-hidden", "true");
    }

    createStoryButton.addEventListener("click", function () {
        signupModal.classList.add("is-open");
        signupModal.setAttribute("aria-hidden", "false");
    });

    signupClose.addEventListener("click", closeSignupModal);

    signupModal.addEventListener("click", function (event) {
        if (event.target === signupModal) closeSignupModal();
    });

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!signupForm.checkValidity()) {
            signupForm.reportValidity();
            return;
        }

        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        localStorage.setItem("demoName", name);
        localStorage.setItem("demoAccount", email);
        window.location.href = "dashboard.html";
    });

    const chipData = [
        "🎵 Played music at 2:14 AM",
        "🛒 Coffee purchase — ₹180",
        "📍 Late walk near campus",
        "📷 Golden-hour photo",
        "🔍 Searched: new beginnings",
        "📝 Note: start again",
        "🎬 Watched a comfort movie",
        "🎧 Favourite song repeated"
    ];

    chipData.forEach(function (text) {
        const chip = document.createElement("div");
        const duration = 16 + Math.random() * 14;
        const delay = -(Math.random() * duration);
        const rotation = (Math.random() - 0.5) * 15;

        chip.className = "chip";
        chip.textContent = text;
        chip.style.left = `${5 + Math.random() * 85}%`;
        chip.style.bottom = "-60px";
        chip.style.setProperty("--rotation", `${rotation}deg`);
        chip.style.animationDuration = `${duration}s`;
        chip.style.animationDelay = `${delay}s`;

        chipContainer.appendChild(chip);
    });

    const orbs = [
        { x: 0.2, y: 0.3, radius: 0.38, color: "#651126", speedX: 0.00012, speedY: 0.00008 },
        { x: 0.75, y: 0.65, radius: 0.32, color: "#a6193d", speedX: -0.0001, speedY: 0.00012 },
        { x: 0.55, y: 0.15, radius: 0.28, color: "#7f1d35", speedX: 0.00008, speedY: -0.0001 },
        { x: 0.1, y: 0.8, radius: 0.22, color: "#c77d46", speedX: 0.00015, speedY: -0.00008 }
    ];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function drawBackground() {
        const width = canvas.width;
        const height = canvas.height;
        const background = context.createLinearGradient(0, 0, width, height);

        background.addColorStop(0, "#12070b");
        background.addColorStop(1, "#210b14");

        context.fillStyle = background;
        context.fillRect(0, 0, width, height);

        orbs.forEach(function (orb) {
            orb.x += orb.speedX;
            orb.y += orb.speedY;

            if (orb.x < 0 || orb.x > 1) {
                orb.speedX *= -1;
            }

            if (orb.y < 0 || orb.y > 1) {
                orb.speedY *= -1;
            }

            const x = orb.x * width;
            const y = orb.y * height;
            const radius = Math.max(width, height) * orb.radius;
            const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

            gradient.addColorStop(0, `${orb.color}55`);
            gradient.addColorStop(0.5, `${orb.color}22`);
            gradient.addColorStop(1, `${orb.color}00`);

            context.fillStyle = gradient;
            context.fillRect(0, 0, width, height);
        });

        requestAnimationFrame(drawBackground);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    drawBackground();
});
