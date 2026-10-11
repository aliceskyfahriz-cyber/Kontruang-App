# Kontruang — Brief Awal Projek

**Nama:** Kontruang (singkatan: kontrol uang)
**Jenis:** Aplikasi pengontrol keuangan milik Fahriz
**Dibuat:** 7 Oktober 2026
**Status:** **v0.2 PWA SUDAH DIBUAT (10 Okt 2026, perintah Fahriz "Gas lanjut v0.2 PWA")** — service worker offline-first (`public/sw.js`, cache `kontruang-v0.2.0`, registrasi hanya di build production), manifest + meta PWA lengkap, banner Install in-app (beforeinstallprompt, hilang saat standalone), backup & restore JSON (di Laporan: unduh/impor 1 file berisi wallets+transactions+budgets+bills, schema v1, validasi format + konfirmasi timpa; teruji round-trip 37 transaksi pulih dan file rusak ditolak), form transaksi jadi bottom sheet di mobile + autofocus nominal. Build terverifikasi, semua aset tersaji HTTP 200. Paket: ZIP sumber `kontruang.zip` + ZIP hasil build siap deploy `kontruang-dist-v0.2.zip` (isi di root). **Catatan jujur:** install PWA + SW hanya aktif di HTTPS atau localhost — dari HP lewat IP LAN (HTTP) tidak akan muncul prompt install; untuk install di HP perlu hosting HTTPS (deploy ZIP dist) atau lanjut Capacitor. **TERATASI 10 Okt 2026 18:15 WIB — Kontruang LIVE di https://aliceskyfahriz-cyber.github.io/Autograph_101/** (GitHub Pages dari repo Autograph_101; alur deploy: paket base64 di `kontruang-pwa/` repo → workflow Actions merakit & menerbitkan; run #2 Success, 10 aset terverifikasi HTTP 200 dari internet). Pembaruan versi berikutnya mengikuti pola yang sama: bangun ulang paket base64 (base `/Autograph_101/`) → unggah potongan → workflow otomatis menerbitkan. — Riwayat: Prototype website v0.1 dibuat 7 Okt 2026 atas perintah Fahriz — Vue 3 + Vite + localStorage di `~/workspace/projects/kontruang/kontruang-web/`, terverifikasi `npm install` + `npm run build` sukses dan dev server jalan di localhost:5173. ZIP untuk Fahriz: `~/workspace/projects/kontruang/kontruang.zip` (32 KB, tanpa node_modules/dist). Isi v0.1: Dashboard (saldo, masuk vs keluar bulan ini, grafik 6 bulan, tagihan, peringatan anggaran), Transaksi (CRUD + cari/saring), Anggaran per kategori, Dompet & tagihan berulang (tombol Bayar auto-catat), Laporan (per kategori, ekspor CSV, hapus/reset data). Data bawaan = data contoh bertanda "(contoh)". Menunggu penilaian Fahriz setelah ia jalankan di VS Code.

## Sasaran pengguna & visi (dari Fahriz, 7 Okt 2026)

- **Fase awal: pribadi dulu** — dipakai Fahriz sendiri.
- **Jangka panjang: publik** — dikembangkan agar semua orang bisa pakai, dengan merombak/mengubah semua fitur di dalamnya. Jadi versi publik bukan sekadar membuka versi pribadi apa adanya; fiturnya akan didesain ulang untuk umum.

## Garis besar fungsi (dari Fahriz, 7 Okt 2026)

- Melihat **uang keluar dan uang masuk**.
- **Tracking seberapa besar pemasukan dan pengeluaran** (perbandingan/ringkasan arus kas).

### Turunan fitur draf (usulan Muse dari garis besar di atas — menunggu konfirmasi Fahriz)

- Dashboard: saldo saat ini, total pemasukan, total pengeluaran (per periode: bulan berjalan sebagai default)
- Tambah transaksi: pemasukan / pengeluaran, nominal, tanggal, catatan, kategori
- Riwayat transaksi: daftar uang masuk-keluar yang bisa disaring per periode/kategori
- Visualisasi: grafik perbandingan pemasukan vs pengeluaran

## Aplikasi referensi / framework fitur (dari Fahriz, 7 Okt 2026)

Fahriz menetapkan aplikasi ini sebagai acuan fitur-fitur Kontruang:

- **Money Lover – Money Manager** — Play Store: https://play.google.com/store/apps/details?id=com.bookmark.money
- Rating saat dicek 7 Okt 2026: ±4,1 dari ±208 ribu ulasan; klaim 10 juta+ pengguna.

Fitur Money Lover (ringkasan dari halaman Play Store-nya, diparafrasekan):

- Pencatat pengeluaran/pemasukan, termasuk tagihan dan utang
- Perencana anggaran, termasuk prediksi pengeluaran dari riwayat
- Keamanan PIN / sidik jari
- Sinkronisasi antarperangkat
- Dompet tertaut: sinkronisasi otomatis ke rekening bank (berlangganan)
- Premium: banyak dompet terpisah (tunai, tabungan, kartu kredit, atau per keperluan), anggaran lanjutan per kategori, laporan beragam format, ekspor ke Google Sheets, tagihan & transaksi berulang dengan pengingat, tanpa iklan

### Pemetaan awal ke Kontruang (usulan Muse — menunggu konfirmasi Fahriz)

- **Masuk inti v1 pribadi:** pencatatan masuk/keluar + tagihan/utang, anggaran, banyak dompet, transaksi berulang + pengingat tagihan, laporan, ekspor
- **Fase lanjut / publik:** sinkronisasi antarperangkat (butuh akun + backend), keamanan PIN/sidik jari (paling relevan di fase mobile), sinkronisasi bank otomatis (paling kompleks — terakhir)

## Roadmap platform (dari Fahriz, 7 Okt 2026)

1. **Fase 1 — Website:** dibangun sebagai website dulu.
2. **Fase 2 — Mobile:** di-grow menjadi aplikasi mobile yang bisa diinstal di handphone.

**Rancangan mobile dibuat 10 Okt 2026** atas permintaan Fahriz di thread khusus Kontruang: dokumen lengkap di `~/workspace/projects/kontruang/RANCANGAN-MOBILE.md`. Usulan intinya: PWA dulu (v0.2) → Capacitor APK Android (v0.3) dari basis kode Vue yang sama (tanpa rewrite), Android dulu, data offline-first lokal dengan migrasi localStorage → Capacitor Preferences + backup/restore JSON, PIN + sidik jari masuk v1 mobile (v0.4), package ID usulan `id.fahriz.kontruang`. Menunggu keputusan Fahriz atas 5 poin di §8 dokumen tersebut sebelum dibangun.

### Implikasi teknis (catatan Muse, untuk diputuskan saat mulai bangun)

- Bangun website dengan pendekatan **mobile-first + PWA-ready** supaya transisi ke aplikasi instalabel mulus: dari basis kode yang sama bisa jadi PWA (installable, tanpa store) atau dibungkus **Capacitor** menjadi APK Android — jalur ini cocok dengan pengalaman Fahriz (Ionic Vue, Node.js, TypeScript).
- Hindari keputusan arsitektur yang mengunci ke desktop saja (layout responsif sejak awal, data terpisah dari tampilan lewat API/service layer).

## Identitas visual

- ~~Logo huruf "K" kuning adalah placeholder~~ → **SUDAH DIGANTI 10 Okt 2026 (v0.1.2)** dengan 3 logo STAYFOCUS / Auto Graph kiriman Fahriz hari itu (asli tersimpan di `~/workspace/projects/kontruang/assets/original/`): (1) **Auto Graph #101 putih** → di-crop rapat jadi `public/logo-utama.png` = logo brand di sidebar + header mobile, sekaligus sumber set ikon aplikasi (`icon-192/512`, maskable 512, apple-touch-icon; favicon & manifest PWA sudah menunjuk ke ikon baru); (2) **Auto Graph emblem abu penuh** → `public/logo-emblem.png` = poster di sidebar web + sumber splash mobile (`assets/mobile/splash-emblem-1024.png`); (3) **STAYFOCUS** → `public/logo-stayfocus.png` = credit brand di footer ("by STAYFOCUS × Auto Graph"). Build v0.1.2 terverifikasi sukses, ZIP diperbarui (±969 KB).
- Catatan QC dari screenshot Fahriz (8 Okt 2026): saldo demo dompet Tunai & E-Wallet tampil negatif karena total pengeluaran contoh 6 bulan melebihi saldo awal kedua dompet itu — perlu diseimbangkan ulang di seed versi berikutnya.

## Gaya UI (preferensi Fahriz, 7 Okt 2026)

- Dasar **monokrom**: hitam `#0A0A0A` / `#171717`, putih/off-white `#E5E5E5` / `#FAFAFA`
- Aksen **abu-abu**: `#262626`, `#737373`, `#A3A3A3`
- Aksen **yellow glow**: `#FFD60A` / `#FDE047` — hemat, untuk highlight, tombol utama, status penting, dan efek glow

## Yang belum ditentukan (menunggu konteks lanjutan dari Fahriz)

- ~~Pengguna: pribadi atau bersama keluarga~~ → **Sudah diputuskan 7 Okt 2026: pribadi dulu, publik kemudian.**
- Fitur tambahan di luar arus kas: acuan Money Lover sudah mencakup budget, utang, tagihan berulang, laporan & ekspor — tinggal Fahriz putuskan subset mana yang masuk v1, mana yang menyusul.
- Kategori transaksi: daftar kategorinya apa saja, atau bebas dibuat sendiri?
- Periode tracking utama: harian / mingguan / bulanan?
- Data: lokal dulu (localStorage) atau langsung backend + login? (untuk fase pribadi, lokal lebih cepat; fase publik pasti butuh akun + backend)
- Kaitan dengan investasi Bibit Fahriz (RD/SBN) — masuk pantauan atau terpisah?
