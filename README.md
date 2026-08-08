# Sistema de Gestión de Biblioteca - Frontend

Frontend React + TypeScript del Sistema de Gestión de Biblioteca. Consume la API
FastAPI y ofrece autenticación, gestión bibliotecaria, estructuras de datos y la
visualización del grafo dirigido usuario-libro.

## Ejecución recomendada con Docker Compose

Docker aísla Node.js, PNPM, Nginx y las dependencias del proyecto. El equipo
anfitrión solo necesita Git, Docker Engine y Docker Compose.

Los repositorios deben conservar la estructura de carpetas usada por el proyecto:

```text
estructura-datos/
├── API-BIBLIOTECA/
└── FRONT-BIBLIOTECA/
```

Desde `API-BIBLIOTECA`, crear el archivo de entorno e iniciar el stack completo:

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
```

En PowerShell, la copia del archivo se realiza con:

```powershell
Copy-Item .env.example .env
```

Servicios predeterminados:

| Recurso | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:8003 |
| Swagger | http://localhost:8003/docs |
| Health del frontend | http://localhost:5173/health |

El servicio `frontend` espera a que la API esté saludable. Nginx sirve la SPA y
resuelve las rutas de React hacia `index.html`, por lo que actualizar una ruta
como `/interacciones` no devuelve 404.

### Configuración del contenedor

Estas variables se definen en `API-BIBLIOTECA/.env`:

| Variable | Valor predeterminado | Propósito |
|---|---|---|
| `FRONTEND_PORT` | `5173` | Puerto publicado para el navegador |
| `API_PORT` | `8003` | Puerto publicado de FastAPI |
| `PUBLIC_API_URL` | `http://localhost:8003` | URL de API visible desde el navegador |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Orígenes permitidos por FastAPI |

`PUBLIC_API_URL` se inyecta al arrancar el contenedor, no al compilar la imagen.
Esto permite reutilizar la misma imagen en otro computador o sistema operativo.
Debe ser una URL alcanzable por el navegador; no se debe usar `http://api:8000`,
porque ese nombre solo existe dentro de la red de Compose.

Si se cambia `FRONTEND_PORT`, también debe incluirse el nuevo origen en
`CORS_ORIGINS`. Si se cambia `API_PORT`, debe actualizarse `PUBLIC_API_URL`.

### Operación

```bash
docker compose logs -f frontend
docker compose restart frontend
docker compose down
```

Para reconstruir únicamente el frontend:

```bash
docker compose build frontend
docker compose up -d frontend
```

## Imagen del frontend

El `Dockerfile` usa dos etapas:

1. Node.js y PNPM instalan exactamente el lockfile y ejecutan el build de Vite.
2. Nginx sin privilegios sirve únicamente los archivos generados.

El contexto excluye dependencias y artefactos del host mediante `.dockerignore`.
La imagen final no contiene `node_modules`, TypeScript ni las herramientas de
desarrollo.

La imagen también puede construirse de forma aislada:

```bash
docker build -t front-biblioteca .
docker run --rm -p 5173:8080 \
  -e API_URL=http://localhost:8003 \
  front-biblioteca
```

En PowerShell:

```powershell
docker run --rm -p 5173:8080 `
  -e API_URL=http://localhost:8003 `
  front-biblioteca
```

## Desarrollo local opcional

Para trabajar con recarga en caliente fuera de Docker se requieren Node.js y
PNPM. Esta modalidad es opcional y no interviene en la imagen de producción.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

La URL de la API puede configurarse en `.env.local`:

```env
VITE_API_URL=http://127.0.0.1:8003
```

Prioridad de configuración:

1. `API_URL` inyectada al contenedor en `runtime-config.js`.
2. `VITE_API_URL` usada por Vite durante desarrollo o build local.
3. `http://127.0.0.1:8003` como valor de respaldo.

## Calidad y pruebas

```bash
pnpm test
pnpm test:coverage
pnpm lint
pnpm typecheck
pnpm build
```

Las pruebas usan Vitest, Testing Library y JSDOM. Las solicitudes HTTP se
sustituyen mediante `src/test/apiMock.ts`, por lo que no requieren FastAPI ni
MariaDB en ejecución.

## Tecnologías

- React 19, TypeScript y Vite
- React Router y Axios
- Tailwind CSS y componentes basados en shadcn/ui
- Vitest y Testing Library
- PNPM con lockfile
- Nginx sin privilegios para producción

## Autores

- Juan Esteban Cajio
- Angel Eduardo Medina
- Jader Montoya

© 2026 Sistema de Gestión de Biblioteca.
