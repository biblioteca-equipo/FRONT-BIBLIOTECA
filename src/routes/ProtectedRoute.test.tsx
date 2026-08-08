import { screen } from "@testing-library/react"
import { Route, Routes } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { adminUser, renderWithAuth } from "@/test/render"


function ProtectedRouteHarness({ allowedRoles }: { allowedRoles?: string[] }) {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
        <Route path="/privada" element={<p>Contenido protegido</p>} />
      </Route>
      <Route path="/login" element={<p>Pantalla de acceso</p>} />
    </Routes>
  )
}

describe("ProtectedRoute", () => {
  it("muestra el estado de carga", () => {
    renderWithAuth(<ProtectedRouteHarness />, {
      route: "/privada",
      auth: { loading: true },
    })

    expect(screen.getByText("Cargando...")).toBeInTheDocument()
  })

  it("redirige al login cuando no existe token", () => {
    renderWithAuth(<ProtectedRouteHarness />, {
      route: "/privada",
      auth: { token: null, user: null },
    })

    expect(screen.getByText("Pantalla de acceso")).toBeInTheDocument()
  })

  it("comunica la falta de permisos para un lector", () => {
    renderWithAuth(
      <ProtectedRouteHarness allowedRoles={["ADMIN", "BIBLIOTECARIO"]} />,
      {
        route: "/privada",
        auth: { user: { ...adminUser, rol: "LECTOR" } },
      },
    )

    expect(screen.getByRole("alert")).toHaveTextContent("No tienes permisos")
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument()
  })

  it("renderiza la ruta para un rol autorizado", () => {
    renderWithAuth(
      <ProtectedRouteHarness allowedRoles={["ADMIN", "BIBLIOTECARIO"]} />,
      { route: "/privada" },
    )

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument()
  })
})
