/* =====================================================
   Desa Pagerkidul - Admin Login UI

   - Bila Supabase terkonfigurasi: login via Supabase Auth
     (email + password akun admin).
   - Fallback demo (admin/admin) HANYA bila Supabase
     belum dikonfigurasi.
===================================================== */

(function () {
  const AUTH_KEY = "admin_auth";

  const isConfigured = () => !!(window.DesaDB && window.DesaDB.configured);

  function setDemoAuthed() {
    window.localStorage.setItem(AUTH_KEY, "1");
  }

  function ensureOverlay() {
    if (document.getElementById("adminLoginOverlay")) return;

    const demo = !isConfigured();
    const hint = demo
      ? "Demo: admin / admin (isi supabase-config.js untuk login beneran)"
      : "Masuk dengan akun admin Supabase";

    const overlay = document.createElement("div");
    overlay.id = "adminLoginOverlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";
    overlay.innerHTML =
      '<div style="width:min(520px, 92vw); background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.25);">' +
      '<div style="padding:16px 20px; background:#f8fafc; border-bottom:1px solid #e5e7eb; display:flex; align-items:center; justify-content:space-between;">' +
      '<div>' +
      '<div style="font-weight:900; color:#166534;">Login Admin</div>' +
      '<div style="font-size:12px; color:#6b7280; font-weight:700;">' + hint + "</div>" +
      "</div>" +
      '<button type="button" id="adminLoginOverlayClose" style="border:none; background:transparent; font-size:18px; cursor:pointer;">×</button>' +
      "</div>" +
      '<div style="padding:18px 20px;">' +
      '<div style="display:grid; grid-template-columns:1fr; gap:12px;">' +
      '<label style="font-weight:800; color:#374151;">Email</label>' +
      '<input id="adminLoginEmail" type="email" class="form-control" style="border:1px solid #d1d5db; border-radius:12px; padding:10px 12px;" placeholder="admin@pagerkidul.id" />' +
      '<label style="font-weight:800; color:#374151;">Password</label>' +
      '<input id="adminLoginPassword" type="password" class="form-control" style="border:1px solid #d1d5db; border-radius:12px; padding:10px 12px;" placeholder="Masukkan password" />' +
      '<div id="adminLoginError" style="display:none; padding:10px 12px; border-radius:12px; background:#fef2f2; color:#b91c1c; font-weight:800; border:1px solid #fecaca;">' +
      "Email atau password salah." +
      "</div>" +
      '<div style="display:flex; gap:10px; justify-content:flex-end; margin-top:6px;">' +
      '<button type="button" id="adminLoginCancel" style="padding:10px 14px; border-radius:12px; border:1px solid #d1d5db; background:#fff; font-weight:800; cursor:pointer;">Batal</button>' +
      '<button type="button" id="adminLoginSubmit" style="padding:10px 14px; border-radius:12px; border:1px solid #166534; background:#166534; color:#fff; font-weight:900; cursor:pointer;">Masuk</button>' +
      "</div>" +
      "</div></div></div>";

    document.body.appendChild(overlay);

    const hide = () => {
      overlay.style.display = "none";
      const err = document.getElementById("adminLoginError");
      if (err) err.style.display = "none";
    };

    document.getElementById("adminLoginOverlayClose").addEventListener("click", hide);
    document.getElementById("adminLoginCancel").addEventListener("click", hide);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) hide();
    });
    document.getElementById("adminLoginPassword").addEventListener("keydown", (e) => {
      if (e.key === "Enter") doLogin();
    });
    document.getElementById("adminLoginSubmit").addEventListener("click", doLogin);
  }

  async function doLogin() {
    const emailEl = document.getElementById("adminLoginEmail");
    const passEl = document.getElementById("adminLoginPassword");
    const err = document.getElementById("adminLoginError");
    const email = (emailEl.value || "").trim();
    const password = passEl.value || "";
    const fail = (msg) => {
      err.textContent = msg || "Email atau password salah.";
      err.style.display = "block";
    };

    if (!email || !password) {
      fail("Isi email dan password dulu.");
      return;
    }

    if (isConfigured()) {
      const submit = document.getElementById("adminLoginSubmit");
      submit.disabled = true;
      submit.textContent = "Memeriksa...";
      const { error } = await window.DesaDB.signIn(email, password);
      submit.disabled = false;
      submit.textContent = "Masuk";
      if (error) {
        fail("Email atau password salah.");
        return;
      }
      window.location.href = "admin.html";
    } else {
      // DEMO fallback — hapus setelah Supabase dikonfigurasi
      if (email === "admin" && password === "admin") {
        setDemoAuthed();
        window.location.href = "admin.html";
      } else {
        fail("Email atau password salah.");
      }
    }
  }

  function initLoginTrigger() {
    document.querySelectorAll('[data-action="login"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        ensureOverlay();
        const overlay = document.getElementById("adminLoginOverlay");
        overlay.style.display = "flex";
        const emailInput = document.getElementById("adminLoginEmail");
        if (emailInput) emailInput.focus();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initLoginTrigger);
})();
