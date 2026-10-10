<template>
  <div class="image-input">
    <div class="image-input__preview" :class="shape">
      <img v-if="modelValue" :src="modelValue" alt="Vista previa" />
      <i v-else :class="['bi', placeholderIcon]"></i>
    </div>

    <div class="image-input__actions">
      <div class="d-flex gap-2">
        <label class="btn btn-sm btn-outline-secondary mb-0">
          <i class="bi bi-upload me-1"></i>{{ modelValue ? 'Cambiar' : 'Subir imagen' }}
          <input type="file" accept="image/*" class="d-none" @change="onFile" />
        </label>
        <button v-if="modelValue" class="btn btn-sm btn-light text-danger" type="button" @click="clear">
          <i class="bi bi-trash"></i>
        </button>
      </div>
      <p class="text-muted small mb-0 mt-1">PNG/JPG. Se optimiza automaticamente (max. 512px).</p>
    </div>
  </div>
</template>

<script setup>
import { alertError } from '@/utils/alerts'

const props = defineProps({
  modelValue: { type: String, default: '' },
  shape: { type: String, default: 'circle' }, // circle | square
  placeholderIcon: { type: String, default: 'bi-image' },
})

const emit = defineEmits(['update:modelValue'])

/** Lee el archivo, lo reduce con canvas y emite un data URL JPEG. */
function onFile(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alertError('Archivo invalido', 'Selecciona un archivo de imagen (PNG o JPG).')
    return
  }

  const reader = new FileReader()
  reader.onload = () => resize(reader.result)
  reader.onerror = () => alertError('Error', 'No se pudo leer el archivo.')
  reader.readAsDataURL(file)
}

function resize(dataUrl) {
  const img = new Image()
  img.onload = () => {
    const MAX = 512
    let { width, height } = img
    if (width >= height && width > MAX) {
      height = Math.round((height * MAX) / width)
      width = MAX
    } else if (height > MAX) {
      width = Math.round((width * MAX) / height)
      height = MAX
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height)
    emit('update:modelValue', canvas.toDataURL('image/jpeg', 0.82))
  }
  img.onerror = () => alertError('Imagen invalida', 'No se pudo procesar la imagen.')
  img.src = dataUrl
}

function clear() {
  emit('update:modelValue', '')
}
</script>
