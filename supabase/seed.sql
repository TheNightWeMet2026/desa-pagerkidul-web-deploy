-- =====================================================
-- Desa Pagerkidul — seed data (starter content)
-- Run AFTER schema.sql in the Supabase SQL Editor.
-- Replace placeholder names/photos with real data later
-- via the admin dashboard.
-- =====================================================

-- profil desa (singleton)
insert into profil_desa (id, visi, misi, deskripsi, luas_wilayah, jumlah_penduduk, jumlah_dusun,
                         email, telepon, alamat, jam_pelayanan, lat, lng)
values (1,
  'Mewujudkan Desa Pagerkidul yang maju, mandiri, transparan, sejahtera, dan berbasis teknologi informasi.',
  array['Pemerintahan Transparan','Pelayanan Publik Digital','Pengembangan Potensi Desa','Informasi Terpercaya'],
  'Desa Pagerkidul merupakan salah satu desa di Kabupaten Pacitan yang terus mengembangkan pelayanan publik berbasis informasi.',
  '1.250 Ha', '3.205 Jiwa', '5 Dusun',
  'pagerkidul.sudimoro@gmail.com', '(0357) xxxx',
  'Desa Pagerkidul, Kecamatan Sudimoro, Kabupaten Pacitan, Jawa Timur',
  'Senin - Jumat, 08.00 - 15.00 WIB',
  -8.235525127926323, 111.34915231024438
)
on conflict (id) do nothing;

-- perangkat desa
insert into perangkat_desa (nama, jabatan, foto_url, telepon, urutan) values
  ('SUNANDI',          'Kades',             'assets/images/foto.jpg', '08xxxxxxxxxx', 1),
  ('TUWADI',           'Kasun Nglumpang',   'assets/images/foto.jpg', '08xxxxxxxxxx', 2),
  ('TRIONO',           'Kasun Krajan',      'assets/images/foto.jpg', '08xxxxxxxxxx', 3),
  ('SUYANTO',          'Kasun Worawari',    'assets/images/foto.jpg', '08xxxxxxxxxx', 4),
  ('SUPRAPTO',         'Kasun Gemaharjo',   'assets/images/foto.jpg', '08xxxxxxxxxx', 5),
  ('SUNDOYO',          'Bendahara',         'assets/images/foto.jpg', '08xxxxxxxxxx', 6),
  ('SRI WAHYUNI',      'Kasi Pemerintahan', 'assets/images/foto.jpg', '08xxxxxxxxxx', 7),
  ('SRI WAHYUDI',      'Staf Desa',         'assets/images/foto.jpg', '08xxxxxxxxxx', 8),
  ('NOVI ARIKTA DINI', 'Kaur Perencanaan',  'assets/images/foto.jpg', '08xxxxxxxxxx', 9),
  ('JAINUDIN',         'Kasi Kesra',        'assets/images/foto.jpg', '08xxxxxxxxxx', 10),
  ('GATHOT PRAWOTO',   'Sekdes',            'assets/images/foto.jpg', '08xxxxxxxxxx', 11),
  ('BUDI PRASETIANTO', 'Staf Desa',         'assets/images/foto.jpg', '08xxxxxxxxxx', 12),
  ('ANITA SETYAWATI',  'Kaur TU dan Umum',  'assets/images/foto.jpg', '08xxxxxxxxxx', 13),
  ('ALI IMRON',        'Kasun Pagergunung', 'assets/images/foto.jpg', '08xxxxxxxxxx', 14),
  ('AGUS DIMYATI',     'Kasi Pelayanan',    'assets/images/foto.jpg', '08xxxxxxxxxx', 15);

-- umkm
insert into umkm (nama_usaha, pemilik, kategori, deskripsi, dusun, kontak, foto_url) values
  ('UMKM Makmur Jaya', 'Pak Ahmad', 'Makanan',
   'Keripik singkong khas Desa Pagerkidul diproduksi menggunakan singkong lokal pilihan dengan cita rasa gurih dan tanpa bahan pengawet.',
   'Dusun Krajan', '08xxxxxxxxxx', 'assets/images/desa.JPG'),
  ('Kelompok Wanita Tani', 'Ibu Siti', 'Minuman Herbal',
   'Minuman herbal berbahan jahe merah, gula aren dan rempah-rempah pilihan yang diproduksi secara higienis oleh masyarakat Desa Pagerkidul.',
   'Dusun Pager', '08xxxxxxxxxx', 'assets/images/desa.JPG'),
  ('UMKM Sumber Rejeki', 'Pak Joko', 'Kerajinan',
   'Kerajinan bambu berupa tempat tisu, keranjang, besek, dan berbagai produk dekoratif yang dibuat secara manual oleh pengrajin lokal.',
   'Dusun Kidul', '08xxxxxxxxxx', 'assets/images/desa.JPG');

-- potensi desa
insert into potensi (judul, kategori, deskripsi, foto_url) values
  ('Pertanian',  'Pertanian',  'Komoditas utama berupa padi, jagung, dan singkong yang menjadi sumber penghasilan masyarakat.', 'assets/images/desa.JPG'),
  ('Peternakan', 'Peternakan', 'Peternakan kambing dan sapi menjadi salah satu sektor ekonomi unggulan masyarakat desa.',       'assets/images/desa.JPG'),
  ('UMKM',       'UMKM',       'Berbagai produk olahan pangan dan kerajinan lokal terus dikembangkan oleh masyarakat.',          'assets/images/desa.JPG'),
  ('Wisata Alam','Wisata',     'Memiliki panorama alam yang masih asri dan berpotensi menjadi destinasi wisata berbasis desa.',  'assets/images/desa.JPG');

-- statistik (tahun 2026)
insert into statistik (kategori, label, nilai) values
  ('pendidikan','SD',950), ('pendidikan','SMP',700), ('pendidikan','SMA',1200), ('pendidikan','D3/S1',390),
  ('pekerjaan','Petani',900), ('pekerjaan','Nelayan',350), ('pekerjaan','UMKM',280), ('pekerjaan','PNS',110), ('pekerjaan','Pelajar',600),
  ('gender','Laki-laki',1635), ('gender','Perempuan',1605),
  ('umur','0-14',420), ('umur','15-24',580), ('umur','25-44',1030), ('umur','45-59',720), ('umur','60+',490);

-- galeri (starter: existing site images; upload real photos to the desa-images bucket later)
insert into galeri (foto_url, caption) values
  ('assets/images/desa.JPG', 'Suasana Desa Pagerkidul'),
  ('assets/images/foto.jpg', 'Kegiatan Desa Pagerkidul'),
  ('assets/images/logo-pacitan.jpg', 'Logo Kabupaten Pacitan');

-- contoh berita/pengumuman
insert into berita (judul, isi, published) values
  ('Selamat datang di website Desa Pagerkidul',
   'Portal resmi Pemerintah Desa Pagerkidul sebagai pusat informasi, pelayanan publik, dan transparansi pemerintahan.',
   true);
