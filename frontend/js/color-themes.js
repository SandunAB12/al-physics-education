const colorThemeStorageKey = "sandun-physics-color-theme";
const themeGroups = window.sandunThemeGroups || [];
const availableColorThemes = themeGroups.flatMap((group) => group.themes);

function findTheme(themeId) {
    return availableColorThemes.find((theme) => theme.id === themeId);
}

function applyColorTheme(themeId, savePreference) {
    const selectedTheme = findTheme(themeId) || findTheme("hot-pink-pop");
    if (!selectedTheme) {
        console.error("The default color theme is missing.");
        return;
    }

    document.documentElement.dataset.colorTheme = selectedTheme.id;
    document.querySelectorAll("[data-theme-choice]").forEach((option) => {
        option.setAttribute("aria-pressed", String(option.dataset.themeChoice === selectedTheme.id));
    });

    const currentThemeLabel = document.querySelector("[data-theme-current]");
    if (currentThemeLabel) {
        const translatedName = typeof window.dashboardI18n === "function"
            ? window.dashboardI18n("theme-" + selectedTheme.id)
            : "";
        currentThemeLabel.textContent = translatedName || selectedTheme.name;
    }

    const triggerSwatches = document.querySelectorAll(".theme-trigger-swatches i");
    selectedTheme.swatches.forEach((color, index) => {
        if (triggerSwatches[index]) {
            triggerSwatches[index].style.backgroundColor = color;
        }
    });

    if (savePreference) {
        try {
            window.localStorage.setItem(colorThemeStorageKey, selectedTheme.id);
        } catch (error) {
            console.error("Could not save the selected color theme.", error);
        }
    }
}

let initialColorTheme = "hot-pink-pop";

try {
    const savedColorTheme = window.localStorage.getItem(colorThemeStorageKey);
    if (findTheme(savedColorTheme)) {
        initialColorTheme = savedColorTheme;
    }
} catch (error) {
    console.error("Could not load the saved color theme.", error);
}

applyColorTheme(initialColorTheme, false);
document.addEventListener("click", (event) => {
    const option = event.target.closest("[data-theme-choice]");
    if (option) {
        applyColorTheme(option.dataset.themeChoice, true);
        document.querySelector(".theme-picker")?.removeAttribute("open");
    }
});
