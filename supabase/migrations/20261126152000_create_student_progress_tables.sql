-- Student Progress Center schema for SANDUN ABEYSEKARA A/L Physics Education.
-- Review carefully and execute manually in Supabase when ready.

-- 1. Individual lesson & topic completion across the 11 A/L Physics units
CREATE TABLE IF NOT EXISTS public.student_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    unit_slug TEXT NOT NULL CHECK (
        unit_slug IN (
            'measurement',
            'mechanics',
            'oscillations-waves',
            'thermal-physics',
            'gravitational-field',
            'electrostatic-field',
            'magnetic-field',
            'current-electricity',
            'electronics',
            'mechanical-properties',
            'matter-radiation'
        )
    ),
    completed_topics JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (
        jsonb_typeof(completed_topics) = 'array'
    ),
    total_topics INTEGER NOT NULL CHECK (total_topics > 0),
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (
        status IN ('not_started', 'in_progress', 'completed')
    ),
    last_studied_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE (user_id, unit_slug)
);

CREATE INDEX IF NOT EXISTS student_lesson_progress_user_studied_idx
    ON public.student_lesson_progress (user_id, last_studied_at DESC);

ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own lesson progress"
    ON public.student_lesson_progress
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own lesson progress"
    ON public.student_lesson_progress
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own lesson progress"
    ON public.student_lesson_progress
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can delete own lesson progress"
    ON public.student_lesson_progress
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 2. Verified MCQ practice attempts per unit
CREATE TABLE IF NOT EXISTS public.student_mcq_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    unit_slug TEXT NOT NULL CHECK (
        unit_slug IN (
            'measurement',
            'mechanics',
            'oscillations-waves',
            'thermal-physics',
            'gravitational-field',
            'electrostatic-field',
            'magnetic-field',
            'current-electricity',
            'electronics',
            'mechanical-properties',
            'matter-radiation'
        )
    ),
    questions_total INTEGER NOT NULL CHECK (questions_total > 0),
    correct_answers INTEGER NOT NULL CHECK (
        correct_answers >= 0 AND correct_answers <= questions_total
    ),
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS student_mcq_attempts_user_time_idx
    ON public.student_mcq_attempts (user_id, attempted_at DESC);

CREATE INDEX IF NOT EXISTS student_mcq_attempts_user_unit_idx
    ON public.student_mcq_attempts (user_id, unit_slug);

ALTER TABLE public.student_mcq_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own MCQ attempts"
    ON public.student_mcq_attempts
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own MCQ attempts"
    ON public.student_mcq_attempts
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can delete own MCQ attempts"
    ON public.student_mcq_attempts
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 3. Chronological study history and learning events
CREATE TABLE IF NOT EXISTS public.student_study_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    unit_slug TEXT CHECK (
        unit_slug IS NULL OR unit_slug IN (
            'measurement',
            'mechanics',
            'oscillations-waves',
            'thermal-physics',
            'gravitational-field',
            'electrostatic-field',
            'magnetic-field',
            'current-electricity',
            'electronics',
            'mechanical-properties',
            'matter-radiation'
        )
    ),
    activity_type TEXT NOT NULL CHECK (
        activity_type IN (
            'lesson_viewed',
            'topic_completed',
            'lesson_completed',
            'mcq_practiced',
            'goal_updated'
        )
    ),
    topic_code TEXT CHECK (topic_code IS NULL OR char_length(topic_code) <= 10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS student_study_activity_user_time_idx
    ON public.student_study_activity (user_id, created_at DESC);

ALTER TABLE public.student_study_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own study activity"
    ON public.student_study_activity
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own study activity"
    ON public.student_study_activity
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can delete own study activity"
    ON public.student_study_activity
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 4. Personal study goals (one row per student)
CREATE TABLE IF NOT EXISTS public.student_study_goals (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    weekly_lessons_target INTEGER CHECK (
        weekly_lessons_target IS NULL OR (weekly_lessons_target >= 1 AND weekly_lessons_target <= 11)
    ),
    daily_mcq_target INTEGER CHECK (
        daily_mcq_target IS NULL OR (daily_mcq_target >= 1 AND daily_mcq_target <= 200)
    ),
    target_exam_year INTEGER CHECK (
        target_exam_year IS NULL OR (target_exam_year >= 2025 AND target_exam_year <= 2035)
    ),
    focus_unit_slug TEXT CHECK (
        focus_unit_slug IS NULL OR focus_unit_slug IN (
            'measurement',
            'mechanics',
            'oscillations-waves',
            'thermal-physics',
            'gravitational-field',
            'electrostatic-field',
            'magnetic-field',
            'current-electricity',
            'electronics',
            'mechanical-properties',
            'matter-radiation'
        )
    ),
    study_note TEXT CHECK (study_note IS NULL OR char_length(study_note) <= 160),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.student_study_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own study goals"
    ON public.student_study_goals
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own study goals"
    ON public.student_study_goals
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own study goals"
    ON public.student_study_goals
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can delete own study goals"
    ON public.student_study_goals
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

REVOKE ALL ON public.student_lesson_progress FROM anon;
REVOKE ALL ON public.student_mcq_attempts FROM anon;
REVOKE ALL ON public.student_study_activity FROM anon;
REVOKE ALL ON public.student_study_goals FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_lesson_progress TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.student_mcq_attempts TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.student_study_activity TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_study_goals TO authenticated;
