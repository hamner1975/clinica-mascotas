<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Contenido web</h1>
        <p class="page-subtitle">Administra el sitio publico de la clinica</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary" type="button" @click="restaurar">
          <i class="bi bi-arrow-counterclockwise me-2"></i>Restaurar
        </button>
        <a href="/" target="_blank" rel="noopener" class="btn btn-outline-secondary">
          <i class="bi bi-box-arrow-up-right me-2"></i>Vista previa
        </a>
        <button class="btn btn-primary" type="button" @click="guardar">
          <i class="bi bi-check2 me-2"></i>Guardar cambios
        </button>
      </div>
    </div>

    <ul class="nav nav-pills hc-tabs mb-3 flex-wrap">
      <li v-for="t in tabs" :key="t.key" class="nav-item">
        <button class="nav-link" :class="{ active: tab === t.key }" type="button" @click="tab = t.key">
          <i :class="['bi', t.icon, 'me-1']"></i>{{ t.label }}
        </button>
      </li>
    </ul>

    <!-- HERO -->
    <div v-show="tab === 'hero'" class="card">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label" for="w-badge">Etiqueta superior</label>
            <input id="w-badge" v-model="form.hero.badge" class="form-control" />
          </div>
          <div class="col-12">
            <label class="form-label" for="w-titulo">Titulo principal</label>
            <input id="w-titulo" v-model="form.hero.titulo" class="form-control" />
          </div>
          <div class="col-12">
            <label class="form-label" for="w-sub">Subtitulo</label>
            <textarea id="w-sub" v-model="form.hero.subtitulo" class="form-control" rows="2"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="w-btn1">Texto del boton principal</label>
            <input id="w-btn1" v-model="form.hero.botonPrimario" class="form-control" />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="w-btn2">Texto del boton secundario</label>
            <input id="w-btn2" v-model="form.hero.botonSecundario" class="form-control" />
          </div>
          <div class="col-12">
            <label class="form-label">Imagen del hero (opcional)</label>
            <ImageInput v-model="form.hero.imagen" shape="square" placeholder-icon="bi-heart-pulse-fill" />
          </div>
        </div>
      </div>
    </div>

    <!-- SERVICIOS -->
    <div v-show="tab === 'servicios'" class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="form-check form-switch">
            <input id="w-sec-serv" v-model="form.secciones.servicios" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="w-sec-serv">Mostrar esta seccion en la web</label>
          </div>
          <button class="btn btn-sm btn-outline-secondary" type="button" @click="agregarServicio">
            <i class="bi bi-plus-lg me-1"></i>Agregar servicio
          </button>
        </div>

        <div v-for="(s, i) in form.servicios" :key="s.id" class="border rounded p-3 mb-2">
          <div class="row g-2">
            <div class="col-12">
              <label class="form-label small text-muted">Icono</label>
              <IconPicker v-model="s.icon" />
            </div>
            <div class="col-md-4">
              <label class="form-label" :for="`s-tit-${s.id}`">Titulo</label>
              <input :id="`s-tit-${s.id}`" v-model="s.titulo" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label" :for="`s-desc-${s.id}`">Descripcion</label>
              <input :id="`s-desc-${s.id}`" v-model="s.descripcion" class="form-control" />
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-outline-danger w-100" type="button" @click="form.servicios.splice(i, 1)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FARMACIA -->
    <div v-show="tab === 'farmacia'" class="card">
      <div class="card-body">
        <div class="form-check form-switch mb-3">
          <input id="w-far-vis" v-model="form.farmacia.visible" class="form-check-input" type="checkbox" />
          <label class="form-check-label" for="w-far-vis">Mostrar el banner de la farmacia</label>
        </div>
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label" for="w-far-tit">Titulo</label>
            <input id="w-far-tit" v-model="form.farmacia.titulo" class="form-control" />
          </div>
          <div class="col-12">
            <label class="form-label" for="w-far-txt">Texto</label>
            <textarea id="w-far-txt" v-model="form.farmacia.texto" class="form-control" rows="2"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="w-far-btn">Texto del boton</label>
            <input id="w-far-btn" v-model="form.farmacia.boton" class="form-control" />
          </div>
        </div>
        <p class="text-muted small mt-3 mb-0">
          <i class="bi bi-info-circle me-1"></i>Los productos y las ofertas se administran en
          <strong>Inventario</strong>.
        </p>
      </div>
    </div>

    <!-- POR QUE ELEGIRNOS -->
    <div v-show="tab === 'elegirnos'" class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="form-check form-switch">
            <input id="w-ele-vis" v-model="form.elegirnos.visible" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="w-ele-vis">Mostrar esta seccion</label>
          </div>
          <button class="btn btn-sm btn-outline-secondary" type="button" @click="agregarItem">
            <i class="bi bi-plus-lg me-1"></i>Agregar bloque
          </button>
        </div>
        <div class="row g-3 mb-2">
          <div class="col-md-6">
            <label class="form-label" for="w-ele-tit">Titulo</label>
            <input id="w-ele-tit" v-model="form.elegirnos.titulo" class="form-control" />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="w-ele-sub">Subtitulo</label>
            <input id="w-ele-sub" v-model="form.elegirnos.subtitulo" class="form-control" />
          </div>
        </div>
        <div v-for="(it, i) in form.elegirnos.items" :key="it.id" class="border rounded p-3 mb-2">
          <div class="row g-2">
            <div class="col-12">
              <label class="form-label small text-muted">Icono</label>
              <IconPicker v-model="it.icon" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Titulo</label>
              <input v-model="it.titulo" class="form-control" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Texto</label>
              <input v-model="it.texto" class="form-control" />
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-outline-danger w-100" type="button" @click="form.elegirnos.items.splice(i, 1)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- REDES -->
    <div v-show="tab === 'redes'" class="card">
      <div class="card-body">
        <p class="text-muted small">Se muestran como enlaces en el pie de la web.</p>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label" for="w-fb"><i class="bi bi-facebook me-1"></i>Facebook (URL)</label>
            <input id="w-fb" v-model="form.redes.facebook" class="form-control" placeholder="https://facebook.com/..." />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="w-ig"><i class="bi bi-instagram me-1"></i>Instagram (URL)</label>
            <input id="w-ig" v-model="form.redes.instagram" class="form-control" placeholder="https://instagram.com/..." />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="w-wa"><i class="bi bi-whatsapp me-1"></i>WhatsApp (numero o URL)</label>
            <input id="w-wa" v-model="form.redes.whatsapp" class="form-control" placeholder="+57 300 123 4567" />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="w-tk"><i class="bi bi-tiktok me-1"></i>TikTok (URL)</label>
            <input id="w-tk" v-model="form.redes.tiktok" class="form-control" placeholder="https://tiktok.com/@..." />
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-primary" type="button" @click="guardar">
        <i class="bi bi-check2 me-2"></i>Guardar cambios
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useSitioStore } from '@/stores/sitio'
import IconPicker from '@/components/admin/IconPicker.vue'
import ImageInput from '@/components/ui/ImageInput.vue'
import { confirmDialog, toastError, toastSuccess } from '@/utils/alerts'

const sitio = useSitioStore()

const tabs = [
  { key: 'hero', label: 'Hero', icon: 'bi-stars' },
  { key: 'servicios', label: 'Servicios', icon: 'bi-clipboard2-pulse' },
  { key: 'farmacia', label: 'Farmacia', icon: 'bi-capsule' },
  { key: 'elegirnos', label: 'Por que elegirnos', icon: 'bi-award' },
  { key: 'redes', label: 'Redes', icon: 'bi-globe' },
]

const tab = ref('hero')
const form = reactive(JSON.parse(JSON.stringify(sitio.contenido)))

function agregarServicio() {
  form.servicios.push({ id: Date.now(), icon: 'bi-star', titulo: '', descripcion: '' })
}
function agregarItem() {
  form.elegirnos.items.push({ id: Date.now(), icon: 'bi-star', titulo: '', texto: '' })
}

async function guardar() {
  try {
    await sitio.save(JSON.parse(JSON.stringify(form)))
    toastSuccess('Contenido guardado', 'Los cambios ya se ven en la web publica.')
  } catch (error) {
    toastError('No se pudo guardar', error?.message || 'Intenta de nuevo.')
  }
}

async function restaurar() {
  const result = await confirmDialog({
    title: 'Restaurar contenido',
    text: 'Se descartaran tus cambios en la web y se volvera al contenido por defecto. ¿Continuar?',
    confirmText: 'Si, restaurar',
    icon: 'warning',
  })
  if (!result.isConfirmed) return
  try {
    await sitio.reset()
    Object.assign(form, JSON.parse(JSON.stringify(sitio.contenido)))
    toastSuccess('Contenido restaurado', 'La web volvio al contenido por defecto.')
  } catch (error) {
    toastError('No se pudo restaurar', error?.message || 'Intenta de nuevo.')
  }
}

onMounted(async () => {
  await sitio.load().catch(() => {})
  Object.assign(form, JSON.parse(JSON.stringify(sitio.contenido)))
})
</script>
