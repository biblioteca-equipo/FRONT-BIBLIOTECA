# Sistema de Gestión de Biblioteca - Frontend

Frontend desarrollado en React + TypeScript para consumir la API del Sistema de Gestión de Biblioteca.

La aplicación permite gestionar:

- Inicio de sesión
- Registro de usuarios
- Listado de usuarios
- Creación y listado de autores
- Creación y listado de categorías
- Creación, búsqueda y listado de libros
- Creación de ejemplares
- Creación y devolución de préstamos
- Creación y atención de reservas
- Consulta de historial de acciones
- Cambio entre modo claro y modo oscuro

---

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- PNPM
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- Componentes personalizados basados en shadcn/ui

---

## Requisitos previos

Antes de ejecutar el proyecto, se debe tener instalado:

- Node.js
- PNPM

Verificar versiones:

````bash
node -v
pnpm -v

Sí, **sí debes tener `.gitignore`**, principalmente para no subir:

```txt
node_modules
.env
dist
archivos de cache
````

Te dejo los comandos para crear **README.md**, **.gitignore** y opcionalmente **.env.example**.

---

## 1. Crear `README.md`

Ejecuta en la raíz del frontend:

````bash
cd ~/FRONT-BIBLIOTECA

cat > README.md <<'EOF'
# Sistema de Gestión de Biblioteca - Frontend

Frontend desarrollado en React + TypeScript para consumir la API del Sistema de Gestión de Biblioteca.

La aplicación permite gestionar:

- Inicio de sesión
- Registro de usuarios
- Listado de usuarios
- Creación y listado de autores
- Creación y listado de categorías
- Creación, búsqueda y listado de libros
- Creación de ejemplares
- Creación y devolución de préstamos
- Creación y atención de reservas
- Consulta de historial de acciones
- Cambio entre modo claro y modo oscuro

---

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- PNPM
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- Componentes personalizados basados en shadcn/ui

---

## Requisitos previos

Antes de ejecutar el proyecto, se debe tener instalado:

- Node.js
- PNPM

Verificar versiones:

```bash
node -v
pnpm -v
````

Este proyecto fue trabajado usando PNPM.

---

## Instalación del proyecto

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar a la carpeta del proyecto:

```bash
cd FRONT-BIBLIOTECA
```

Instalar dependencias:

```bash
pnpm install
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```bash
touch .env
```

Agregar la URL del backend:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Si no se configura esta variable, el frontend usará por defecto:

```txt
http://127.0.0.1:8000
```

---

## Ejecutar el frontend

Para correr el proyecto en modo desarrollo:

```bash
pnpm dev
```

Luego abrir en el navegador:

```txt
http://localhost:5173
```

---

## Backend requerido

Este frontend consume una API desarrollada en FastAPI.

El backend debe estar corriendo en:

```txt
http://127.0.0.1:8000
```

Comando típico para correr el backend:

```bash
uvicorn main:app --reload
```

---

## Endpoints consumidos

### Auth

```txt
POST /auth/register
POST /auth/login-json
GET  /auth/me
```

### Usuarios

```txt
GET /usuarios
```

### Autores

```txt
GET  /autores
POST /autores
```

### Categorías

```txt
GET  /categorias
POST /categorias
```

### Libros

```txt
GET  /libros
POST /libros
GET  /libros/buscar
GET  /libros/catalogo/lista
POST /libros/ejemplares
```

### Préstamos

```txt
GET  /prestamos
POST /prestamos
PUT  /prestamos/{prestamo_id}/devolver
```

### Reservas

```txt
POST /reservas
GET  /reservas/cola
PUT  /reservas/atender-siguiente
```

### Historial

```txt
GET /historial/pila
GET /historial/ultima-accion
```

---

## Estructura principal del proyecto

```txt
FRONT-BIBLIOTECA/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── CopyrightFooter.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── theme/
│   │   │   ├── mode-toggle.tsx
│   │   │   └── theme-provider.tsx
│   │   └── ui/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAutores.ts
│   │   ├── useCategorias.ts
│   │   ├── useHistorial.ts
│   │   ├── useLibros.ts
│   │   ├── usePrestamos.ts
│   │   ├── useReservas.ts
│   │   └── useUsuarios.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── types.ts
│   ├── pages/
│   │   ├── auth/
│   │   ├── autores/
│   │   ├── categorias/
│   │   ├── dashboard/
│   │   ├── historial/
│   │   ├── libros/
│   │   ├── prestamos/
│   │   ├── reservas/
│   │   └── usuarios/
│   ├── routes/
│   │   └── ProtectedRoute.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Flujo general de uso

1. El usuario entra a `/login`.
2. Si no tiene cuenta, puede ir a `/registro`.
3. Al iniciar sesión correctamente, se guarda el token en `localStorage`.
4. Las rutas internas quedan protegidas.
5. El frontend envía el token en las peticiones mediante Axios.
6. El usuario puede navegar por el sistema desde el sidebar.

---

## Comandos útiles

Instalar dependencias:

```bash
pnpm install
```

Ejecutar en desarrollo:

```bash
pnpm dev
```

Formatear archivos:

```bash
pnpm exec prettier --write "src/**/*.{ts,tsx,css}"
```

Compilar para producción:

```bash
pnpm build
```

Previsualizar build:

```bash
pnpm preview
```

---

## Autores

Desarrollado por:

- Juan Esteban Cajio
- Angel Eduardo Medina
- Jader Montoya

---

## Derechos de autor

© 2026 Sistema de Gestión de Biblioteca. Todos los derechos reservados.
EOF

````

---

## 2. Crear `.gitignore`

Ejecuta:

```bash
cat > .gitignore <<'EOF'
# Dependencies
node_modules/

# Build
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Cache
.cache/
.vite/
.turbo/

# Editor
.vscode/*
!.vscode/settings.json
.idea/

# OS
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo
node_modules/.tmp/
EOF
````

---

## 3. Crear `.env.example`

Esto sí se sube al repo para que otros sepan qué variable crear.

```bash
cat > .env.example <<'EOF'
VITE_API_URL=http://127.0.0.1:8000
EOF
```

---

## 4. Verifica archivos

```bash
ls -la
```

Debes ver:

```txt
README.md
.gitignore
.env.example
package.json
pnpm-lock.yaml
src/
```

---

## 5. Subir al repo

```bash
git status
git add README.md .gitignore .env.example
git commit -m "docs: agregar readme y gitignore del frontend"
git push
```

Si también quieres subir todos los cambios del frontend:

```bash
git add .
git commit -m "feat: implementar interfaz frontend biblioteca"
git push
```
