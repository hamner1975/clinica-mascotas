<template>
  <div v-if="total > 0" class="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
    <span class="text-muted small">
      Mostrando {{ from }}&ndash;{{ to }} de {{ total }}
    </span>

    <nav v-if="totalPages > 1" aria-label="Paginacion">
      <ul class="pagination pagination-sm mb-0">
        <li class="page-item" :class="{ disabled: page <= 1 }">
          <button class="page-link" type="button" aria-label="Anterior" @click="go(page - 1)">
            <i class="bi bi-chevron-left"></i>
          </button>
        </li>

        <li v-for="p in pages" :key="p" class="page-item" :class="{ active: p === page }">
          <button class="page-link" type="button" @click="go(p)">{{ p }}</button>
        </li>

        <li class="page-item" :class="{ disabled: page >= totalPages }">
          <button class="page-link" type="button" aria-label="Siguiente" @click="go(page + 1)">
            <i class="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, default: 1 },
  perPage: { type: Number, default: 8 },
  total: { type: Number, default: 0 },
})

const emit = defineEmits(['update:page'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))
const from = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.perPage + 1))
const to = computed(() => Math.min(props.page * props.perPage, props.total))

// Ventana de paginas alrededor de la actual (maximo 5 botones).
const pages = computed(() => {
  const delta = 2
  const start = Math.max(1, props.page - delta)
  const end = Math.min(totalPages.value, props.page + delta)
  const result = []
  for (let i = start; i <= end; i += 1) result.push(i)
  return result
})

function go(target) {
  if (target < 1 || target > totalPages.value) return
  emit('update:page', target)
}
</script>
