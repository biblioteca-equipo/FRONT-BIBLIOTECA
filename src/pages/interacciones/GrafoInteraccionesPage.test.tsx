import { screen } from "@testing-library/react"
import { Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"

import { GrafoInteraccionesPage } from "@/pages/interacciones/GrafoInteraccionesPage"
import { apiMock } from "@/test/apiMock"
import { graphFixture } from "@/test/graphFixture"
import { renderWithAuth } from "@/test/render"


function renderPage() {
  return renderWithAuth(
    <Routes>
      <Route path="/interacciones" element={<GrafoInteraccionesPage />} />
      <Route path="/interacciones/arbol" element={<p>Árbol anterior</p>} />
    </Routes>,
    { route: "/interacciones" },
  )
}

describe("GrafoInteraccionesPage", () => {
  it("advierte una respuesta truncada y conserva el enlace al arbol anterior", async () => {
    const payload = graphFixture()
    apiMock.onGet("/grafos/interacciones").reply(200, {
      ...payload,
      metadatos: { ...payload.metadatos, truncado: true },
    })

    renderPage()

    expect(await screen.findByText(/La respuesta fue truncada/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /visualización n-aria/ })).toHaveAttribute(
      "href",
      "/interacciones/arbol",
    )
    expect(screen.getByRole("img", { name: /Grafo bipartito/ })).toBeInTheDocument()
  })

  it("descarta campos personales de una respuesta no vacia y no los registra", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => undefined)
    const payload = graphFixture()
    apiMock.onGet("/grafos/interacciones").reply(200, {
      ...payload,
      vertices: payload.vertices.map((vertex) => ({
        ...vertex,
        documento: "PII-DOC-7788",
        correo: "pii@example.test",
        telefono: "3009998877",
        token: "PII-TOKEN-7788",
        password_hash: "PII-HASH-7788",
      })),
    })

    renderPage()

    expect(await screen.findByRole("img", { name: /Grafo bipartito/ })).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(
      /PII-DOC-7788|pii@example\.test|3009998877|PII-TOKEN-7788|PII-HASH-7788/i,
    )
    expect(consoleError).not.toHaveBeenCalled()
    expect(consoleLog).not.toHaveBeenCalled()
  })

  it("muestra el estado 403 y ofrece reintentar", async () => {
    apiMock.onGet("/grafos/interacciones").reply(403)
    renderPage()

    expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permisos")
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument()
  })
})
