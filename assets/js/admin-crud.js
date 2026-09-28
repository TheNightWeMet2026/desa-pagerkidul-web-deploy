/* =====================================================
   Desa Pagerkidul - Admin CRUD (Supabase)

   Menghubungkan tabel admin (Perangkat Desa, Statistik,
   Potensi Desa, Produk UMKM) ke database Supabase:

   - render isi tabel dari DB saat halaman dimuat
   - tombol Add / Edit / Delete membuka modal dengan
     form yang dibangun otomatis per tabel
   - upload foto ke Storage bucket "desa-images"
   - Preview tetap memakai modal #previewModal

   Bila Supabase belum dikonfigurasi, tabel dummy bawaan
   HTML tetap dipakai (fallback).
===================================================== */

(function () {
    "use strict";

    const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

    /* section id -> nama tabel */
    const SECTION_TABLE = {
        officials: "perangkat_desa",
        statistics: "statistik",
        potentials: "potensi",
        umkm: "umkm"
    };

    const IMG_STYLE = "width:48px;height:48px;object-fit:cover;border:1px solid rgba(16,24,40,.10);";

    function actionsCell(table, id, preview) {
        return (
            '<div class="btn-group" role="group">' +
            '<button class="btn btn-outline-admin btn-sm" data-bs-toggle="modal" data-bs-target="#previewModal"' +
            ' data-title="' + esc(preview.title) + '"' +
            (preview.media ? ' data-media="' + esc(preview.media) + '"' : "") +
            ' data-body="' + esc(preview.body) + '" type="button">' +
            '<i class="bi bi-eye"></i> Preview</button>' +
            '<button class="btn btn-primary-admin btn-sm" data-crud-edit="' + table + '" data-id="' + id + '" type="button">' +
            '<i class="bi bi-pencil"></i> Edit</button>' +
            '<button class="btn btn-danger-admin btn-sm" data-crud-delete="' + table + '" data-id="' + id +
            '" data-label="' + esc(preview.title) + '" type="button">' +
            '<i class="bi bi-trash"></i> Delete</button>' +
            "</div>"
        );
    }

    const CONFIG = {
        perangkat_desa: {
            title: "Perangkat Desa",
            tableId: "tblOfficials",
            orderBy: "urutan",
            fields: [
                { key: "nama", label: "Nama", type: "text", required: true, placeholder: "cth: Nama Kepala Desa" },
                { key: "jabatan", label: "Jabatan", type: "text", required: true, placeholder: "cth: Kepala Desa" },
                { key: "telepon", label: "Telepon", type: "text", placeholder: "08xxxxxxxxxx" },
                { key: "urutan", label: "Urutan tampil", type: "number", value: 0 },
                { key: "foto_url", label: "Foto", type: "image" }
            ],
            row: (r) =>
                "<tr>" +
                '<td><img src="' + esc(r.foto_url || "assets/images/foto.jpg") + '" class="rounded-4" style="' + IMG_STYLE + '" alt="Foto"></td>' +
                "<td>" + esc(r.nama) + "</td>" +
                '<td class="text-muted">' + esc(r.jabatan) + "</td>" +
                '<td class="text-muted">' + esc(r.telepon || "-") + "</td>" +
                "<td>" + actionsCell("perangkat_desa", r.id, {
                    title: r.nama,
                    media: r.foto_url,
                    body: "Profil perangkat desa: " + r.nama + " (" + r.jabatan + ")."
                }) + "</td></tr>"
        },
        statistik: {
            title: "Statistik",
            tableId: "tblStats",
            orderBy: "id",
            fields: [
                { key: "kategori", label: "Kategori", type: "select", options: ["pendidikan", "pekerjaan", "gender", "umur"], required: true },
                { key: "label", label: "Label", type: "text", required: true, placeholder: "cth: SD / Petani / Laki-laki" },
                { key: "nilai", label: "Nilai", type: "number", required: true, placeholder: "cth: 950" },
                { key: "tahun", label: "Tahun", type: "number", value: 2026 }
            ],
            row: (r) =>
                "<tr>" +
                "<td>" + esc(r.kategori) + "</td>" +
                "<td>" + esc(r.label) + "</td>" +
                '<td class="text-muted">' + esc(r.nilai) + "</td>" +
                "<td>" + actionsCell("statistik", r.id, {
                    title: r.kategori + " — " + r.label,
                    body: "Nilai statistik: " + r.nilai + " (" + (r.tahun || "-") + ")."
                }) + "</td></tr>"
        },
        potensi: {
            title: "Potensi Desa",
            tableId: "tblPotentials",
            orderBy: "id",
            fields: [
                { key: "judul", label: "Judul", type: "text", required: true, placeholder: "cth: Pertanian" },
                { key: "kategori", label: "Kategori", type: "select", options: ["Pertanian", "Peternakan", "UMKM", "Wisata"], required: true },
                { key: "deskripsi", label: "Deskripsi", type: "textarea", placeholder: "Deskripsi potensi desa..." },
                { key: "foto_url", label: "Foto", type: "image" }
            ],
            row: (r) =>
                "<tr>" +
                '<td><img src="' + esc(r.foto_url || "assets/images/desa.JPG") + '" class="rounded-4" style="' + IMG_STYLE + '" alt="Potensi"></td>' +
                "<td>" + esc(r.judul) + "</td>" +
                '<td class="text-muted">' + esc((r.deskripsi || "").slice(0, 80)) + "</td>" +
                '<td class="text-muted">' + esc(r.kategori || "-") + "</td>" +
                "<td>" + actionsCell("potensi", r.id, {
                    title: r.judul,
                    media: r.foto_url,
                    body: "Preview potensi: " + (r.deskripsi || "-")
                }) + "</td></tr>"
        },
        umkm: {
            title: "Produk UMKM",
            tableId: "tblUmkm",
            orderBy: "id",
            fields: [
                { key: "nama_usaha", label: "Nama usaha/produk", type: "text", required: true },
                { key: "pemilik", label: "Pemilik", type: "text" },
                { key: "kategori", label: "Kategori", type: "text", placeholder: "cth: Makanan" },
                { key: "dusun", label: "Dusun", type: "text", placeholder: "cth: Dusun Krajan" },
                { key: "kontak", label: "Kontak", type: "text", placeholder: "08xxxxxxxxxx" },
                { key: "deskripsi", label: "Deskripsi", type: "textarea", placeholder: "Deskripsi produk..." },
                { key: "foto_url", label: "Foto", type: "image" }
            ],
            row: (r) =>
                "<tr>" +
                '<td><img src="' + esc(r.foto_url || "assets/images/desa.JPG") + '" class="rounded-4" style="' + IMG_STYLE + '" alt="Produk"></td>' +
                "<td>" + esc(r.nama_usaha) + "</td>" +
                '<td class="text-muted">' + esc(r.pemilik || "-") + "</td>" +
                '<td class="text-muted">' + esc(r.kategori || "-") + "</td>" +
                '<td class="text-muted">' + esc((r.deskripsi || "").slice(0, 80)) + "</td>" +
                '<td class="text-muted">' + esc(r.kontak || "-") + "</td>" +
                "<td>" + actionsCell("umkm", r.id, {
                    title: r.nama_usaha,
                    media: r.foto_url,
                    body: "Preview produk UMKM: " + (r.deskripsi || "-")
                }) + "</td></tr>"
        }
    };

    let activeForm = null;   // { table, id, fields }
    let pendingDelete = null; // { table, id }

    /* ---------- toast ---------- */
    function toast(msg, ok) {
        let t = document.getElementById("crudToast");
        if (!t) {
            t = document.createElement("div");
            t.id = "crudToast";
            t.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:10000;padding:12px 18px;" +
                "border-radius:12px;font-weight:700;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.2);" +
                "transition:opacity .3s;opacity:0;pointer-events:none;";
            document.body.appendChild(t);
        }
        t.style.background = ok === false ? "#b91c1c" : "#166534";
        t.textContent = msg;
        t.style.opacity = "1";
        clearTimeout(t._h);
        t._h = setTimeout(() => { t.style.opacity = "0"; }, 2600);
    }

    /* ---------- render tabel ---------- */
    async function renderTable(table) {
        const cfg = CONFIG[table];
        const db = window.DesaDB;
        if (!db || !db.configured) return;
        const tbody = document.querySelector("#" + cfg.tableId + " tbody");
        if (!tbody) return;
        const rows = await db.list(table, cfg.orderBy);
        if (!rows) return; // gagal fetch -> biarkan dummy
        tbody.innerHTML = rows.length
            ? rows.map(cfg.row).join("")
            : '<tr><td colspan="10" class="text-center text-muted py-4">Belum ada data. Klik "Add Data" untuk menambah.</td></tr>';
    }

    /* ---------- form builder ---------- */
    function fieldHtml(f, val) {
        const v = val != null && val !== "" ? val : (f.value !== undefined ? f.value : "");
        const req = f.required ? "required" : "";
        const star = f.required ? ' <span class="text-danger">*</span>' : "";
        const id = "crud-" + f.key;
        let input;
        if (f.type === "textarea") {
            input = '<textarea id="' + id + '" data-field="' + f.key + '" class="form-control rounded-4" rows="3"' +
                ' placeholder="' + esc(f.placeholder || "") + '">' + esc(v) + "</textarea>";
        } else if (f.type === "number") {
            input = '<input id="' + id + '" data-field="' + f.key + '" type="number" class="form-control rounded-4"' +
                ' value="' + esc(v) + '" placeholder="' + esc(f.placeholder || "") + '" ' + req + ">";
        } else if (f.type === "select") {
            input = '<select id="' + id + '" data-field="' + f.key + '" class="form-control rounded-4">' +
                f.options.map((o) => '<option value="' + esc(o) + '"' + (String(o) === String(v) ? " selected" : "") + ">" + esc(o) + "</option>").join("") +
                "</select>";
        } else if (f.type === "image") {
            input =
                '<input id="' + id + '" data-field="' + f.key + '" type="text" class="form-control rounded-4"' +
                ' value="' + esc(v) + '" placeholder="URL foto (atau upload di bawah)">' +
                '<div class="mt-2 d-flex align-items-center gap-3 flex-wrap">' +
                '<img id="' + id + '-preview" src="' + esc(v || "assets/images/desa.JPG") + '" class="rounded-4"' +
                ' style="width:72px;height:72px;object-fit:cover;border:1px solid #e5e7eb;" alt="preview">' +
                '<label class="btn btn-outline-admin btn-sm mb-0" style="cursor:pointer;">' +
                '<i class="bi bi-upload"></i> Upload foto' +
                '<input id="' + id + '-file" type="file" accept="image/*" hidden></label>' +
                '<small class="text-muted" id="' + id + '-status"></small>' +
                "</div>";
        } else {
            input = '<input id="' + id + '" data-field="' + f.key + '" type="text" class="form-control rounded-4"' +
                ' value="' + esc(v) + '" placeholder="' + esc(f.placeholder || "") + '" ' + req + ">";
        }
        return '<div class="col-md-6"><label class="form-label fw-bold">' + esc(f.label) + star + "</label>" + input + "</div>";
    }

    function buildForm(formId, fields, values) {
        const form = document.getElementById(formId);
        if (!form) return;
        form.innerHTML = fields.map((f) => fieldHtml(f, values[f.key])).join("");
        // wire upload untuk field gambar
        fields.filter((f) => f.type === "image").forEach((f) => {
            const fileInput = document.getElementById("crud-" + f.key + "-file");
            if (fileInput) fileInput.addEventListener("change", () => {
                if (fileInput.files && fileInput.files[0]) uploadImage(activeForm.table, fileInput.files[0], f.key);
            });
        });
    }

    async function uploadImage(table, file, fieldKey) {
        const db = window.DesaDB;
        const urlInput = document.getElementById("crud-" + fieldKey);
        const preview = document.getElementById("crud-" + fieldKey + "-preview");
        const status = document.getElementById("crud-" + fieldKey + "-status");
        if (!db || !db.client) return;
        try {
            status.textContent = "Mengupload...";
            const ext = (file.name.split(".").pop() || "jpg").toLowerCase().slice(0, 4);
            const path = table + "/" + Date.now() + "_" + Math.random().toString(36).slice(2, 8) + "." + ext;
            const { error } = await db.client.storage.from("desa-images").upload(path, file, { upsert: false });
            if (error) throw error;
            const { data } = db.client.storage.from("desa-images").getPublicUrl(path);
            urlInput.value = data.publicUrl;
            preview.src = data.publicUrl;
            status.textContent = "Berhasil diupload.";
        } catch (err) {
            status.textContent = "Gagal upload: " + (err.message || err);
        }
    }

    /* ---------- modal flows ---------- */
    function showModal(id) {
        bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).show();
    }
    function hideModal(id) {
        const m = bootstrap.Modal.getInstance(document.getElementById(id));
        if (m) m.hide();
    }

    function openAdd(table) {
        const cfg = CONFIG[table];
        activeForm = { table: table, id: null, fields: cfg.fields };
        document.getElementById("addModalTitle").textContent = "Tambah " + cfg.title;
        const alert = document.getElementById("addModalAlert");
        if (alert) alert.style.display = "none";
        buildForm("addModalForm", cfg.fields, {});
    }

    async function openEdit(table, id) {
        const db = window.DesaDB;
        const cfg = CONFIG[table];
        const row = await db.getOne(table, id);
        if (!row) { toast("Gagal memuat data.", false); return; }
        activeForm = { table: table, id: id, fields: cfg.fields };
        document.getElementById("editModalTitle").textContent = "Edit " + cfg.title;
        const alert = document.getElementById("editModalAlert");
        if (alert) alert.style.display = "none";
        buildForm("editModalForm", cfg.fields, row);
        showModal("editModal");
    }

    function openDelete(table, id, label) {
        pendingDelete = { table: table, id: id };
        const labelEl = document.getElementById("deleteModalLabel");
        if (labelEl) labelEl.textContent = label || "data ini";
        showModal("deleteModal");
    }

    async function saveForm(mode) {
        if (!activeForm) return;
        const { table, id, fields } = activeForm;
        const formId = mode === "add" ? "addModalForm" : "editModalForm";
        const modalId = mode === "add" ? "addModal" : "editModal";
        const saveBtn = document.getElementById(mode === "add" ? "addModalSave" : "editModalSave");

        const payload = {};
        for (const f of fields) {
            const el = document.querySelector("#" + formId + ' [data-field="' + f.key + '"]');
            let v = el ? el.value.trim() : "";
            if (f.required && !v) {
                toast('"' + f.label + '" wajib diisi.', false);
                if (el) el.focus();
                return;
            }
            if (f.type === "number") v = v === "" ? null : Number(v);
            payload[f.key] = v === "" ? null : v;
        }

        const db = window.DesaDB;
        if (!db || !db.client) { toast("Supabase belum dikonfigurasi.", false); return; }
        const original = saveBtn.textContent;
        saveBtn.disabled = true;
        saveBtn.textContent = "Menyimpan...";
        try {
            let error;
            if (mode === "add") {
                ({ error } = await db.client.from(table).insert(payload));
            } else {
                ({ error } = await db.client.from(table).update(payload).eq("id", id));
            }
            if (error) throw error;
            hideModal(modalId);
            await renderTable(table);
            toast(mode === "add" ? "Data berhasil ditambahkan." : "Perubahan berhasil disimpan.");
        } catch (err) {
            toast("Gagal menyimpan: " + (err.message || err), false);
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = original;
        }
    }

    async function doDelete() {
        if (!pendingDelete) return;
        const { table, id } = pendingDelete;
        const db = window.DesaDB;
        const btn = document.getElementById("deleteModalConfirm");
        btn.disabled = true;
        try {
            const { error } = await db.client.from(table).delete().eq("id", id);
            if (error) throw error;
            hideModal("deleteModal");
            await renderTable(table);
            toast("Data berhasil dihapus.");
        } catch (err) {
            toast("Gagal menghapus: " + (err.message || err), false);
        } finally {
            btn.disabled = false;
            pendingDelete = null;
        }
    }

    /* ---------- preview modal fill (delegated, works for dynamic rows) ---------- */
    function fillPreview(btn) {
        const title = btn.getAttribute("data-title") || "Preview";
        const body = btn.getAttribute("data-body") || "-";
        const media = btn.getAttribute("data-media") || "";
        const modal = document.getElementById("previewModal");
        const previewBody = document.getElementById("previewBody");
        if (previewBody) {
            previewBody.innerHTML =
                '<div class="row g-3 align-items-start">' +
                (media ?
                    '<div class="col-md-5"><div class="rounded-4 overflow-hidden border" style="background:#F8FAFC;">' +
                    '<img src="' + esc(media) + '" alt="Preview" class="w-100" style="height:200px;object-fit:cover;"></div></div>' : "") +
                '<div class="col-md-' + (media ? "7" : "12") + '">' +
                '<div class="mb-2"><span class="badge rounded-pill" style="background:rgba(22,101,52,.12);' +
                'border:1px solid rgba(22,101,52,.18);color:#166534;font-weight:900;">' + esc(title) + "</span></div>" +
                '<div class="text-muted fw-semibold">' + esc(body) + "</div>" +
                "</div></div>";
        }
        const modalTitle = modal ? modal.querySelector(".modal-title") : null;
        if (modalTitle) modalTitle.textContent = title;
    }

    /* ---------- init ---------- */
    document.addEventListener("DOMContentLoaded", async () => {
        const db = window.DesaDB;
        if (!db || !db.configured) return; // fallback: biarkan tabel dummy

        for (const table of Object.keys(CONFIG)) {
            await renderTable(table);
        }

        document.getElementById("addModalSave").addEventListener("click", () => saveForm("add"));
        document.getElementById("editModalSave").addEventListener("click", () => saveForm("edit"));
        document.getElementById("deleteModalConfirm").addEventListener("click", doDelete);

        document.addEventListener("click", (e) => {
            const addBtn = e.target.closest('[data-bs-target="#addModal"]');
            if (addBtn) {
                const sec = addBtn.closest(".admin-section");
                const table = sec ? SECTION_TABLE[sec.id] : null;
                if (table) openAdd(table);
                return;
            }
            const editBtn = e.target.closest("[data-crud-edit]");
            if (editBtn) {
                openEdit(editBtn.getAttribute("data-crud-edit"), editBtn.getAttribute("data-id"));
                return;
            }
            const delBtn = e.target.closest("[data-crud-delete]");
            if (delBtn) {
                openDelete(delBtn.getAttribute("data-crud-delete"), delBtn.getAttribute("data-id"), delBtn.getAttribute("data-label"));
                return;
            }
            const pvBtn = e.target.closest('[data-bs-target="#previewModal"]');
            if (pvBtn) fillPreview(pvBtn);
        });
    });
})();
