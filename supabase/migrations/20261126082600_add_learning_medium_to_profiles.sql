ALTER TABLE public.profiles
    ADD COLUMN learning_medium TEXT,
    ADD CONSTRAINT profiles_learning_medium_check
        CHECK (learning_medium IS NULL OR learning_medium IN ('si', 'en', 'ta'));
