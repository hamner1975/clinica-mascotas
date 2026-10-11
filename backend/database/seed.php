<?php
declare(strict_types=1);

/**
 * Carga los datos iniciales (roles, usuario admin, catalogos y ejemplos).
 * Uso:  php backend/database/seed.php
 */

require __DIR__ . '/../bootstrap.php';

use App\Config\Database;
use App\Core\Env;

$pdo = Database::connection();
$today = date('Y-m-d');
$day = static fn (int $offset): string => date('Y-m-d', strtotime(($offset >= 0 ? '+' : '') . $offset . ' days'));

$permisosTodos = [
    'pacientes.ver', 'pacientes.gestionar', 'pacientes.eliminar',
    'citas.ver', 'citas.gestionar', 'consultas.ver', 'consultas.gestionar',
    'historia.ver', 'historia.gestionar', 'diagnosticos.ver', 'diagnosticos.gestionar',
    'farmacia.ver', 'farmacia.vender', 'inventario.ver', 'inventario.gestionar',
    'tienda.ver', 'tienda.gestionar', 'ventas.ver', 'ventas.gestionar',
    'usuarios.ver', 'usuarios.gestionar', 'roles.ver', 'roles.gestionar',
    'reportes.ver', 'configuracion.gestionar',
];

echo "Limpiando tablas...\n";
$pdo->exec('SET FOREIGN_KEY_CHECKS = 0');
foreach (['venta_detalle', 'ventas', 'consultas', 'citas', 'mascotas', 'duenos', 'productos', 'usuarios', 'roles', 'diagnosticos', 'sitio', 'configuracion'] as $table) {
    $pdo->exec("TRUNCATE TABLE $table");
}
$pdo->exec('SET FOREIGN_KEY_CHECKS = 1');

// ---------------------------------- Roles ----------------------------------
$roles = [
    [1, 'Administrador', 'Acceso total al sistema.', 1, $permisosTodos],
    [2, 'Veterinario', 'Atencion clinica, pacientes e historia clinica.', 0, [
        'pacientes.ver', 'pacientes.gestionar', 'citas.ver', 'citas.gestionar', 'consultas.ver',
        'consultas.gestionar', 'historia.ver', 'historia.gestionar', 'diagnosticos.ver', 'farmacia.ver', 'reportes.ver',
    ]],
    [3, 'Recepcionista', 'Agenda, pacientes y venta en mostrador.', 0, [
        'pacientes.ver', 'pacientes.gestionar', 'citas.ver', 'citas.gestionar', 'consultas.ver',
        'historia.ver', 'farmacia.ver', 'farmacia.vender', 'ventas.ver', 'ventas.gestionar', 'tienda.ver',
    ]],
    [4, 'Farmaceutico', 'Inventario, farmacia y tienda online.', 0, [
        'farmacia.ver', 'farmacia.vender', 'inventario.ver', 'inventario.gestionar',
        'tienda.ver', 'tienda.gestionar', 'ventas.ver', 'ventas.gestionar',
    ]],
];
$stmt = $pdo->prepare('INSERT INTO roles (id, nombre, descripcion, sistema, permisos) VALUES (?, ?, ?, ?, ?)');
foreach ($roles as [$id, $nombre, $desc, $sistema, $permisos]) {
    $stmt->execute([$id, $nombre, $desc, $sistema, json_encode($permisos)]);
}

// -------------------------------- Usuarios ---------------------------------
$adminHash = password_hash('admin123', PASSWORD_DEFAULT);
$userHash = password_hash('123456', PASSWORD_DEFAULT);
$usuarios = [
    [1, 'Ana', 'Ramirez', '52987456', 'admin@clinica.test', '+57 300 111 2233', $adminHash, 1, 1, $today],
    [2, 'Carlos', 'Mena', '79845123', 'carlos.mena@clinica.test', '+57 311 222 3344', $userHash, 2, 1, $day(-1)],
    [3, 'Lucia', 'Vega', '43567788', 'lucia.vega@clinica.test', '+57 301 333 4455', $userHash, 2, 1, $day(-2)],
    [4, 'Pedro', 'Salas', '10293847', 'pedro.salas@clinica.test', '+57 320 444 5566', $userHash, 3, 1, $day(-3)],
    [5, 'Marta', 'Rios', '56473829', 'marta.rios@clinica.test', '+57 312 555 6677', $userHash, 4, 0, null],
];
$stmt = $pdo->prepare('INSERT INTO usuarios (id, nombres, apellidos, documento, email, telefono, password_hash, rol_id, activo, ultimo_acceso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
foreach ($usuarios as $u) {
    $stmt->execute($u);
}

// ------------------------------ Diagnosticos -------------------------------
$diagnosticos = [
    [1, 'DX-001', 'Otitis externa', 'Dermatologicas', 'Todas', 0, 1, 'Inflamacion del conducto auditivo externo.'],
    [2, 'DX-002', 'Parvovirosis canina', 'Infecciosas', 'Perro', 1, 1, 'Infeccion viral aguda del tracto digestivo.'],
    [3, 'DX-003', 'Sarna demodecica', 'Parasitarias', 'Perro', 0, 1, 'Infestacion por acaros Demodex.'],
    [4, 'DX-004', 'Gastritis', 'Digestivas', 'Todas', 0, 1, 'Inflamacion de la mucosa gastrica.'],
    [5, 'DX-005', 'Moquillo', 'Infecciosas', 'Perro', 1, 1, 'Enfermedad viral multisistemica.'],
    [6, 'DX-006', 'Rinotraqueitis felina', 'Respiratorias', 'Gato', 1, 1, 'Infeccion respiratoria superior felina.'],
    [7, 'DX-007', 'Conjuntivitis', 'Oftalmologicas', 'Todas', 0, 1, 'Inflamacion de la conjuntiva ocular.'],
    [8, 'DX-008', 'Displasia de cadera', 'Osteomusculares', 'Perro', 0, 1, 'Alteracion de la articulacion coxofemoral.'],
    [9, 'DX-009', 'Dermatitis alergica', 'Dermatologicas', 'Todas', 0, 1, 'Reaccion cutanea de origen alergico.'],
    [10, 'DX-010', 'Tos de las perreras', 'Respiratorias', 'Perro', 1, 1, 'Traqueobronquitis infecciosa canina.'],
    [11, 'DX-011', 'Giardiasis', 'Parasitarias', 'Todas', 1, 1, 'Infeccion por el protozoo Giardia.'],
    [12, 'DX-012', 'Leucemia felina', 'Infecciosas', 'Gato', 1, 1, 'Infeccion retroviral felina.'],
];
$stmt = $pdo->prepare('INSERT INTO diagnosticos (id, codigo, nombre, categoria, especie, contagioso, activo, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
foreach ($diagnosticos as $d) {
    $stmt->execute($d);
}

// -------------------------------- Productos --------------------------------
$productos = [
    [1, 'Amoxicilina 500mg', 'Medicamentos', 'Medicamento', 12000, 7000, 0, 2, 10, 'Caja', 'AMX-2401', $day(150), 1, 1, 'Antibiotico de amplio espectro.'],
    [2, 'Vacuna antirrabica', 'Vacunas', 'Medicamento', 45000, 30000, 0, 3, 5, 'Unidad', 'VAR-2312', $day(200), 1, 1, 'Dosis unica anual.'],
    [3, 'Antipulgas (pipeta)', 'Medicamentos', 'Medicamento', 18000, 11000, 15, 5, 8, 'Unidad', 'APU-2403', $day(300), 0, 1, 'Proteccion por 30 dias.'],
    [4, 'Suero fisiologico 500ml', 'Medicamentos', 'Medicamento', 9000, 5000, 0, 24, 6, 'Frasco', 'SUE-2405', $day(400), 0, 1, 'Solucion isotonica esteril.'],
    [5, 'Shampoo dermatologico', 'Higiene', 'Producto', 26000, 15000, 20, 15, 5, 'Frasco', 'SHA-2402', $day(500), 0, 1, 'Para pieles sensibles.'],
    [6, 'Alimento premium perro 3kg', 'Alimentos', 'Producto', 58000, 40000, 10, 20, 6, 'Bolsa', 'ALP-2406', $day(360), 0, 1, 'Balanceado adulto razas medianas.'],
    [7, 'Alimento gato 1.5kg', 'Alimentos', 'Producto', 38000, 26000, 0, 0, 5, 'Bolsa', 'ALG-2406', $day(330), 0, 1, 'Balanceado gatos adultos.'],
    [8, 'Collar antipulgas', 'Accesorios', 'Producto', 22000, 12000, 25, 12, 4, 'Unidad', 'COL-2404', $day(540), 0, 1, 'Proteccion hasta 5 meses.'],
    [9, 'Vitamina B complex', 'Medicamentos', 'Medicamento', 15000, 8000, 0, 6, 6, 'Blister', 'VIT-2405', $day(210), 0, 1, 'Suplemento vitaminico.'],
    [10, 'Desparasitante oral', 'Medicamentos', 'Medicamento', 20000, 12000, 0, 9, 4, 'Blister', 'DES-2407', $day(20), 1, 1, 'Contra parasitos internos.'],
];
$stmt = $pdo->prepare('INSERT INTO productos (id, nombre, categoria, tipo, precio, costo, descuento, stock, stock_minimo, unidad, lote, vencimiento, requiere_receta, activo, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
foreach ($productos as $p) {
    $stmt->execute($p);
}

// -------------------------------- Duenos -----------------------------------
$duenos = [
    [1, 'Maria', 'Gomez Ruiz', '10234567', 'maria.gomez@correo.com', '+57 300 123 4567', 'Calle 45 #12-30, Bogota', ''],
    [2, 'Jose', 'Perez Lozano', '79845123', 'jose.perez@correo.com', '+57 311 987 6543', 'Carrera 8 #3-15, Medellin', 'Cliente frecuente.'],
    [3, 'Ana', 'Torres Marin', '52987456', 'ana.torres@correo.com', '+57 320 555 1122', 'Av. Siempre Viva 742, Cali', ''],
    [4, 'Luis', 'Diaz Herrera', '11223344', 'luis.diaz@correo.com', '+57 301 444 8899', 'Calle 100 #20-40, Bogota', ''],
];
$stmt = $pdo->prepare('INSERT INTO duenos (id, nombres, apellidos, documento, email, telefono, direccion, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
foreach ($duenos as $d) {
    $stmt->execute($d);
}

// -------------------------------- Mascotas ---------------------------------
$mascotas = [
    [1, 'Luna', 'Perro', 'Golden Retriever', 'Hembra', '2021-03-15', 28.5, 'Dorado', 1, 1, 'Alergica a la penicilina.'],
    [2, 'Michi', 'Gato', 'Comun europeo', 'Macho', '2022-08-01', 4.2, 'Atigrado', 2, 1, ''],
    [3, 'Rocky', 'Perro', 'Bulldog Frances', 'Macho', '2020-01-20', 12.8, 'Blanco', 3, 0, 'Problemas respiratorios leves.'],
    [4, 'Nube', 'Gato', 'Siames', 'Hembra', '2023-05-10', 3.6, 'Crema', 4, 0, ''],
    [5, 'Toby', 'Perro', 'Beagle', 'Macho', '2019-11-02', 14.1, 'Tricolor', 1, 1, 'Requiere control de peso.'],
    [6, 'Kira', 'Roedor', 'Cobaya', 'Hembra', '2024-02-14', 0.9, 'Marron y blanco', 3, 0, ''],
];
$stmt = $pdo->prepare('INSERT INTO mascotas (id, nombre, especie, raza, sexo, fecha_nacimiento, peso, color, dueno_id, esterilizado, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
foreach ($mascotas as $m) {
    $stmt->execute($m);
}

// --------------------------------- Citas -----------------------------------
$citas = [
    [1, 1, $day(0), '09:00', 'Vacunacion anual', 'Dra. Ana Ramirez', 'Confirmada', ''],
    [2, 2, $day(0), '09:30', 'Control post-operatorio', 'Dr. Carlos Mena', 'En sala', ''],
    [3, 3, $day(0), '10:15', 'Revision general', 'Dra. Lucia Vega', 'Pendiente', ''],
    [4, 4, $day(0), '11:00', 'Desparasitacion', 'Dra. Ana Ramirez', 'Pendiente', ''],
    [5, 5, $day(1), '08:30', 'Control de peso', 'Dr. Carlos Mena', 'Confirmada', ''],
    [6, 6, $day(1), '10:00', 'Corte de unas', 'Dra. Lucia Vega', 'Pendiente', ''],
    [7, 1, $day(-3), '15:00', 'Reaccion alergica', 'Dra. Ana Ramirez', 'Atendida', ''],
    [8, 3, $day(-1), '16:30', 'Tos persistente', 'Dr. Carlos Mena', 'Cancelada', ''],
];
$stmt = $pdo->prepare('INSERT INTO citas (id, mascota_id, fecha, hora, motivo, veterinario, estado, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
foreach ($citas as $c) {
    $stmt->execute($c);
}

// -------------------------------- Consultas --------------------------------
$consultas = [
    [1, 7, 1, $day(-3), '15:10', 'Reaccion alergica', 38.5, 28.5, 90, 'Dermatitis alergica', 'Antihistaminico por 5 dias', 'Revisar en 1 semana.', 'Dra. Ana Ramirez', $day(4)],
    [2, null, 2, $day(-5), '11:20', 'Vomito', 38.1, 4.1, 160, 'Gastritis leve', 'Dieta blanda 3 dias', '', 'Dr. Carlos Mena', null],
];
$stmt = $pdo->prepare('INSERT INTO consultas (id, cita_id, mascota_id, fecha, hora, motivo, temperatura, peso, frecuencia_cardiaca, diagnostico, tratamiento, observaciones, veterinario, proxima_cita) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
foreach ($consultas as $c) {
    $stmt->execute($c);
}

// ------------------------------- Ajustes -----------------------------------
$config = [
    'nombre' => 'Veterinaria Mascotas',
    'eslogan' => 'Sistema integral',
    'documento' => '900.123.456-7',
    'telefono' => '+57 300 123 4567',
    'email' => 'contacto@clinicamascotas.test',
    'direccion' => 'Calle 45 #12-30, Bogota',
    'moneda' => 'COP',
    'horaApertura' => '08:00',
    'horaCierre' => '18:00',
    'duracionCita' => 30,
    'iva' => 19,
];
$pdo->prepare('INSERT INTO configuracion (id, contenido) VALUES (1, ?)')->execute([json_encode($config)]);

$sitio = [
    'hero' => [
        'badge' => 'Clinica veterinaria',
        'titulo' => 'Cuidamos a tus mascotas como a nuestra familia',
        'subtitulo' => 'Ofrecemos atencion veterinaria integral: consultas, vacunacion, cirugia, laboratorio y mas. Y ahora tambien puedes comprar en nuestra farmacia online.',
        'botonPrimario' => 'Ver servicios',
        'botonSecundario' => 'Ir a la farmacia',
        'imagen' => '',
    ],
    'secciones' => ['servicios' => true, 'farmacia' => true, 'elegirnos' => true, 'contacto' => true],
    'servicios' => [
        ['id' => 1, 'icon' => 'bi-clipboard2-pulse', 'titulo' => 'Consulta general', 'descripcion' => 'Revision completa, diagnostico y plan de tratamiento con seguimiento.'],
        ['id' => 2, 'icon' => 'bi-shield-check', 'titulo' => 'Vacunacion', 'descripcion' => 'Esquema de vacunas completo para perros y gatos.'],
        ['id' => 3, 'icon' => 'bi-bandaid', 'titulo' => 'Cirugia y curas', 'descripcion' => 'Procedimientos quirurgicos y curaciones con equipo especializado.'],
        ['id' => 4, 'icon' => 'bi-droplet', 'titulo' => 'Laboratorio clinico', 'descripcion' => 'Analisis de sangre, orina y examenes especializados.'],
        ['id' => 5, 'icon' => 'bi-emoji-smile', 'titulo' => 'Odontologia', 'descripcion' => 'Limpieza dental y tratamiento de enfermedades orales.'],
        ['id' => 6, 'icon' => 'bi-stars', 'titulo' => 'Estetica y peluqueria', 'descripcion' => 'Bano, corte y cuidado integral del pelaje.'],
        ['id' => 7, 'icon' => 'bi-bug', 'titulo' => 'Desparasitacion', 'descripcion' => 'Control de parasitos internos y externos.'],
        ['id' => 8, 'icon' => 'bi-camera', 'titulo' => 'Imagenes y rayos X', 'descripcion' => 'Diagnostico por imagen para casos complejos.'],
    ],
    'farmacia' => [
        'visible' => true,
        'titulo' => 'Nuestra farmacia veterinaria',
        'texto' => 'Medicamentos, vacunas, alimentos y accesorios. Compra online y recoge en la clinica o recibe en casa.',
        'boton' => 'Entrar a la farmacia',
    ],
    'elegirnos' => [
        'visible' => true,
        'titulo' => 'Por que elegirnos',
        'subtitulo' => 'Profesionales comprometidos con el bienestar de tu mascota.',
        'items' => [
            ['id' => 1, 'icon' => 'bi-award', 'titulo' => 'Equipo profesional', 'texto' => 'Veterinarios con amplia experiencia y formacion continua.'],
            ['id' => 2, 'icon' => 'bi-lightning-charge', 'titulo' => 'Atencion agil', 'texto' => 'Citas, diagnostico y resultados sin esperas largas.'],
            ['id' => 3, 'icon' => 'bi-heart', 'titulo' => 'Trato cercano', 'texto' => 'Amamos a los animales tanto como tu.'],
        ],
    ],
    'redes' => ['facebook' => '', 'instagram' => '', 'whatsapp' => '', 'tiktok' => ''],
];
$pdo->prepare('INSERT INTO sitio (id, contenido) VALUES (1, ?)')->execute([json_encode($sitio)]);

echo "OK. Datos iniciales cargados.\n";
echo "Admin: admin@clinica.test / admin123\n";
echo "Otros usuarios: <correo> / 123456\n";
