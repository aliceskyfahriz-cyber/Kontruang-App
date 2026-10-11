# Paket situs Kontruang PWA (GitHub Pages)

Folder ini berisi hasil build Kontruang v0.2 PWA (build dengan base `/Kontruang-App/`)
yang dikemas sebagai ZIP lalu di-encode base64 dan dipecah jadi potongan teks
`site.zip.b64.part*` — karena konektor GitHub Muse hanya bisa mengunggah file teks.

Workflow `.github/workflows/kontruang-pages.yml` merakitnya kembali
(`cat site.zip.b64.part* | base64 -d`), mengekstrak, dan menerbitkan ke GitHub Pages:

**https://aliceskyfahriz-cyber.github.io/Kontruang-App/**

Untuk memperbarui: bangun ulang dist dengan `VITE_BASE=/Kontruang-App/`,
zip isinya, ganti potongan base64-nya, lalu push — deploy berjalan otomatis.

Deploy dipicu ulang oleh Muse pada 11 Okt 2026 setelah Fahriz menambahkan workflow & mengaktifkan Pages (GitHub Actions).
Pemicu ke-2: repo dijadikan publik + Pages Source GitHub Actions (11 Okt 2026).
Pemicu ke-3: Source GitHub Actions terkonfirmasi tersimpan (banner 'GitHub Pages source saved').
