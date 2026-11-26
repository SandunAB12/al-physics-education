(() => {
    const progressSection = document.querySelector("#my-progress");
    if (!progressSection) {
        return;
    }

    // Verified topic counts inspected from frontend/<slug>.html (Phase 1 inspection).
    const LESSONS = [
        { slug: "measurement", number: "01", nameKey: "progressUnitName1", topicCount: 6 },
        { slug: "mechanics", number: "02", nameKey: "progressUnitName2", topicCount: 6 },
        { slug: "oscillations-waves", number: "03", nameKey: "progressUnitName3", topicCount: 6 },
        { slug: "thermal-physics", number: "04", nameKey: "progressUnitName4", topicCount: 6 },
        { slug: "gravitational-field", number: "05", nameKey: "progressUnitName5", topicCount: 6 },
        { slug: "electrostatic-field", number: "06", nameKey: "progressUnitName6", topicCount: 6 },
        { slug: "magnetic-field", number: "07", nameKey: "progressUnitName7", topicCount: 6 },
        { slug: "current-electricity", number: "08", nameKey: "progressUnitName8", topicCount: 6 },
        { slug: "electronics", number: "09", nameKey: "progressUnitName9", topicCount: 6 },
        { slug: "mechanical-properties", number: "10", nameKey: "progressUnitName10", topicCount: 6 },
        { slug: "matter-radiation", number: "11", nameKey: "progressUnitName11", topicCount: 6 }
    ];
    const LESSON_BY_SLUG = new Map(LESSONS.map((lesson) => [lesson.slug, lesson]));
    const RING_CIRCUMFERENCE = 2 * Math.PI * 50;

    const elements = {
        syncBadge: document.querySelector("#progress-sync-badge"),
        ringFill: document.querySelector("#progress-ring-fill"),
        overallPercent: document.querySelector("#progress-overall-percent"),
        overallHeadline: document.querySelector("#progress-overall-headline"),
        overallSummary: document.querySelector("#progress-overall-summary"),
        unitsCompleted: document.querySelector("#progress-units-completed"),
        totalUnits: document.querySelector("#progress-total-units"),
        unitsInProgress: document.querySelector("#progress-units-in-progress"),
        topicsCompleted: document.querySelector("#progress-topics-completed"),
        totalTopics: document.querySelector("#progress-total-topics"),
        nextLink: document.querySelector("#progress-next-link"),
        nextLabel: document.querySelector("#progress-next-label"),
        goalHeading: document.querySelector("#study-goal-heading"),
        goalSubtitle: document.querySelector("#study-goal-subtitle"),
        goalToggle: document.querySelector("#toggle-goal-form"),
        goalMeters: document.querySelector("#study-goal-meters"),
        goalLessonsBlock: document.querySelector("#goal-lessons-block"),
        goalLessonsRatio: document.querySelector("#goal-lessons-ratio"),
        goalLessonsBar: document.querySelector("#goal-lessons-bar"),
        goalMcqBlock: document.querySelector("#goal-mcq-block"),
        goalMcqRatio: document.querySelector("#goal-mcq-ratio"),
        goalMcqBar: document.querySelector("#goal-mcq-bar"),
        goalTags: document.querySelector("#study-goal-tags"),
        goalForm: document.querySelector("#study-goal-form"),
        goalWeeklyInput: document.querySelector("#goal-weekly-lessons"),
        goalDailyMcqInput: document.querySelector("#goal-daily-mcq"),
        goalExamYearInput: document.querySelector("#goal-exam-year"),
        goalFocusUnitSelect: document.querySelector("#goal-focus-unit"),
        goalNoteInput: document.querySelector("#goal-study-note"),
        saveGoalButton: document.querySelector("#save-goal-button"),
        cancelGoalButton: document.querySelector("#cancel-goal-button"),
        goalStatus: document.querySelector("#study-goal-status"),
        filterButtons: Array.from(document.querySelectorAll("[data-progress-filter]")),
        masteryList: document.querySelector("#unit-mastery-list"),
        masteryEmpty: document.querySelector("#unit-mastery-empty"),
        mcqBadge: document.querySelector("#mcq-status-badge"),
        mcqEmptyState: document.querySelector("#mcq-empty-state"),
        mcqStatsView: document.querySelector("#mcq-stats-view"),
        mcqAttemptsCount: document.querySelector("#mcq-attempts-count"),
        mcqQuestionsCount: document.querySelector("#mcq-questions-count"),
        mcqAccuracyValue: document.querySelector("#mcq-accuracy-value"),
        mcqFocusSummary: document.querySelector("#mcq-focus-summary"),
        historyBadge: document.querySelector("#history-count-badge"),
        historyEmptyState: document.querySelector("#history-empty-state"),
        historyTimeline: document.querySelector("#history-timeline")
    };

    const state = {
        userId: "",
        activeFilter: "all",
        tablesMissing: false,
        loadFailed: false,
        lessonProgress: new Map(),
        mcqAttempts: [],
        studyActivity: [],
        studyGoal: null
    };

    function t(key, vars) {
        let text = typeof window.dashboardI18n === "function" ? window.dashboardI18n(key) : key;
        if (vars && typeof text === "string") {
            Object.keys(vars).forEach((name) => {
                text = text.replaceAll("{" + name + "}", String(vars[name]));
            });
        }
        return text;
    }

    function getUnitName(slug) {
        const lesson = LESSON_BY_SLUG.get(slug);
        return lesson ? t(lesson.nameKey) : slug;
    }

    function isMissingTableError(error) {
        if (!error) {
            return false;
        }
        const code = String(error.code || "");
        const message = String(error.message || "");
        return code === "42P01" ||
            code === "PGRST205" ||
            /does not exist|schema cache|404/i.test(message);
    }

    function setGoalFormStatus(message, isError) {
        if (!elements.goalStatus) {
            return;
        }
        if (!message) {
            elements.goalStatus.hidden = true;
            elements.goalStatus.textContent = "";
            elements.goalStatus.classList.remove("is-error");
            return;
        }
        elements.goalStatus.textContent = message;
        elements.goalStatus.classList.toggle("is-error", Boolean(isError));
        elements.goalStatus.setAttribute("role", isError ? "alert" : "status");
        elements.goalStatus.hidden = false;
    }

    function populateFocusUnitOptions() {
        if (!elements.goalFocusUnitSelect) {
            return;
        }
        const selected = elements.goalFocusUnitSelect.value;
        const placeholderOption = elements.goalFocusUnitSelect.querySelector('option[value=""]');
        elements.goalFocusUnitSelect.replaceChildren();
        if (placeholderOption) {
            placeholderOption.textContent = t("progressGoalFocusUnitNone");
            elements.goalFocusUnitSelect.append(placeholderOption);
        } else {
            const noneOption = document.createElement("option");
            noneOption.value = "";
            noneOption.textContent = t("progressGoalFocusUnitNone");
            elements.goalFocusUnitSelect.append(noneOption);
        }
        LESSONS.forEach((lesson) => {
            const option = document.createElement("option");
            option.value = lesson.slug;
            option.textContent = lesson.number + " · " + t(lesson.nameKey);
            elements.goalFocusUnitSelect.append(option);
        });
        elements.goalFocusUnitSelect.value = LESSON_BY_SLUG.has(selected) ? selected : "";
    }

    function computeMcqByUnit() {
        const stats = new Map();
        state.mcqAttempts.forEach((attempt) => {
            if (!LESSON_BY_SLUG.has(attempt.unit_slug)) {
                return;
            }
            const current = stats.get(attempt.unit_slug) || {
                attempts: 0,
                questions: 0,
                correct: 0
            };
            current.attempts += 1;
            current.questions += Number(attempt.questions_total) || 0;
            current.correct += Number(attempt.correct_answers) || 0;
            stats.set(attempt.unit_slug, current);
        });
        return stats;
    }

    function getUnitMetrics(lesson) {
        const row = state.lessonProgress.get(lesson.slug);
        const totalTopics = row && Number(row.total_topics) > 0
            ? Number(row.total_topics)
            : lesson.topicCount;
        const completedList = row && Array.isArray(row.completed_topics)
            ? row.completed_topics
            : [];
        const completedCount = Math.min(completedList.length, totalTopics);
        let status = "not_started";
        if (row && (row.status === "completed" || completedCount >= totalTopics)) {
            status = "completed";
        } else if (row && (row.status === "in_progress" || completedCount > 0 || row.last_studied_at)) {
            status = "in_progress";
        }
        return {
            lesson,
            status,
            completedCount,
            totalTopics,
            percent: totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0,
            lastStudiedAt: row ? row.last_studied_at : null
        };
    }

    function renderSyncBadge() {
        if (!elements.syncBadge) {
            return;
        }
        if (state.tablesMissing) {
            elements.syncBadge.textContent = t("progressStatusSetupNeeded");
            return;
        }
        if (state.loadFailed) {
            elements.syncBadge.textContent = t("progressStatusUnavailable");
            return;
        }
        elements.syncBadge.textContent = t("progressStatusSynced");
    }

    function renderOverallProgress() {
        const allMetrics = LESSONS.map(getUnitMetrics);
        const totalUnits = LESSONS.length;
        const totalTopics = allMetrics.reduce((sum, item) => sum + item.totalTopics, 0);
        const completedUnits = allMetrics.filter((item) => item.status === "completed").length;
        const inProgressUnits = allMetrics.filter((item) => item.status === "in_progress").length;
        const topicsMastered = allMetrics.reduce((sum, item) => sum + item.completedCount, 0);
        const hasActivity = completedUnits > 0 || inProgressUnits > 0 || topicsMastered > 0;
        const percent = totalTopics > 0 ? Math.round((topicsMastered / totalTopics) * 100) : 0;

        elements.unitsCompleted.textContent = String(completedUnits);
        elements.totalUnits.textContent = String(totalUnits);
        elements.unitsInProgress.textContent = String(inProgressUnits);
        elements.topicsCompleted.textContent = String(topicsMastered);
        elements.totalTopics.textContent = String(totalTopics);

        if (hasActivity) {
            elements.overallPercent.textContent = percent + "%";
            elements.ringFill.style.strokeDashoffset = String(
                RING_CIRCUMFERENCE * (1 - percent / 100)
            );
            elements.overallHeadline.textContent = t("progressOverallActiveHeadline", { percent });
            elements.overallSummary.textContent = t("progressOverallActiveSummary", {
                completed: completedUnits,
                totalUnits,
                topics: topicsMastered,
                totalTopics
            });
        } else {
            elements.overallPercent.textContent = "—";
            elements.ringFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
            elements.overallHeadline.textContent = t("progressOverallEmptyHeadline");
            elements.overallSummary.textContent = state.tablesMissing
                ? t("progressSetupSummary")
                : t("progressOverallEmptySummary");
        }

        const inProgressSorted = allMetrics
            .filter((item) => item.status === "in_progress")
            .sort((a, b) => new Date(b.lastStudiedAt || 0) - new Date(a.lastStudiedAt || 0));
        const nextUnit = inProgressSorted[0] ||
            allMetrics.find((item) => item.status === "not_started") ||
            allMetrics[0];

        if (nextUnit && elements.nextLink && elements.nextLabel) {
            elements.nextLink.href = nextUnit.lesson.slug + ".html";
            elements.nextLabel.textContent = nextUnit.status === "in_progress"
                ? t("progressContinueUnit", { unit: t(nextUnit.lesson.nameKey) })
                : t("progressStartFirstUnit");
        }

        syncMyLearningCards(allMetrics);
    }

    function syncMyLearningCards(allMetrics) {
        allMetrics.forEach((item) => {
            const card = document.querySelector('#my-learning a.ld-unit-card[href="' + item.lesson.slug + '.html"]');
            if (!card) {
                return;
            }
            const statusText = card.querySelector(".ld-unit-progress strong");
            const bar = card.querySelector(".ld-unit-track > span");
            if (statusText) {
                if (item.status === "not_started") {
                    statusText.textContent = t("notTracked");
                } else {
                    statusText.textContent = t("progressTopicsRatio", {
                        done: item.completedCount,
                        total: item.totalTopics
                    });
                }
            }
            if (bar) {
                bar.style.width = item.percent + "%";
            }
        });
    }

    function renderStudyGoal() {
        const goal = state.studyGoal;
        const hasGoal = Boolean(
            goal && (
                goal.weekly_lessons_target ||
                goal.daily_mcq_target ||
                goal.target_exam_year ||
                goal.focus_unit_slug ||
                (goal.study_note && goal.study_note.trim())
            )
        );

        elements.goalToggle.textContent = hasGoal
            ? t("progressGoalEditButton")
            : t("progressGoalSetButton");

        if (!hasGoal) {
            elements.goalHeading.textContent = t("progressGoalEmptyTitle");
            elements.goalSubtitle.textContent = t("progressGoalEmptyDescription");
            elements.goalMeters.hidden = true;
            return;
        }

        elements.goalHeading.textContent = t("progressGoalActiveTitle");
        elements.goalSubtitle.textContent = (goal.study_note && goal.study_note.trim()) ||
            t("progressGoalActiveDescription");
        elements.goalMeters.hidden = false;

        if (goal.weekly_lessons_target) {
            const weekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
            let weeklyUnits = 0;
            state.lessonProgress.forEach((row) => {
                const timestamp = row.completed_at || row.last_studied_at;
                if (timestamp && new Date(timestamp).getTime() >= weekAgoMs) {
                    weeklyUnits += 1;
                }
            });
            const pct = Math.min(100, Math.round((weeklyUnits / goal.weekly_lessons_target) * 100));
            elements.goalLessonsBlock.hidden = false;
            elements.goalLessonsRatio.textContent = weeklyUnits + " / " + goal.weekly_lessons_target;
            elements.goalLessonsBar.style.width = pct + "%";
        } else {
            elements.goalLessonsBlock.hidden = true;
        }

        if (goal.daily_mcq_target) {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            const todayMcqs = state.mcqAttempts.reduce((sum, attempt) => {
                const time = attempt.attempted_at ? new Date(attempt.attempted_at).getTime() : 0;
                return time >= startOfToday.getTime()
                    ? sum + (Number(attempt.questions_total) || 0)
                    : sum;
            }, 0);
            const pct = Math.min(100, Math.round((todayMcqs / goal.daily_mcq_target) * 100));
            elements.goalMcqBlock.hidden = false;
            elements.goalMcqRatio.textContent = todayMcqs + " / " + goal.daily_mcq_target;
            elements.goalMcqBar.style.width = pct + "%";
        } else {
            elements.goalMcqBlock.hidden = true;
        }

        elements.goalTags.replaceChildren();
        if (goal.target_exam_year) {
            const yearTag = document.createElement("span");
            yearTag.className = "ld-goal-tag";
            yearTag.textContent = t("progressGoalExamYearTag", { year: goal.target_exam_year });
            elements.goalTags.append(yearTag);
        }
        if (goal.focus_unit_slug && LESSON_BY_SLUG.has(goal.focus_unit_slug)) {
            const unitTag = document.createElement("span");
            unitTag.className = "ld-goal-tag";
            unitTag.textContent = t("progressGoalFocusTag", {
                unit: getUnitName(goal.focus_unit_slug)
            });
            elements.goalTags.append(unitTag);
        }
    }

    function populateGoalForm() {
        const goal = state.studyGoal || {};
        elements.goalWeeklyInput.value = goal.weekly_lessons_target || "";
        elements.goalDailyMcqInput.value = goal.daily_mcq_target || "";
        elements.goalExamYearInput.value = goal.target_exam_year || "";
        elements.goalFocusUnitSelect.value = goal.focus_unit_slug && LESSON_BY_SLUG.has(goal.focus_unit_slug)
            ? goal.focus_unit_slug
            : "";
        elements.goalNoteInput.value = goal.study_note || "";
    }

    function renderUnitMasteryList() {
        const mcqByUnit = computeMcqByUnit();
        const rows = LESSONS.map((lesson) => {
            const metrics = getUnitMetrics(lesson);
            const mcq = mcqByUnit.get(lesson.slug);
            const mcqAccuracy = mcq && mcq.questions > 0
                ? Math.round((mcq.correct / mcq.questions) * 100)
                : null;
            return { ...metrics, mcq, mcqAccuracy };
        });

        const counts = {
            all: rows.length,
            in_progress: rows.filter((r) => r.status === "in_progress").length,
            completed: rows.filter((r) => r.status === "completed").length,
            needs_mcq: rows.filter((r) => !r.mcq).length
        };

        elements.filterButtons.forEach((button) => {
            const filter = button.dataset.progressFilter;
            const active = filter === state.activeFilter;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
            if (filter === "all") {
                button.textContent = t("progressFilterAllCount", { count: counts.all });
            } else if (filter === "in_progress") {
                button.textContent = t("progressFilterInProgressCount", { count: counts.in_progress });
            } else if (filter === "completed") {
                button.textContent = t("progressFilterCompletedCount", { count: counts.completed });
            } else if (filter === "needs_mcq") {
                button.textContent = t("progressFilterNeedsMcqCount", { count: counts.needs_mcq });
            }
        });

        const filtered = rows.filter((row) => {
            if (state.activeFilter === "in_progress") return row.status === "in_progress";
            if (state.activeFilter === "completed") return row.status === "completed";
            if (state.activeFilter === "needs_mcq") return !row.mcq;
            return true;
        });

        elements.masteryList.replaceChildren();
        elements.masteryEmpty.hidden = filtered.length > 0;
        elements.masteryEmpty.textContent = t("progressFilterEmpty");

        filtered.forEach((row) => {
            const article = document.createElement("article");
            article.className = "ld-mastery-row";

            const top = document.createElement("div");
            top.className = "ld-mastery-row-top";

            const titleWrap = document.createElement("div");
            titleWrap.className = "ld-mastery-unit-title";
            const num = document.createElement("span");
            num.className = "ld-mastery-num";
            num.textContent = row.lesson.number;
            const title = document.createElement("strong");
            title.textContent = t(row.lesson.nameKey);
            titleWrap.append(num, title);

            const statusBadge = document.createElement("span");
            statusBadge.className = "ld-mastery-status";
            if (row.status === "completed") {
                statusBadge.classList.add("is-completed");
                statusBadge.textContent = t("progressStatusCompleted");
            } else if (row.status === "in_progress") {
                statusBadge.classList.add("is-in-progress");
                statusBadge.textContent = t("progressStatusInProgress");
            } else {
                statusBadge.textContent = t("progressStatusNotStarted");
            }
            top.append(titleWrap, statusBadge);

            const bar = document.createElement("div");
            bar.className = "ld-mastery-bar";
            bar.setAttribute("aria-hidden", "true");
            const barFill = document.createElement("span");
            barFill.style.width = row.percent + "%";
            bar.append(barFill);

            const bottom = document.createElement("div");
            bottom.className = "ld-mastery-row-bottom";

            const meta = document.createElement("div");
            meta.className = "ld-mastery-meta";
            const topicsSpan = document.createElement("span");
            topicsSpan.textContent = t("progressTopicsRatio", {
                done: row.completedCount,
                total: row.totalTopics
            });
            const mcqChip = document.createElement("span");
            mcqChip.className = "ld-mastery-mcq";
            mcqChip.textContent = row.mcqAccuracy !== null
                ? t("progressMcqUnitBadge", { accuracy: row.mcqAccuracy })
                : t("progressMcqUnitNone");
            meta.append(topicsSpan, mcqChip);

            const openLink = document.createElement("a");
            openLink.className = "ld-mastery-open";
            openLink.href = row.lesson.slug + ".html";
            openLink.textContent = t("progressOpenUnit") + " →";

            bottom.append(meta, openLink);
            article.append(top, bar, bottom);
            elements.masteryList.append(article);
        });
    }

    function renderMcqPerformance() {
        const attempts = state.mcqAttempts;
        if (!attempts.length) {
            elements.mcqBadge.textContent = t("progressMcqEmptyBadge");
            elements.mcqEmptyState.hidden = false;
            elements.mcqStatsView.hidden = true;
            return;
        }

        const totalQuestions = attempts.reduce((sum, a) => sum + (Number(a.questions_total) || 0), 0);
        const totalCorrect = attempts.reduce((sum, a) => sum + (Number(a.correct_answers) || 0), 0);
        const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        elements.mcqBadge.textContent = t("progressMcqAttemptsBadge", { count: attempts.length });
        elements.mcqEmptyState.hidden = true;
        elements.mcqStatsView.hidden = false;
        elements.mcqAttemptsCount.textContent = String(attempts.length);
        elements.mcqQuestionsCount.textContent = String(totalQuestions);
        elements.mcqAccuracyValue.textContent = accuracy + "%";

        const byUnit = Array.from(computeMcqByUnit().entries())
            .map(([slug, stat]) => ({
                slug,
                accuracy: stat.questions > 0 ? Math.round((stat.correct / stat.questions) * 100) : 0
            }))
            .sort((a, b) => a.accuracy - b.accuracy);

        if (byUnit.length && byUnit[0].accuracy < 75) {
            elements.mcqFocusSummary.textContent = t("progressMcqFocusText", {
                unit: getUnitName(byUnit[0].slug),
                accuracy: byUnit[0].accuracy
            });
        } else {
            elements.mcqFocusSummary.textContent = t("progressMcqSolidText");
        }
    }

    function formatActivityDate(isoValue) {
        if (!isoValue) {
            return "";
        }
        try {
            const locale = document.documentElement.lang || "en";
            return new Intl.DateTimeFormat(locale, {
                month: "short",
                day: "numeric"
            }).format(new Date(isoValue));
        } catch {
            return "";
        }
    }

    function describeActivity(event) {
        if (event.activity_type === "topic_completed") {
            return t("progressActivityTopicCompleted", { topic: event.topic_code || "" }).trim();
        }
        if (event.activity_type === "lesson_completed") {
            return t("progressActivityLessonCompleted");
        }
        if (event.activity_type === "mcq_practiced") {
            return t("progressActivityMcqPracticed");
        }
        if (event.activity_type === "goal_updated") {
            return t("progressActivityGoalUpdated");
        }
        return t("progressActivityLessonViewed");
    }

    function renderStudyHistory() {
        const events = state.studyActivity.slice(0, 8);
        if (!events.length) {
            elements.historyBadge.textContent = t("progressHistoryEmptyBadge");
            elements.historyEmptyState.hidden = false;
            elements.historyTimeline.hidden = true;
            elements.historyTimeline.replaceChildren();
            return;
        }

        elements.historyBadge.textContent = t("progressHistoryCountBadge", {
            count: state.studyActivity.length
        });
        elements.historyEmptyState.hidden = true;
        elements.historyTimeline.hidden = false;
        elements.historyTimeline.replaceChildren();

        events.forEach((event) => {
            const item = document.createElement("li");
            item.className = "ld-history-item";

            const copy = document.createElement("div");
            copy.className = "ld-history-item-copy";
            const title = document.createElement("strong");
            title.textContent = describeActivity(event);
            const subtitle = document.createElement("span");
            subtitle.textContent = event.unit_slug && LESSON_BY_SLUG.has(event.unit_slug)
                ? getUnitName(event.unit_slug)
                : t("progressGoalKicker");
            copy.append(title, subtitle);

            const time = document.createElement("span");
            time.className = "ld-history-time";
            time.textContent = formatActivityDate(event.created_at);

            item.append(copy, time);
            elements.historyTimeline.append(item);
        });
    }

    function renderAll() {
        populateFocusUnitOptions();
        renderSyncBadge();
        renderOverallProgress();
        renderStudyGoal();
        renderUnitMasteryList();
        renderMcqPerformance();
        renderStudyHistory();
    }

    async function loadStudentProgress(userId) {
        state.userId = userId;
        const client = window.supabaseClient;
        if (!client) {
            state.loadFailed = true;
            renderAll();
            return;
        }

        try {
            const [progressRes, mcqRes, activityRes, goalRes] = await Promise.all([
                client
                    .from("student_lesson_progress")
                    .select("unit_slug, completed_topics, total_topics, status, last_studied_at, completed_at")
                    .eq("user_id", userId),
                client
                    .from("student_mcq_attempts")
                    .select("unit_slug, questions_total, correct_answers, attempted_at")
                    .eq("user_id", userId)
                    .order("attempted_at", { ascending: false }),
                client
                    .from("student_study_activity")
                    .select("unit_slug, activity_type, topic_code, created_at")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false })
                    .limit(12),
                client
                    .from("student_study_goals")
                    .select("weekly_lessons_target, daily_mcq_target, target_exam_year, focus_unit_slug, study_note, updated_at")
                    .eq("user_id", userId)
                    .maybeSingle()
            ]);

            const errors = [progressRes.error, mcqRes.error, activityRes.error, goalRes.error].filter(Boolean);
            if (errors.length) {
                if (errors.some(isMissingTableError)) {
                    state.tablesMissing = true;
                    state.loadFailed = false;
                } else {
                    throw errors[0];
                }
            } else {
                state.tablesMissing = false;
                state.loadFailed = false;
                state.lessonProgress = new Map(
                    (progressRes.data || []).map((row) => [row.unit_slug, row])
                );
                state.mcqAttempts = mcqRes.data || [];
                state.studyActivity = activityRes.data || [];
                state.studyGoal = goalRes.data || null;
            }
        } catch (error) {
            console.error("Could not load student progress data.", error);
            state.loadFailed = true;
        }

        renderAll();
    }

    function toggleGoalForm(open) {
        const shouldOpen = typeof open === "boolean" ? open : elements.goalForm.hidden;
        if (shouldOpen) {
            populateGoalForm();
        }
        elements.goalForm.hidden = !shouldOpen;
        elements.goalToggle.setAttribute("aria-expanded", String(shouldOpen));
        setGoalFormStatus("", false);
    }

    async function handleGoalSubmit(event) {
        event.preventDefault();
        if (!state.userId || !window.supabaseClient) {
            setGoalFormStatus(t("progressGoalSaveError"), true);
            return;
        }
        if (state.tablesMissing) {
            setGoalFormStatus(t("progressGoalSetupError"), true);
            return;
        }

        const weeklyRaw = elements.goalWeeklyInput.value.trim();
        const mcqRaw = elements.goalDailyMcqInput.value.trim();
        const yearRaw = elements.goalExamYearInput.value.trim();
        const focusSlug = elements.goalFocusUnitSelect.value || null;
        const note = elements.goalNoteInput.value.trim() || null;

        if (!weeklyRaw && !mcqRaw && !yearRaw && !focusSlug && !note) {
            setGoalFormStatus(t("progressGoalValidation"), true);
            return;
        }

        const payload = {
            user_id: state.userId,
            weekly_lessons_target: weeklyRaw ? Number(weeklyRaw) : null,
            daily_mcq_target: mcqRaw ? Number(mcqRaw) : null,
            target_exam_year: yearRaw ? Number(yearRaw) : null,
            focus_unit_slug: focusSlug,
            study_note: note,
            updated_at: new Date().toISOString()
        };

        elements.saveGoalButton.disabled = true;
        setGoalFormStatus(t("progressGoalSaving"), false);

        try {
            const client = window.supabaseClient;
            const { data, error } = await client
                .from("student_study_goals")
                .upsert(payload, { onConflict: "user_id" })
                .select("weekly_lessons_target, daily_mcq_target, target_exam_year, focus_unit_slug, study_note, updated_at")
                .single();
            if (error) {
                throw error;
            }

            state.studyGoal = data;

            const { data: activityRow, error: activityError } = await client
                .from("student_study_activity")
                .insert({
                    user_id: state.userId,
                    unit_slug: focusSlug,
                    activity_type: "goal_updated"
                })
                .select("unit_slug, activity_type, topic_code, created_at")
                .single();
            if (!activityError && activityRow) {
                state.studyActivity = [activityRow, ...state.studyActivity].slice(0, 12);
            }

            toggleGoalForm(false);
            renderStudyGoal();
            renderStudyHistory();
            setGoalFormStatus(t("progressGoalSaved"), false);
        } catch (error) {
            console.error("Could not save personal study goal.", error);
            if (isMissingTableError(error)) {
                state.tablesMissing = true;
                renderSyncBadge();
                setGoalFormStatus(t("progressGoalSetupError"), true);
            } else {
                setGoalFormStatus(t("progressGoalSaveError"), true);
            }
        } finally {
            elements.saveGoalButton.disabled = false;
        }
    }

    elements.goalToggle?.addEventListener("click", () => toggleGoalForm());
    elements.cancelGoalButton?.addEventListener("click", () => toggleGoalForm(false));
    elements.goalForm?.addEventListener("submit", handleGoalSubmit);

    elements.filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            state.activeFilter = button.dataset.progressFilter || "all";
            renderUnitMasteryList();
        });
    });

    window.addEventListener("sandun:language-changed", () => {
        renderAll();
    });

    window.addEventListener("sandun:dashboard-ready", (event) => {
        const userId = event.detail && event.detail.userId;
        if (userId) {
            loadStudentProgress(userId);
        } else {
            renderAll();
        }
    });

    renderAll();
    if (window.sandunStudentContext && window.sandunStudentContext.userId) {
        loadStudentProgress(window.sandunStudentContext.userId);
    }
})();
