<template>
  <div class="icon-picker">
    <button
      v-for="ic in ICONOS"
      :key="ic"
      type="button"
      class="icon-picker__item"
      :class="{ 'is-active': modelValue === ic }"
      :title="ic.replace('bi-', '')"
      @click="$emit('update:modelValue', ic)"
    >
      <i :class="['bi', ic]"></i>
    </button>
  </div>
</template>

<script setup>
import { ICONOS } from '@/data/iconos'

defineProps({
  modelValue: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>
