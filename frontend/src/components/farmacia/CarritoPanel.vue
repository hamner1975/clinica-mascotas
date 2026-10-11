<template>
  <div class="card">
    <div class="card-body">
      <h3 class="card-title d-flex justify-content-between align-items-center">
        <span><i class="bi bi-cart3 me-2 text-primary"></i>{{ titulo }}</span>
        <span class="badge rounded-pill text-bg-light border">{{ items.length }}</span>
      </h3>

      <div v-if="items.length === 0" class="text-center text-muted py-4">
        <i class="bi bi-cart fs-2 d-block mb-2"></i>
        <small>Agrega productos para comenzar.</small>
      </div>

      <ul v-else class="list-unstyled mb-0">
        <li
          v-for="item in items"
          :key="item.productoId"
          class="d-flex align-items-center gap-2 py-2 border-bottom"
        >
          <div class="flex-grow-1 overflow-hidden">
            <div class="fw-semibold small text-truncate">{{ item.nombre }}</div>
            <small class="text-muted">{{ money(item.precio) }} c/u</small>
          </div>

          <div class="input-group input-group-sm flex-shrink-0" style="width: 108px">
            <button class="btn btn-outline-secondary" type="button" @click="cambiar(item, item.cantidad - 1)">
              <i class="bi bi-dash-lg"></i>
            </button>
            <input
              class="form-control text-center"
              :value="item.cantidad"
              @change="onInput(item, $event)"
            />
            <button class="btn btn-outline-secondary" type="button" @click="cambiar(item, item.cantidad + 1)">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>

          <button class="btn btn-sm btn-light text-danger flex-shrink-0" type="button" @click="$emit('remove', item.productoId)">
            <i class="bi bi-x-lg"></i>
          </button>
        </li>
      </ul>
    </div>

    <div class="card-footer bg-white">
      <div v-if="mostrarTotal" class="d-flex justify-content-between align-items-center mb-2">
        <span class="text-muted">Total</span>
        <span class="fs-5 fw-bold">{{ money(total) }}</span>
      </div>
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { money } from '@/utils/format'

defineProps({
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  titulo: { type: String, default: 'Carrito' },
  /** Mostrar la fila de total dentro del panel (los pedidos usan su propio resumen). */
  mostrarTotal: { type: Boolean, default: true },
})

const emit = defineEmits(['update-cantidad', 'remove'])

function cambiar(item, cantidad) {
  if (cantidad <= 0) {
    emit('remove', item.productoId)
    return
  }
  emit('update-cantidad', { productoId: item.productoId, cantidad })
}

function onInput(item, event) {
  cambiar(item, Number(event.target.value))
}
</script>
