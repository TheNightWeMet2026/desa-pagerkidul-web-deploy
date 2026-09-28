# Desa Pagerkidul — Website

Website profil Desa Pagerkidul, Kecamatan Sudimoro, Kabupaten Pacitan.
Live dengan GitHub Pages dari branch `main`.

## Struktur

- `index.html` — halaman utama (profil, perangkat desa, UMKM, potensi, galeri, kontak)
- `admin.html` — dashboard admin
- `assets/` — CSS, JS, gambar
- `supabase/` — `schema.sql`, `seed.sql`, dan panduan setup backend
- `TODO.md` — daftar tugas lanjutan

## Backend (Supabase)

Konten dinamis (perangkat desa, UMKM, potensi, galeri, statistik, layanan surat,
pengaduan) tersimpan di Supabase. Tanpa konfigurasi, situs memakai konten statis
bawaan sebagai fallback.

Setup:

1. Buat project di [Supabase](https://supabase.com) (region Singapore).
2. Jalankan `supabase/schema.sql` di SQL Editor.
3. Jalankan `supabase/seed.sql` untuk data awal.
4. Buat admin user di Authentication → Users (auto-confirm).
5. Isi Project URL dan anon key di `assets/js/supabase-config.js`.

Panduan lengkap: `supabase/README.md`.

## Admin

Buka `admin.html` dan login dengan akun admin Supabase. Kelola Perangkat Desa,
Statistik, Potensi Desa, dan Produk UMKM langsung dari dashboard (tambah / edit /
hapus, termasuk upload foto).
