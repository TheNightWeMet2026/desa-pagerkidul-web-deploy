# Supabase backend — setup guide

## 1. Create the project (2 minutes)
1. Go to https://supabase.com → sign up / log in.
2. **New project** → name it `desa-pagerkidul`, pick the region closest to you (Singapore), set a database password.
3. Wait for the project to finish provisioning.

## 2. Create the tables
1. Open **SQL Editor** → **New query**.
2. Paste the full contents of `schema.sql` → **Run**.
3. New query → paste `seed.sql` → **Run**.
4. Check **Table Editor**: you should see `perangkat_desa`, `umkm`, `potensi`, `berita`, `galeri`, `profil_desa`, `statistik`, `layanan_surat`, `pengaduan` with starter rows.

## 3. Create the admin login
1. Go to **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email: e.g. `admin@pagerkidul.id`, set a strong password, **auto-confirm** the user.
3. This email + password is what you type into the site's **Login Admin** button.

## 4. Connect the website
1. Go to **Project Settings** → **API**. Copy the **Project URL** and the **anon public** key.
2. Open `assets/js/supabase-config.js` in this repo and paste them in.
3. Commit + push, then redeploy (or just re-upload the files).

That's it — the public site will now load perangkat desa, UMKM, potensi, galeri, and charts
from the database, and the admin login uses real Supabase Auth instead of the old demo.

## 5. Uploading photos
- Use **Storage** → bucket `desa-images` (public). Upload photos there, copy the public URL,
  and paste it into the `foto_url` field of the relevant row in Table Editor.
- Later, the admin dashboard's upload buttons can be wired to this bucket.

## Notes
- Row Level Security is ON: the public can only *read* published content and *submit*
  layanan/pengaduan forms. Only logged-in admins can write.
- The `anon` key is safe to ship in frontend code (it's public by design); RLS is what protects the data.
- Never put the `service_role` key in the website.
