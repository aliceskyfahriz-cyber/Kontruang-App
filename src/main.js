import { createApp } from 'vue'
import App from './App.vue'
import './styles.css'

createApp(App).mount('#app')

// PWA: daftarkan service worker hanya di build production —
// di mode dev (vite) SW bisa menyajikan file lama dan membingungkan saat ngoding.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(() => {
      /* abaikan: aplikasi tetap jalan tanpa offline cache */
    })
  })
}
