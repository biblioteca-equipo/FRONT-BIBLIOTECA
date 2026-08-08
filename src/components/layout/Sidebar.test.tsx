import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Sidebar } from "@/components/layout/Sidebar"
import { adminUser, renderWithAuth } from "@/test/render"


describe("Sidebar", () => {
  it("oculta las vistas administrativas a un lector", () => {
    renderWithAuth(<Sidebar />, {
      auth: { user: { ...adminUser, rol: "LECTOR" } },
    })

    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Interacciones" })).not.toBeInTheDocument()
    expect(screen.queryByRole("link", { name: "Usuarios" })).not.toBeInTheDocument()
  })

  it("muestra las vistas del proyecto a un administrador", () => {
    renderWithAuth(<Sidebar />)

    expect(screen.getByRole("link", { name: "Interacciones" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Árboles de libros" })).toBeInTheDocument()
  })
})
