# 🌿 Lestari - Platform Kampanye Lingkungan Hidup

**Lestari** adalah platform web modern yang bertujuan untuk meningkatkan kesadaran masyarakat tentang isu lingkungan, menggalang partisipasi dalam event sosial, dan memfasilitasi donasi digital secara transparan.

Proyek ini dibuat sebagai pemenuhan Tugas Ujian Akhir Semester (UAS) Mata Kuliah Pemrograman Web.

🚀 **Demo Aplikasi:** [https://putunebandi.github.io/lestari/index.html](https://putunebandi.github.io/lestari/index.html)

---

## ✨ Fitur Unggulan

### 1. 📖 Artikel Edukatif & Pencarian
* Menampilkan artikel terkini seputar lingkungan.
* **Fitur Search Real-time:** Memfilter artikel berdasarkan judul atau kategori tanpa *reload* halaman.
* **Share Button:** Bagikan artikel ke WhatsApp, Twitter, atau Salin Link dengan notifikasi Toast.

### 2. 📅 Manajemen Event
* Informasi jadwal kegiatan kampanye alam.
* Detail event lengkap dengan lokasi dan waktu.

### 3. 💸 Sistem Donasi Interaktif
* **Format Rupiah Otomatis:** Input nominal donasi otomatis menambahkan titik ribuan (Contoh: `50.000`).
* **Validasi Input:** Minimal donasi Rp 20.000.
* **Simulasi QRIS:** Pop-up pembayaran menggunakan SweetAlert2 dengan *countdown timer* dan simulasi proses verifikasi.
* **Transparansi:** Laporan penggunaan dana dapat diunduh (PDF) sebagai bukti akuntabilitas.

### 4. 📩 Formulir Kontak
* Validasi input formulir.
* Simulasi pengiriman pesan dengan animasi *loading* dan notifikasi sukses yang personal.

---

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan teknologi *Client-Side* modern:

* **HTML5 & CSS3**: Struktur dan styling halaman.
* **Bootstrap 5**: Framework CSS untuk tampilan responsif (*Mobile Friendly*).
* **JavaScript (Vanilla ES6+)**: Logika interaktif utama (DOM Manipulation).
* **JSON**: Penyimpanan data konten (Artikel, Event, Laporan Donasi).
* **SweetAlert2**: Library untuk notifikasi *popup* dan *alert* interaktif.

---

## 📂 Struktur Folder

```text
lestari/
├── assets/
│   ├── css/
│   │   └── style.css       # Custom CSS
│   ├── js/
│   │   └── script.js       # Logika Utama
│   ├── img/                # Aset Gambar
│   └── documents/          # File Dokumen Laporan
├── data/
│   ├── articles.json       # Database Artikel
│   ├── events.json         # Database Event
│   └── donasi.json         # Database Laporan Donasi
├── index.html              # Halaman Utama
├── artikel.html            # Halaman Daftar Artikel
├── donasi.html             # Halaman Donasi
├── event.html              # Halaman Daftar Event
├── kontak.html             # Halaman Kontak
└── README.md               # Dokumentasi Proyek