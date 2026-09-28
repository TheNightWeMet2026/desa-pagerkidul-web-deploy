/* =====================================================
   Desa Pagerkidul - Admin Auth (Supabase)

   - Bila Supabase terkonfigurasi: guard memakai
     Supabase Auth session (asli, bukan localStorage).
   - Fallback demo via localStorage HANYA bila Supabase
     belum dikonfigurasi. Hapus fallback ini setelah
     akun admin dibuat di Supabase Auth
     (lihat supabase/README.md).
===================================================== */

(function () {
  const AUTH_KEY = "admin_auth";
  const LOGIN_URL = "index.html";
  const isAdminPage = () =>
    window.location.pathname.toLowerCase().endsWith("admin.html");

  function wireLogout() {
    document.querySelectorAll('a[href="#logout"], #logout').forEach((el) => {
      el.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          if (window.DesaDB) await window.DesaDB.signOut();
        } catch (err) {
          /* abaikan */
        }
        window.location.href = LOGIN_URL;
      });
    });
  }

  async function guard() {
    const db = window.DesaDB;
    if (db && db.configured) {
      const session = await db.getSession();
      if (!session) {
        window.location.href = LOGIN_URL;
        return;
      }
    } else if (window.localStorage.getItem(AUTH_KEY) !== "1") {
      // DEMO fallback — ganti dengan Supabase Auth (supabase/README.md)
      window.location.href = LOGIN_URL;
      return;
    }
    wireLogout();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (isAdminPage()) guard();
  });
})();
