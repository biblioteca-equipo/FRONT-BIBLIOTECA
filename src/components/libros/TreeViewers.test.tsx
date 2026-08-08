import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AvlTreeViewer } from "@/components/libros/AvlTreeViewer"
import { NaryTreeViewer } from "@/components/libros/NaryTreeViewer"


describe("visualizaciones de arboles", () => {
  it("conserva el estado vacio del visor AVL", () => {
    render(<AvlTreeViewer node={null} />)
    expect(screen.getByText(/No hay datos para mostrar/)).toBeInTheDocument()
  })

  it("renderiza y resalta un nodo AVL", () => {
    render(
      <AvlTreeViewer
        selectedIsbn="ISBN-1"
        node={{
          key: "ISBN-1",
          value: {
            id: 1,
            autor_id: 1,
            categoria_id: 1,
            titulo: "Libro AVL",
            isbn: "ISBN-1",
            anio_publicacion: 2026,
            estado: "ACTIVO",
          },
          height: 1,
          left: null,
          right: null,
        }}
      />,
    )

    expect(screen.getByText("Libro AVL")).toBeInTheDocument()
    expect(screen.getByText("BUSCADO")).toBeInTheDocument()
  })

  it("conserva el estado vacio del visor n-ario", () => {
    render(<NaryTreeViewer node={null} />)
    expect(screen.getByText(/No hay datos para mostrar/)).toBeInTheDocument()
  })

  it("renderiza una jerarquia n-aria y su interaccion", () => {
    render(
      <NaryTreeViewer
        node={{
          key: "biblioteca",
          label: "Biblioteca",
          data: { tipo: "raiz" },
          children: [
            {
              key: "libro:1",
              label: "Libro reservado",
              data: {
                tipo: "libro",
                isbn: "ISBN-NARIO",
                interaccion: "reserva",
              },
              children: [],
            },
          ],
        }}
      />,
    )

    expect(screen.getByText("Biblioteca")).toBeInTheDocument()
    expect(screen.getByText("Libro reservado")).toBeInTheDocument()
    expect(screen.getByText("Reservado")).toBeInTheDocument()
  })
})
