(() => {
    const supportedMediums = new Set(["si", "en", "ta"]);
    const selectionForm = document.querySelector("#learning-medium-form");
    const mediumChoice = document.querySelector("#learning-medium-choice");
    const selectionStatus = document.querySelector("#learning-medium-status");
    const dashboard = document.querySelector("[data-student-dashboard]");
    const dashboardStatus = document.querySelector("#medium-access-status");
    const dashboardRetryLink = document.querySelector("#medium-access-retry");

    function setStatus(element, message, type) {
        if (!element) {
            return;
        }
        element.textContent = message;
        element.classList.remove("is-error", "is-success");
        if (type) {
            element.classList.add("is-" + type);
        }
        element.setAttribute("role", type === "error" ? "alert" : "status");
        element.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
        element.hidden = false;
    }

    function dashboardText(key, fallback) {
        return typeof window.dashboardI18n === "function"
            ? window.dashboardI18n(key)
            : fallback;
    }

    function getClient() {
        const client = window.supabaseClient;
        if (!client || !client.auth) {
            throw new Error("Supabase is unavailable. Check the client configuration and reload this page.");
        }
        return client;
    }

    async function getAuthenticatedUser(client) {
        const { data: sessionData, error: sessionError } = await client.auth.getSession();
        if (sessionError) {
            throw sessionError;
        }
        if (!sessionData.session) {
            return null;
        }

        const { data: userData, error: userError } = await client.auth.getUser();
        if (userError) {
            throw userError;
        }
        return userData.user || null;
    }

    async function loadOwnProfile(client, userId) {
        const { data, error } = await client
            .from("profiles")
            .select("id, learning_medium")
            .eq("id", userId)
            .maybeSingle();
        if (error) {
            throw error;
        }
        if (data && data.id !== userId) {
            throw new Error("Supabase returned a profile that does not match the signed-in account.");
        }
        return data;
    }

    async function initializeSelection() {
        if (!selectionForm) {
            return;
        }

        try {
            const client = getClient();
            const user = await getAuthenticatedUser(client);
            if (!user) {
                window.location.replace("login.html");
                return;
            }

            const profile = await loadOwnProfile(client, user.id);
            if (profile && supportedMediums.has(profile.learning_medium)) {
                window.location.replace("dashboard.html");
                return;
            }

            selectionForm.hidden = false;
            mediumChoice.disabled = false;
            selectionForm.querySelector('button[type="submit"]').disabled = false;
            setStatus(selectionStatus, "Choose one learning medium to continue to your dashboard.", "");
        } catch (error) {
            console.error("Could not load the signed-in student's learning medium.", error);
            setStatus(
                selectionStatus,
                "Your learning medium could not be checked. Check your connection and profile permissions, then reload. " +
                    (error.message || ""),
                "error"
            );
        }
    }

    async function saveSelection(event) {
        event.preventDefault();
        if (!selectionForm.reportValidity()) {
            return;
        }

        const submitButton = selectionForm.querySelector('button[type="submit"]');
        const submitLabel = submitButton.querySelector("[data-submit-label]");
        const spinner = submitButton.querySelector(".student-auth-spinner");
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
        submitLabel.textContent = "Saving...";
        spinner.hidden = false;
        mediumChoice.disabled = true;
        setStatus(selectionStatus, "Saving your learning medium...", "");

        try {
            const learningMedium = mediumChoice.value;
            if (!supportedMediums.has(learningMedium)) {
                throw new Error("Choose one of the available learning mediums.");
            }

            const client = getClient();
            const user = await getAuthenticatedUser(client);
            if (!user) {
                window.location.replace("login.html");
                return;
            }

            const existingProfile = await loadOwnProfile(client, user.id);
            const query = existingProfile
                ? client
                    .from("profiles")
                    .update({ learning_medium: learningMedium })
                    .eq("id", user.id)
                : client
                    .from("profiles")
                    .insert({ id: user.id, learning_medium: learningMedium });
            const { data, error } = await query
                .select("id, learning_medium")
                .single();
            if (error) {
                throw error;
            }
            if (!data || data.id !== user.id || data.learning_medium !== learningMedium) {
                throw new Error("Supabase did not confirm the selected medium on your own profile.");
            }

            setStatus(selectionStatus, "Learning medium saved. Opening your dashboard...", "success");
            window.location.assign("dashboard.html");
        } catch (error) {
            console.error("Could not save the signed-in student's learning medium.", error);
            setStatus(
                selectionStatus,
                "Your learning medium could not be saved. Your dashboard remains unavailable until it is saved. " +
                    (error.message || ""),
                "error"
            );
            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");
            submitLabel.textContent = "Save and continue";
            spinner.hidden = true;
            mediumChoice.disabled = false;
        }
    }

    async function requireDashboardMedium() {
        if (!dashboard) {
            return;
        }

        try {
            const client = getClient();
            const user = await getAuthenticatedUser(client);
            if (!user) {
                window.location.replace("login.html");
                return;
            }

            const profile = await loadOwnProfile(client, user.id);
            if (!profile || !supportedMediums.has(profile.learning_medium)) {
                window.location.replace("learning-medium.html");
                return;
            }

            if (typeof window.setDashboardLanguage !== "function") {
                throw new Error("Dashboard translations could not be loaded.");
            }
            window.setDashboardLanguage(profile.learning_medium);
            window.sandunStudentContext = {
                userId: user.id,
                learningMedium: profile.learning_medium
            };
            window.dispatchEvent(new CustomEvent("sandun:dashboard-ready", {
                detail: window.sandunStudentContext
            }));
            dashboardStatus.hidden = true;
            dashboard.hidden = false;
        } catch (error) {
            console.error("Could not verify the signed-in student's dashboard access.", error);
            setStatus(
                dashboardStatus,
                dashboardText(
                    "statusDashboardError",
                    "Your dashboard is unavailable because your learning medium could not be verified. Please try again."
                ),
                "error"
            );
            dashboardRetryLink.hidden = false;
        }
    }

    if (selectionForm) {
        selectionForm.addEventListener("submit", saveSelection);
        initializeSelection();
    }
    if (dashboard) {
        requireDashboardMedium();
    }
})();
