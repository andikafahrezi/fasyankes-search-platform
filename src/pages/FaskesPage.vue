<template>
  <q-page class="faskes-page">

    <!-- Mobile filter drawer -->
    <q-drawer
      v-model="drawerOpen"
      side="left"
      overlay
      behavior="mobile"
      :width="280"
      class="filter-drawer"
    >
      <div class="q-pa-md">
        <FilterSidebar :filter="filter" @update:filter="onFilterUpdate" />
      </div>
    </q-drawer>

    <div class="faskes-container">
      <!-- Desktop: Sidebar kiri -->
      <div class="sidebar-col gt-sm">
        <FilterSidebar :filter="filter" @update:filter="onFilterUpdate" />
      </div>

      <!-- Konten kanan -->
      <div class="content-col">

        <!-- Header -->
        <div class="page-header">
          <h1 class="page-title">Temukan Tempat Kesehatan Anda dengan Fasyankes Kami</h1>
          <p class="page-subtitle">Telusuri fasilitas medis secara mudah dan cepat</p>
        </div>

        <!-- Mobile filter toggle -->
        <div class="lt-md mobile-filter-btn-row">
          <q-btn
            icon="tune"
            label="Filter"
            flat
            no-caps
            class="mobile-filter-btn"
            @click="drawerOpen = true"
          />
        </div>

        <!-- Search bar -->
        <div class="search-row">
          <div class="search-wrapper">
            <span class="search-icon-wrap">
              <AppIcon name="search" :size="20" color="#94a3b8" />
            </span>
            <input
              v-model="searchQuery"
              type="text"
              class="search-native"
              placeholder="Cari nama rumah sakit, klinik, atau fasilitas layanan kesehatan lainnya..."
              @input="onSearch"
            />
            <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''; onSearch('')">
              <AppIcon name="close" :size="16" color="#94a3b8" />
            </button>
          </div>
        </div>

        <!-- Filter chips -->
        <div class="chip-row">
          <q-chip
            clickable
            :selected="filter.buka24jam"
            class="filter-chip-24jam"
            :class="{ 'filter-chip-24jam--active': filter.buka24jam }"
            @click="toggleChip('buka24jam')"
          >
            Buka 24/7
          </q-chip>
          <q-chip
            clickable
            :selected="filter.terkoverAsuransi"
            class="filter-chip-asuransi"
            :class="{ 'filter-chip-asuransi--active': filter.terkoverAsuransi }"
            @click="toggleChip('terkoverAsuransi')"
          >
            Terkover asuransi
          </q-chip>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-area">
          <div class="faskes-grid">
            <q-card
              v-for="n in 6"
              :key="'skeleton-' + n"
              flat
              bordered
              class="skeleton-card"
            >
              <q-skeleton height="140px" square />
              <q-card-section>
                <q-skeleton type="text" width="60%" />
                <q-skeleton type="text" width="80%" class="q-mt-sm" />
                <q-skeleton type="text" width="90%" />
              </q-card-section>
              <q-card-actions>
                <q-skeleton type="QBtn" width="100%" />
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredFaskes.length === 0" class="empty-state">
          <AppIcon name="search_off" :size="48" color="#cbd5e1" />
          <p class="empty-title">Fasilitas tidak ditemukan</p>
          <p class="empty-subtitle">Coba ubah kata kunci atau filter pencarian</p>
          <q-btn label="Reset Filter" flat no-caps class="btn-reset" @click="resetFilter" />
        </div>

        <!-- Grid -->
        <div v-else class="faskes-grid">
          <FaskesCard
            v-for="faskes in displayedFaskes"
            :key="faskes.id"
            :faskes="faskes"
            @daftar="onDaftar"
          />
        </div>

        <!-- Pagination info & load more -->
        <div v-if="filteredFaskes.length > 0" class="pagination-area">
          <p class="pagination-info">
            Menampilkan {{ displayedFaskes.length }} dari {{ filteredFaskes.length }} fasilitas
          </p>
          <q-btn
            v-if="displayedFaskes.length < filteredFaskes.length"
            label="Lihat Fasilitas Lainnya"
            icon-right="expand_more"
            outline
            no-caps
            class="btn-load-more"
            @click="loadMore"
          />
        </div>

      </div><!-- /content-col -->
    </div><!-- /faskes-container -->

    <!-- Floating emergency call button -->
    <q-btn
      round
      unelevated
      class="btn-emergency"
      @click="emergencyCall"
    >
      <AppIcon name="phone_in_talk" :size="22" color="#fff" />
      <q-tooltip>Darurat Medis - Hubungi 119</q-tooltip>
    </q-btn>

    <!-- Dialog Daftar Online -->
    <q-dialog v-model="daftarDialog">
      <q-card class="daftar-dialog-card">
        <q-card-section class="dialog-header">
          <div class="dialog-title-row">
            <AppIcon name="event_available" :size="22" color="#185fa5" />
            <h3 class="dialog-title">Pendaftaran Online</h3>
          </div>
          <q-btn flat round dense icon="close" @click="daftarDialog = false" />
        </q-card-section>
        <q-separator />
        <q-card-section v-if="selectedFaskes">
          <div class="dialog-faskes-info">
            <div class="dialog-logo">
              <img
                v-if="selectedFaskes?.logo"
                :src="selectedFaskes.logo"
                :alt="selectedFaskes.nama"
                style="width: 100%; height: 100%; object-fit: cover;"
              />
              <AppIcon v-else name="local_hospital" :size="24" color="#185fa5" />
            </div>
            <div>
              <p class="dialog-faskes-nama">{{ selectedFaskes.nama }}</p>
              <p class="dialog-faskes-alamat">{{ selectedFaskes.alamat }}</p>
            </div>
          </div>
          <p class="dialog-note">
            Lengkapi formulir pendaftaran online Anda. Pastikan data diri sesuai
            dengan kartu identitas resmi untuk mempercepat proses verifikasi saat tiba di fasilitas.
          </p>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn label="Tutup" flat no-caps @click="daftarDialog = false" />
          <q-btn
            label="Isi Form Pendaftaran"
            unelevated
            no-caps
            class="btn-hubungi"
            @click="goToDaftar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import AppIcon from 'src/components/AppIcon.vue'
import FaskesCard from 'src/components/FaskesCard.vue'
import FilterSidebar from 'src/components/FilterSidebar.vue'
import { useRouter } from 'vue-router'

// ─── State ────────────────────────────────────────────────────
const drawerOpen = ref(false)
const searchQuery = ref('')
const loading = ref(false)
const daftarDialog = ref(false)
const selectedFaskes = ref(null)
const PAGE_SIZE = 6
const displayCount = ref(PAGE_SIZE)
const router =useRouter()

const filter = reactive({
  provinsi: '',
  kota: '',
  terdekat: false,
  kategori: '',
  buka24jam: false,
  terkoverAsuransi: false
})

// ─── Data faskes dummy ────────────────────────────────────────────────
const allFaskes = ref([
  {
    id: 1, nama: 'Klinik Aulia Medika', tipeLabel: 'KLINIK', subTipe: 'KLINIK PRATAMA',
    kategori: 'klinik', alamat: 'Gedung Graha Medika Lt. 2, Jl. Asia Afrika No. 12, Bandung',
    provinsi: 'Jawa Barat', kota: 'Bandung', tersedia: true,
    buka24jam: false, terkoverAsuransi: true, image: 'https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjN8fGhlYWx0aGNhcmV8ZW58MHx8MHx8fDA%3D', logo: 'https://i.pinimg.com/1200x/a5/05/72/a50572eb4a410caeb2b9ac983c551a04.jpg'
  },
  {
    id: 2, nama: 'RS Umum Daerah Bekasi', tipeLabel: 'RUMAH SAKIT', subTipe: 'RS UMUM',
    kategori: 'rumah_sakit', alamat: 'Jl. Pramuka No. 55, Bekasi Timur',
    provinsi: 'Jawa Barat', kota: 'Bekasi', tersedia: true,
    buka24jam: true, terkoverAsuransi: true, image: '', logo: 'https://i.pinimg.com/1200x/46/6a/95/466a95e70b96ccfce46dd1d61a12ccb9.jpg'
  },
  {
    id: 3, nama: 'Puskesmas Tanah Abang', tipeLabel: 'PUSKESMAS', subTipe: 'PUSKESMAS KECAMATAN',
    kategori: 'puskesmas', alamat: 'Jl. Tanah Abang II No. 1, Jakarta Pusat',
    provinsi: 'DKI Jakarta', kota: 'Jakarta Pusat', tersedia: true,
    buka24jam: false, terkoverAsuransi: false, image: '', logo: ''
  },
  {
    id: 4, nama: 'Klinik Pratama PKU Muhammadiyah', tipeLabel: 'KLINIK', subTipe: 'KLINIK PRATAMA',
    kategori: 'klinik', alamat: 'Jl. Ahmad Yani No. 7, Bandung',
    provinsi: 'Jawa Barat', kota: 'Bandung', tersedia: true,
    buka24jam: true, terkoverAsuransi: true, image: '', logo: ''
  },
  {
    id: 5, nama: 'Klinik Utama Gracia', tipeLabel: 'KLINIK', subTipe: 'KLINIK UTAMA',
    kategori: 'klinik', alamat: 'Jl. Cihampelas No. 161, Bandung',
    provinsi: 'Jawa Barat', kota: 'Bandung', tersedia: true,
    buka24jam: false, terkoverAsuransi: false, image: '', logo: ''
  },
  {
    id: 6, nama: 'Laboratorium Klinik Prodia', tipeLabel: 'LABORATORIUM', subTipe: 'LAB KLINIK',
    kategori: 'laboratorium', alamat: 'Jl. Kramat Raya No. 150, Jakarta Pusat',
    provinsi: 'DKI Jakarta', kota: 'Jakarta Pusat', tersedia: false,
    buka24jam: false, terkoverAsuransi: true, image: '', logo: ''
  },
  {
    id: 7, nama: 'RS Siloam Semanggi', tipeLabel: 'RUMAH SAKIT', subTipe: 'RS SWASTA',
    kategori: 'rumah_sakit', alamat: 'Jl. Jend. Sudirman Kav. 76, Jakarta Selatan',
    provinsi: 'DKI Jakarta', kota: 'Jakarta Selatan', tersedia: true,
    buka24jam: true, terkoverAsuransi: true, image: '', logo: ''
  },
  {
    id: 8, nama: 'Praktik dr. Hendra Santoso, Sp.PD', tipeLabel: 'PRAKTIK MANDIRI', subTipe: 'SPESIALIS',
    kategori: 'praktik_mandiri', alamat: 'Jl. Merdeka No. 12, Depok',
    provinsi: 'Jawa Barat', kota: 'Depok', tersedia: true,
    buka24jam: false, terkoverAsuransi: false, image: '', logo: ''
  },
])

// ─── Computed ─────────────────────────────────────────────────
const filteredFaskes = computed(() => {
  return allFaskes.value.filter(f => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch = !q || f.nama.toLowerCase().includes(q) || f.alamat.toLowerCase().includes(q)
    const matchProvinsi = !filter.provinsi || f.provinsi === filter.provinsi
    const matchKota = !filter.kota || f.kota === filter.kota
    const matchKategori = !filter.kategori || f.kategori === filter.kategori
    const matchBuka = !filter.buka24jam || f.buka24jam
    const matchAsuransi = !filter.terkoverAsuransi || f.terkoverAsuransi
    return matchSearch && matchProvinsi && matchKota && matchKategori && matchBuka && matchAsuransi
  })
})

const displayedFaskes = computed(() => filteredFaskes.value.slice(0, displayCount.value))

// ─── Methods ──────────────────────────────────────────────────
function onFilterUpdate(newFilter) {
  Object.assign(filter, newFilter)
  displayCount.value = PAGE_SIZE
}

function onSearch() {
  displayCount.value = PAGE_SIZE
}

function toggleChip(key) {
  filter[key] = !filter[key]
  displayCount.value = PAGE_SIZE
}

function loadMore() {
  displayCount.value += PAGE_SIZE
}

function resetFilter() {
  Object.assign(filter, {
    provinsi: '', kota: '', terdekat: false,
    kategori: '', buka24jam: false, terkoverAsuransi: false
  })
  searchQuery.value = ''
  displayCount.value = PAGE_SIZE
}

function onDaftar(faskes) {
  selectedFaskes.value = faskes
  daftarDialog.value = true
}

function emergencyCall() {
  window.location.href = 'tel:119'
}

function goToDaftar() {
  daftarDialog.value = false
  router.push({
    path: '/daftar',
    query: {
      faskes: selectedFaskes.value?.nama,
      id: selectedFaskes.value?.id,
      image: selectedFaskes.value?.image
    }
  })
}
</script>

<style scoped>
/* ── Layout ──────────────────────────────────────────────── */
.faskes-page {
  background: #fafbfc;
  min-height: 100vh;
  padding-bottom: 80px;
}
.faskes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 32px;
  display: flex;
  align-items: flex-start;
  gap: 0;
}
.sidebar-col {
  width: 220px;
  flex-shrink: 0;
  padding-top: 8px;
}
.content-col {
  flex: 1;
  min-width: 0;
}

/* ── Header ──────────────────────────────────────────────── */
.page-header { margin-bottom: 24px; }
.page-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px;
  line-height: 1.2;
}
.page-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

/* ── Search ──────────────────────────────────────────────── */
.search-row { margin-bottom: 12px; }
.search-wrapper {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  height: 52px;
  padding: 0 16px;
  gap: 10px;
  transition: border-color 0.2s;
}
.search-wrapper:focus-within {
  border-color: #185fa5;
}
.search-icon-wrap {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  line-height: 1;
}
.search-native {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #0f172a;
  min-width: 0;
  line-height: 1;
}
.search-native::placeholder {
  color: #94a3b8;
}
.search-clear {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

/* ── Chips ───────────────────────────────────────────────── */
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}
.filter-chip-24jam {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  border-radius: 20px !important;
  border: 1.5px solid #e2e8f0 !important;
  background: #fff !important;
  color: #475569 !important;
  height: 34px;
  transition: all 0.15s;
}
.filter-chip-24jam--active {
  border-color: #0f6e56 !important;
  background: #e1f5ee !important;
  color: #0f6e56 !important;
}
.filter-chip-asuransi {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  border-radius: 20px !important;
  border: 1.5px solid #e2e8f0 !important;
  background: #fff !important;
  color: #475569 !important;
  height: 34px;
  transition: all 0.15s;
}
.filter-chip-asuransi--active {
  border-color: #185fa5 !important;
  background: #e6f1fb !important;
  color: #185fa5 !important;
}

/* ── Grid ────────────────────────────────────────────────── */
.faskes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* ── Skeleton ────────────────────────────────────────────── */
.skeleton-card {
  border-radius: 16px !important;
  overflow: hidden;
}

/* ── Empty state ─────────────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 80px 0;
}
.empty-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #334155;
  margin: 16px 0 8px;
}
.empty-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 24px;
}
.btn-reset {
  font-family: 'Inter', sans-serif;
  color: #185fa5 !important;
}

/* ── Pagination ──────────────────────────────────────────── */
.pagination-area {
  margin-top: 40px;
  text-align: center;
}
.pagination-info {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 16px;
}
.btn-load-more {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  border: 1.5px solid #334155 !important;
  border-radius: 24px !important;
  color: #0f172a !important;
  padding: 8px 28px !important;
}

/* ── Emergency btn ───────────────────────────────────────── */
.btn-emergency {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 56px;
  height: 56px;
  background: #185fa5 !important;
  box-shadow: 0 4px 16px rgba(24, 95, 165, 0.35) !important;
  z-index: 100;
}

/* ── Dialog ──────────────────────────────────────────────── */
.daftar-dialog-card {
  width: 420px;
  max-width: 95vw;
  border-radius: 20px !important;
}
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px !important;
}
.dialog-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dialog-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.dialog-faskes-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}
.dialog-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #e6f1fb;
  display: flex;
  /* object-fit: contain; */
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.dialog-faskes-nama {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
}
.dialog-faskes-alamat {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #64748b;
  margin: 0;
}
.dialog-note {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #64748b;
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px;
  margin: 0;
}
.btn-hubungi {
  background: #185fa5 !important;
  color: #fff !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-weight: 600 !important;
  border-radius: 10px !important;
}

/* ── Mobile ──────────────────────────────────────────────── */
.mobile-filter-btn-row { margin-bottom: 12px; }
.mobile-filter-btn {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #185fa5;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 6px 16px;
}
.filter-drawer :deep(.q-drawer) {
  background: #fff;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1024px) {
  .faskes-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .faskes-container { padding: 24px 16px; }
  .page-title { font-size: 24px; }
  .faskes-grid { grid-template-columns: repeat(1, 1fr); }
}
</style>
