<script setup>
import { ref, onMounted } from 'vue'

// Prefix path aset public — mengikuti base build (mis. subpath GitHub Pages)
const BASE = import.meta.env.BASE_URL
import Dashboard from './views/Dashboard.vue'
import Transactions from './views/Transactions.vue'
import Budgets from './views/Budgets.vue'
import Wallets from './views/Wallets.vue'
import Reports from './views/Reports.vue'
import TransactionModal from './components/TransactionModal.vue'
import { addTransaction, updateTransaction, removeTransaction } from './store.js'

const page = ref('dashboard')
const modalOpen = ref(false)
const editing = ref(null)

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'transaksi', label: 'Transaksi', icon: '⇅' },
  { id: 'anggaran', label: 'Anggaran', icon: '◎' },
  { id: 'dompet', label: 'Dompet', icon: '▤' },
  { id: 'laporan', label: 'Laporan', icon: '▥' }
]

function openAdd() {
  editing.value = null
  modalOpen.value = true
}

function openEdit(tx) {
  editing.value = tx
  modalOpen.value = true
}

function handleSave(data) {
  if (editing.value) updateTransaction(editing.value.id, data)
  else addTransaction(data)
  modalOpen.value = false
  editing.value = null
}

function handleRemove(id) {
  removeTransaction(id)
  modalOpen.value = false
  editing.value = null
}

// ---------- PWA: banner "Install aplikasi" ----------
// Muncul hanya bila browser menawarkan install (event beforeinstallprompt)
// dan aplikasi belum berjalan sebagai aplikasi ter-install (standalone).
const installVisible = ref(false)
let deferredInstallPrompt = null

onMounted(() => {
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  if (standalone) return
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredInstallPrompt = e
    installVisible.value = true
  })
  window.addEventListener('appinstalled', () => {
    installVisible.value = false
    deferredInstallPrompt = null
  })
})

async function doInstall() {
  if (!deferredInstallPrompt) return
  deferredInstallPrompt.prompt()
  await deferredInstallPrompt.userChoice
  deferredInstallPrompt = null
  installVisible.value = false
}
</script>

<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <img class="brand-logo" :src="BASE + 'logo-utama.jpg'" alt="Logo Auto Graph" />
        <div>
          <strong>KONTRUANG</strong>
          <span class="muted small block">kontrol uang</span>
        </div>
      </div>
      <nav>
        <button
          v-for="n in NAV"
          :key="n.id"
          :class="{ active: page === n.id }"
          @click="page = n.id"
        >
          <span class="nav-icon">{{ n.icon }}</span> {{ n.label }}
        </button>
      </nav>
      <img class="sidebar-poster" :src="BASE + 'logo-emblem.jpg'" alt="Logo Auto Graph — emblem" />
      <p class="muted small side-note">Fase 1 — Website (pribadi)<br />Fase 2 — Aplikasi mobile</p>
    </aside>

    <main class="content">
      <header class="mobile-brand">
        <img class="brand-logo" :src="BASE + 'logo-utama.jpg'" alt="Logo Auto Graph" />
        <div>
          <strong>KONTRUANG</strong>
          <span class="muted small block">kontrol uang</span>
        </div>
      </header>
      <Dashboard v-if="page === 'dashboard'" @add="openAdd" @edit="openEdit" @goto="page = $event" />
      <Transactions v-else-if="page === 'transaksi'" @add="openAdd" @edit="openEdit" />
      <Budgets v-else-if="page === 'anggaran'" />
      <Wallets v-else-if="page === 'dompet'" />
      <Reports v-else-if="page === 'laporan'" />

      <footer class="footer muted small">
        <img class="footer-brand" :src="BASE + 'logo-stayfocus.jpg'" alt="STAYFOCUS — Auto Graph" />
        Kontruang v0.2 — PWA, by STAYFOCUS × Auto Graph.<br />
        Data tersimpan lokal di browser (localStorage). Angka bertanda "(contoh)" adalah data demo.
      </footer>
    </main>

    <nav class="bottomnav">
      <button
        v-for="n in NAV"
        :key="n.id"
        :class="{ active: page === n.id }"
        @click="page = n.id"
      >
        <span class="nav-icon">{{ n.icon }}</span>
        <span>{{ n.label }}</span>
      </button>
    </nav>

    <TransactionModal
      v-if="modalOpen"
      :editing="editing"
      @close="modalOpen = false"
      @save="handleSave"
      @remove="handleRemove"
    />

    <div v-if="installVisible" class="install-banner">
      <img :src="BASE + 'logo-utama.jpg'" alt="" />
      <div>
        <strong>Install Kontruang</strong>
        <span class="muted small block">Pasang di layar utama — buka kayak aplikasi, tetap jalan offline.</span>
      </div>
      <span class="spacer"></span>
      <button class="btn-accent" @click="doInstall">Install</button>
      <button class="btn-ghost" @click="installVisible = false">✕</button>
    </div>
  </div>
</template>
