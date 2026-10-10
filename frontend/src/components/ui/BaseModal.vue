<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      @click.self="onBackdrop"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" :class="sizeClass">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i v-if="icon" :class="['bi', icon, 'me-2 text-primary']"></i>{{ title }}
            </h5>
            <button type="button" class="btn-close" aria-label="Cerrar" @click="$emit('close')"></button>
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="open" class="modal-backdrop fade show"></div>
  </Teleport>
</template>

<script setup>
import { computed, onUnmounted, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
  size: { type: String, default: '' }, // '' | 'sm' | 'lg' | 'xl'
  closeOnBackdrop: { type: Boolean, default: true },
})

const emit = defineEmits(['close'])

const sizeClass = computed(() => (props.size ? `modal-${props.size}` : ''))

function onBackdrop() {
  if (props.closeOnBackdrop) emit('close')
}

// Bloquea el scroll del fondo mientras el modal esta abierto.
watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
