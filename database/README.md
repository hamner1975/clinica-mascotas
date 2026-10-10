# Base de datos - Clinica Mascotas (Fase 2)

Carpeta reservada para los **scripts SQL** de MySQL (esquema, datos iniciales y
migraciones). Se completara al iniciar la Fase 2.

## Entidades previstas (borrador)

- `usuarios`, `roles`, `permisos`, `rol_permiso`
- `duenos` (tutores de las mascotas)
- `mascotas` (pacientes: especie, raza, sexo, fecha de nacimiento, peso)
- `citas`
- `consultas`
- `diagnosticos` / `consulta_diagnostico`
- `historia_clinica` (entradas/evoluciones por mascota)
- `medicamentos` / `productos` (farmacia y tienda)
- `inventario` (lotes, stock, vencimientos)
- `ventas`, `venta_detalle`, `pedidos_online`
- `categorias`, `proveedores`

## Archivos previstos

| Archivo | Proposito |
| --- | --- |
| `schema.sql` | Creacion completa de la base de datos y tablas |
| `seed.sql` | Datos iniciales (roles, permisos, usuario admin) |
| `migrations/` | Cambios incrementales del esquema |
