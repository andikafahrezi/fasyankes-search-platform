<template>
  <q-card class="faskes-card" flat bordered>
    <!-- Image area -->
    <div class="faskes-card__image">
      <img
        v-if="faskes.image"
        :src="faskes.image"
        :alt="faskes.nama"
        class="faskes-card__img"
      />
      <div v-else class="faskes-card__img-placeholder">
        <AppIcon name="local_hospital" :size="32" color="#94a3b8" />
      </div>
      <q-badge
        class="faskes-card__badge"
        :class="faskes.tersedia ? 'badge--available' : 'badge--unavailable'"
      >
        {{ faskes.tersedia ? 'Available' : 'Penuh' }}
      </q-badge>
    </div>

    <!-- Logo -->
    <div class="faskes-card__logo">
      <img
        v-if="faskes.logo"
        :src="faskes.logo"
        :alt="faskes.nama + 'logo'"
        class="logo-img"
      />
      <div v-else class="logo-placeholder">
        <AppIcon name="local_hospital" :size="20" color="#64748b" />
      </div>
    </div>

    <q-card-section class="faskes-card__body">
      <!-- Kategori breadcrumb -->
      <div class="faskes-card__kategori">
        <span class="kategori-type">{{ faskes.tipeLabel }}</span>
        <AppIcon name="chevron_right" :size="14" color="#64748b" />
        <span class="kategori-sub">{{ faskes.subTipe }}</span>
      </div>

      <!-- Nama -->
      <h3 class="faskes-card__nama">{{ faskes.nama }}</h3>

      <!-- Alamat -->
      <div class="faskes-card__alamat">
        <span class="alamat-icon">location_on</span>
        <span class="alamat-text">{{ faskes.alamat }}</span>
      </div>

      <!-- Badges -->
      <div v-if="faskes.buka24jam || faskes.terkoverAsuransi" class="faskes-card__tags">
        <span v-if="faskes.buka24jam" class="tag tag--green">Buka 24/7</span>
        <span v-if="faskes.terkoverAsuransi" class="tag tag--blue">Terkover Asuransi</span>
      </div>
    </q-card-section>

    <q-card-actions class="faskes-card__actions">
      <q-btn
        label="Daftar Online"
        class="btn-daftar"
        unelevated
        no-caps
        @click="$emit('daftar', faskes)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  faskes: { type: Object, required: true }
})
defineEmits(['daftar'])
</script>

<style scoped>
.faskes-card {
  border-radius: 16px !important;
  border: 1px solid #e2e8f0 !important;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
}
.faskes-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
  transform: translateY(-2px);
}

/* Image */
.faskes-card__image {
  position: relative;
  height: 140px;
  background: #f1f5f9;
  overflow: hidden;
}
.faskes-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.faskes-card__img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}
.faskes-card__badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
}
.badge--available {
  background: #fff !important;
  color: #1d9e75 !important;
  border: 1px solid #9fe1cb !important;
}
.badge--unavailable {
  background: #fff !important;
  color: #d85a30 !important;
  border: 1px solid #f5c4b3 !important;
}

/* Logo */
.faskes-card__logo {
  position: relative;
  margin-top: -24px;
  margin-left: 16px;
  width: 48px;
  height: 48px;
  z-index: 2;
}
.logo-img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 2px solid #fff;
  object-fit: contain;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.logo-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 2px solid #fff;
  background: #f8fafc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Body */
.faskes-card__body {
  padding: 8px 16px 4px !important;
  flex: 1;
}
.faskes-card__kategori {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 4px;
}
.kategori-type {
  font-size: 11px;
  font-weight: 600;
  color: #185fa5;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}
.kategori-sub {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.faskes-card__nama {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 2px 0 8px;
  line-height: 1.3;
}

.faskes-card__alamat {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-top: 4px;
}
.alamat-icon {
  font-family: 'Material Symbols Rounded';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5; /* sama dengan line-height teks */
  flex-shrink: 0;
  color: #94a3b8;
  /* override optical sizing yang bikin padding besar */
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 14;
}
.alamat-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
  flex: 1;
  min-width: 0;
}

.faskes-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.tag {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
}
.tag--green { background: #e1f5ee; color: #0f6e56; }
.tag--blue  { background: #e6f1fb; color: #185fa5; }

/* Actions */
.faskes-card__actions {
  padding: 12px 16px 16px !important;
}
.btn-daftar {
  width: 100%;
  background: #1a1a2e !important;
  color: #fff !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  border-radius: 10px !important;
  height: 40px;
}
.btn-daftar:hover {
  background: #16213e !important;
}
</style>
