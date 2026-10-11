# Despliegue - Clinica Mascotas (Fase 4)

Guia paso a paso para publicar el sistema en un **hosting cPanel** (recomendado)
usando **GitHub** como repositorio.

## Arquitectura de produccion

```
  Navegador
     │
     ├── https://tudominio.com        → FRONTEND (Vue compilado: carpeta dist/)
     │                                   docroot de public_html
     │
     └── https://api.tudominio.com    → BACKEND (API PHP)
                                         docroot = backend/public
                                         │
                                         └── MySQL (base de datos del hosting)
```

- El **frontend** son archivos estaticos (no necesita Node en el servidor).
- El **backend** es la API PHP, servida por Apache (no el servidor embebido).
- La API vive en un **subdominio** (`api.tudominio.com`) cuyo *document root*
  apunta a la carpeta `backend/public` (asi el codigo y el `.env` quedan fuera
  de la web).

---

## Requisitos

- Cuenta de **GitHub** y repositorio creado (vacio).
- **Hosting cPanel** con PHP 8+, MySQL y acceso a **Administrador de archivos**
  y **Git Version Control** (o FTP).
- Un **dominio** y (opcional) un **subdominio** `api.tudominio.com`.

---

## Paso 1 - GitHub

```bash
# En la carpeta del proyecto (local)
git remote add origin https://github.com/TU_USUARIO/clinica-mascotas.git
git push -u origin main
```

Recomendado: trabajar con dos ramas.
- `main` → produccion
- `develop` → pruebas (staging)

---

## Paso 2 - Base de datos (cPanel)

1. cPanel → **MySQL Databases**:
   - Crea la base de datos (ej. `usuario_clinica`).
   - Crea un usuario y asignalo a la base con **todos los privilegios**.
2. cPanel → **phpMyAdmin**: selecciona la base y **Importa**:
   - `database/schema.sql` (crea las tablas).
3. Carga los datos iniciales (roles, admin, catalogos). Desde tu PC, apuntando
   a la base del hosting (edita antes `backend/.env` con los datos de produccion):

   ```bash
   php backend/database/seed.php
   ```
   *Alternativa sin PHP local:* importa un volcado SQL (pidelo al equipo).

---

## Paso 3 - Backend (API)

1. Sube la carpeta `backend/` a tu cuenta (por **Git** o Administrador de archivos),
   **fuera de `public_html`** (ej. `/home/usuario/clinica_backend`).
   > Si tu hosting obliga a tenerlo dentro, subelo a `public_html/api` y usa el
   > `.htaccess` incluido para no exponer archivos sensibles.

2. Crea el **subdominio** `api.tudominio.com` y apunta su *document root* a
   `backend/public`.

3. Crea el archivo **`backend/.env`** de produccion:

   ```
   APP_ENV=production
   APP_URL=https://api.tudominio.com

   JWT_SECRET=una_clave_larga_y_secreta_aleatoria_1234567890

   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=usuario_clinica
   DB_USER=usuario_clinica
   DB_PASS=tu_password

   CORS_ORIGIN=https://tudominio.com
   ```

4. Verifica: abre `https://api.tudominio.com/api/health` → debe responder
   `{ "ok": true, "db": true }`.

---

## Paso 4 - Frontend (web + farmacia)

1. Crea **`frontend/.env.production`** con la URL publica de la API:

   ```
   VITE_API_URL=https://api.tudominio.com/api
   ```

2. Compila:

   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. Sube **el contenido de `frontend/dist/`** a `public_html` (incluye el
   `.htaccess` para que las rutas funcionen al recargar).

---

## Paso 5 - Verificacion

- `https://tudominio.com` → web de la clinica (y `/tienda` la farmacia).
- `https://tudominio.com/admin` → login del panel (`admin@clinica.test` /
  `admin123`; **cambia la contrasena** en produccion).
- La app se puede **instalar como PWA** en el celular.

---

## Actualizaciones (despliegue en caliente)

Usaremos dos carpetas para no cortar el servicio:

- `public_html` (produccion)
- `staging` (pruebas)

Flujo recomendado:
1. Subir cambios a la rama `develop` → probar en `staging`.
2. Si todo esta bien, fusionar a `main` y actualizar produccion.

Para el frontend: repetir el `npm run build` y subir `dist/`.
Para el backend: `git pull` en el servidor (cPanel → Git Version Control) y
revisar que el `.env` no cambie.

---

## Seguridad (checklist)

- [ ] `APP_ENV=production` en el `.env` del servidor.
- [ ] `JWT_SECRET` distinto al de desarrollo y largo/aleatorio.
- [ ] `CORS_ORIGIN` solo con tu dominio real.
- [ ] Contrasena del usuario `admin` cambiada.
- [ ] El `.env` **nunca** dentro de `public_html`.
- [ ] Respaldos periodicos de la base de datos (phpMyAdmin → Exportar).
