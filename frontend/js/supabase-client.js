(() => {
    // Replace these with the Project URL and Publishable key from Supabase.
    // Never put a Secret key or service_role key in frontend code.
    const SUPABASE_URL = "https://dyhfbbyjqjiocjlqbybf.supabase.co";
    const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_pgs7LR28wnRvFqU28JvOiQ_rfrQufqO";

    window.supabaseClient = null;

    if (
        SUPABASE_URL === "YOUR_SUPABASE_PROJECT_URL" ||
        SUPABASE_PUBLISHABLE_KEY === "YOUR_SUPABASE_PUBLISHABLE_KEY"
    ) {
        console.info(
            "Supabase is not configured. Add your project URL and publishable key in js/supabase-client.js."
        );
        return;
    }

    if (!window.supabase || typeof window.supabase.createClient !== "function") {
        console.error(
            "Supabase JS v2 did not load. Check the internet connection and the CDN script."
        );
        return;
    }

    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
    console.info(
        "Supabase client initialized. A database connection has not been tested."
    );
})();
