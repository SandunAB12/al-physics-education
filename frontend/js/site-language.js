(() => {
    const supportedMediums = new Set(["si", "en", "ta"]);
    const scriptDirectory = new URL(".", document.currentScript.src);
    const timeoutDuration = 8000;
    let completed = false;
    let fallbackTimer;

    document.documentElement.classList.add("language-pending");

    function showLanguageNotice(message, includeSelectionLink) {
        const main = document.querySelector("main");
        if (!main) {
            return;
        }

        const notice = document.createElement("p");
        notice.className = "site-language-notice";
        notice.setAttribute("role", "status");
        notice.textContent = message;
        if (includeSelectionLink) {
            notice.append(" ");
            const link = document.createElement("a");
            link.href = "learning-medium.html";
            link.textContent = "Choose your learning medium";
            notice.append(link);
        }
        main.prepend(notice);
    }

    function finish(language, notice) {
        if (completed) {
            return;
        }
        completed = true;
        window.clearTimeout(fallbackTimer);

        try {
            if (typeof window.setDashboardLanguage === "function") {
                window.setDashboardLanguage(language);
            } else {
                document.documentElement.lang = "en";
                console.error("The shared learning-content translations could not be loaded.");
                notice = notice || "Learning descriptions are shown in English because translations could not be loaded.";
            }
        } catch (error) {
            console.error("Could not apply the saved learning medium.", error);
            document.documentElement.lang = "en";
            notice = "Learning descriptions are shown in English because your learning medium could not be applied.";
        }

        if (notice) {
            showLanguageNotice(notice, language === "en");
        }
        document.documentElement.classList.remove("language-pending");
    }

    function hasScript(scriptUrl) {
        const expectedUrl = new URL(scriptUrl, scriptDirectory).href;
        return Array.from(document.scripts).some((script) => script.src === expectedUrl);
    }

    function loadScript(source) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = new URL(source, scriptDirectory).href;
            script.onload = resolve;
            script.onerror = () => reject(new Error("Could not load " + source));
            document.head.append(script);
        });
    }

    async function ensureTranslations() {
        if (typeof window.setDashboardLanguage !== "function") {
            await loadScript("dashboard-i18n.js");
        }
    }

    async function ensureSupabaseClient() {
        if (window.supabaseClient) {
            return;
        }

        const cdnUrl = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        if (!window.supabase && !hasScript(cdnUrl)) {
            await loadScript(cdnUrl);
        }
        if (!window.supabaseClient && !hasScript("supabase-client.js")) {
            await loadScript("supabase-client.js");
        }
    }

    async function readOwnMedium() {
        await ensureSupabaseClient();
        const client = window.supabaseClient;
        if (!client || !client.auth) {
            return {
                language: "en",
                notice: "Your saved learning medium could not be checked. Learning descriptions are shown in English."
            };
        }

        const { data: sessionData, error: sessionError } = await client.auth.getSession();
        if (sessionError) {
            throw sessionError;
        }
        if (!sessionData.session) {
            return { language: "en" };
        }

        const { data: userData, error: userError } = await client.auth.getUser();
        if (userError) {
            throw userError;
        }
        const user = userData.user;
        if (!user) {
            throw new Error("Supabase did not return the authenticated user.");
        }

        const { data: profile, error: profileError } = await client
            .from("profiles")
            .select("id, learning_medium")
            .eq("id", user.id)
            .maybeSingle();
        if (profileError) {
            throw profileError;
        }
        if (profile && profile.id !== user.id) {
            throw new Error("Supabase returned a profile that does not match the signed-in account.");
        }
        if (!profile || !supportedMediums.has(profile.learning_medium)) {
            return {
                language: "en",
                notice: "Choose a learning medium to personalize lesson descriptions. They are shown in English for now."
            };
        }
        return { language: profile.learning_medium };
    }

    async function initializeLanguage() {
        fallbackTimer = window.setTimeout(() => {
            finish(
                "en",
                "Your learning medium could not be verified in time. Learning descriptions are shown in English."
            );
        }, timeoutDuration);

        try {
            await ensureTranslations();
            if (completed) {
                return;
            }
            const result = await readOwnMedium();
            finish(result.language, result.notice);
        } catch (error) {
            console.error("Could not load the student's saved learning medium.", error);
            finish(
                "en",
                "Your learning medium could not be verified. Learning descriptions are shown in English."
            );
        }
    }

    document.addEventListener("DOMContentLoaded", initializeLanguage, { once: true });
})();
