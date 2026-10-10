/**
 * Datos de ejemplo (Fase 1).
 * Se cargan solo si el navegador no tiene datos guardados.
 * En Fase 2 estos datos vendran de la base de datos MySQL.
 */
import { TODOS_LOS_PERMISOS } from '@/data/permisos'

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

export const seedProductos = [
  { id: 1, nombre: 'Amoxicilina 500mg', categoria: 'Medicamentos', tipo: 'Medicamento', precio: 12000, costo: 7000, stock: 2, stockMinimo: 10, unidad: 'Caja', lote: 'AMX-2401', vencimiento: isoOffset(150), requiereReceta: true, activo: true, descripcion: 'Antibiotico de amplio espectro.' },
  { id: 2, nombre: 'Vacuna antirrabica', categoria: 'Vacunas', tipo: 'Medicamento', precio: 45000, costo: 30000, stock: 3, stockMinimo: 5, unidad: 'Unidad', lote: 'VAR-2312', vencimiento: isoOffset(200), requiereReceta: true, activo: true, descripcion: 'Dosis unica anual.' },
  { id: 3, nombre: 'Antipulgas (pipeta)', categoria: 'Medicamentos', tipo: 'Medicamento', precio: 18000, costo: 11000, stock: 5, stockMinimo: 8, unidad: 'Unidad', lote: 'APU-2403', vencimiento: isoOffset(300), requiereReceta: false, activo: true, descripcion: 'Proteccion por 30 dias.' },
  { id: 4, nombre: 'Suero fisiologico 500ml', categoria: 'Medicamentos', tipo: 'Medicamento', precio: 9000, costo: 5000, stock: 24, stockMinimo: 6, unidad: 'Frasco', lote: 'SUE-2405', vencimiento: isoOffset(400), requiereReceta: false, activo: true, descripcion: 'Solucion isotonica esteril.' },
  { id: 5, nombre: 'Shampoo dermatologico', categoria: 'Higiene', tipo: 'Producto', precio: 26000, costo: 15000, stock: 15, stockMinimo: 5, unidad: 'Frasco', lote: 'SHA-2402', vencimiento: isoOffset(500), requiereReceta: false, activo: true, descripcion: 'Para pieles sensibles.' },
  { id: 6, nombre: 'Alimento premium perro 3kg', categoria: 'Alimentos', tipo: 'Producto', precio: 58000, costo: 40000, stock: 20, stockMinimo: 6, unidad: 'Bolsa', lote: 'ALP-2406', vencimiento: isoOffset(360), requiereReceta: false, activo: true, descripcion: 'Balanceado adulto razas medianas.' },
  { id: 7, nombre: 'Alimento gato 1.5kg', categoria: 'Alimentos', tipo: 'Producto', precio: 38000, costo: 26000, stock: 0, stockMinimo: 5, unidad: 'Bolsa', lote: 'ALG-2406', vencimiento: isoOffset(330), requiereReceta: false, activo: true, descripcion: 'Balanceado gatos adultos.' },
  { id: 8, nombre: 'Collar antipulgas', categoria: 'Accesorios', tipo: 'Producto', precio: 22000, costo: 12000, stock: 12, stockMinimo: 4, unidad: 'Unidad', lote: 'COL-2404', vencimiento: isoOffset(540), requiereReceta: false, activo: true, descripcion: 'Proteccion hasta 5 meses.' },
  { id: 9, nombre: 'Vitamina B complex', categoria: 'Medicamentos', tipo: 'Medicamento', precio: 15000, costo: 8000, stock: 6, stockMinimo: 6, unidad: 'Blister', lote: 'VIT-2405', vencimiento: isoOffset(210), requiereReceta: false, activo: true, descripcion: 'Suplemento vitaminico.' },
  { id: 10, nombre: 'Desparasitante oral', categoria: 'Medicamentos', tipo: 'Medicamento', precio: 20000, costo: 12000, stock: 9, stockMinimo: 4, unidad: 'Blister', lote: 'DES-2407', vencimiento: isoOffset(20), requiereReceta: true, activo: true, descripcion: 'Contra parasitos internos.' },
]

export const seedVentas = [
  {
    id: 1,
    fecha: isoOffset(0),
    hora: '10:30',
    canal: 'Mostrador',
    cliente: 'Cliente mostrador',
    items: [{ productoId: 3, nombre: 'Antipulgas (pipeta)', precio: 18000, cantidad: 2 }],
    total: 36000,
    estado: 'Completada',
  },
  {
    id: 2,
    fecha: isoOffset(-1),
    hora: '16:05',
    canal: 'Online',
    cliente: 'Maria Gomez',
    items: [
      { productoId: 5, nombre: 'Shampoo dermatologico', precio: 26000, cantidad: 1 },
      { productoId: 8, nombre: 'Collar antipulgas', precio: 22000, cantidad: 2 },
    ],
    total: 70000,
    estado: 'Enviado',
  },
  {
    id: 3,
    fecha: isoOffset(0),
    hora: '11:15',
    canal: 'Online',
    cliente: 'Jose Perez',
    items: [{ productoId: 6, nombre: 'Alimento premium perro 3kg', precio: 58000, cantidad: 1 }],
    total: 58000,
    estado: 'Pendiente',
  },
]

export const seedRoles = [
  {
    id: 1,
    nombre: 'Administrador',
    descripcion: 'Acceso total al sistema.',
    sistema: true,
    permisos: [...TODOS_LOS_PERMISOS],
  },
  {
    id: 2,
    nombre: 'Veterinario',
    descripcion: 'Atencion clinica, pacientes e historia clinica.',
    sistema: false,
    permisos: [
      'pacientes.ver',
      'pacientes.gestionar',
      'citas.ver',
      'citas.gestionar',
      'consultas.ver',
      'consultas.gestionar',
      'historia.ver',
      'historia.gestionar',
      'diagnosticos.ver',
      'farmacia.ver',
      'reportes.ver',
    ],
  },
  {
    id: 3,
    nombre: 'Recepcionista',
    descripcion: 'Agenda, pacientes y venta en mostrador.',
    sistema: false,
    permisos: [
      'pacientes.ver',
      'pacientes.gestionar',
      'citas.ver',
      'citas.gestionar',
      'consultas.ver',
      'historia.ver',
      'farmacia.ver',
      'farmacia.vender',
      'ventas.ver',
      'ventas.gestionar',
      'tienda.ver',
    ],
  },
  {
    id: 4,
    nombre: 'Farmaceutico',
    descripcion: 'Inventario, farmacia y tienda online.',
    sistema: false,
    permisos: [
      'farmacia.ver',
      'farmacia.vender',
      'inventario.ver',
      'inventario.gestionar',
      'tienda.ver',
      'tienda.gestionar',
      'ventas.ver',
      'ventas.gestionar',
    ],
  },
]

export const seedUsuarios = [
  { id: 1, nombres: 'Ana', apellidos: 'Ramirez', documento: '52987456', email: 'admin@clinica.test', telefono: '+57 300 111 2233', rolId: 1, activo: true, ultimoAcceso: isoOffset(0) },
  { id: 2, nombres: 'Carlos', apellidos: 'Mena', documento: '79845123', email: 'carlos.mena@clinica.test', telefono: '+57 311 222 3344', rolId: 2, activo: true, ultimoAcceso: isoOffset(-1) },
  { id: 3, nombres: 'Lucia', apellidos: 'Vega', documento: '43567788', email: 'lucia.vega@clinica.test', telefono: '+57 301 333 4455', rolId: 2, activo: true, ultimoAcceso: isoOffset(-2) },
  { id: 4, nombres: 'Pedro', apellidos: 'Salas', documento: '10293847', email: 'pedro.salas@clinica.test', telefono: '+57 320 444 5566', rolId: 3, activo: true, ultimoAcceso: isoOffset(-3) },
  { id: 5, nombres: 'Marta', apellidos: 'Rios', documento: '56473829', email: 'marta.rios@clinica.test', telefono: '+57 312 555 6677', rolId: 4, activo: false, ultimoAcceso: '' },
]

export const seedDiagnosticos = [
  { id: 1, codigo: 'DX-001', nombre: 'Otitis externa', categoria: 'Dermatologicas', especie: 'Todas', contagioso: false, activo: true, descripcion: 'Inflamacion del conducto auditivo externo.' },
  { id: 2, codigo: 'DX-002', nombre: 'Parvovirosis canina', categoria: 'Infecciosas', especie: 'Perro', contagioso: true, activo: true, descripcion: 'Infeccion viral aguda del tracto digestivo.' },
  { id: 3, codigo: 'DX-003', nombre: 'Sarna demodecica', categoria: 'Parasitarias', especie: 'Perro', contagioso: false, activo: true, descripcion: 'Infestacion por acaros Demodex.' },
  { id: 4, codigo: 'DX-004', nombre: 'Gastritis', categoria: 'Digestivas', especie: 'Todas', contagioso: false, activo: true, descripcion: 'Inflamacion de la mucosa gastrica.' },
  { id: 5, codigo: 'DX-005', nombre: 'Moquillo', categoria: 'Infecciosas', especie: 'Perro', contagioso: true, activo: true, descripcion: 'Enfermedad viral multisistemica.' },
  { id: 6, codigo: 'DX-006', nombre: 'Rinotraqueitis felina', categoria: 'Respiratorias', especie: 'Gato', contagioso: true, activo: true, descripcion: 'Infeccion respiratoria superior felina.' },
  { id: 7, codigo: 'DX-007', nombre: 'Conjuntivitis', categoria: 'Oftalmologicas', especie: 'Todas', contagioso: false, activo: true, descripcion: 'Inflamacion de la conjuntiva ocular.' },
  { id: 8, codigo: 'DX-008', nombre: 'Displasia de cadera', categoria: 'Osteomusculares', especie: 'Perro', contagioso: false, activo: true, descripcion: 'Alteracion del desarrollo de la articulacion coxofemoral.' },
  { id: 9, codigo: 'DX-009', nombre: 'Dermatitis alergica', categoria: 'Dermatologicas', especie: 'Todas', contagioso: false, activo: true, descripcion: 'Reaccion cutanea de origen alergico.' },
  { id: 10, codigo: 'DX-010', nombre: 'Tos de las perreras', categoria: 'Respiratorias', especie: 'Perro', contagioso: true, activo: true, descripcion: 'Traqueobronquitis infecciosa canina.' },
  { id: 11, codigo: 'DX-011', nombre: 'Giardiasis', categoria: 'Parasitarias', especie: 'Todas', contagioso: true, activo: true, descripcion: 'Infeccion por el protozoo Giardia.' },
  { id: 12, codigo: 'DX-012', nombre: 'Leucemia felina', categoria: 'Infecciosas', especie: 'Gato', contagioso: true, activo: true, descripcion: 'Infeccion retroviral felina.' },
]
