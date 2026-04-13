<template>
  <aside class="filter-sidebar">
    <!-- Logo Medisin -->
    <div class="sidebar-logo">
      <!-- Ganti src dengan path PNG dari anda -->
      <img src="/images/medisin-logo.png" alt="Medisin" class="logo-img" />
      <!-- sementara pakai text logo dulu -->
      <!-- <span class="logo-text">Medi<span class="logo-accent">sin</span></span> -->
    </div>

    <div class="filter-header">
      <h2 class="filter-title">Filter Pencarian</h2>
      <p class="filter-subtitle">Temukan layanan kesehatan di dekat anda</p>
    </div>

    <!-- Provinsi -->
    <div class="filter-group">
      <label class="filter-label">PROVINSI</label>
      <q-select
        v-model="localFilter.provinsi"
        :options="provinsiOptions"
        outlined
        dense
        emit-value
        map-options
        class="filter-select"
        @update:model-value="emit('update:filter', localFilter)"
      />
    </div>

    <!-- Kabupaten/Kota -->
    <div class="filter-group">
      <label class="filter-label">KABUPATEN/KOTA</label>
      <q-select
        v-model="localFilter.kota"
        :options="kotaOptions"
        outlined
        dense
        emit-value
        map-options
        class="filter-select"
        @update:model-value="emit('update:filter', localFilter)"
      />
    </div>

    <!-- Terdekat toggle -->
    <div class="filter-group">
      <div class="filter-toggle-row">
        <div class="toggle-icon-label">
          <AppIcon name="near_me" :size="18" color="#185fa5" />
          <span class="toggle-label">Terdekat</span>
        </div>
        <q-toggle
          v-model="localFilter.terdekat"
          color="blue-7"
          @update:model-value="handleTerdekat"
        />
      </div>
    </div>

    <!-- Kategori -->
    <div class="filter-group">
      <label class="filter-label">KATEGORI</label>
      <div class="kategori-list">
        <button
          v-for="kat in kategoriList"
          :key="kat.value"
          class="kategori-item"
          :class="{ 'kategori-item--active': localFilter.kategori === kat.value }"
          @click="selectKategori(kat.value)"
        >
          <AppIcon :name="kat.icon" :size="18" :color="localFilter.kategori === kat.value ? '#185fa5' : '#64748b'" />
          <span>{{ kat.label }}</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { reactive, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  filter: { type: Object, required: true }
})
const emit = defineEmits(['update:filter'])

const localFilter = reactive({ ...props.filter })

watch(() => props.filter, (val) => {
  Object.assign(localFilter, val)
}, { deep: true })

const provinsiOptions = [
  { label: 'Semua Lokasi', value: '' },
  { label: 'DKI Jakarta', value: 'DKI Jakarta' },
  { label: 'Jawa Barat', value: 'Jawa Barat' },
  { label: 'Jawa Tengah', value: 'Jawa Tengah' },
  { label: 'Jawa Timur', value: 'Jawa Timur' },
  { label: 'Banten', value: 'Banten' },
  { label: 'Sumatera Utara', value: 'Sumatera Utara' },
]

const kotaOptions = [
  { label: 'Semua Kabupaten/Kota', value: '' },
  { label: 'Bandung', value: 'Bandung' },
  { label: 'Jakarta Selatan', value: 'Jakarta Selatan' },
  { label: 'Jakarta Pusat', value: 'Jakarta Pusat' },
  { label: 'Bekasi', value: 'Bekasi' },
  { label: 'Depok', value: 'Depok' },
  { label: 'Bogor', value: 'Bogor' },
]

const kategoriList = [
  { label: 'Semua Fasilitas', value: '', icon: 'apps' },
  { label: 'Rumah Sakit', value: 'rumah_sakit', icon: 'local_hospital' },
  { label: 'Puskesmas', value: 'puskesmas', icon: 'health_and_safety' },
  { label: 'Klinik', value: 'klinik', icon: 'medical_services' },
  { label: 'Praktik Mandiri', value: 'praktik_mandiri', icon: 'person' },
  { label: 'Laboratorium Kesehatan', value: 'laboratorium', icon: 'biotech' },
]

function selectKategori(val) {
  localFilter.kategori = val
  emit('update:filter', { ...localFilter })
}

function handleTerdekat(val) {
  if (val) {
    // Simulate geolocation request
    localFilter.terdekat = true
  }
  emit('update:filter', { ...localFilter })
}
</script>

<style scoped>
.filter-sidebar {
  width: 220px;
  flex-shrink: 0;
  padding-right: 32px;
}

.filter-header { margin-bottom: 24px; }
.filter-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
}
.filter-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

.filter-group { margin-bottom: 20px; }
.filter-label {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}

.filter-select :deep(.q-field__control) {
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
}

.filter-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.toggle-icon-label {
  display: flex;
  align-items: center;
  gap: 8px;
}
.toggle-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

/* Logo */
.sidebar-logo {
  margin-bottom: 20px;
  /* padding-bottom: 20px; */
}
.logo-img {
  height: 42px;
  width: auto;
  display: block;
}
.logo-text {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}
.logo-accent { color: #185fa5; }

/* Kategori */
.kategori-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.kategori-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  text-align: left;
  transition: background 0.15s, color 0.15s;
  width: 100%;
}
.kategori-item:hover {
  background: #f1f5f9;
}
.kategori-item--active {
  background: #e6f1fb !important;
  color: #185fa5 !important;
  font-weight: 600;
}
</style>
