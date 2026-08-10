import { expect, test, type BrowserContext, type Page } from "@playwright/test"


const admin = {
  id: 1,
  nombre: "Admin",
  apellido: "E2E",
  documento: "E2E-ADMIN",
  email: "admin@example.test",
  rol: "ADMIN",
  telefono: null,
  estado: "ACTIVO",
  last_login: null,
}

const metadata = {
  dirigido: true,
  ponderado: true,
  bipartito: true,
  total_vertices: 4,
  total_aristas: 3,
  peso_total: 6,
  tiempo_construccion_ms: 0.42,
  regla_peso: "prestamos_total + reservas_total",
  filtros: { max_nodos: 200 },
  truncado: false,
}

const vertices = [
  {
    clave: "usuario:1", tipo: "usuario", id: 1, etiqueta: "Usuario 1", estado: "ACTIVO",
    documento: "PII-DOC-7788", correo: "pii@example.test", telefono: "3009998877",
    token: "PII-TOKEN-7788", password_hash: "PII-HASH-7788",
  },
  { clave: "usuario:2", tipo: "usuario", id: 2, etiqueta: "Usuario 2", estado: "ACTIVO" },
  { clave: "libro:1", tipo: "libro", id: 1, titulo: "Libro compartido", isbn: null, estado: "ACTIVO" },
  { clave: "libro:2", tipo: "libro", id: 2, titulo: "Segundo libro", isbn: "E2E-002", estado: "ACTIVO" },
]

const edge = (overrides: Record<string, unknown>) => ({
  origen: "usuario:1",
  destino: "libro:1",
  peso: 2,
  prestamos_total: 1,
  prestamos_activos: 0,
  prestamos_devueltos: 1,
  prestamos_vencidos: 0,
  devoluciones_total: 1,
  reservas_total: 1,
  reservas_pendientes: 0,
  reservas_atendidas: 0,
  reservas_canceladas: 1,
  ultima_interaccion: "2026-08-07T15:30:00Z",
  ...overrides,
})

const edges = [
  edge({}),
  edge({
    origen: "usuario:2",
    peso: 1,
    prestamos_devueltos: 0,
    devoluciones_total: 0,
    reservas_pendientes: 1,
    reservas_canceladas: 0,
    ultima_interaccion: null,
  }),
  edge({
    destino: "libro:2",
    peso: 3,
    prestamos_total: 2,
    prestamos_activos: 1,
    prestamos_devueltos: 1,
    reservas_atendidas: 1,
    reservas_canceladas: 0,
  }),
]

const globalSnapshot = { metadatos: metadata, vertices, aristas: edges }

async function authenticate(context: BrowserContext, page: Page, role = "ADMIN") {
  await context.addInitScript(() => localStorage.setItem("token", "e2e-token"))
  await page.route("**/auth/me", async (route) => {
    await route.fulfill({ json: { ...admin, rol: role } })
  })
}

async function mockGraphApi(page: Page, options: { truncated?: boolean; failFirst?: boolean } = {}) {
  let firstGlobalRequest = options.failFirst ?? false
  await page.route("**/grafos/interacciones**", async (route) => {
    const url = new URL(route.request().url())
    if (url.pathname.endsWith("/recorridos")) {
      const algorithm = url.searchParams.get("algoritmo") ?? "bfs"
      await route.fulfill({
        json: {
          algoritmo: algorithm,
          inicio: url.searchParams.get("inicio"),
          orden: ["usuario:1", "libro:1", "libro:2"],
          total_visitados: 3,
        },
      })
      return
    }
    if (url.pathname.endsWith("/usuarios/99")) {
      await route.fulfill({
        json: {
          metadatos: { ...metadata, total_vertices: 1, total_aristas: 0, peso_total: 0 },
          vertices: [{ clave: "usuario:99", tipo: "usuario", id: 99, etiqueta: "Usuario 99", estado: "ACTIVO" }],
          aristas: [],
        },
      })
      return
    }
    if (firstGlobalRequest) {
      firstGlobalRequest = false
      await route.abort("failed")
      return
    }
    await route.fulfill({
      json: {
        ...globalSnapshot,
        metadatos: { ...metadata, truncado: options.truncated ?? false },
      },
    })
  })
}

test("visualiza libro compartido, filtros, detalle, recorridos y privacidad", async ({ context, page }) => {
  const consoleMessages: string[] = []
  page.on("console", (message) => consoleMessages.push(message.text()))
  await authenticate(context, page)
  await mockGraphApi(page)

  await page.goto("/interacciones")
  await expect(page.getByRole("img", { name: /Grafo bipartito/ })).toBeVisible()
  await expect(page.getByRole("button", { name: /libro Libro compartido/ })).toHaveCount(1)
  await expect(page.getByRole("button", { name: /Relacion .* hacia libro:1/ })).toHaveCount(2)

  await page.getByRole("button", { name: /Relacion usuario:1 hacia libro:1/ }).click()
  await expect(page.getByRole("heading", { name: "Arista agregada" })).toBeVisible()
  await expect(page.getByText("Canceladas:").locator("..")).toContainText("1")
  await expect(page.getByText("Devueltos:").locator("..")).toContainText("1")

  await page.getByLabel("Estado agregado").selectOption("reserva_cancelada")
  await expect(page.getByRole("button", { name: /Relacion/ })).toHaveCount(1)
  await page.getByRole("button", { name: "Limpiar filtros" }).click()

  await page.getByRole("button", { name: "usuario Usuario 1" }).click()
  await page.getByLabel("Algoritmo de recorrido").selectOption("bfs")
  await page.getByRole("button", { name: "Ejecutar recorrido" }).click()
  await expect(page.getByRole("heading", { name: "Orden BFS" })).toBeVisible()
  await page.getByLabel("Algoritmo de recorrido").selectOption("dfs")
  await page.getByRole("button", { name: "Ejecutar recorrido" }).click()
  await expect(page.getByRole("heading", { name: "Orden DFS" })).toBeVisible()

  const visibleText = await page.locator("body").innerText()
  const consoleText = consoleMessages.join("\n")
  for (const secret of ["PII-DOC-7788", "pii@example.test", "3009998877", "PII-TOKEN-7788", "PII-HASH-7788"]) {
    expect(visibleText).not.toContain(secret)
    expect(consoleText).not.toContain(secret)
  }
})

test("representa usuario aislado y respuesta truncada", async ({ context, page }) => {
  await authenticate(context, page)
  await mockGraphApi(page, { truncated: true })

  await page.goto("/interacciones")
  await expect(page.getByText(/La respuesta fue truncada/)).toBeVisible()
  await page.getByRole("spinbutton", { name: "Usuario" }).fill("99")
  await page.getByRole("button", { name: "Subgrafo" }).click()
  await expect(page.getByRole("button", { name: "usuario Usuario 99" })).toBeVisible()
  await expect(page.getByText("Aristas:").locator("..")).toContainText("0")
})

test("bloquea el rol lector antes de solicitar el grafo", async ({ context, page }) => {
  let graphRequests = 0
  await authenticate(context, page, "LECTOR")
  await page.route("**/grafos/interacciones**", async (route) => {
    graphRequests += 1
    await route.fulfill({ json: globalSnapshot })
  })

  await page.goto("/interacciones")
  await expect(page.getByRole("alert")).toContainText("No tienes permisos")
  expect(graphRequests).toBe(0)
})

test("muestra error de red y permite reintentar", async ({ context, page }) => {
  await authenticate(context, page)
  await mockGraphApi(page, { failFirst: true })

  await page.goto("/interacciones")
  await expect(page.getByRole("alert")).toContainText("No fue posible conectar")
  await page.getByRole("button", { name: "Reintentar" }).click()
  await expect(page.getByRole("img", { name: /Grafo bipartito/ })).toBeVisible()
})

test("la evidencia n-aria descarta PII recibida del endpoint heredado", async ({ context, page }) => {
  await authenticate(context, page)
  await mockGraphApi(page)
  await page.route("**/libros/catalogo/interacciones/usuario/7", async (route) => {
    await route.fulfill({
      json: {
        estructura: "ÁRBOL N-ARIO",
        relacion: "Usuario -> interacciones -> libros",
        descripcion: "Evidencia heredada",
        usuario: {
          id: 7, nombre: "PII-NOMBRE-7788", documento: "PII-DOC-7788",
          email: "pii@example.test", rol: "ADMIN", estado: "ACTIVO",
        },
        total_nodos: 1,
        total_prestamos: 0,
        total_reservas: 0,
        arbol: {
          key: "usuario:7",
          label: "PII-NOMBRE-7788",
          data: { tipo: "usuario", usuario_id: 7, documento: "PII-DOC-7788", token: "PII-TOKEN-7788" },
          children: [],
        },
        recorrido_pre_order: [],
      },
    })
  })

  await page.goto("/interacciones/arbol")
  await page.getByPlaceholder(/Ingrese ID del usuario/).fill("7")
  await page.getByRole("button", { name: "Ver interacciones" }).click()
  await expect(page.getByText("Usuario 7").first()).toBeVisible()
  const visibleText = await page.locator("body").innerText()
  expect(visibleText).not.toMatch(/PII-NOMBRE-7788|PII-DOC-7788|pii@example\.test|PII-TOKEN-7788/)
})
