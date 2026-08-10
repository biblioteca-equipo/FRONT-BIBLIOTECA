# Evidencia de calidad del frontend

Fecha de ejecución: 2026-08-09 (America/Bogota)

## Entorno

- Node.js: 24.16.0
- PNPM: 11.16.0
- Playwright: 1.62.1
- Chromium: revisión 1234 instalada por Playwright
- Docker Engine: 29.6.2
- Docker Compose: 5.3.1

## Puertas de calidad

| Comando | Resultado |
|---|---|
| `pnpm test` | 10 archivos y 34 pruebas aprobadas |
| `pnpm test:coverage` | 34 pruebas aprobadas; 42.18 % sentencias, 43.50 % ramas, 37.76 % funciones y 41.44 % líneas |
| `pnpm lint` | Código cero, sin advertencias |
| `pnpm typecheck` | Código cero |
| `pnpm build` | Código cero; build Vite generado correctamente |
| `pnpm test:e2e` | 5 escenarios Playwright aprobados en Chromium |

La cobertura específica registrada para el hook del grafo fue 97.01 % de
sentencias y 96.66 % de líneas. Las utilidades del grafo obtuvieron 94.11 % de
sentencias y 100 % de líneas. No se establece un umbral global para el código
heredado, de acuerdo con el diseño del cambio OpenSpec.

## Escenarios de navegador deterministas

La suite Playwright con HTTP controlado comprobó:

- libro compartido representado por un único nodo y dos aristas entrantes;
- detalle de peso, préstamo devuelto y reserva cancelada;
- filtros, limpieza de filtros y recorridos BFS/DFS;
- usuario existente sin interacciones;
- resultado truncado;
- bloqueo visual del rol `LECTOR` antes de solicitar el grafo;
- error de red y reintento;
- descarte de documento, correo, teléfono, token y hash tanto en el grafo como
  en la evidencia n-aria heredada;
- ausencia de los valores sensibles centinela en DOM y consola.

## Integración real

Se levantó `database`, `api` y `frontend` con Compose; los tres servicios
alcanzaron estado saludable. Después se ejecutaron:

- `alembic upgrade head`;
- `alembic check`, sin nuevas operaciones detectadas;
- seeder idempotente, con cero registros creados en la segunda ejecución;
- `/health`, con estado `ok` y base configurada;
- `pnpm test:e2e:real`, con 1 escenario aprobado.

El escenario real inició sesión desde Nginx, recibió el grafo desde FastAPI,
comprobó el encabezado CORS para el origen del navegador, seleccionó una arista,
ejecutó BFS, aplicó y limpió filtros, y verificó en OpenAPI las rutas del grafo.

El volumen local provenía de una configuración anterior y contenía la cuenta
sintética `DEMO-ADMIN-001` con un correo reservado y credenciales desalineadas.
Solo esa cuenta de demostración fue sincronizada con los valores actuales de
`.env`; no se modificaron usuarios reales, préstamos, reservas ni catálogo.
