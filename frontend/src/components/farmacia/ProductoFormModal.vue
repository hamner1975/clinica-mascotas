<template>
  <BaseModal
    :open="open"
    :title="isEdit ? 'Editar producto' : 'Nuevo producto'"
    icon="bi-box-seam"
    size="lg"
    @close="$emit('close')"
  >
    <form id="producto-form" novalidate @submit.prevent="onSubmit">
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label">Imagen</label>
          <ImageInput v-model="form.imagen" shape="square" placeholder-icon="bi-box-seam" />
        </div>

        <div class="col-md-8">
          <label class="form-label" for="p-nombre">Nombre <span class="text-danger">*</span></label>
          <input id="p-nombre" v-model="form.nombre" class="form-control" :class="invalid('nombre')" placeholder="Ej: Amoxicilina 500mg" @blur="validateField('nombre')" />
          <p v-if="showError('nombre')" class="text-danger small mt-1 mb-0">{{ errors.nombre }}</p>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="p-tipo">Tipo</label>
          <SearchSelect id="p-tipo" v-model="form.tipo" :options="tipoOptions" icon="" :clearable="false" placeholder="Tipo" />
        </div>

        <div class="col-md-6">
          <label class="form-label" for="p-categoria">Categoria <span class="text-danger">*</span></label>
          <SearchSelect
            id="p-categoria"
            v-model="form.categoria"
            :options="categoriaOptions"
            icon="bi-tags"
            placeholder="Categoria"
            :invalid="!!(touched.categoria && errors.categoria)"
            @blur="validateField('categoria')"
          />
          <p v-if="showError('categoria')" class="text-danger small mt-1 mb-0">{{ errors.categoria }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="p-unidad">Unidad</label>
          <SearchSelect id="p-unidad" v-model="form.unidad" :options="unidadOptions" icon="" :clearable="false" placeholder="Unidad" />
        </div>

        <div class="col-md-6">
          <label class="form-label" for="p-precio">Precio de venta <span class="text-danger">*</span></label>
          <div class="input-group">
            <span class="input-group-text">S/</span>
            <input id="p-precio" v-model="form.precio" type="number" step="0.01" min="0" class="form-control" :class="invalid('precio')" @blur="validateField('precio')" />
          </div>
          <p v-if="showError('precio')" class="text-danger small mt-1 mb-0">{{ errors.precio }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="p-costo">Costo</label>
          <div class="input-group">
            <span class="input-group-text">S/</span>
            <input id="p-costo" v-model="form.costo" type="number" step="0.01" min="0" class="form-control" :class="invalid('costo')" @blur="validateField('costo')" />
          </div>
          <p v-if="showError('costo')" class="text-danger small mt-1 mb-0">{{ errors.costo }}</p>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="p-stock">Stock <span class="text-danger">*</span></label>
          <input id="p-stock" v-model="form.stock" type="number" min="0" class="form-control" :class="invalid('stock')" @blur="validateField('stock')" />
          <p v-if="showError('stock')" class="text-danger small mt-1 mb-0">{{ errors.stock }}</p>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="p-min">Stock minimo</label>
          <input id="p-min" v-model="form.stockMinimo" type="number" min="0" class="form-control" :class="invalid('stockMinimo')" @blur="validateField('stockMinimo')" />
          <p v-if="showError('stockMinimo')" class="text-danger small mt-1 mb-0">{{ errors.stockMinimo }}</p>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="p-venc">Vencimiento</label>
          <input id="p-venc" v-model="form.vencimiento" type="date" class="form-control" />
        </div>

        <div class="col-md-4">
          <label class="form-label" for="p-descuento">Descuento (%)</label>
          <input id="p-descuento" v-model="form.descuento" type="number" min="0" max="100" class="form-control" :class="invalid('descuento')" placeholder="0" @blur="validateField('descuento')" />
          <p v-if="showError('descuento')" class="text-danger small mt-1 mb-0">{{ errors.descuento }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="p-lote">Lote</label>
          <input id="p-lote" v-model="form.lote" class="form-control" placeholder="Ej: AMX-2401" />
        </div>

        <div class="col-md-6 d-flex align-items-end">
          <div class="w-100">
            <div class="form-check form-switch">
              <input id="p-receta" v-model="form.requiereReceta" class="form-check-input" type="checkbox" />
              <label class="form-check-label" for="p-receta">Requiere receta</label>
            </div>
            <div class="form-check form-switch">
              <input id="p-activo" v-model="form.activo" class="form-check-input" type="checkbox" />
              <label class="form-check-label" for="p-activo">Activo (visible en tienda)</label>
            </div>
          </div>
        </div>

        <div class="col-12">
          <label class="form-label" for="p-desc">Descripcion</label>
          <textarea id="p-desc" v-model="form.descripcion" class="form-control" rows="2"></textarea>
        </div>
      </div>
    </form>

    <template #footer>
      <button class="btn btn-light" type="button" @click="$emit('close')">Cancelar</button>
      <button class="btn btn-primary" type="submit" form="producto-form">
        <i class="bi bi-check2 me-1"></i>{{ isEdit ? 'Guardar cambios' : 'Registrar producto' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import ImageInput from '@/components/ui/ImageInput.vue'
import { useProductosStore } from '@/stores/productos'
import { useForm } from '@/composables/useForm'
import { CATEGORIAS_PRODUCTO, TIPOS_PRODUCTO, UNIDADES } from '@/data/catalogos'
import { notifyValidation, toastSuccess } from '@/utils/alerts'

const props = defineProps({
  open: { type: Boolean, default: false },
  producto: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const store = useProductosStore()

const tipoOptions = TIPOS_PRODUCTO.map((t) => ({ value: t, label: t }))
const categoriaOptions = [
  { value: '', label: 'Selecciona una categoria' },
  ...CATEGORIAS_PRODUCTO.map((c) => ({ value: c, label: c })),
]
const unidadOptions = UNIDADES.map((u) => ({ value: u, label: u }))

function emptyForm() {
  return {
    imagen: '',
    nombre: '',
    categoria: '',
    tipo: 'Medicamento',
    precio: '',
    costo: '',
    descuento: 0,
    stock: 0,
    stockMinimo: 5,
    unidad: 'Unidad',
    lote: '',
    vencimiento: '',
    requiereReceta: false,
    activo: true,
    descripcion: '',
  }
}

const { form, errors, touched, validate, validateField, firstError, reset } = useForm(emptyForm(), {
  nombre: { label: 'Nombre', required: true, min: 2 },
  categoria: { label: 'Categoria', required: true },
  precio: { label: 'Precio de venta', required: true, number: true, minValue: 0 },
  costo: { label: 'Costo', number: true, minValue: 0 },
  descuento: { label: 'Descuento (%)', number: true, minValue: 0, maxValue: 100 },
  stock: { label: 'Stock', required: true, number: true, minValue: 0 },
  stockMinimo: { label: 'Stock minimo', number: true, minValue: 0 },
})

const isEdit = computed(() => !!props.producto?.id)

function invalid(field) {
  return { 'is-invalid': touched[field] && errors[field] }
}
function showError(field) {
  return touched[field] && errors[field]
}

watch(
  () => props.open,
  (open) => {
    if (open) reset(props.producto ? { ...emptyForm(), ...props.producto } : emptyForm())
  },
)

function onSubmit() {
  if (!validate()) {
    notifyValidation(firstError())
    return
  }
  store.save({ ...form })
  toastSuccess(isEdit.value ? 'Producto actualizado' : 'Producto registrado', `${form.nombre} se guardo correctamente.`)
  emit('saved')
  emit('close')
}
</script>
