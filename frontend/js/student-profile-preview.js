(() => {
    const form = document.querySelector("#student-profile-form");
    const photoInput = document.querySelector("#profile-photo");
    const photoPreview = document.querySelector("#profile-photo-preview");
    const livePhoto = document.querySelector("#profile-live-photo");
    const avatarFallback = document.querySelector("#profile-avatar-fallback");
    const liveFallback = document.querySelector("#profile-live-fallback");
    const removePhotoButton = document.querySelector("#remove-profile-photo");
    const photoMessage = document.querySelector("#profile-photo-message");
    const saveStatus = document.querySelector("#profile-save-status");
    const saveButton = document.querySelector("#save-profile-button");
    const saveLabel = saveButton.querySelector(".profile-save-label");
    const saveSpinner = saveButton.querySelector(".profile-save-spinner");
    const liveIndicator = document.querySelector("#profile-live-state");
    const fullNameInput = document.querySelector("#profile-full-name");
    const displayNameInput = document.querySelector("#profile-display-name");
    const schoolInput = document.querySelector("#profile-school");
    const gradeInput = document.querySelector("#profile-grade");
    const aboutInput = document.querySelector("#profile-about");
    const storageBucketName = "student-avatars";
    const maxPhotoBytes = 5 * 1024 * 1024;
    const mimeTypesByExtension = new Map([
        ["jpg", "image/jpeg"],
        ["jpeg", "image/jpeg"],
        ["png", "image/png"],
        ["webp", "image/webp"]
    ]);
    const signedUrlExpirySeconds = 60 * 60;
    const profileColumns = "id, full_name, display_name, school, grade, bio, avatar_url, updated_at";
    let userId = "";
    let profileExists = false;
    let savedProfile = {
        full_name: "",
        display_name: "",
        school: "",
        grade: "",
        bio: "",
        avatar_url: null
    };
    let currentAvatarPath = "";
    let currentSignedAvatarUrl = "";
    let activePhotoUrl = "";
    let pendingPhotoFile = null;
    let removeAvatarRequested = false;

    function setSaveStatus(message, type) {
        saveStatus.textContent = message;
        saveStatus.hidden = false;
        saveStatus.classList.toggle("is-error", type === "error");
        saveStatus.classList.toggle("is-success", type === "success");
        saveStatus.setAttribute("role", type === "error" ? "alert" : "status");
        saveStatus.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
    }

    function setPhotoMessage(message, isError) {
        photoMessage.textContent = message;
        photoMessage.classList.toggle("is-error", isError);
    }

    function isOwnStoragePath(path, ownerId) {
        if (typeof path !== "string" || !path || path.includes("\\")) {
            return false;
        }
        const segments = path.split("/");
        return segments.length === 2 &&
            segments[0] === ownerId &&
            segments[1] !== "" &&
            segments[1] !== "." &&
            segments[1] !== "..";
    }

    function safeSignedAvatarUrl(value) {
        if (typeof value !== "string" || !value.trim()) {
            return "";
        }
        try {
            const parsed = new URL(value, window.location.href);
            if (parsed.protocol === "https:" || parsed.origin === window.location.origin) {
                return parsed.href;
            }
        } catch (error) {
            console.error("Could not parse the signed profile photo URL.", error);
        }
        return "";
    }

    async function createSignedAvatarUrl(client, path, ownerId) {
        if (!isOwnStoragePath(path, ownerId)) {
            throw new Error("The saved photo path is not inside your own storage folder.");
        }
        const { data, error } = await client.storage
            .from(storageBucketName)
            .createSignedUrl(path, signedUrlExpirySeconds);
        if (error) {
            throw error;
        }
        const signedUrl = safeSignedAvatarUrl(data && data.signedUrl);
        if (!signedUrl) {
            throw new Error("Supabase did not return a valid signed URL for your private photo.");
        }
        return signedUrl;
    }

    function setPhotoElements(url) {
        if (url) {
            photoPreview.src = url;
            livePhoto.src = url;
            photoPreview.hidden = false;
            livePhoto.hidden = false;
            avatarFallback.hidden = true;
            liveFallback.hidden = true;
            return;
        }

        photoPreview.removeAttribute("src");
        livePhoto.removeAttribute("src");
        photoPreview.hidden = true;
        livePhoto.hidden = true;
        avatarFallback.hidden = false;
        liveFallback.hidden = false;
    }

    function releaseActivePhotoUrl() {
        if (activePhotoUrl) {
            URL.revokeObjectURL(activePhotoUrl);
            activePhotoUrl = "";
        }
    }

    function renderCurrentAvatar() {
        if (removeAvatarRequested) {
            setPhotoElements("");
            return;
        }
        if (activePhotoUrl) {
            setPhotoElements(activePhotoUrl);
            return;
        }
        setPhotoElements(currentSignedAvatarUrl);
    }

    function updateTextPreview() {
        const fullName = fullNameInput.value.trim();
        const displayName = displayNameInput.value.trim();
        document.querySelector("#profile-preview-name").textContent =
            displayName || fullName || "Your display name";
        document.querySelector("#profile-preview-full-name").textContent =
            fullName || "Full name not added";
        document.querySelector("#profile-preview-school").textContent =
            schoolInput.value.trim() || "Not provided";
        document.querySelector("#profile-preview-grade").textContent =
            gradeInput.value.trim() || "Not provided";
        document.querySelector("#profile-preview-about").textContent =
            aboutInput.value.trim() || "Your short introduction will appear here.";
    }

    function setProfileIndicator(text) {
        liveIndicator.textContent = text;
    }

    function setEditorDisabled(disabled) {
        Array.from(form.elements).forEach((control) => {
            control.disabled = disabled;
        });
        saveButton.setAttribute("aria-busy", String(disabled));
        if (!disabled) {
            updatePhotoControls();
        }
    }

    function setSavingState(saving) {
        saveLabel.textContent = saving ? "Saving..." : "Save profile";
        saveSpinner.hidden = !saving;
    }

    function updatePhotoControls() {
        removePhotoButton.disabled =
            removeAvatarRequested || (!currentAvatarPath && !pendingPhotoFile);
    }

    function clearUnsavedStatus() {
        setSaveStatus("Unsaved changes stay on this page until you save them.", "status");
        setProfileIndicator("UNSAVED CHANGES");
    }

    function discardPendingPhoto() {
        releaseActivePhotoUrl();
        pendingPhotoFile = null;
        photoInput.value = "";
    }

    function populateProfile(profile, signedAvatarUrl) {
        const data = profile || {};
        savedProfile = {
            full_name: data.full_name || "",
            display_name: data.display_name || "",
            school: data.school || "",
            grade: data.grade || "",
            bio: data.bio || "",
            avatar_url: data.avatar_url || null
        };
        profileExists = Boolean(profile);
        currentAvatarPath = savedProfile.avatar_url || "";
        currentSignedAvatarUrl = signedAvatarUrl || "";
        fullNameInput.value = savedProfile.full_name;
        displayNameInput.value = savedProfile.display_name;
        schoolInput.value = savedProfile.school;
        gradeInput.value = savedProfile.grade;
        aboutInput.value = savedProfile.bio;
        removeAvatarRequested = false;
        discardPendingPhoto();
        renderCurrentAvatar();
        updateTextPreview();
        updatePhotoControls();
        setProfileIndicator(profileExists ? "PROFILE LOADED" : "NEW PROFILE");
    }

    async function loadProfile(client, authenticatedUserId, requireProfile) {
        const { data, error } = await client
            .from("profiles")
            .select(profileColumns)
            .eq("id", authenticatedUserId)
            .maybeSingle();
        if (error) {
            throw error;
        }
        if (requireProfile && (!data || data.id !== authenticatedUserId)) {
            throw new Error("Supabase did not return the saved profile for the signed-in user.");
        }
        let signedAvatarUrl = "";
        let photoLoadError = null;
        if (data && data.avatar_url) {
            try {
                signedAvatarUrl = await createSignedAvatarUrl(
                    client,
                    data.avatar_url,
                    authenticatedUserId
                );
            } catch (avatarError) {
                photoLoadError = avatarError;
                console.error("Could not load the authenticated student's private profile photo.", avatarError);
            }
        }
        populateProfile(data, signedAvatarUrl);
        if (photoLoadError) {
            setPhotoMessage(
                "The saved photo could not be loaded: " +
                (photoLoadError.message || "Supabase could not create a signed URL."),
                true
            );
        } else {
            setPhotoMessage(data && data.avatar_url ? "Private profile photo loaded." : "", false);
        }
        return data;
    }

    async function initializeProfile() {
        setEditorDisabled(true);
        setProfileIndicator("LOADING");
        setSaveStatus("Checking your account and loading your profile...", "status");

        const client = window.supabaseClient;
        if (!client || !client.auth) {
            setSaveStatus("Supabase is unavailable. Check the client configuration and reload this page.", "error");
            setProfileIndicator("UNAVAILABLE");
            return;
        }

        try {
            const { data: sessionData, error: sessionError } = await client.auth.getSession();
            if (sessionError) {
                throw sessionError;
            }
            if (!sessionData.session) {
                window.location.replace("login.html");
                return;
            }

            const { data: userData, error: userError } = await client.auth.getUser();
            if (userError) {
                if (userError.status === 401) {
                    window.location.replace("login.html");
                    return;
                }
                throw userError;
            }
            if (!userData.user) {
                window.location.replace("login.html");
                return;
            }

            userId = userData.user.id;
            await loadProfile(client, userId);
            setEditorDisabled(false);
            setSaveStatus(
                profileExists
                    ? "Your saved profile is loaded. Changes are private to your account."
                    : "No profile row exists yet. Save your details to create your private profile.",
                "status"
            );
        } catch (error) {
            console.error("Could not load the authenticated student's profile.", error);
            setProfileIndicator("UNAVAILABLE");
            setSaveStatus(
                "Could not load your profile. Check your connection and the profiles table permissions, then reload. " +
                (error.message || ""),
                "error"
            );
        }
    }

    async function insertOwnProfile(client, payload) {
        await verifyAuthenticatedUser(client);
        const { data, error } = await client
            .from("profiles")
            .insert({ id: userId, ...payload })
            .select(profileColumns)
            .single();
        if (error && error.code === "23505") {
            return updateOwnProfile(client, payload);
        }
        if (error) {
            throw error;
        }
        return data;
    }

    async function updateOwnProfile(client, payload) {
        await verifyAuthenticatedUser(client);
        const { data, error } = await client
            .from("profiles")
            .update(payload)
            .eq("id", userId)
            .select(profileColumns)
            .single();
        if (error) {
            throw error;
        }
        return data;
    }

    async function verifyAuthenticatedUser(client) {
        if (!client || !client.auth) {
            throw new Error("Supabase authentication is unavailable. Sign in again before saving.");
        }
        const { data, error } = await client.auth.getUser();
        if (error) {
            throw error;
        }
        if (!data || !data.user || !data.user.id) {
            throw new Error("Your Supabase session is missing or invalid. Sign in again before saving.");
        }
        if (data.user.id !== userId) {
            throw new Error("The signed-in account does not match this profile. Reload the page before saving.");
        }
    }

    function errorDetails(error) {
        const details = [];
        if (error && error.code) {
            details.push("code " + error.code);
        }
        if (error && error.message) {
            details.push(error.message);
        }
        if (error && error.details) {
            details.push(error.details);
        }
        if (error && error.hint) {
            details.push(error.hint);
        }
        return details.join(" — ") || "Please try again.";
    }

    function saveErrorMessage(error, writeConfirmed) {
        const prefix = writeConfirmed
            ? "Supabase accepted the profile write, but the saved profile could not be fully verified."
            : "Supabase could not save your profile.";
        return prefix + " " + errorDetails(error);
    }

    function createAvatarStoragePath(file) {
        const extension = file.name.split(".").pop().toLowerCase();
        const contentType = mimeTypesByExtension.get(extension);
        if (!contentType || (file.type && file.type.toLowerCase() !== contentType)) {
            throw new Error("Choose a JPG, JPEG, PNG or WebP image with a matching file type.");
        }
        if (file.size === 0 || file.size > maxPhotoBytes) {
            throw new Error("Choose an image larger than 0 bytes and no larger than 5 MB.");
        }
        if (!window.crypto || typeof window.crypto.randomUUID !== "function") {
            throw new Error("This browser cannot create a secure unique photo filename. Update your browser and try again.");
        }
        return {
            path: userId + "/" + window.crypto.randomUUID() + "." + extension,
            contentType
        };
    }

    async function hasValidImageSignature(file, contentType) {
        const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
        if (contentType === "image/jpeg") {
            return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
        }
        if (contentType === "image/png") {
            return header[0] === 0x89 &&
                header[1] === 0x50 &&
                header[2] === 0x4e &&
                header[3] === 0x47 &&
                header[4] === 0x0d &&
                header[5] === 0x0a &&
                header[6] === 0x1a &&
                header[7] === 0x0a;
        }
        if (contentType === "image/webp") {
            return String.fromCharCode(...header.slice(0, 4)) === "RIFF" &&
                String.fromCharCode(...header.slice(8, 12)) === "WEBP";
        }
        return false;
    }

    async function removeOwnAvatar(client, path) {
        if (!isOwnStoragePath(path, userId)) {
            throw new Error("Refusing to delete a photo outside your own storage folder.");
        }
        const { error } = await client.storage
            .from(storageBucketName)
            .remove([path]);
        if (error) {
            throw error;
        }
    }

    async function cleanupUnreferencedUpload(client, path) {
        const { data, error } = await client
            .from("profiles")
            .select("avatar_url")
            .eq("id", userId)
            .maybeSingle();
        if (error) {
            throw error;
        }
        if (data && data.avatar_url === path) {
            return false;
        }
        await removeOwnAvatar(client, path);
        return true;
    }

    async function saveProfile(event) {
        event.preventDefault();
        if (!userId) {
            setSaveStatus("Your account could not be verified. Sign in again before saving.", "error");
            setProfileIndicator("SAVE BLOCKED");
            return;
        }

        setEditorDisabled(true);
        setSavingState(true);
        setSaveStatus("Saving your profile...", "status");
        setProfileIndicator("SAVING");

        const client = window.supabaseClient;
        const previousAvatarPath = currentAvatarPath;
        let targetAvatarPath = removeAvatarRequested ? null : currentAvatarPath || null;
        let uploadedPath = "";
        let uploadConfirmed = false;
        let writeConfirmed = false;

        try {
            await verifyAuthenticatedUser(client);
            if (pendingPhotoFile) {
                const file = pendingPhotoFile;
                const avatar = createAvatarStoragePath(file);
                if (!await hasValidImageSignature(file, avatar.contentType)) {
                    throw new Error("The selected file contents do not match a supported image format.");
                }
                const { data: uploadData, error: uploadError } = await client.storage
                    .from(storageBucketName)
                    .upload(avatar.path, file, {
                        cacheControl: "3600",
                        contentType: avatar.contentType,
                        upsert: false
                    });
                if (uploadError) {
                    throw uploadError;
                }
                uploadedPath = avatar.path;
                uploadConfirmed = true;
                if (!uploadData || uploadData.path !== avatar.path) {
                    throw new Error("Supabase did not confirm the uploaded photo path.");
                }
                targetAvatarPath = avatar.path;
            }

            const payload = {
                full_name: fullNameInput.value.trim() || null,
                display_name: displayNameInput.value.trim() || null,
                school: schoolInput.value.trim() || null,
                grade: gradeInput.value.trim() || null,
                bio: aboutInput.value.trim() || null,
                avatar_url: targetAvatarPath,
                updated_at: new Date().toISOString()
            };
            const saved = profileExists
                ? await updateOwnProfile(client, payload)
                : await insertOwnProfile(client, payload);
            if (!saved || saved.id !== userId) {
                throw new Error("Supabase did not confirm the write for the signed-in user's profile.");
            }
            writeConfirmed = true;
            if ((saved.avatar_url || null) !== targetAvatarPath) {
                throw new Error("The saved profile row did not contain the expected private photo path.");
            }
            const reloaded = await loadProfile(client, userId, true);
            if (!reloaded || (reloaded.avatar_url || null) !== targetAvatarPath) {
                throw new Error("The profile reload did not confirm the saved private photo path.");
            }

            let cleanupWarning = "";
            if (previousAvatarPath && previousAvatarPath !== targetAvatarPath) {
                if (isOwnStoragePath(previousAvatarPath, userId)) {
                    try {
                        await removeOwnAvatar(client, previousAvatarPath);
                    } catch (cleanupError) {
                        console.error("The previous private profile photo could not be removed.", cleanupError);
                        cleanupWarning = " Your profile is saved, but the previous photo could not be deleted from Storage: " +
                            errorDetails(cleanupError);
                    }
                } else {
                    cleanupWarning = " Your profile is saved, but the previous photo was not deleted because its path is outside your own storage folder.";
                }
            }

            if (cleanupWarning) {
                setProfileIndicator("SAVED · CLEANUP NEEDED");
                setSaveStatus("Profile saved and verified." + cleanupWarning, "error");
            } else {
                setProfileIndicator("PROFILE SAVED");
                setSaveStatus("Profile Saved Successfully", "success");
            }
        } catch (error) {
            console.error("Could not save the authenticated student's profile.", error);
            let cleanupNote = "";
            if (uploadConfirmed && uploadedPath && !writeConfirmed) {
                try {
                    const removed = await cleanupUnreferencedUpload(client, uploadedPath);
                    cleanupNote = removed
                        ? " The unreferenced upload was removed."
                        : " The profile row references the uploaded photo, so it was retained.";
                } catch (cleanupError) {
                    console.error("Could not safely clean up the unreferenced profile photo upload.", cleanupError);
                    cleanupNote = " The upload could not be safely cleaned up: " + errorDetails(cleanupError);
                }
            }
            setProfileIndicator(writeConfirmed ? "VERIFY SAVE" : "SAVE FAILED");
            setSaveStatus(saveErrorMessage(error, writeConfirmed) + cleanupNote, "error");
        } finally {
            setSavingState(false);
            setEditorDisabled(false);
        }
    }

    function handlePhotoError(event) {
        const failedUrl = event.currentTarget.currentSrc || event.currentTarget.src;
        if (activePhotoUrl && failedUrl === activePhotoUrl) {
            discardPendingPhoto();
            removeAvatarRequested = false;
            renderCurrentAvatar();
            updatePhotoControls();
            setPhotoMessage("The selected file could not be decoded as an image.", true);
            setSaveStatus("Choose a valid JPG, JPEG, PNG or WebP image. Nothing was uploaded.", "error");
            return;
        }

        if (currentSignedAvatarUrl && failedUrl === currentSignedAvatarUrl) {
            currentSignedAvatarUrl = "";
            setPhotoElements("");
            setPhotoMessage("The private profile photo could not be loaded. Its storage path is unchanged.", true);
        }
    }

    form.addEventListener("input", () => {
        updateTextPreview();
        clearUnsavedStatus();
    });
    form.addEventListener("change", () => {
        updateTextPreview();
        clearUnsavedStatus();
    });

    photoInput.addEventListener("change", () => {
        const file = photoInput.files[0];
        if (!file) {
            return;
        }

        const extension = file.name.split(".").pop().toLowerCase();
        const expectedMimeType = mimeTypesByExtension.get(extension);
        if (!expectedMimeType || (file.type && file.type.toLowerCase() !== expectedMimeType)) {
            discardPendingPhoto();
            removeAvatarRequested = false;
            renderCurrentAvatar();
            updatePhotoControls();
            setPhotoMessage("Choose a JPG, JPEG, PNG or WebP image.", true);
            return;
        }

        if (file.size === 0 || file.size > maxPhotoBytes) {
            discardPendingPhoto();
            removeAvatarRequested = false;
            renderCurrentAvatar();
            updatePhotoControls();
            setPhotoMessage("Choose an image larger than 0 bytes and no larger than 5 MB.", true);
            return;
        }

        discardPendingPhoto();
        try {
            activePhotoUrl = URL.createObjectURL(file);
        } catch (error) {
            photoInput.value = "";
            renderCurrentAvatar();
            setPhotoMessage("The browser couldn't preview this image. Try another file.", true);
            console.error("Could not create a local profile photo preview.", error);
            return;
        }

        pendingPhotoFile = file;
        removeAvatarRequested = false;
        setPhotoElements(activePhotoUrl);
        updatePhotoControls();
        setPhotoMessage("Photo preview ready. Save your profile to upload it privately.", false);
        clearUnsavedStatus();
    });

    photoPreview.addEventListener("error", handlePhotoError);
    livePhoto.addEventListener("error", handlePhotoError);

    removePhotoButton.addEventListener("click", () => {
        const cancelingNewPhoto = Boolean(pendingPhotoFile);
        discardPendingPhoto();
        removeAvatarRequested = !cancelingNewPhoto && Boolean(currentAvatarPath);
        renderCurrentAvatar();
        updatePhotoControls();
        setPhotoMessage(
            removeAvatarRequested
                ? "Photo removal will be saved with your profile."
                : "Default avatar selected.",
            false
        );
        clearUnsavedStatus();
    });

    form.addEventListener("reset", () => {
        window.setTimeout(() => {
            if (!userId) {
                return;
            }
            populateProfile(profileExists ? savedProfile : null, currentSignedAvatarUrl);
            setPhotoMessage("Unsaved changes were discarded.", false);
            setSaveStatus("Your saved profile values have been restored.", "status");
        }, 0);
    });

    form.addEventListener("submit", saveProfile);
    window.addEventListener("pagehide", releaseActivePhotoUrl);
    initializeProfile();
})();
