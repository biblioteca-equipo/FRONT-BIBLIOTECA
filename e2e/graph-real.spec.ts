import { expect, test } from "@playwright/test"


test("@real valida Compose, CORS, OpenAPI y el grafo en navegador", async ({ page, request }) => {
  const apiUrl = process.env.PLAYWRIGHT_API_URL ?? "http://127.0.0.1:8003"
  const email = process.env.DEMO_ADMIN_EMAIL ?? "admin@biblioteca.example.com"
  const password = process.env.DEMO_ADMIN_PASSWORD ?? "AdminDemo123!"
  const consoleErrors: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text())
  })

  await page.goto("/login")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Contraseña").fill(password)
  await page.getByRole("button", { name: "Entrar" }).click()
  await expect(page.getByRole("heading", { name: "Dashboard Biblioteca" })).toBeVisible()

  const graphResponsePromise = page.waitForResponse(
    (response) => response.url().includes("/grafos/interacciones?") && response.status() === 200,
  )
  await page.getByRole("link", { name: "Interacciones" }).click()
  const graphResponse = await graphResponsePromise
  await expect(page.getByRole("img", { name: /Grafo bipartito/ })).toBeVisible()
  expect(graphResponse.headers()["access-control-allow-origin"]).toBe(new URL(page.url()).origin)

  await page.getByRole("button", { name: /Relacion/ }).first().click()
  await expect(page.getByRole("heading", { name: "Arista agregada" })).toBeVisible()
  await page.getByRole("button", { name: /usuario Usuario/ }).first().click()
  await page.getByRole("button", { name: "Ejecutar recorrido" }).click()
  await expect(page.getByRole("heading", { name: "Orden BFS" })).toBeVisible()
  await page.getByLabel("Tipo de interacción").selectOption("reservas")
  await page.getByRole("button", { name: "Limpiar filtros" }).click()

  const openapiResponse = await request.get(`${apiUrl}/openapi.json`)
  expect(openapiResponse.ok()).toBeTruthy()
  const openapi = await openapiResponse.json()
  expect(openapi.paths).toHaveProperty("/grafos/interacciones")
  expect(openapi.paths).toHaveProperty("/grafos/interacciones/recorridos")

  const visibleText = await page.locator("body").innerText()
  expect(visibleText).not.toContain(email)
  expect(visibleText).not.toContain(password)
  expect(consoleErrors.join("\n")).not.toContain(email)
  expect(consoleErrors.join("\n")).not.toContain(password)
})
