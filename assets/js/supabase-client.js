/* =====================================================
   Desa Pagerkidul - Supabase client + data helpers

   Exposes window.DesaDB:
     .configured  - true when supabase-config.js is filled in
     .client      - the supabase client (or null)
     .list(table, orderBy) - public read helper, null on failure
     .getStatistik()       - { kategori: {labels, values} } or null
     .signIn(email, password)
     .signOut()
     .getSession()

   Safe to load on every page: when not configured every
   helper resolves to null and the site uses static content.
===================================================== */

(function () {
    const cfg = window.DESA_SUPABASE_CONFIG || {};
    const looksConfigured =
        typeof cfg.url === "string" &&
        typeof cfg.anonKey === "string" &&
        cfg.url.indexOf("YOUR-PROJECT") === -1 &&
        cfg.url.indexOf("supabase.co") !== -1;

    const configured = looksConfigured && typeof window.supabase !== "undefined";

    let client = null;
    if (configured) {
        try {
            client = window.supabase.createClient(cfg.url, cfg.anonKey);
        } catch (e) {
            console.warn("[desa] supabase init failed:", e);
        }
    } else {
        console.info("[desa] Supabase not configured - using static fallback content. See assets/js/supabase-config.js");
    }

    async function list(table, orderBy) {
        if (!client) return null;
        let q = client.from(table).select("*");
        if (orderBy) q = q.order(orderBy);
        const { data, error } = await q;
        if (error) {
            console.warn("[desa] fetch '" + table + "' failed:", error.message);
            return null;
        }
        return data;
    }

    async function getStatistik() {
        const rows = await list("statistik", "id");
        if (!rows || !rows.length) return null;
        const out = {};
        for (const r of rows) {
            if (!out[r.kategori]) out[r.kategori] = { labels: [], values: [] };
            out[r.kategori].labels.push(r.label);
            out[r.kategori].values.push(r.nilai);
        }
        return out;
    }

    window.DesaDB = {
        configured: !!client,
        client: client,

        list: list,
        getStatistik: getStatistik,

        getOne: async function (table, id) {
            if (!client) return null;
            const { data, error } = await client.from(table).select("*").eq("id", id).single();
            if (error) return null;
            return data;
        },

        signIn: async function (email, password) {
            if (!client) return { error: { message: "not-configured" } };
            const { data, error } = await client.auth.signInWithPassword({ email: email, password: password });
            return { data: data, error: error };
        },

        signOut: async function () {
            if (client) await client.auth.signOut();
            try { window.localStorage.removeItem("admin_auth"); } catch (e) {}
        },

        getSession: async function () {
            if (!client) return null;
            const { data } = await client.auth.getSession();
            return data.session || null;
        }
    };
})();
