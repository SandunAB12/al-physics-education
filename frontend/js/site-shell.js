(() => {
    const themeGroups = [
        {
            name: "Soft & Pretty",
            themes: [
                { id: "pink-blossom", name: "Pink Blossom", swatches: ["#FFF3F7", "#682D4B", "#D95F91"] },
                { id: "lavender-dream", name: "Lavender Dream", swatches: ["#F5F1FC", "#35254F", "#9874D6"] },
                { id: "peach-glow", name: "Peach Glow", swatches: ["#FFF4EB", "#4B3028", "#D8794D"] },
                { id: "cherry-blossom", name: "Cherry Blossom", swatches: ["#FFF5F2", "#4B2029", "#C43D52"] },
                { id: "arctic-blue", name: "Arctic Blue", swatches: ["#EFF8FC", "#183A4C", "#39A8C8"] }
            ]
        },
        {
            name: "Bold & Modern",
            themes: [
                { id: "hot-pink-pop", name: "Hot Pink Pop", swatches: ["#FFF8FC", "#190D16", "#F00078"] },
                { id: "electric-ocean", name: "Electric Ocean", swatches: ["#EFF8FF", "#071B35", "#087FF5"] },
                { id: "sunset-fire", name: "Sunset Fire", swatches: ["#FFF4E8", "#292421", "#D94F20"] },
                { id: "royal-violet", name: "Royal Violet", swatches: ["#F5F0FA", "#21132F", "#7542C8"] },
                { id: "midnight-blue", name: "Midnight Blue", swatches: ["#EEF2F8", "#101827", "#526A91"] }
            ]
        },
        {
            name: "Fresh & Motivational",
            themes: [
                { id: "avocado-fresh", name: "Avocado Fresh", swatches: ["#F7F5E9", "#34351F", "#89952E"] },
                { id: "forest-luxe", name: "Forest Luxe", swatches: ["#F1F5EF", "#14251E", "#397552"] },
                { id: "emerald-green", name: "Emerald Green", swatches: ["#EFF8F3", "#103426", "#07966A"] },
                { id: "mint-energy", name: "Mint Energy", swatches: ["#EEFAF6", "#143B3A", "#16A99A"] },
                { id: "sunshine", name: "Sunshine", swatches: ["#FFF9E6", "#30301F", "#D49A00"] }
            ]
        },
        {
            name: "Elegant & Universal",
            themes: [
                { id: "royal-navy", name: "Royal Navy", swatches: ["#F1F4F8", "#15243A", "#315D91"] },
                { id: "ocean-breeze", name: "Ocean Breeze", swatches: ["#F0F8F7", "#173A3D", "#2D9690"] },
                { id: "coffee-cream", name: "Coffee Cream", swatches: ["#F6F0E7", "#30241D", "#96704C"] },
                { id: "royal-purple", name: "Royal Purple", swatches: ["#F6F2F9", "#38223F", "#8A4F78"] }
            ]
        }
    ];
    window.sandunThemeGroups = themeGroups;

    const themeOptions = themeGroups.map((group) => `
        <section class="theme-group" aria-label="${group.name}">
            <h3>${group.name}</h3>
            <div class="theme-option-list">
                ${group.themes.map((theme) => `
                    <button class="theme-option" type="button" data-theme-choice="${theme.id}" aria-pressed="false">
                        <span class="theme-swatches" aria-hidden="true">
                            ${theme.swatches.map((color) => `<span style="--swatch-color:${color}"></span>`).join("")}
                        </span>
                        <span>${theme.name}</span>
                    </button>`).join("")}
            </div>
        </section>`).join("");

    const page = window.location.pathname.split("/").pop() || "index.html";
    const header = document.querySelector(".site-header");
    if (header) {
        header.innerHTML = `
            <nav class="navbar" aria-label="Main navigation">
                <a class="brand" href="index.html" aria-label="SANDUN ABEYSEKARA home">
                    <span class="brand-mark">S</span>
                    <span>SANDUN <strong>ABEYSEKARA</strong></span>
                </a>
                <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-links">
                    <span></span><span></span><span></span><span class="sr-only">Toggle menu</span>
                </button>
                <ul class="nav-links" id="nav-links">
                    <li><a${page === "index.html" ? ' class="active" aria-current="page"' : ""} href="index.html">Home</a></li>
                    <li><a${page === "dashboard.html" ? ' class="active" aria-current="page"' : ""} href="dashboard.html">Dashboard</a></li>
                    <li><a${page === "teacher.html" ? ' class="active" aria-current="page"' : ""} href="teacher.html">Teacher</a></li>
                    <li><a${page === "contact.html" ? ' class="active" aria-current="page"' : ""} href="contact.html">Contact</a></li>
                    <li><a${page === "login.html" ? ' class="active" aria-current="page"' : ""} href="login.html">Login</a></li>
                    <li class="theme-control">
                        <details class="theme-picker">
                            <summary class="theme-trigger" aria-label="Choose a color theme">
                                <span class="theme-trigger-swatches" aria-hidden="true"><i></i><i></i><i></i></span>
                                <span data-theme-current>Hot Pink Pop</span>
                                <span class="theme-trigger-chevron" aria-hidden="true"></span>
                            </summary>
                            <div class="theme-menu">
                                <p class="theme-menu-title">Choose your color theme</p>
                                ${themeOptions}
                            </div>
                        </details>
                    </li>
                </ul>
            </nav>`;
    }

    const footer = document.querySelector(".site-footer");
    if (footer) {
        footer.innerHTML = `
            <a class="brand footer-brand" href="index.html" aria-label="SANDUN ABEYSEKARA home">
                <span class="brand-mark">S</span>
                <span>SANDUN <strong>ABEYSEKARA</strong></span>
            </a>
            <div class="footer-links" aria-label="Footer navigation">
                <a href="index.html">Home</a>
                <a href="dashboard.html">Dashboard</a>
                <a href="teacher.html">Teacher</a>
                <a href="contact.html">Contact</a>
            </div>
            <p>A/L PHYSICS EDUCATION · © 2026 SANDUN ABEYSEKARA</p>`;
    }

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    menuToggle?.addEventListener("click", () => {
        const isOpen = navLinks?.classList.toggle("open") ?? false;
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    const artworkScript = document.createElement("script");
    artworkScript.src = new URL("theme-botanical-art.js", document.currentScript.src).href;
    document.body.appendChild(artworkScript);
})();
