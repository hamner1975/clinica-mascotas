<template>
  <div class="search-select">
    <div class="input-group" :class="{ 'is-invalid': invalid }">
      <span v-if="icon" class="input-group-text"><i :class="['bi', icon]"></i></span>
      <input
        :id="id || undefined"
        ref="inputEl"
        class="form-control"
        :class="{ 'is-invalid': invalid }"
        type="text"
        role="combobox"
        autocomplete="off"
        :disabled="disabled"
        :placeholder="placeholderText"
        :value="text"
        :aria-expanded="open ? 'true' : 'false'"
        @focus="onFocus"
        @input="onInput"
        @keydown="onKeydown"
        @blur="onBlur"
      />
      <button
        v-if="clearable && modelValue !== '' && modelValue !== null"
        class="btn btn-outline-secondary"
        type="button"
        tabindex="-1"
        aria-label="Limpiar"
        @mousedown.prevent="clear"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <Teleport to="body">
      <ul v-if="open && filtered.length" class="search-select__menu" :style="menuStyle">
        <li
          v-for="(option, index) in filtered"
          :key="option.value"
          class="search-select__item"
          :class="{ 'is-active': index === highlighted }"
          @mousedown.prevent="select(option)"
          @mousemove="highlighted = index"
        >
          <span class="fw-semibold d-block">{{ option.label }}</span>
          <small v-if="option.sublabel" class="text-muted">{{ option.sublabel }}</small>
        </li>
      </ul>
      <div v-else-if="open" class="search-select__empty" :style="menuStyle">Sin resultados</div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  /** Array de { value, label, sublabel? } */
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Buscar...' },
  icon: { type: String, default: 'bi-search' },
  id: { type: String, default: '' },
  invalid: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  /** Mostrar el boton para limpiar la seleccion. */
  clearable: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const inputEl = ref(null)
const open = ref(false)
const text = ref('') // lo que se ve en el input
const highlighted = ref(0)
const menuStyle = ref({})

const selected = computed(() => {
  if (props.modelValue === '' || props.modelValue === null || props.modelValue === undefined) return null
  return props.options.find((o) => o.value === props.modelValue) || null
})

// Si cambia la seleccion (y no se esta escribiendo), reflejarla en el input.
watch(
  selected,
  () => {
    if (!open.value) text.value = selected.value ? selected.value.label : ''
  },
  { immediate: true },
)

const filtered = computed(() => {
  const q = text.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter(
    (o) => o.label.toLowerCase().includes(q) || (o.sublabel || '').toLowerCase().includes(q),
  )
})

const placeholderText = computed(() =>
  open.value && selected.value ? selected.value.label : props.placeholder,
)

function updatePosition() {
  const el = inputEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  menuStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: 2000,
  }
}

function onFocus() {
  if (props.disabled) return
  open.value = true
  text.value = ''
  highlighted.value = Math.max(
    0,
    filtered.value.findIndex((o) => o.value === props.modelValue),
  )
  nextTick(updatePosition)
}

function onInput(event) {
  text.value = event.target.value
  open.value = true
  highlighted.value = 0
  updatePosition()
}

function onKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (!open.value) {
      open.value = true
      nextTick(updatePosition)
      return
    }
    highlighted.value = Math.min(highlighted.value + 1, filtered.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    highlighted.value = Math.max(highlighted.value - 1, 0)
  } else if (event.key === 'Enter') {
    if (open.value && filtered.value[highlighted.value]) {
      event.preventDefault()
      select(filtered.value[highlighted.value])
    }
  } else if (event.key === 'Escape') {
    open.value = false
    inputEl.value?.blur()
  }
}

function select(option) {
  emit('update:modelValue', option.value)
  text.value = option.label
  open.value = false
}

function clear() {
  emit('update:modelValue', '')
  text.value = ''
  open.value = false
  inputEl.value?.focus()
}

function onBlur() {
  open.value = false
  emit('blur')
}

// Reposicionar el menu si la pagina/panel se desplaza mientras esta abierto.
watch(open, (isOpen) => {
  if (isOpen) {
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
  } else {
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})
</script>
