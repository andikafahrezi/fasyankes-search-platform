<template>
  <q-page class="daftar-page">

    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-overlay" />
      <img
        :src="faskesImage"
        alt="Fasilitas Kesehatan"
        class="hero-bg"
      />
      <div class="hero-content">
        <h1 class="hero-title">Pendaftaran Online</h1>
        <p class="hero-subtitle">
          Mulailah perjalanan Anda menuju kesehatan bersama kami.<br />
          Layanan klinis yang cepat, aman, dan disesuaikan dengan kebutuhan Anda.
        </p>
      </div>
    </div>

    <!-- Form Card -->
    <div class="form-section">
      <div class="form-card">

        <!-- Info Banner -->
        <div class="info-banner">
          <AppIcon name="info" :size="18" color="#475569" />
          <div class="info-text">
            <span class="info-title">INFORMASI PENDAFTARAN</span>
            <p class="info-desc">
              Pendaftaran terbuka bagi pasien baru maupun pasien lama.
              Pastikan NIK Anda sesuai dengan kartu identitas resmi untuk kelancaran proses verifikasi dan layanan medis.
            </p>
          </div>
        </div>

        <!-- Faskes terpilih (jika ada) -->
        <div v-if="faskesNama" class="selected-faskes">
          <!-- <AppIcon name="local_hospital" :size="16" color="#185fa5" /> -->
          <span>{{ faskesNama }}</span>
        </div>

        <!-- Form -->
        <div class="form-grid">

          <!-- Jenis Pasien -->
          <div class="form-field">
            <label class="field-label">Jenis Pasien</label>
            <q-select
              v-model="form.jenisPasien"
              :options="jenisPasienOptions"
              outlined
              dense
              emit-value
              map-options
              class="field-input"
            >
              <template #selected>
                <span :style="{ color: form.jenisPasien === '' ? '#94a3b8' : '#0f172a' }">
                  {{ form.jenisPasien === '' ? 'Pilih Status Pasien' : jenisPasienOptions.find(o => o.value === form.jenisPasien)?.label }}
                </span>
              </template>
            </q-select>
          </div>

          <!-- Nama Lengkap -->
          <div class="form-field">
            <label class="field-label">Nama Lengkap</label>
            <q-input
              v-model="form.namaLengkap"
              outlined
              dense
              placeholder="Sesuai KTP"
              class="field-input"
              :class="{ 'field-error': errors.namaLengkap }"
            />
            <span v-if="errors.namaLengkap" class="error-msg">{{ errors.namaLengkap }}</span>
          </div>

          <!-- No NIK -->
          <div class="form-field">
            <label class="field-label">No NIK</label>
            <q-input
              v-model="form.nik"
              outlined
              dense
              placeholder="16 Digit Nomor Induk Kependudukan"
              maxlength="16"
              class="field-input"
              :class="{ 'field-error': errors.nik }"
              @update:model-value="val => form.nik = val.replace(/\D/g, '')"
            />
            <span v-if="errors.nik" class="error-msg">{{ errors.nik }}</span>
          </div>

          <!-- Tanggal Lahir -->
          <div class="form-field">
            <label class="field-label">Tanggal Lahir</label>
            <q-input
              v-model="form.tanggalLahir"
              outlined
              dense
              type="date"
              class="field-input"
              :class="{ 'field-error': errors.tanggalLahir }"
            >
              <template #append>
                <AppIcon name="calendar_month" :size="18" color="#94a3b8" />
              </template>
            </q-input>
            <span v-if="errors.tanggalLahir" class="error-msg">{{ errors.tanggalLahir }}</span>
          </div>

          <!-- Email -->
          <div class="form-field">
            <label class="field-label">Email</label>
            <q-input
              v-model="form.email"
              outlined
              dense
              type="email"
              placeholder="contoh@email.com"
              class="field-input"
              :class="{ 'field-error': errors.email }"
            />
            <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
          </div>

          <!-- No Handphone -->
          <div class="form-field">
            <label class="field-label">No Handphone</label>
            <q-input
              v-model="form.noHp"
              outlined
              dense
              placeholder="08xx xxxx xxxx"
              maxlength="13"
              class="field-input"
              :class="{ 'field-error': errors.noHp }"
              @update:model-value="val => form.noHp = val.replace(/\D/g, '')"
            />
            <span v-if="errors.noHp" class="error-msg">{{ errors.noHp }}</span>
          </div>

          <!-- Pilih Layanan -->
          <div class="form-field">
            <label class="field-label">Pilih Layanan</label>
            <q-select
              v-model="form.layanan"
              :options="layananOptions"
              outlined
              dense
              emit-value
              map-options
              class="field-input"
            >
              <template #selected>
                <span :style="{ color: form.layanan === '' ? '#94a3b8' : '#0f172a' }">
                  {{ form.layanan === '' ? 'Pilih Poliklinik/Layanan' : layananOptions.find(o => o.value === form.layanan)?.label }}
                </span>
              </template>
            </q-select>
          </div>

          <!-- Tanggal Kunjungan -->
          <div class="form-field">
            <label class="field-label">Tanggal Kunjungan</label>
            <q-input
              v-model="form.tanggalKunjungan"
              outlined
              dense
              type="date"
              :min="today"
              class="field-input"
              :class="{ 'field-error': errors.tanggalKunjungan }"
            >
              <template #append>
                <AppIcon name="calendar_month" :size="18" color="#94a3b8" />
              </template>
            </q-input>
            <span v-if="errors.tanggalKunjungan" class="error-msg">{{ errors.tanggalKunjungan }}</span>
          </div>

        </div><!-- /form-grid -->

        <!-- Action buttons -->
        <div class="form-actions">
          <q-btn
            label="Kembali"
            unelevated
            no-caps
            class="btn-kembali"
            @click="router.back()"
          />
          <q-btn
            label="Daftar"
            icon-right="arrow_forward"
            unelevated
            no-caps
            class="btn-daftar"
            :loading="submitting"
            @click="submitForm"
          />
        </div>

        <!-- Terms note -->
        <p class="terms-note">
          Dengan mengklik "Daftar", Anda menyetujui Syarat dan Ketentuan serta Kebijakan Privasi kami.
        </p>

      </div><!-- /form-card -->
    </div><!-- /form-section -->

    <!-- Footer -->
    <footer class="daftar-footer">
      <span class="footer-copy">© 2024 Medisin. All rights reserved.</span>
      <div class="footer-icons">
        <AppIcon name="language" :size="20" color="#94a3b8" />
        <AppIcon name="ios_share" :size="20" color="#94a3b8" />
        <AppIcon name="add_to_home_screen" :size="20" color="#94a3b8" />
      </div>
    </footer>

  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppIcon from 'src/components/AppIcon.vue'

const router = useRouter()
const route = useRoute()

const faskesNama = computed(() => route.query.faskes || '')
const submitting = ref(false)

const today = new Date().toISOString().split('T')[0]

const form = reactive({
  jenisPasien: '',
  namaLengkap: '',
  nik: '',
  tanggalLahir: '',
  email: '',
  noHp: '',
  layanan: '',
  tanggalKunjungan: ''
})

const errors = reactive({
  jenisPasien: '', namaLengkap: '', nik: '',
  tanggalLahir: '', email: '', noHp: '',
  layanan: '', tanggalKunjungan: ''
})

const jenisPasienOptions = [
  { label: 'Pilih Status Pasien', value: '' },
  { label: 'Pasien Baru', value: 'baru' },
  { label: 'Pasien Lama', value: 'lama' },
  { label: 'Pasien Rujukan', value: 'rujukan' },
  { label: 'Pasien BPJS', value: 'bpjs' },
]

const layananOptions = [
  { label: 'Pilih Poliklinik/Layanan', value: '' },
  { label: 'Poli Umum', value: 'poli_umum' },
  { label: 'Poli Gigi', value: 'poli_gigi' },
  { label: 'Poli Anak', value: 'poli_anak' },
  { label: 'Poli Kandungan', value: 'poli_kandungan' },
  { label: 'Poli Jantung', value: 'poli_jantung' },
  { label: 'Poli Mata', value: 'poli_mata' },
  { label: 'IGD', value: 'igd' },
  { label: 'Laboratorium', value: 'laboratorium' },
  { label: 'Radiologi', value: 'radiologi' },
]

const faskesImage = computed(() => route.query.image || 'https://images.unsplash.com/photo-1716143493323-0cad35854aa1?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')

function validate() {
  let valid = true
  Object.keys(errors).forEach(k => errors[k] = '')

  if (!form.jenisPasien || form.jenisPasien === '') { errors.jenisPasien = 'Pilih jenis pasien'; valid = false }
  if (!form.namaLengkap.trim()) { errors.namaLengkap = 'Nama lengkap wajib diisi'; valid = false }
  if (!form.nik || form.nik.length !== 16) { errors.nik = 'NIK harus 16 digit'; valid = false }
  if (!form.tanggalLahir) { errors.tanggalLahir = 'Tanggal lahir wajib diisi'; valid = false }
  if (!form.email || !form.email.includes('@')) { errors.email = 'Email tidak valid'; valid = false }
  if (!form.noHp || form.noHp.length < 10) { errors.noHp = 'No handphone tidak valid'; valid = false }
  if (!form.layanan || form.layanan === '') { errors.layanan = 'Pilih layanan'; valid = false }
  if (!form.tanggalKunjungan) { errors.tanggalKunjungan = 'Tanggal kunjungan wajib diisi'; valid = false }

  return valid
}

async function submitForm() {
  if (!validate()) return
  submitting.value = true
  await new Promise(r => setTimeout(r, 1200)) // simulasi submit
  submitting.value = false
  router.push({ path: '/daftar/sukses', query: { nama: form.namaLengkap, faskes: faskesNama.value } })
}
</script>

<style scoped>
/* ── Page ─────────────────────────────────────────────────── */
.daftar-page {
  background: #f0f2f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Hero ─────────────────────────────────────────────────── */
.hero-section {
  position: relative;
  height: 280px;
  overflow: hidden;
  flex-shrink: 0;
}
.hero-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(30%);
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.55) 0%,
    rgba(15, 23, 42, 0.3) 100%
  );
  z-index: 1;
}
.hero-content {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 60px 80px;
}
.hero-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 40px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 10px;
  line-height: 1.1;
}
.hero-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: rgba(255,255,255,0.85);
  margin: 0;
  max-width: 580px;
  line-height: 1.6;
}

/* ── Form section ─────────────────────────────────────────── */
.form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 24px 60px;
  margin-top: -48px;
  position: relative;
  z-index: 10;
}

.form-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 36px 40px 32px;
  width: 100%;
  max-width: 780px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.08);
}

/* ── Info banner ──────────────────────────────────────────── */
.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 28px;
}
.info-text { flex: 1; }
.info-title {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #334155;
  letter-spacing: 0.8px;
  margin-bottom: 4px;
}
.info-desc {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

/* ── Selected faskes ──────────────────────────────────────── */
.selected-faskes {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e6f1fb;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 24px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #185fa5;
}

/* ── Form grid ────────────────────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
  margin-bottom: 32px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

/* icon kalender di sembunyiin biar gk double */
.field-input :deep(input[type="date"]::-webkit-calendar-picker-indicator) {
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.field-input :deep(.q-field__control) {
  border-radius: 10px;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}
.field-input :deep(.q-field__control:before) {
  border: 1.5px solid #e2e8f0;
}
.field-input :deep(.q-field__control:hover:before) {
  border-color: #94a3b8;
}
.field-input :deep(.q-field__control.q-field__control--focused:before) {
  border-color: #185fa5 !important;
  border-width: 1.5px !important;
}

.field-error :deep(.q-field__control:before) {
  border-color: #e24b4a !important;
}

.error-msg {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #e24b4a;
  margin-top: -2px;
}

/* ── Actions ──────────────────────────────────────────────── */
.form-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.btn-kembali {
  height: 52px;
  border-radius: 14px !important;
  background: #e2e8f0 !important;
  color: #475569 !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-weight: 600 !important;
  font-size: 15px !important;
}

.btn-daftar {
  height: 52px;
  border-radius: 14px !important;
  background: #1a1a2e !important;
  color: #fff !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-weight: 600 !important;
  font-size: 15px !important;
}
.btn-daftar:hover { background: #16213e !important; }

/* ── Terms ────────────────────────────────────────────────── */
.terms-note {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  margin: 0;
}

/* ── Footer ───────────────────────────────────────────────── */
.daftar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  background: transparent;
}
.footer-copy {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #94a3b8;
}
.footer-icons {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* ── Responsive ───────────────────────────────────────────── */
@media (max-width: 640px) {
  .hero-content { padding: 0 24px 20%; }
  .hero-title { font-size: 28px; }
  .form-card { padding: 24px 20px; }
  .form-grid { grid-template-columns: 1fr; }
  .form-actions { grid-template-columns: 1fr; }
}
</style>
