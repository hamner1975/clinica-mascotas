/**
 * Datos de ejemplo (Fase 1).
 * Se cargan solo si el navegador no tiene datos guardados.
 * En Fase 2 estos datos vendran de la base de datos MySQL.
 */
export const seedDuenos = [
  {
    id: 1,
    nombres: 'Maria',
    apellidos: 'Gomez Ruiz',
    documento: '10234567',
    email: 'maria.gomez@correo.com',
    telefono: '+57 300 123 4567',
    direccion: 'Calle 45 #12-30, Bogota',
    notas: '',
  },
  {
    id: 2,
    nombres: 'Jose',
    apellidos: 'Perez Lozano',
    documento: '79845123',
    email: 'jose.perez@correo.com',
    telefono: '+57 311 987 6543',
    direccion: 'Carrera 8 #3-15, Medellin',
    notas: 'Cliente frecuente.',
  },
  {
    id: 3,
    nombres: 'Ana',
    apellidos: 'Torres Marin',
    documento: '52987456',
    email: 'ana.torres@correo.com',
    telefono: '+57 320 555 1122',
    direccion: 'Av. Siempre Viva 742, Cali',
    notas: '',
  },
  {
    id: 4,
    nombres: 'Luis',
    apellidos: 'Diaz Herrera',
    documento: '11223344',
    email: 'luis.diaz@correo.com',
    telefono: '+57 301 444 8899',
    direccion: 'Calle 100 #20-40, Bogota',
    notas: '',
  },
]

export const seedMascotas = [
  {
    id: 1,
    nombre: 'Luna',
    especie: 'Perro',
    raza: 'Golden Retriever',
    sexo: 'Hembra',
    fechaNacimiento: '2021-03-15',
    peso: 28.5,
    color: 'Dorado',
    duenoId: 1,
    esterilizado: true,
    notas: 'Alergica a la penicilina.',
  },
  {
    id: 2,
    nombre: 'Michi',
    especie: 'Gato',
    raza: 'Comun europeo',
    sexo: 'Macho',
    fechaNacimiento: '2022-08-01',
    peso: 4.2,
    color: 'Atigrado',
    duenoId: 2,
    esterilizado: true,
    notas: '',
  },
  {
    id: 3,
    nombre: 'Rocky',
    especie: 'Perro',
    raza: 'Bulldog Frances',
    sexo: 'Macho',
    fechaNacimiento: '2020-01-20',
    peso: 12.8,
    color: 'Blanco',
    duenoId: 3,
    esterilizado: false,
    notas: 'Problemas respiratorios leves.',
  },
  {
    id: 4,
    nombre: 'Nube',
    especie: 'Gato',
    raza: 'Siames',
    sexo: 'Hembra',
    fechaNacimiento: '2023-05-10',
    peso: 3.6,
    color: 'Crema',
    duenoId: 4,
    esterilizado: false,
    notas: '',
  },
  {
    id: 5,
    nombre: 'Toby',
    especie: 'Perro',
    raza: 'Beagle',
    sexo: 'Macho',
    fechaNacimiento: '2019-11-02',
    peso: 14.1,
    color: 'Tricolor',
    duenoId: 1,
    esterilizado: true,
    notas: 'Requiere control de peso.',
  },
  {
    id: 6,
    nombre: 'Kira',
    especie: 'Roedor',
    raza: 'Cobaya',
    sexo: 'Hembra',
    fechaNacimiento: '2024-02-14',
    peso: 0.9,
    color: 'Marron y blanco',
    duenoId: 3,
    esterilizado: false,
    notas: '',
  },
]

/** Fecha en formato YYYY-MM-DD desplazada N dias respecto a hoy. */
function isoOffset(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const offset = d.getTimezoneOffset()
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10)
}

export const seedCitas = [
  { id: 1, mascotaId: 1, fecha: isoOffset(0), hora: '09:00', motivo: 'Vacunacion anual', veterinario: 'Dra. Ana Ramirez', estado: 'Confirmada', notas: '' },
  { id: 2, mascotaId: 2, fecha: isoOffset(0), hora: '09:30', motivo: 'Control post-operatorio', veterinario: 'Dr. Carlos Mena', estado: 'En sala', notas: '' },
  { id: 3, mascotaId: 3, fecha: isoOffset(0), hora: '10:15', motivo: 'Revision general', veterinario: 'Dra. Lucia Vega', estado: 'Pendiente', notas: '' },
  { id: 4, mascotaId: 4, fecha: isoOffset(0), hora: '11:00', motivo: 'Desparasitacion', veterinario: 'Dra. Ana Ramirez', estado: 'Pendiente', notas: '' },
  { id: 5, mascotaId: 5, fecha: isoOffset(1), hora: '08:30', motivo: 'Control de peso', veterinario: 'Dr. Carlos Mena', estado: 'Confirmada', notas: '' },
  { id: 6, mascotaId: 6, fecha: isoOffset(1), hora: '10:00', motivo: 'Corte de unas', veterinario: 'Dra. Lucia Vega', estado: 'Pendiente', notas: '' },
  { id: 7, mascotaId: 1, fecha: isoOffset(-3), hora: '15:00', motivo: 'Reaccion alergica', veterinario: 'Dra. Ana Ramirez', estado: 'Atendida', notas: '' },
  { id: 8, mascotaId: 3, fecha: isoOffset(-1), hora: '16:30', motivo: 'Tos persistente', veterinario: 'Dr. Carlos Mena', estado: 'Cancelada', notas: '' },
]

export const seedConsultas = [
  {
    id: 1,
    citaId: 7,
    mascotaId: 1,
    fecha: isoOffset(-3),
    hora: '15:10',
    motivo: 'Reaccion alergica',
    temperatura: 38.5,
    peso: 28.5,
    frecuenciaCardiaca: 90,
    diagnostico: 'Dermatitis alergica',
    tratamiento: 'Antihistaminico por 5 dias',
    observaciones: 'Revisar en 1 semana.',
    veterinario: 'Dra. Ana Ramirez',
    proximaCita: isoOffset(4),
  },
  {
    id: 2,
    citaId: null,
    mascotaId: 2,
    fecha: isoOffset(-5),
    hora: '11:20',
    motivo: 'Vomito',
    temperatura: 38.1,
    peso: 4.1,
    frecuenciaCardiaca: 160,
    diagnostico: 'Gastritis leve',
    tratamiento: 'Dieta blanda 3 dias',
    observaciones: '',
    veterinario: 'Dr. Carlos Mena',
    proximaCita: '',
  },
]
