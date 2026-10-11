import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

/** Contenido por defecto del sitio publico. */
const DEFAULT = {
  hero: {
    badge: 'Clinica veterinaria',
    titulo: 'Cuidamos a tus mascotas como a nuestra familia',
    subtitulo:
      'Ofrecemos atencion veterinaria integral: consultas, vacunacion, cirugia, laboratorio y mas. Y ahora tambien puedes comprar en nuestra farmacia online.',
    botonPrimario: 'Ver servicios',
    botonSecundario: 'Ir a la farmacia',
    imagen: '',
  },
  secciones: { servicios: true, farmacia: true, elegirnos: true, contacto: true },
  servicios: [
    { id: 1, icon: 'bi-clipboard2-pulse', titulo: 'Consulta general', descripcion: 'Revision completa, diagnostico y plan de tratamiento con seguimiento.' },
    { id: 2, icon: 'bi-shield-check', titulo: 'Vacunacion', descripcion: 'Esquema de vacunas completo para perros y gatos.' },
    { id: 3, icon: 'bi-bandaid', titulo: 'Cirugia y curas', descripcion: 'Procedimientos quirurgicos y curaciones con equipo especializado.' },
    { id: 4, icon: 'bi-droplet', titulo: 'Laboratorio clinico', descripcion: 'Analisis de sangre, orina y examenes especializados.' },
    { id: 5, icon: 'bi-emoji-smile', titulo: 'Odontologia', descripcion: 'Limpieza dental y tratamiento de enfermedades orales.' },
    { id: 6, icon: 'bi-stars', titulo: 'Estetica y peluqueria', descripcion: 'Bano, corte y cuidado integral del pelaje.' },
    { id: 7, icon: 'bi-bug', titulo: 'Desparasitacion', descripcion: 'Control de parasitos internos y externos.' },
    { id: 8, icon: 'bi-camera', titulo: 'Imagenes y rayos X', descripcion: 'Diagnostico por imagen para casos complejos.' },
  ],
  farmacia: {
    visible: true,
    titulo: 'Nuestra farmacia veterinaria',
    texto: 'Medicamentos, vacunas, alimentos y accesorios. Compra online y recoge en la clinica o recibe en casa.',
    boton: 'Entrar a la farmacia',
  },
  elegirnos: {
    visible: true,
    titulo: 'Por que elegirnos',
    subtitulo: 'Profesionales comprometidos con el bienestar de tu mascota.',
    items: [
      { id: 1, icon: 'bi-award', titulo: 'Equipo profesional', texto: 'Veterinarios con amplia experiencia y formacion continua.' },
      { id: 2, icon: 'bi-lightning-charge', titulo: 'Atencion agil', texto: 'Citas, diagnostico y resultados sin esperas largas.' },
      { id: 3, icon: 'bi-heart', titulo: 'Trato cercano', texto: 'Amamos a los animales tanto como tu.' },
    ],
  },
  redes: { facebook: '', instagram: '', whatsapp: '', tiktok: '' },
}

/**
 * Store del contenido editable de la web publica.
 * FASE 2: los datos viven en MySQL; aqui se consultan via la API.
 */
export const useSitioStore = defineStore('sitio', () => {
  const contenido = ref(structuredClone(DEFAULT))
  const loaded = ref(false)

  async function load(force = false) {
    if (loaded.value && !force) return
    try {
      const { data } = await api.get('/sitio')
      if (data.data) {
        contenido.value = { ...structuredClone(DEFAULT), ...data.data }
      }
      loaded.value = true
    } catch {
      // Si falla, se mantiene el contenido por defecto.
    }
  }

  async function save(payload) {
    const { data } = await api.put('/sitio', payload)
    contenido.value = data.data ?? payload
  }

  async function reset() {
    await save(structuredClone(DEFAULT))
  }

  return { contenido, loaded, load, save, reset, DEFAULT }
})
