import { computed, ref, watch } from 'vue'

/**
 * Paginacion en memoria reutilizable.
 *
 * @param {import('vue').Ref<Array>} source  Lista completa (computed o ref).
 * @param {number} perPage                   Elementos por pagina.
 */
export function usePagination(source, perPage = 8) {
  const page = ref(1)

  const total = computed(() => source.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / perPage)))

  const paginated = computed(() => {
    const start = (page.value - 1) * perPage
    return source.value.slice(start, start + perPage)
  })

  function setPage(next) {
    page.value = Math.min(Math.max(1, next), totalPages.value)
  }

  // Si los resultados cambian (por un filtro), volvemos a una pagina valida.
  watch(totalPages, () => {
    if (page.value > totalPages.value) page.value = totalPages.value
  })

  return { page, perPage, total, totalPages, paginated, setPage }
}
