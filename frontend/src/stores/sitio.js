import { defineStore } from 'pinia'
import { ref } from 'vue'

const KEY = 'cm_sitio'

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

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...structuredClone(DEFAULT), ...JSON.parse(raw) } : structuredClone(DEFAULT)
  } catch {
    return structuredClone(DEFAULT)
  }
}

/** Store del contenido editable de la web publica. */
export const useSitioStore = defineStore('sitio', () => {
  const contenido = ref(load())

  function save(payload) {
    contenido.value = structuredClone(payload)
    localStorage.setItem(KEY, JSON.stringify(contenido.value))
  }

  function reset() {
    contenido.value = structuredClone(DEFAULT)
    localStorage.setItem(KEY, JSON.stringify(contenido.value))
  }

  return { contenido, save, reset, DEFAULT }
})
