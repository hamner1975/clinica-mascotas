<template>
  <BaseModal :open="open" title="Detalle de la venta" icon="bi-receipt" size="lg" @close="$emit('close')">
    <template v-if="venta">
      <div class="d-flex flex-wrap justify-content-between gap-2 mb-3">
        <div>
          <p class="mb-0 fw-semibold">Venta #{{ venta.id }}</p>
          <small class="text-muted">{{ formatFecha(venta.fecha) }} &middot; {{ venta.hora }}</small>
        </div>
        <div class="text-end">
          <span class="badge rounded-pill me-1" :class="canalVariant(venta.canal)">{{ venta.canal }}</span>
          <span class="badge rounded-pill" :class="estadoVentaVariant(venta.estado)">{{ venta.estado }}</span>
        </div>
      </div>

      <p class="mb-3 small">
        <i class="bi bi-person me-1 text-muted"></i><strong>Cliente:</strong> {{ venta.cliente }}
      </p>

      <div class="table-responsive">
        <table class="table table-sm align-middle">
          <thead>
            <tr class="text-muted small text-uppercase">
              <th scope="col">Producto</th>
              <th scope="col" class="text-center">Cant.</th>
              <th scope="col" class="text-end">Precio</th>
              <th scope="col" class="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in venta.items" :key="item.productoId">
              <td>{{ item.nombre }}</td>
              <td class="text-center">{{ item.cantidad }}</td>
              <td class="text-end">{{ money(item.precio) }}</td>
              <td class="text-end">{{ money(item.precio * item.cantidad) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-end fw-semibold">Total</td>
              <td class="text-end fw-bold">{{ money(venta.total) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </template>

    <template #footer>
      <button class="btn btn-light" type="button" @click="$emit('close')">Cerrar</button>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/ui/BaseModal.vue'
import { canalVariant, estadoVentaVariant } from '@/data/catalogos'
import { formatFecha, money } from '@/utils/format'

defineProps({
  open: { type: Boolean, default: false },
  venta: { type: Object, default: null },
})

defineEmits(['close'])
</script>
