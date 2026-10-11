import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Kontruang — dev server di http://localhost:5173 (sama seperti prototype AutographFJ v1)
// Base path bisa diganti lewat env VITE_BASE (mis. build GitHub Pages di subpath
// "/Autograph_101/"); default "/" untuk pemakaian normal / localhost / Capacitor nanti.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
  server: {
    port: 5173,
    host: true
  }
})
