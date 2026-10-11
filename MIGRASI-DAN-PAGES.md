# Kontruang-App — catatan migrasi & deploy

Repo ini adalah rumah khusus proyek **Kontruang** sejak 11 Oktober 2026,
dipindahkan dari folder `kontruang/` + `kontruang-pwa/` di repo Autograph_101
agar tiap proyek Fahriz punya repo sendiri.

## Isi repo
- Kode sumber aplikasi (Vue 3 + Vite) di root repo: `src/`, `public/`, `index.html`,
  `package.json`, `vite.config.js` — versi PWA v0.2.
- `BRIEF.md` — brief proyek. `RANCANGAN-MOBILE.md` — rancangan jalur mobile (PWA → Capacitor).
- `kontruang-pwa/` — paket situs hasil build untuk GitHub Pages (base64, lihat README di dalamnya).
- Catatan: file biner di `public/` (ikon PNG & logo JPG) tidak ikut tersalin lewat
  konektor teks Muse; file-file itu ada di dalam paket situs `kontruang-pwa/`
  (untuk Pages) dan di arsip proyek lokal.

## Deploy GitHub Pages (sekali saja)
1. Tambahkan file `.github/workflows/kontruang-pages.yml` (Muse tidak bisa
   mengunggah file workflow — harus dibuat lewat web GitHub; isinya sama dengan
   workflow Kontruang di repo Autograph_101).
2. Settings → Pages → Source: **GitHub Actions**.
3. Push perubahan apa pun di `kontruang-pwa/**` memicu deploy otomatis.
   Alamat situs: https://aliceskyfahriz-cyber.github.io/Kontruang-App/
