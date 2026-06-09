# Pustaka Konteks (Context Library) - BAKTI NUSA Survey App

File ini adalah peta dan dokumentasi cepat untuk keseluruhan aplikasi. Tujuannya agar pengembangan selanjutnya bisa lebih "sat-set" saat mencari letak fitur, komponen, logika, atau desain.

---

## 🏗️ 1. Arsitektur & Teknologi
- **Framework:** Next.js (App Router)
- **Styling:** Vanilla CSS dengan variabel terpusat (Neo-Brutalism / Duolingo-like UI)
- **Database Utama:** Google Sheets (melalui API `googleapis` untuk Read & Write)
- **Data Statis:** File CSV lokal di-parsing menggunakan `papaparse`

---

## 📂 2. Peta Direktori Utama

### `src/app/` (Routing & Halaman Server)
| File/Folder | Fungsi |
|-------------|--------|
| `layout.js` | Kerangka dasar HTML, memuat font (Google Fonts), dan memuat komponen global `<ScrollToTop />`. |
| `page.js` | Halaman **Beranda/Katalog**. (Server Component). Mengambil data `daftar_awardee.csv` dan melemparnya ke `<CatalogClient />`. |
| `survey/[referal]/page.js` | Halaman **Buka Survey**. Mengecek ID referal, jika valid, memuat data rubrik penilaian dan melemparnya ke `<SurveyForm />`. |
| `dashboard/[referal]/page.js` | Halaman **Data Insight**. Terhubung langsung ke Google Sheets API untuk membaca data, menghitung demografi, dan memuat ulasan Pengembangan Diri secara *real-time*. |
| `api/submit/route.js` | **Backend Endpoint**. Menerima POST request dari form survey dan menulis/menambahkan baris data ke Google Sheets. |
| `globals.css` | **Pusat Desain (CSS)**. Menyimpan semua warna (Tema Merah BAKTI NUSA), *class* kotak (`.glass-card`), animasi blob, dan responsivitas web. |

### `src/components/` (Logika & Interaksi UI/Client)
| File | Deskripsi & Fitur Utama |
|------|-------------------------|
| `CatalogClient.js` | Merender daftar kartu Awardee di beranda. **Fitur:** *Search Box* pencarian nama/wilayah, dan *Fallback Copy Link* (bisa copy URL + muncul modal sukses 🥳). |
| `SurveyForm.js` | Mesin utama form survey. **Fitur:** <br>- Form *Step-by-step* (Profil -> Penilaian -> Saran). <br>- Fitur *Auto-Scroll Highlight* untuk pertanyaan yang belum dijawab. <br>- **Double Confirmation Modal** (🤔 Sudah Yakin?) sebelum submit ke *database*. |
| `ScrollToTop.js` | Tombol melayang (ikon ⬆️) di sudut kanan bawah yang muncul saat user *scroll* jauh ke bawah. |

### `src/data/` (Data Statis Lokal)
| File | Fungsi |
|------|--------|
| `daftar_awardee.csv` | Database mentah awardee (Nama, Referal, Wilayah, Foto). Ekstensi foto sudah dikompresi menjadi `.webp`. |
| `rubrik_evaluasi.csv` | Kumpulan soal pertanyaan dan kategori penilaian untuk di-render di `SurveyForm.js`. |

---

## 🎨 3. Pustaka Warna & CSS (di `globals.css`)
Jika ingin merubah warna, ubah variabel di bagian `:root` pada file `globals.css`:
- `--bg-main: #991b1b;` -> Background dominan (Merah Gelap).
- `--primary: #dc2626;` -> Warna utama tombol dan interaksi (Merah Menyala).
- `--accent-green: #bef264;` -> Hijau stabilo untuk tombol *Submit/Lanjut*.
- `--accent-blue: #fca5a5;` -> Aksen merah muda (digunakan di teks *subtitle*).
- `.glass-card` / `.catalog-card` -> Wadah desain komponen utama dengan sudut membulat (*squircle*).

---

## 🔑 4. Konfigurasi Environment (Rahasia)
Untuk bisa berjalan dengan baik (terutama saat terkoneksi ke Vercel atau Localhost), aplikasi **harus** memiliki 3 variabel ini di Vercel atau di file `.env` lokal:
1. `GOOGLE_CLIENT_EMAIL`
2. `GOOGLE_PRIVATE_KEY`
3. `SPREADSHEET_ID`

---

## 🚀 5. Perintah Terminal Berguna
- Menjalankan secara lokal biasa: `npm run dev`
- Menjalankan agar bisa diakses lewat HP (di jaringan Wi-Fi yang sama): `npm run dev -- -H 0.0.0.0`
- Menginstall *package* baru: `npm install <nama_package>`
- *Push* ke GitHub: `git add .` -> `git commit -m "Pesan"` -> `git push`

---
*Dokumen ini dibuat otomatis oleh AI Assistant untuk memudahkan navigasi bagi tim developer.*
