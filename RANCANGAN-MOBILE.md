# Kontruang — Rancangan Versi Mobile

**Dibuat:** 10 Oktober 2026 (atas permintaan Fahriz di thread khusus Kontruang)
**Basis:** Web prototype v0.1.1 — Vue 3 + Vite + localStorage, di `kontruang-web/`
**Status:** RANCANGAN — menunggu keputusan Fahriz di §8 sebelum dibangun

---

## 1. Ringkasan keputusan utama (usulan)

| Hal | Usulan | Alasan |
|---|---|---|
| Jalur teknis | **PWA dulu → lalu Capacitor (APK Android)** dari basis kode yang sama | Tidak ada rewrite. Kode web sekarang sudah punya `manifest.webmanifest` + bottom navigation, jadi modal transisinya kecil. Capacitor juga sejalan dengan pengalaman Fahriz di Ionic Vue / TypeScript. |
| Platform pertama | **Android dulu** | HP utama Fahriz Android (Galaxy S23). iOS menyusul di fase publik (butuh Mac + akun Apple Developer). |
| Data | Tetap **offline-first, lokal di HP**. Migrasi `localStorage` → Capacitor Preferences, cadangan/restore via file JSON | Fase pribadi belum butuh server. Data keuangan sensitif tidak keluar HP. Backend + sinkronisasi disiapkan untuk fase publik saja. |
| Keamanan | **PIN + biometrik (sidik jari)** masuk v1 mobile | Ini fitur yang justru baru terasa gunanya di mobile (acuan Money Lover juga punya). Di web tidak relevan. |
| Package ID | `id.fahriz.kontruang` | Nama unik untuk Android; bisa diganti sebelum rilis Play Store, tidak bisa diganti sesudahnya. |

**Yang TIDAK diusulkan:** rewrite native (Kotlin/Flutter/React Native). Mahal, membuang kode Vue yang sudah jalan, dan tidak memberi keuntungan berarti untuk aplikasi pencatat keuangan.

---

## 2. Perbandingan jalur teknis

| | PWA | Capacitor (dipilih) | Rewrite native / Flutter |
|---|---|---|---|
| Usaha | Paling kecil — poles web yang ada | Sedang — bungkus web yang sama | Besar — tulis ulang semua |
| Install | Dari browser ("Tambahkan ke layar utama") | APK langsung / Play Store | Play Store / App Store |
| Akses fitur HP | Terbatas | Penuh: biometrik, notifikasi lokal, share sheet, penyimpanan aman | Penuh |
| Notifikasi tagihan | Tidak andal | **Andal (local notification)** | Andal |
| Sidik jari / PIN native | Tidak | **Ya (plugin)** | Ya |
| Biaya jalan | Rp0 | Rp0 untuk APK pribadi; Play Store USD 25 sekali bayar bila nanti publik | Sama + waktu rewrite |
| Peran di rencana | **Tahap perantara (v0.2)** | **Target utama (v0.3+)** | Tidak dipakai |

---

## 3. Navigasi & struktur layar

Pola mobile: **bottom tab bar 4 tab + 1 tombol aksi besar di tengah (FAB)**. Tombol "+" adalah jantungnya aplikasi keuangan — mencatat harus bisa < 5 detik, satu tangan, dari layar mana pun.

```
┌─────────────────────────────────────┐
│  Beranda  Transaksi   Anggaran  Lainnya │
│     ▦        ⇅      ◎       ⋯        │
│              ╭─────╮                  │
│              │  +  │ ← FAB kuning glow│
│              ╰─────╯                  │
└─────────────────────────────────────┘
```

Pemetaan dari 5 menu web sekarang:

| Menu web v0.1.1 | Di mobile | Catatan |
|---|---|---|
| Dashboard | **Tab Beranda** | Saldo total disembunyikan/ditampilkan dengan tap ikon mata (privasi saat buka aplikasi di tempat umum) |
| Transaksi | **Tab Transaksi** | List dikelompokkan per hari ("Hari ini", "Kemarin", tanggal), swipe kiri = hapus, swipe kanan = edit |
| — (modal Tambah) | **FAB "+" → bottom sheet** | Bukan halaman penuh: bottom sheet naik dari bawah, keyboard angka langsung fokus ke nominal |
| Anggaran | **Tab Anggaran** | Progress bar per kategori + peringatan kuning/merah saat ≥80% / ≥100% |
| Dompet | Masuk **Lainnya → Dompet** | Di mobile, dompet jarang dibuka harian — turun dari tab utama |
| Laporan | Masuk **Lainnya → Laporan** | Grafik batang 6 bulan dibuat vertikal-friendly; ekspor CSV via share sheet (kirim ke WhatsApp/email/Drive) |
| Tagihan berulang | Masuk **Lainnya → Tagihan** + muncul juga sebagai kartu di Beranda | Tombol "Bayar" tetap auto-catat transaksi, sama seperti web |
| — (baru) | **Lainnya → Pengaturan** | PIN/biometrik, backup & restore, tema, reset data, tentang |

### Rincian layar kunci

**a. Splash → Kunci**
Logo Kontruang di latar hitam → bila PIN aktif, minta PIN / sidik jari sebelum data tampil. Gagal 5× → jeda 30 detik.

**b. Beranda**
- Kartu saldo total (semua dompet) + masuk vs keluar bulan ini
- Kartu "Tagihan terdekat" (jatuh tempo ≤ 7 hari) dengan tombol Bayar
- Peringatan anggaran yang hampir habis
- 5 transaksi terakhir
- Grafik mini 6 bulan

**c. Bottom sheet Tambah Transaksi (layar terpenting)**
- Toggle Pengeluaran / Pemasukan di atas
- Nominal: keypad besar, format Rp otomatis saat mengetik
- Kategori: grid ikon, kategori terakhir dipakai tampil pertama
- Dompet: chip pilihan, default dompet terakhir dipakai
- Tanggal default hari ini; catatan opsional
- Tombol Simpan selalu terlihat di atas keyboard — target: **3 tap dari buka sheet sampai tersimpan** untuk transaksi rutin

**d. Transaksi**
- Cari + filter (periode, kategori, dompet, tipe) — disembunyikan di balik ikon filter, bukan memenuhi layar seperti di web
- Header lengket per hari dengan subtotal harian

---

## 4. Fitur khusus mobile (yang tidak ada / tidak maksimal di web)

Masuk **v1 mobile**:
1. **Notifikasi lokal tagihan** — pengingat H-3 dan H-1 sebelum jatuh tempo, jam 09.00 WIB. Jalan tanpa internet, tanpa server (local notification Capacitor).
2. **Pengingat catat harian** (opsional, bisa dimatikan) — jam 20.00: "Ada pengeluaran yang belum dicatat hari ini?"
3. **PIN + sidik jari** untuk membuka aplikasi.
4. **Backup & restore file JSON** — ekspor semua data ke satu file, simpan di Drive/WhatsApp ke diri sendiri; restore di HP baru tinggal impor file itu. Ini pengganti sinkronisasi selama fase pribadi.
5. **Share sheet native** untuk ekspor CSV laporan.
6. **Haptic feedback** ringan pada simpan transaksi & bayar tagihan.
7. **Splash screen + ikon aplikasi** proper — **ASET SUDAH TERSEDIA (10 Okt 2026):** Fahriz mengirim 3 logo STAYFOCUS / Auto Graph dan sudah dipasang di web v0.1.2. Set ikon aplikasi (192/512/maskable/apple-touch) dibuat dari logo Auto Graph #101 yang di-crop rapat; sumber splash dari logo emblem abu (`assets/mobile/splash-emblem-1024.png`, sumber ikon `assets/mobile/app-icon-source-1024.png`). Tinggal dipakai saat build Capacitor, tidak menunggu logo lagi.

Ditunda (fase lanjut, dicatat agar tidak hilang):
- Widget layar utama Android (saldo + tombol catat cepat)
- Scan struk / OCR nominal
- Sinkronisasi antarperangkat + akun (butuh backend Node.js — disiapkan untuk fase publik)
- Sinkronisasi bank otomatis (paling kompleks, terakhir, mengikuti pemetaan Money Lover di BRIEF)

---

## 5. Data & migrasi

- Skema data **tidak berubah**: `wallets`, `transactions`, `budgets`, `bills` (sama seperti `src/store.js` sekarang) — supaya data web dan mobile kompatibel dan file backup bisa saling dipakai.
- Penyimpanan naik kelas bertahap:
  - v0.2 (PWA): tetap `localStorage` + tambah ekspor/impor JSON sebagai jembatan.
  - v0.3 (Capacitor): pindah ke **Capacitor Preferences** (penyimpanan native persisten; `localStorage` di WebView Android bisa terhapus saat cache dibersihkan — risiko kehilangan data yang harus ditutup di fase ini).
  - Bila data membesar (> ribuan transaksi terasa lambat): pindah ke SQLite — ditunda sampai terbukti perlu.
- Migrasi otomatis sekali jalan saat upgrade: baca kunci lama `kontruang-data-v1`, salin ke penyimpanan baru, beri versi skema `schemaVersion: 1` untuk migrasi berikutnya.
- **Aturan emas:** tidak ada rilis mobile yang boleh menghapus/mengubah format data tanpa migrasi + backup otomatis dulu.

---

## 6. Gaya visual di mobile

Mengikuti preferensi Fahriz yang sudah terkunci (monokrom + yellow glow):

- Latar `#0A0A0A`, permukaan `#171717` / `#262626`, teks `#FAFAFA` / `#A3A3A3`
- Kuning `#FFD60A` hanya untuk: FAB "+", tab aktif, tombol utama, status penting — glow dipakai **hemat** (di layar kecil glow berlebihan cepat terasa norak & mengganggu keterbacaan di luar ruangan)
- Target sentuh minimum 48px; elemen penting di zona jempol (sepertiga bawah layar)
- Safe area (notch / gesture bar) dihormati; status bar menyatu dengan latar hitam
- Font & angka: nominal uang memakai angka tabular agar tidak bergeser saat berubah

---

## 7. Roadmap pengerjaan (setelah rancangan disetujui)

| Tahap | Isi | Hasil untuk Fahriz |
|---|---|---|
| **Mobile v0.2 — PWA** ✅ SELESAI 10 Okt 2026 | Service worker offline-first, ikon & manifest proper, banner Install in-app, backup/restore JSON (Laporan), form transaksi bottom sheet di mobile | ZIP sumber + ZIP dist siap deploy terkirim ke Fahriz; lalu **DIDEPLOY & LIVE 10 Okt 2026: https://aliceskyfahriz-cyber.github.io/Autograph_101/** (GitHub Pages, workflow run Success, aset terverifikasi) — sudah bisa di-install di HP |
| **Mobile v0.3 — Capacitor Android** | Bungkus Capacitor, migrasi penyimpanan ke Preferences, build APK | File `.apk` dikirim ke Fahriz, install langsung di Galaxy S23 |
| **Mobile v0.4 — Fitur native** | Notifikasi tagihan + pengingat harian, PIN + sidik jari, share sheet, haptic | Versi pribadi yang "utuh" untuk dipakai sehari-hari |
| **Mobile v1.0 — Siap publik (nanti)** | Backend + akun + sinkronisasi, desain ulang fitur untuk umum, Play Store | Di luar lingkup fase pribadi; dibahas terpisah saat Fahriz memutuskan go-publik |

Setiap tahap berhenti di titik aman dan menunggu kata lanjut dari Fahriz, sama seperti pola proyek lain.

---

## 8. Keputusan yang dibutuhkan dari Fahriz

1. **Jalur teknis:** setuju PWA (v0.2) → Capacitor (v0.3), atau langsung lompat ke Capacitor?
2. **Android saja dulu** — dikonfirmasi?
3. **PIN + sidik jari** masuk v1 mobile (di v0.4), atau ditunda dulu?
4. **Package ID** `id.fahriz.kontruang` — dipakai, atau ada nama lain?
5. ~~**Logo final** Kontruang~~ → **SELESAI 10 Okt 2026:** 3 logo STAYFOCUS / Auto Graph dikirim Fahriz dan sudah dipasang (lihat BRIEF.md bagian Identitas visual). Tidak lagi jadi penghambat.
