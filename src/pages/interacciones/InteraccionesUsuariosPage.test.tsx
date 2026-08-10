import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { InteraccionesUsuariosPage } from "@/pages/interacciones/InteraccionesUsuariosPage"
import { apiMock } from "@/test/apiMock"
import { renderWithAuth } from "@/test/render"


describe("InteraccionesUsuariosPage", () => {
  it("descarta PII del resumen y de los nodos de la evidencia n-aria", async () => {
    const user = userEvent.setup()
    apiMock.onGet("/libros/catalogo/interacciones/usuario/7").reply(200, {
      estructura: "ÁRBOL N-ARIO",
      relacion: "Usuario -> interacciones -> libros",
      descripcion: "Evidencia heredada",
      usuario: {
        id: 7,
        nombre: "PII-NOMBRE-7788",
        documento: "PII-DOC-7788",
        email: "pii@example.test",
        rol: "ADMIN",
        estado: "ACTIVO",
      },
      total_nodos: 1,
      total_prestamos: 0,
      total_reservas: 0,
      arbol: {
        key: "usuario:7",
        label: "PII-NOMBRE-7788",
        data: {
          tipo: "usuario",
          usuario_id: 7,
          documento: "PII-DOC-7788",
          email: "pii@example.test",
          token: "PII-TOKEN-7788",
        },
        children: [],
      },
      recorrido_pre_order: [],
    })

    renderWithAuth(<InteraccionesUsuariosPage />)
    await user.type(screen.getByPlaceholderText(/Ingrese ID del usuario/), "7")
    await user.click(screen.getByRole("button", { name: "Ver interacciones" }))

    expect(await screen.findAllByText("Usuario 7")).not.toHaveLength(0)
    expect(document.body.textContent).not.toMatch(
      /PII-NOMBRE-7788|PII-DOC-7788|pii@example\.test|PII-TOKEN-7788/i,
    )
  })
})
