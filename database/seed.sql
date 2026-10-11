
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT  IGNORE INTO `citas` VALUES (1,1,'2026-10-11','09:00:00','Vacunacion anual','Dra. Ana Ramirez','Confirmada',''),(2,2,'2026-10-11','09:30:00','Control post-operatorio','Dr. Carlos Mena','En sala',''),(3,3,'2026-10-11','10:15:00','Revision general','Dra. Lucia Vega','Pendiente',''),(4,4,'2026-10-11','11:00:00','Desparasitacion','Dra. Ana Ramirez','Pendiente',''),(5,5,'2026-10-12','08:30:00','Control de peso','Dr. Carlos Mena','Confirmada',''),(6,6,'2026-10-12','10:00:00','Corte de unas','Dra. Lucia Vega','Pendiente',''),(7,1,'2026-10-08','15:00:00','Reaccion alergica','Dra. Ana Ramirez','Atendida',''),(8,3,'2026-10-10','16:30:00','Tos persistente','Dr. Carlos Mena','Cancelada','');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;

/*!40000 ALTER TABLE `configuracion` DISABLE KEYS */;
INSERT  IGNORE INTO `configuracion` VALUES (1,'{\"nombre\":\"Veterinaria Mascotas\",\"eslogan\":\"Sistema integral\",\"documento\":\"900.123.456-7\",\"telefono\":\"+57 300 123 4567\",\"email\":\"contacto@clinicamascotas.test\",\"direccion\":\"Calle 45 #12-30, Bogota\",\"moneda\":\"PEN\",\"horaApertura\":\"08:00\",\"horaCierre\":\"18:00\",\"duracionCita\":30,\"iva\":19,\"costoDelivery\":8,\"deliveryGratisDesde\":60}','2026-10-11 17:14:02');
/*!40000 ALTER TABLE `configuracion` ENABLE KEYS */;

/*!40000 ALTER TABLE `consultas` DISABLE KEYS */;
INSERT  IGNORE INTO `consultas` VALUES (1,7,1,'2026-10-08','15:10:00','Reaccion alergica',38.50,28.50,90,'Dermatitis alergica','Antihistaminico por 5 dias','Revisar en 1 semana.','Dra. Ana Ramirez','2026-10-15'),(2,NULL,2,'2026-10-06','11:20:00','Vomito',38.10,4.10,160,'Gastritis leve','Dieta blanda 3 dias','','Dr. Carlos Mena',NULL);
/*!40000 ALTER TABLE `consultas` ENABLE KEYS */;

/*!40000 ALTER TABLE `diagnosticos` DISABLE KEYS */;
INSERT  IGNORE INTO `diagnosticos` VALUES (1,'DX-001','Otitis externa','Dermatologicas','Todas',0,1,'Inflamacion del conducto auditivo externo.'),(2,'DX-002','Parvovirosis canina','Infecciosas','Perro',1,1,'Infeccion viral aguda del tracto digestivo.'),(3,'DX-003','Sarna demodecica','Parasitarias','Perro',0,1,'Infestacion por acaros Demodex.'),(4,'DX-004','Gastritis','Digestivas','Todas',0,1,'Inflamacion de la mucosa gastrica.'),(5,'DX-005','Moquillo','Infecciosas','Perro',1,1,'Enfermedad viral multisistemica.'),(6,'DX-006','Rinotraqueitis felina','Respiratorias','Gato',1,1,'Infeccion respiratoria superior felina.'),(7,'DX-007','Conjuntivitis','Oftalmologicas','Todas',0,1,'Inflamacion de la conjuntiva ocular.'),(8,'DX-008','Displasia de cadera','Osteomusculares','Perro',0,1,'Alteracion de la articulacion coxofemoral.'),(9,'DX-009','Dermatitis alergica','Dermatologicas','Todas',0,1,'Reaccion cutanea de origen alergico.'),(10,'DX-010','Tos de las perreras','Respiratorias','Perro',1,1,'Traqueobronquitis infecciosa canina.'),(11,'DX-011','Giardiasis','Parasitarias','Todas',1,1,'Infeccion por el protozoo Giardia.'),(12,'DX-012','Leucemia felina','Infecciosas','Gato',1,1,'Infeccion retroviral felina.');
/*!40000 ALTER TABLE `diagnosticos` ENABLE KEYS */;

/*!40000 ALTER TABLE `duenos` DISABLE KEYS */;
INSERT  IGNORE INTO `duenos` VALUES (1,'Maria','Gomez Ruiz','10234567','maria.gomez@correo.com','+57 300 123 4567','Calle 45 #12-30, Bogota',''),(2,'Jose','Perez Lozano','79845123','jose.perez@correo.com','+57 311 987 6543','Carrera 8 #3-15, Medellin','Cliente frecuente.'),(3,'Ana','Torres Marin','52987456','ana.torres@correo.com','+57 320 555 1122','Av. Siempre Viva 742, Cali',''),(4,'Luis','Diaz Herrera','11223344','luis.diaz@correo.com','+57 301 444 8899','Calle 100 #20-40, Bogota','');
/*!40000 ALTER TABLE `duenos` ENABLE KEYS */;

/*!40000 ALTER TABLE `mascotas` DISABLE KEYS */;
INSERT  IGNORE INTO `mascotas` VALUES (1,'Luna','Perro','Golden Retriever','Hembra','2021-03-15',28.50,'Dorado',1,1,'Alergica a la penicilina.',NULL),(2,'Michi','Gato','Comun europeo','Macho','2022-08-01',4.20,'Atigrado',2,1,'',NULL),(3,'Rocky','Perro','Bulldog Frances','Macho','2020-01-20',12.80,'Blanco',3,0,'Problemas respiratorios leves.',NULL),(4,'Nube','Gato','Siames','Hembra','2023-05-10',3.60,'Crema',4,0,'',NULL),(5,'Toby','Perro','Beagle','Macho','2019-11-02',14.10,'Tricolor',1,1,'Requiere control de peso.',NULL),(6,'Kira','Roedor','Cobaya','Hembra','2024-02-14',0.90,'Marron y blanco',3,0,'',NULL);
/*!40000 ALTER TABLE `mascotas` ENABLE KEYS */;

/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT  IGNORE INTO `productos` VALUES (1,'Amoxicilina 500mg','Medicamentos','Medicamento',25.00,15.00,0,2,10,'Caja','AMX-2401','2027-03-10',1,1,'Antibiotico de amplio espectro.',NULL),(2,'Vacuna antirrabica','Vacunas','Medicamento',50.00,32.00,0,3,5,'Unidad','VAR-2312','2027-04-29',1,1,'Dosis unica anual.',NULL),(3,'Antipulgas (pipeta)','Medicamentos','Medicamento',35.00,20.00,15,5,8,'Unidad','APU-2403','2027-08-07',0,1,'Proteccion por 30 dias.',NULL),(4,'Suero fisiologico 500ml','Medicamentos','Medicamento',12.00,7.00,0,24,6,'Frasco','SUE-2405','2027-11-15',0,1,'Solucion isotonica esteril.',NULL),(5,'Shampoo dermatologico','Higiene','Producto',30.00,18.00,20,15,5,'Frasco','SHA-2402','2028-02-23',0,1,'Para pieles sensibles.',NULL),(6,'Alimento premium perro 3kg','Alimentos','Producto',65.00,45.00,10,20,6,'Bolsa','ALP-2406','2027-10-06',0,1,'Balanceado adulto razas medianas.',NULL),(7,'Alimento gato 1.5kg','Alimentos','Producto',45.00,30.00,0,0,5,'Bolsa','ALG-2406','2027-09-06',0,1,'Balanceado gatos adultos.',NULL),(8,'Collar antipulgas','Accesorios','Producto',25.00,14.00,25,12,4,'Unidad','COL-2404','2028-04-03',0,1,'Proteccion hasta 5 meses.',NULL),(9,'Vitamina B complex','Medicamentos','Medicamento',20.00,11.00,0,6,6,'Blister','VIT-2405','2027-05-09',0,1,'Suplemento vitaminico.',NULL),(10,'Desparasitante oral','Medicamentos','Medicamento',22.00,13.00,0,9,4,'Blister','DES-2407','2026-10-31',1,1,'Contra parasitos internos.',NULL);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;

/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT  IGNORE INTO `roles` VALUES (1,'Administrador','Acceso total al sistema.','[\"pacientes.ver\",\"pacientes.gestionar\",\"pacientes.eliminar\",\"citas.ver\",\"citas.gestionar\",\"consultas.ver\",\"consultas.gestionar\",\"historia.ver\",\"historia.gestionar\",\"diagnosticos.ver\",\"diagnosticos.gestionar\",\"farmacia.ver\",\"farmacia.vender\",\"inventario.ver\",\"inventario.gestionar\",\"tienda.ver\",\"tienda.gestionar\",\"ventas.ver\",\"ventas.gestionar\",\"usuarios.ver\",\"usuarios.gestionar\",\"roles.ver\",\"roles.gestionar\",\"reportes.ver\",\"configuracion.gestionar\"]',1,'2026-10-11 17:14:02'),(2,'Veterinario','Atencion clinica, pacientes e historia clinica.','[\"pacientes.ver\",\"pacientes.gestionar\",\"citas.ver\",\"citas.gestionar\",\"consultas.ver\",\"consultas.gestionar\",\"historia.ver\",\"historia.gestionar\",\"diagnosticos.ver\",\"farmacia.ver\",\"reportes.ver\"]',0,'2026-10-11 17:14:02'),(3,'Recepcionista','Agenda, pacientes y venta en mostrador.','[\"pacientes.ver\",\"pacientes.gestionar\",\"citas.ver\",\"citas.gestionar\",\"consultas.ver\",\"historia.ver\",\"farmacia.ver\",\"farmacia.vender\",\"ventas.ver\",\"ventas.gestionar\",\"tienda.ver\"]',0,'2026-10-11 17:14:02'),(4,'Farmaceutico','Inventario, farmacia y tienda online.','[\"farmacia.ver\",\"farmacia.vender\",\"inventario.ver\",\"inventario.gestionar\",\"tienda.ver\",\"tienda.gestionar\",\"ventas.ver\",\"ventas.gestionar\"]',0,'2026-10-11 17:14:02');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

/*!40000 ALTER TABLE `sitio` DISABLE KEYS */;
INSERT  IGNORE INTO `sitio` VALUES (1,'{\"hero\":{\"badge\":\"Clinica veterinaria\",\"titulo\":\"Cuidamos a tus mascotas como a nuestra familia\",\"subtitulo\":\"Ofrecemos atencion veterinaria integral: consultas, vacunacion, cirugia, laboratorio y mas. Y ahora tambien puedes comprar en nuestra farmacia online.\",\"botonPrimario\":\"Ver servicios\",\"botonSecundario\":\"Ir a la farmacia\",\"imagen\":\"\"},\"secciones\":{\"servicios\":true,\"farmacia\":true,\"elegirnos\":true,\"contacto\":true},\"servicios\":[{\"id\":1,\"icon\":\"bi-clipboard2-pulse\",\"titulo\":\"Consulta general\",\"descripcion\":\"Revision completa, diagnostico y plan de tratamiento con seguimiento.\"},{\"id\":2,\"icon\":\"bi-shield-check\",\"titulo\":\"Vacunacion\",\"descripcion\":\"Esquema de vacunas completo para perros y gatos.\"},{\"id\":3,\"icon\":\"bi-bandaid\",\"titulo\":\"Cirugia y curas\",\"descripcion\":\"Procedimientos quirurgicos y curaciones con equipo especializado.\"},{\"id\":4,\"icon\":\"bi-droplet\",\"titulo\":\"Laboratorio clinico\",\"descripcion\":\"Analisis de sangre, orina y examenes especializados.\"},{\"id\":5,\"icon\":\"bi-emoji-smile\",\"titulo\":\"Odontologia\",\"descripcion\":\"Limpieza dental y tratamiento de enfermedades orales.\"},{\"id\":6,\"icon\":\"bi-stars\",\"titulo\":\"Estetica y peluqueria\",\"descripcion\":\"Bano, corte y cuidado integral del pelaje.\"},{\"id\":7,\"icon\":\"bi-bug\",\"titulo\":\"Desparasitacion\",\"descripcion\":\"Control de parasitos internos y externos.\"},{\"id\":8,\"icon\":\"bi-camera\",\"titulo\":\"Imagenes y rayos X\",\"descripcion\":\"Diagnostico por imagen para casos complejos.\"}],\"farmacia\":{\"visible\":true,\"titulo\":\"Nuestra farmacia veterinaria\",\"texto\":\"Medicamentos, vacunas, alimentos y accesorios. Compra online y recoge en la clinica o recibe en casa.\",\"boton\":\"Entrar a la farmacia\"},\"elegirnos\":{\"visible\":true,\"titulo\":\"Por que elegirnos\",\"subtitulo\":\"Profesionales comprometidos con el bienestar de tu mascota.\",\"items\":[{\"id\":1,\"icon\":\"bi-award\",\"titulo\":\"Equipo profesional\",\"texto\":\"Veterinarios con amplia experiencia y formacion continua.\"},{\"id\":2,\"icon\":\"bi-lightning-charge\",\"titulo\":\"Atencion agil\",\"texto\":\"Citas, diagnostico y resultados sin esperas largas.\"},{\"id\":3,\"icon\":\"bi-heart\",\"titulo\":\"Trato cercano\",\"texto\":\"Amamos a los animales tanto como tu.\"}]},\"redes\":{\"facebook\":\"\",\"instagram\":\"\",\"whatsapp\":\"\",\"tiktok\":\"\"}}','2026-10-11 17:14:02');
/*!40000 ALTER TABLE `sitio` ENABLE KEYS */;

/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT  IGNORE INTO `usuarios` VALUES (1,'Ana','Ramirez','52987456','admin@clinica.test','+57 300 111 2233','$2y$10$6Jp0A0qoL58QwMfyYhfnf.fHimEOjg/b7wdvExnFK0xGtHswIjNRW',1,1,'2026-10-11','2026-10-11 17:14:02'),(2,'Carlos','Mena','79845123','carlos.mena@clinica.test','+57 311 222 3344','$2y$10$i1QHLN.NTQcGZQQGd19xIuXL/LgsRxnkFkIdVIss1oo4.Iiq28O1C',2,1,'2026-10-10','2026-10-11 17:14:02'),(3,'Lucia','Vega','43567788','lucia.vega@clinica.test','+57 301 333 4455','$2y$10$i1QHLN.NTQcGZQQGd19xIuXL/LgsRxnkFkIdVIss1oo4.Iiq28O1C',2,1,'2026-10-09','2026-10-11 17:14:02'),(4,'Pedro','Salas','10293847','pedro.salas@clinica.test','+57 320 444 5566','$2y$10$i1QHLN.NTQcGZQQGd19xIuXL/LgsRxnkFkIdVIss1oo4.Iiq28O1C',3,1,'2026-10-08','2026-10-11 17:14:02'),(5,'Marta','Rios','56473829','marta.rios@clinica.test','+57 312 555 6677','$2y$10$i1QHLN.NTQcGZQQGd19xIuXL/LgsRxnkFkIdVIss1oo4.Iiq28O1C',4,0,NULL,'2026-10-11 17:14:02');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

/*!40000 ALTER TABLE `venta_detalle` DISABLE KEYS */;
INSERT  IGNORE INTO `venta_detalle` VALUES (1,1,3,'Antipulgas (pipeta)',30.00,2),(2,2,5,'Shampoo dermatologico',24.00,1),(3,2,8,'Collar antipulgas',19.00,2),(4,3,6,'Alimento premium perro 3kg',59.00,1);
/*!40000 ALTER TABLE `venta_detalle` ENABLE KEYS */;

/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT  IGNORE INTO `ventas` VALUES (1,'2026-10-11','10:30:00','Mostrador','Cliente mostrador','','Efectivo','Mostrador',0.00,60.00,'Completada'),(2,'2026-10-10','16:05:00','Online','Maria Gomez','','Mercado Pago','Mostrador',0.00,62.00,'Enviado'),(3,'2026-10-11','11:15:00','Online','Jose Perez','','Yape','Mostrador',0.00,59.00,'Pendiente');
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

