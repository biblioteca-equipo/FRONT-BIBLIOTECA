import { screen } from "@testing-library/react"
import { Route, Routes } from "react-router-dom"
import { describe, expect, it } from "vitest"

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

  it("representa el estado vacio sin exponer campos personales", async () => {
    const payload = graphFixture({ vertices: [], aristas: [] })
    apiMock.onGet("/grafos/interacciones").reply(200, {
      ...payload,
      metadatos: {
        ...payload.metadatos,
        total_vertices: 0,
        total_aristas: 0,
        peso_total: 0,
      },
    })

    renderPage()

    expect(await screen.findByText(/No hay relaciones/)).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/documento|correo|telefono|token|password|hash/i)
  })

  it("muestra el estado 403 y ofrece reintentar", async () => {
    apiMock.onGet("/grafos/interacciones").reply(403)
    renderPage()

    expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permisos")
    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument()
  })
})
