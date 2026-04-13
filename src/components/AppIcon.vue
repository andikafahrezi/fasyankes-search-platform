<template>
  <span
    class="material-symbols-rounded"
    :style="{
      fontSize: size + 'px',
      color: color || 'inherit',
      lineHeight: '1',
      display: 'inline-flex',
      alignItems: 'center',
    }"
  >{{ name }}</span>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 20 },
  color: { type: String, default: '' }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
.material-symbols-rounded {
  font-family: 'Material Symbols Rounded';
  font-style: normal;
  line-height: 1;
  user-select: none;
}
</style>
