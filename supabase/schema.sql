-- ---------- content tables ----------

create table if not exists perangkat_desa (
  id bigint generated always as identity primary key,
  nama text not null,
  jabatan text not null,
  foto_url text,
  telepon text,
  urutan int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists umkm (
  id bigint generated always as identity primary key,
  nama_usaha text not null,
  pemilik text,
  kategori text,
  deskripsi text,
  dusun text,
  kontak text,
  foto_url text,
  created_at timestamptz not null default now()
);

create table if not exists potensi (
  id bigint generated always as identity primary key,
  judul text not null,
  kategori text,
  deskripsi text,
  foto_url text,
  created_at timestamptz not null default now()
);

create table if not exists berita (
  id bigint generated always as identity primary key,
  judul text not null,
  isi text,
  foto_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists galeri (
  id bigint generated always as identity primary key,
  foto_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

-- singleton row (id = 1): site-wide profile settings
create table if not exists profil_desa (
  id int primary key,
  visi text,
  misi text[] not null default '{}',
  deskripsi text,
  luas_wilayah text,
  jumlah_penduduk text,
  jumlah_dusun text,
  email text,
  telepon text,
  alamat text,
  jam_pelayanan text,
  lat double precision,
  lng double precision,
  updated_at timestamptz not null default now()
);

create table if not exists statistik (
  id bigint generated always as identity primary key,
  kategori text not null,            -- pendidikan | pekerjaan | gender | umur
  label text not null,
  nilai int not null,
  tahun int not null default 2026,
  created_at timestamptz not null default now()
);

-- ---------- village-service tables ----------

create table if not exists layanan_surat (
  id bigint generated always as identity primary key,
  jenis_surat text not null,          -- e.g. 'KTP', 'Domisili', 'SKTM', 'Kelahiran'
  nama_pemohon text not null,
  nik text not null,
  keperluan text,
  kontak text,
  status text not null default 'diajukan',  -- diajukan | diproses | selesai | ditolak
  created_at timestamptz not null default now()
);

create table if not exists pengaduan (
  id bigint generated always as identity primary key,
  nama text not null,
  kontak text,
  isi text not null,
  status text not null default 'baru',      -- baru | diproses | selesai
  created_at timestamptz not null default now()
);

-- ---------- row level security ----------

alter table perangkat_desa enable row level security;
alter table umkm            enable row level security;
alter table potensi         enable row level security;
alter table berita          enable row level security;
alter table galeri          enable row level security;
alter table profil_desa     enable row level security;
alter table statistik       enable row level security;
alter table layanan_surat   enable row level security;
alter table pengaduan       enable row level security;

-- public read access for published content
create policy "public read perangkat" on perangkat_desa for select using (true);
create policy "public read umkm"      on umkm            for select using (true);
create policy "public read potensi"   on potensi          for select using (true);
create policy "public read berita"    on berita           for select using (published = true);
create policy "public read galeri"    on galeri           for select using (true);
create policy "public read profil"    on profil_desa      for select using (true);
create policy "public read statistik" on statistik        for select using (true);

-- villagers can submit service requests (no public read)
create policy "public insert layanan"   on layanan_surat for insert with check (true);
create policy "public insert pengaduan" on pengaduan     for insert with check (true);

-- logged-in admins (Supabase Auth) can manage everything
create policy "admin all perangkat" on perangkat_desa for all to authenticated using (true) with check (true);
create policy "admin all umkm"      on umkm            for all to authenticated using (true) with check (true);
create policy "admin all potensi"   on potensi          for all to authenticated using (true) with check (true);
create policy "admin all berita"    on berita           for all to authenticated using (true) with check (true);
create policy "admin all galeri"    on galeri           for all to authenticated using (true) with check (true);
create policy "admin all profil"    on profil_desa      for all to authenticated using (true) with check (true);
create policy "admin all statistik" on statistik        for all to authenticated using (true) with check (true);
create policy "admin all layanan"   on layanan_surat    for all to authenticated using (true) with check (true);
create policy "admin all pengaduan" on pengaduan        for all to authenticated using (true) with check (true);

-- ---------- image storage ----------

insert into storage.buckets (id, name, public)
values ('desa-images', 'desa-images', true)
on conflict (id) do nothing;

create policy "public read images"
  on storage.objects for select using (bucket_id = 'desa-images');

create policy "admin upload images"
  on storage.objects for insert to authenticated with check (bucket_id = 'desa-images');

create policy "admin update images"
  on storage.objects for update to authenticated using (bucket_id = 'desa-images');

create policy "admin delete images"
  on storage.objects for delete to authenticated using (bucket_id = 'desa-images');
