-- ============================================
-- Portfolio Database Schema + RLS + Seed Data
-- ============================================

-- Profile / About
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  about_title TEXT,
  about_paragraph_1 TEXT,
  about_paragraph_2 TEXT,
  experience TEXT,
  status TEXT,
  email TEXT,
  github TEXT,
  instagram TEXT,
  profile_image_url TEXT,
  about_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  github_url TEXT,
  tags TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT,
  date TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  project TEXT,
  message TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Public read policies (anyone can view portfolio)
-- ============================================
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);

-- ============================================
-- Auth write policies (only logged-in users can modify)
-- ============================================
CREATE POLICY "Auth insert profiles" ON profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update profiles" ON profiles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete profiles" ON profiles FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert skills" ON skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update skills" ON skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete skills" ON skills FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert certificates" ON certificates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update certificates" ON certificates FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete certificates" ON certificates FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert testimonials" ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update testimonials" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete testimonials" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- Storage Bucket RLS Policies
-- (Create the bucket "portfolio" manually in Supabase Dashboard first, set to Public)
-- ============================================

-- Allow anyone to view/download files (public portfolio images)
CREATE POLICY "Public read storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

-- Allow authenticated users to upload files
CREATE POLICY "Auth upload storage" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update files
CREATE POLICY "Auth update storage" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete files
CREATE POLICY "Auth delete storage" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio'
    AND auth.role() = 'authenticated'
  );

-- ============================================
-- Seed Data
-- ============================================

-- Seed Profile
INSERT INTO profiles (full_name, tagline, bio, about_title, about_paragraph_1, about_paragraph_2, experience, status, email, github, instagram)
VALUES (
  'Ferdiansyah Pratama',
  'Freelancer Web Developer & Machine Learning Enthusiast',
  'Saya menyukai tantangan dalam problem solving dan menulis kode yang rapi serta terstruktur. Saya menciptakan solusi digital inovatif melalui pengembangan web dan machine learning.',
  'Halo! Saya Ferdiansyah, mahasiswa yang passionate dengan teknologi',
  'Saya adalah mahasiswa Pendidikan Teknik Informatika yang aktif sebagai freelancer dengan pengalaman lebih dari 1 tahun. Saya memiliki passion khusus dalam problem solving dan selalu berusaha menulis kode yang rapi, terstruktur, dan mudah dipelihara.',
  'Sebagai seseorang yang menyukai tantangan, saya selalu antusias menghadapi masalah-masalah kompleks dalam pengembangan aplikasi web modern. Saat ini, saya juga tengah fokus mengembangkan kemampuan saya di bidang Artificial Intelligence karena saya ingin menjadi seorang AI Engineer yang mampu membuat solusi pintar dan inovatif. Ketika tidak sedang coding, saya aktif belajar teknologi baru.',
  '1+ Tahun Freelancer',
  'Mahasiswa Aktif',
  'ferdiansyahpratama716@gmail.com',
  'https://github.com/PSocietyyy',
  'https://instagram.com/ferdiansyah_p69'
);

-- Seed Skills
INSERT INTO skills (name, sort_order) VALUES
  ('PHP', 1),
  ('JavaScript', 2),
  ('TypeScript', 3),
  ('Python', 4),
  ('TailwindCSS', 5),
  ('MySQL', 6),
  ('Laravel', 7),
  ('React', 8),
  ('Linux', 9),
  ('GitHub', 10),
  ('Scikit-Learn', 11),
  ('TensorFlow', 12);

-- Seed Projects
INSERT INTO projects (title, description, github_url, tags, sort_order) VALUES
  ('E-Commerce Editor Product',
   'Platform e-commerce dengan fitur editor produk yang memungkinkan seller untuk mengedit detail produk secara real-time',
   NULL,
   ARRAY['React', 'Laravel', 'MySQL'],
   1),
  ('Sistem Akademik Kampus (SIAKAD)',
   'Sistem informasi akademik untuk mempermudah pengelolaan aktivitas perkuliahan. Mulai dari pendataan mahasiswa & dosen, KRS/KHS, jadwal kuliah, presensi, hingga rapor nilai yang terintegrasi secara real-time.',
   NULL,
   ARRAY['Laravel', 'Livewire', 'MySQL'],
   2),
  ('Learning Management System (LMS)',
   'Platform pembelajaran digital yang mendukung proses belajar mengajar modern dengan fitur manajemen course, modul pembelajaran, quiz interaktif, pengumpulan tugas, serta sistem penilaian otomatis.',
   NULL,
   ARRAY['Laravel', 'Livewire', 'MySQL'],
   3),
  ('Marketplace Platform',
   'Platform marketplace multi-vendor dengan sistem pembayaran terintegrasi dan manajemen inventori',
   'https://github.com/PSocietyyy/marketplace',
   ARRAY['PHP', 'Laravel', 'MySQL'],
   4),
  ('Film Recommendation System',
   'Sistem rekomendasi film menggunakan machine learning untuk memberikan saran film berdasarkan film yang sedang ditonton',
   'https://github.com/PSocietyyy/recomendation_film',
   ARRAY['Python', 'Scikit-Learn'],
   5);

-- Seed Certificates
INSERT INTO certificates (title, issuer, date, sort_order) VALUES
  ('Linux Fundamental', 'Aguna Course', '2024', 1),
  ('Defensif Security Operation', 'Cybrary', '2024', 2),
  ('Linux Kernel Development', 'Linux Foundation', '2024', 3);

-- Seed Testimonials
INSERT INTO testimonials (name, project, message, sort_order) VALUES
  ('Arkadani Fathir Fahrezi',
   'PPDB Web dengan Custom Test',
   'Ferdiansyah sangat membantu dalam pengembangan sistem PPDB web dengan custom test. Kode yang dihasilkan rapi, terstruktur, dan mudah dipahami. Sangat profesional dan responsif!',
   1),
  ('Elang M Riefky',
   'E-Commerce Custom Product',
   'Saya sangat terbantu dengan kontribusi Ferdiansyah dalam project E-Commerce, khususnya dalam fitur custom product. Pengerjaannya cepat dan hasil yang diberikan sangat memuaskan.',
   2),
  ('Fachri Saleano D',
   'Pembelian LMS',
   'Saya puas dengan kualitas LMS yang disediakan Ferdiansyah. Proses pengerjaan cepat, fitur lengkap, dan sangat sesuai kebutuhan. Layanan after-sales juga sangat membantu.',
   3),
  ('Galih Kusumadinata',
   'LMS',
   'Platform LMS yang dikembangkan sangat mendukung proses belajar mengajar modern. Fitur manajemen course, modul pembelajaran, quiz interaktif, pengumpulan tugas, serta sistem penilaian otomatis bekerja dengan sangat baik dan mempermudah seluruh alur pembelajaran.',
   4);
