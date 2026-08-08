import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { GraphDetailPanel } from "@/components/interacciones/GraphDetailPanel"
import { InteractionGraphViewer } from "@/components/interacciones/InteractionGraphViewer"
import { graphFixture } from "@/test/graphFixture"


describe("InteractionGraphViewer", () => {
  it("representa un libro compartido como un unico nodo y dos aristas", () => {
    const snapshot = graphFixture()
    render(
      <InteractionGraphViewer
        vertices={[...snapshot.vertices, snapshot.vertices[2]]}
        edges={snapshot.aristas}
        selection={null}
        onSelect={() => undefined}
      />,
    )

    expect(screen.getAllByRole("button", { name: /libro Libro compartido/ })).toHaveLength(1)
    expect(screen.getAllByRole("button", { name: /Relacion usuario:/ })).toHaveLength(2)
  })

  it("permite seleccionar con click y teclado y muestra el orden recorrido", () => {
    const snapshot = graphFixture()
    const onSelect = vi.fn()
    render(
      <InteractionGraphViewer
        vertices={snapshot.vertices}
        edges={snapshot.aristas}
        selection={null}
        traversalOrder={["usuario:1", "libro:1"]}
        onSelect={onSelect}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /usuario Usuario 1/ }))
    fireEvent.keyDown(screen.getByRole("button", { name: /Relacion usuario:1/ }), { key: "Enter" })
    expect(onSelect).toHaveBeenNthCalledWith(1, { kind: "vertex", key: "usuario:1" })
    expect(onSelect).toHaveBeenNthCalledWith(2, {
      kind: "edge",
      source: "usuario:1",
      target: "libro:1",
    })
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
  })
})

describe("GraphDetailPanel", () => {
  it("muestra contadores de una arista y fecha opcional segura", () => {
    const snapshot = graphFixture()
    render(
      <GraphDetailPanel
        snapshot={snapshot}
        selection={{ kind: "edge", source: "usuario:2", target: "libro:1" }}
      />,
    )

    expect(screen.getByText(/Sin fecha/)).toBeInTheDocument()
    expect(screen.getByText(/Reservas:/)).toBeInTheDocument()
  })

  it("no expone atributos personales en un vertice de usuario", () => {
    const snapshot = graphFixture()
    render(
      <GraphDetailPanel snapshot={snapshot} selection={{ kind: "vertex", key: "usuario:1" }} />,
    )

    expect(screen.getByText("Usuario 1")).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/correo|documento|telefono|token|password|hash/i)
  })
})
