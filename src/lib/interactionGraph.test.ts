import { describe, expect, it } from "vitest"

import {
  EMPTY_GRAPH_FILTERS,
  filterGraphSnapshot,
  graphVertexLabel,
  neighborsToSnapshot,
  normalizeGraphSnapshot,
} from "@/lib/interactionGraph"
import { graphFixture } from "@/test/graphFixture"


describe("utilidades del grafo", () => {
  it("normaliza ISBN y fecha opcionales", () => {
    const snapshot = graphFixture()
    const book = snapshot.vertices[2]
    if (book.tipo !== "libro") throw new Error("fixture invalida")
    const normalized = normalizeGraphSnapshot({
      ...snapshot,
      vertices: [{ ...book, isbn: undefined as unknown as null }],
      aristas: [{ ...snapshot.aristas[1], ultima_interaccion: undefined as unknown as null }],
    })

    expect(normalized.vertices[0]).toMatchObject({ isbn: null })
    expect(normalized.aristas[0].ultima_interaccion).toBeNull()
  })

  it("convierte vecinos en una instantanea sin duplicar el vertice consultado", () => {
    const snapshot = graphFixture()
    const converted = neighborsToSnapshot({
      metadatos: snapshot.metadatos,
      vertice: snapshot.vertices[0],
      vecinos: [snapshot.vertices[2]],
      aristas: [snapshot.aristas[0]],
    })

    expect(converted.vertices.map((vertex) => vertex.clave)).toEqual(["usuario:1", "libro:1"])
  })

  it("filtra por reservas canceladas y conserva solo sus extremos", () => {
    const filtered = filterGraphSnapshot(graphFixture(), {
      ...EMPTY_GRAPH_FILTERS,
      interaccion: "reservas",
      estado: "reserva_cancelada",
    })

    expect(filtered.aristas).toHaveLength(1)
    expect(filtered.vertices.map((vertex) => vertex.clave).sort()).toEqual([
      "libro:1",
      "usuario:1",
    ])
    expect(filtered.metadatos.peso_total).toBe(2)
  })

  it("filtra por usuario y titulo de libro", () => {
    const filtered = filterGraphSnapshot(graphFixture(), {
      ...EMPTY_GRAPH_FILTERS,
      usuario: "2",
      libro: "compartido",
    })

    expect(filtered.aristas.map((edge) => edge.origen)).toEqual(["usuario:2"])
  })

  it("conserva vertices aislados cuando no hay filtros", () => {
    const snapshot = graphFixture({ aristas: [] })
    expect(filterGraphSnapshot(snapshot, EMPTY_GRAPH_FILTERS).vertices).toHaveLength(3)
    expect(graphVertexLabel(snapshot.vertices[0])).toBe("Usuario 1")
    expect(graphVertexLabel(snapshot.vertices[2])).toBe("Libro compartido")
  })
})
