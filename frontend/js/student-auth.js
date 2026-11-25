(() => {
    const loginForm = document.querySelector("#student-login-form");
    const registerForm = document.querySelector("#student-register-form");
    const authStatus = document.querySelector("#auth-status");
    const modeButtons = Array.from(document.querySelectorAll("[data-auth-mode]"));
    const authHeading = document.querySelector("#auth-form-heading");
    const authDescription = document.querySelector("#auth-form-description");
    const logoutButton = document.querySelector("#student-logout-button");
    const logoutNote = document.querySelector("#logout-note");

    function getClient() {
        const client = window.supabaseClient;
        if (!client || !client.auth) {
            throw new Error("Supabase is unavailable. Check the client configuration and reload this page.");
        }
        return client;
    }

    function setStatus(message, type) {
        if (!authStatus) {
            return;
        }
        authStatus.textContent = message;
        authStatus.className = "student-auth-status is-" + type;
        authStatus.setAttribute("role", type === "error" ? "alert" : "status");
        authStatus.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
        authStatus.hidden = false;
    }

    function clearStatus() {
        if (!authStatus) {
            return;
        }
        authStatus.textContent = "";
        authStatus.className = "student-auth-status";
        authStatus.setAttribute("role", "status");
        authStatus.setAttribute("aria-live", "polite");
        authStatus.hidden = true;
    }

    function errorMessage(error) {
        const message = error && typeof error.message === "string" ? error.message : "";
        if (/email not confirmed/i.test(message)) {
            return "Please confirm your email before signing in. Check your inbox and spam folder.";
        }
        if (/invalid login credentials/i.test(message)) {
            return "Email or password is incorrect. Check your details and try again.";
        }
        return message || "The request could not be completed. Please try again.";
    }

    function setMode(mode) {
        if (!loginForm || !registerForm) {
            return;
        }
        const registering = mode === "register";
        loginForm.hidden = registering;
        registerForm.hidden = !registering;
        authHeading.textContent = registering ? "Create your account" : "Student Login";
        authDescription.textContent = registering
            ? "Register with your email address. You will need to confirm it before signing in."
            : "Welcome back. Enter your account details to continue.";
        modeButtons.forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                String(button.dataset.authMode === mode)
            );
        });
        clearStatus();
    }

    function setBusy(form, busy, busyLabel) {
        const button = form.querySelector('button[type="submit"]');
        const label = button.querySelector("[data-submit-label]");
        const spinner = button.querySelector(".student-auth-spinner");

        button.disabled = busy;
        button.setAttribute("aria-busy", String(busy));
        label.textContent = busy ? busyLabel : label.dataset.readyText;
        spinner.hidden = !busy;
        modeButtons.forEach((modeButton) => {
            modeButton.disabled = busy;
        });
    }

    async function runFormAction(form, busyLabel, action) {
        clearStatus();
        setBusy(form, true, busyLabel);
        try {
            await action();
        } catch (error) {
            console.error("Student authentication request failed.", error);
            setStatus(errorMessage(error), "error");
        } finally {
            setBusy(form, false, busyLabel);
        }
    }

    async function findOwnProfile(client, userId) {
        const { data, error } = await client
            .from("profiles")
            .select("id")
            .eq("id", userId)
            .maybeSingle();
        if (error) {
            throw error;
        }
        return data;
    }

    async function ensureOwnProfile(client, userId) {
        const existingProfile = await findOwnProfile(client, userId);
        if (existingProfile) {
            return;
        }

        const { error } = await client.from("profiles").insert({ id: userId });
        if (!error) {
            return;
        }

        if (error.code === "23505") {
            const profileAfterRace = await findOwnProfile(client, userId);
            if (profileAfterRace) {
                return;
            }
        }
        throw error;
    }

    async function signIn(event) {
        event.preventDefault();
        if (!loginForm.reportValidity()) {
            return;
        }

        const email = loginForm.elements.email.value.trim();
        const password = loginForm.elements.password.value;
        await runFormAction(loginForm, "Signing in...", async () => {
            const client = getClient();
            const { data, error } = await client.auth.signInWithPassword({
                email,
                password
            });
            if (error) {
                throw error;
            }
            if (!data.session || !data.user) {
                throw new Error("No signed-in session was returned. If you just registered, confirm your email and try again.");
            }

            const { data: userData, error: userError } = await client.auth.getUser();
            if (userError || !userData.user) {
                const { error: signOutError } = await client.auth.signOut();
                if (signOutError) {
                    console.error("Could not clear the unverified sign-in session.", signOutError);
                }
                throw userError || new Error("Supabase did not return the authenticated user.");
            }

            try {
                await ensureOwnProfile(client, userData.user.id);
            } catch (profileError) {
                const { error: signOutError } = await client.auth.signOut();
                if (signOutError) {
                    console.error("Could not clear the session after profile setup failed.", signOutError);
                }
                const detail = profileError && profileError.message
                    ? " Details: " + profileError.message
                    : "";
                throw new Error(
                    "Your sign-in succeeded, but your own profile could not be verified or created. Check that public.profiles has an id column and that its own-user SELECT and INSERT policies are active." +
                    detail
                );
            }

            setStatus("Sign-in successful. Opening your student dashboard...", "success");
            window.location.assign("dashboard.html");
        });
    }

    async function register(event) {
        event.preventDefault();
        if (!registerForm.reportValidity()) {
            return;
        }

        const email = registerForm.elements.email.value.trim();
        const password = registerForm.elements.password.value;
        const passwordConfirm = registerForm.elements["password-confirm"].value;
        if (password !== passwordConfirm) {
            setStatus("The passwords do not match. Please check both password fields.", "error");
            registerForm.elements["password-confirm"].focus();
            return;
        }

        await runFormAction(registerForm, "Creating account...", async () => {
            const client = getClient();
            const { error } = await client.auth.signUp({ email, password });
            if (error) {
                throw error;
            }

            registerForm.reset();
            setMode("login");
            setStatus(
                "Registration request submitted. Check your email, including the spam folder, and confirm your account before signing in.",
                "success"
            );
        });
    }

    function attachPasswordToggles() {
        document.querySelectorAll("[data-password-toggle]").forEach((button) => {
            button.addEventListener("click", () => {
                const input = document.getElementById(button.dataset.passwordToggle);
                const showPassword = input.type === "password";
                input.type = showPassword ? "text" : "password";
                button.textContent = showPassword ? "Hide" : "Show";
                button.setAttribute("aria-pressed", String(showPassword));
                button.setAttribute(
                    "aria-label",
                    (showPassword ? "Hide " : "Show ") +
                    input.labels[0].textContent.toLowerCase()
                );
            });
        });
    }

    function initializeAuthForms() {
        if (!loginForm || !registerForm || !authStatus) {
            return;
        }

        modeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                setMode(button.dataset.authMode);
            });
        });
        loginForm.addEventListener("submit", signIn);
        registerForm.addEventListener("submit", register);
        [loginForm, registerForm].forEach((form) => {
            form.addEventListener("input", clearStatus);
        });
        attachPasswordToggles();
    }

    async function initializeLogout() {
        if (!logoutButton || !logoutNote) {
            return;
        }

        try {
            const client = getClient();
            const { data, error } = await client.auth.getSession();
            if (error) {
                throw error;
            }

            logoutButton.disabled = !data.session;
            logoutNote.textContent = data.session
                ? "You are signed in. Use this button to securely end your session."
                : "Sign in to enable sign-out.";

            logoutButton.addEventListener("click", async () => {
                logoutButton.disabled = true;
                logoutNote.textContent = "Signing out...";
                const { error: signOutError } = await client.auth.signOut();
                if (signOutError) {
                    console.error("Student sign-out failed.", signOutError);
                    logoutNote.textContent = "Could not sign out. Please try again.";
                    logoutButton.disabled = false;
                    return;
                }
                window.location.assign("login.html");
            });
        } catch (error) {
            console.error("Could not check the student session.", error);
            logoutButton.disabled = true;
            logoutNote.textContent = "Session status is unavailable. Reload the page and try again.";
        }
    }

    initializeAuthForms();
    initializeLogout();
})();
