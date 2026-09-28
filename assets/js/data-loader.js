/* =====================================================
   Desa Pagerkidul - dynamic content from Supabase

   Mengganti isi section publik (perangkat desa, potensi,
   UMKM, galeri) dengan data dari database bila Supabase
   terkonfigurasi. Bila tidak, konten statis bawaan HTML
   tetap dipakai (fallback).
===================================================== */

(function () {
    const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
    const img = (u, fb) => esc(u || fb);

    const POTENSI_ICONS = {
        "Pertanian": "bi-flower1",
        "Peternakan": "bi-house-heart-fill",
        "UMKM": "bi-shop",
        "Wisata": "bi-camera-fill"
    };

    document.addEventListener("DOMContentLoaded", async () => {
        const db = window.DesaDB;
        if (!db || !db.configured) return;

        await Promise.allSettled([
            renderPerangkat(db),
            renderPotensi(db),
            renderUmkm(db),
            renderGaleri(db)
        ]);

        if (window.AOS) { try { window.AOS.refresh(); } catch (e) {} }
        try {
            if (typeof GLightbox === "function") GLightbox({ selector: ".gallery-item" });
        } catch (e) {}
    });

    async function renderPerangkat(db) {
        const rows = await db.list("perangkat_desa", "urutan");
        if (!rows || !rows.length) return;
        const grid = document.getElementById("perangkatGrid");
        if (!grid) return;

        const kepala = rows.find((r) => /kepala desa/i.test(r.jabatan || ""));
        const rest = kepala ? rows.filter((r) => r.id !== kepala.id) : rows;

        const chief = document.getElementById("chiefCard");
        if (chief && kepala) {
            chief.innerHTML =
                '<img src="' + img(kepala.foto_url, "assets/images/foto.jpg") + '" alt="' + esc(kepala.nama) + '">' +
                "<h3>" + esc(kepala.nama) + "</h3>" +
                "<span>" + esc(kepala.jabatan) + "</span>";
        }

        grid.innerHTML = rest.map((r, i) =>
            '<div class="col-lg-3 col-md-6">' +
            '<div class="staff-card" data-aos="fade-up" data-aos-delay="' + ((i % 4) * 100) + '">' +
            '<img src="' + img(r.foto_url, "assets/images/foto.jpg") + '" alt="' + esc(r.nama) + '">' +
            "<h5>" + esc(r.nama) + "</h5>" +
            "<span>" + esc(r.jabatan) + "</span>" +
            "</div></div>"
        ).join("");
    }

    async function renderPotensi(db) {
        const rows = await db.list("potensi", "id");
        if (!rows || !rows.length) return;
        const grid = document.getElementById("potensiGrid");
        if (!grid) return;
        grid.innerHTML = rows.map((r, i) => {
            const icon = POTENSI_ICONS[r.kategori] || "bi-grid-fill";
            return (
                '<div class="col-lg-3 col-md-6">' +
                '<div class="potensi-card" data-aos="fade-up" data-aos-delay="' + ((i % 4) * 100) + '">' +
                '<img src="' + img(r.foto_url, "assets/images/desa.JPG") + '" alt="' + esc(r.judul) + '">' +
                '<div class="potensi-content">' +
                '<div class="potensi-icon"><i class="bi ' + icon + '"></i></div>' +
                "<h4>" + esc(r.judul) + "</h4>" +
                "<p>" + esc(r.deskripsi) + "</p>" +
                "</div></div></div>"
            );
        }).join("");
    }

    async function renderUmkm(db) {
        const rows = await db.list("umkm", "id");
        if (!rows || !rows.length) return;
        const wrap = document.getElementById("umkmTimeline");
        if (!wrap) return;
        wrap.innerHTML = rows.map((r, i) =>
            '<div class="umkm-item">' +
            '<div class="timeline-dot">' + (i + 1) + "</div>" +
            '<div class="row align-items-center gy-4">' +
            '<div class="col-lg-4">' +
            '<img src="' + img(r.foto_url, "assets/images/desa.JPG") + '" class="umkm-photo" alt="' + esc(r.nama_usaha) + '">' +
            "</div>" +
            '<div class="col-lg-5">' +
            '<span class="badge-category">' + esc(r.kategori || "UMKM") + "</span>" +
            "<h3>" + esc(r.nama_usaha) + "</h3>" +
            '<div class="umkm-meta">' +
            '<span><i class="bi bi-person-fill"></i> ' + esc(r.pemilik) + "</span>" +
            '<span><i class="bi bi-geo-alt-fill"></i> ' + esc(r.dusun) + "</span>" +
            "</div>" +
            "<p>" + esc(r.deskripsi) + "</p>" +
            "</div>" +
            '<div class="col-lg-3">' +
            '<div class="owner-card">' +
            "<div><small>Pemilik</small><h6>" + esc(r.pemilik) + "</h6></div>" +
            "<div><small>Kontak</small><h6>" + esc(r.kontak) + "</h6></div>" +
            "</div></div>" +
            "</div></div>"
        ).join("");
    }

    async function renderGaleri(db) {
        const rows = await db.list("galeri", "id");
        if (!rows || !rows.length) return;
        const grid = document.getElementById("galeriGrid");
        if (!grid) return;
        grid.innerHTML = rows.map((r) =>
            '<div class="col-lg-4 col-md-6">' +
            '<a href="' + esc(r.foto_url) + '" class="gallery-item" data-gallery="galeri-desa">' +
            '<img src="' + esc(r.foto_url) + '" class="img-fluid w-100" alt="' + esc(r.caption || "Galeri Desa") + '">' +
            "</a></div>"
        ).join("");
    }
})();
