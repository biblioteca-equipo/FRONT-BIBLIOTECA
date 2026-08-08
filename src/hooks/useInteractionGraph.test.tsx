import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { useInteractionGraph } from "@/hooks/useInteractionGraph"
import { apiMock } from "@/test/apiMock"
import { graphFixture } from "@/test/graphFixture"


describe("useInteractionGraph", () => {
  it("carga el grafo global y normaliza campos opcionales", async () => {
    const payload = graphFixture()
    apiMock.onGet("/grafos/interacciones").reply(200, payload)
    const { result } = renderHook(() => useInteractionGraph())

    await act(() => result.current.loadGlobal(100))

    expect(result.current.snapshot?.vertices).toHaveLength(3)
    expect(result.current.snapshot?.aristas[1].ultima_interaccion).toBeNull()
    expect(apiMock.history.get[0].params).toEqual({ max_nodos: 100 })
  })

  it("carga subgrafo, vecinos de usuario y predecesores de libro", async () => {
    const payload = graphFixture()
    apiMock.onGet("/grafos/interacciones/usuarios/1").reply(200, payload)
    apiMock.onGet("/grafos/interacciones/usuarios/1/libros").reply(200, {
      metadatos: payload.metadatos,
      vertice: payload.vertices[0],
      vecinos: [payload.vertices[2]],
      aristas: [payload.aristas[0]],
    })
    apiMock.onGet("/grafos/interacciones/libros/1/usuarios").reply(200, {
      metadatos: payload.metadatos,
      vertice: payload.vertices[2],
      vecinos: payload.vertices.slice(0, 2),
      aristas: payload.aristas,
    })
    const { result } = renderHook(() => useInteractionGraph())

    await act(() => result.current.loadUser(1))
    await act(() => result.current.loadUserNeighbors(1))
    expect(result.current.snapshot?.vertices).toHaveLength(2)
    await act(() => result.current.loadBookPredecessors(1))
    expect(result.current.snapshot?.vertices).toHaveLength(3)
  })

  it("ejecuta y limpia recorridos", async () => {
    apiMock.onGet("/grafos/interacciones/recorridos").reply(200, {
      algoritmo: "bfs",
      inicio: "usuario:1",
      orden: ["usuario:1", "libro:1"],
      total_visitados: 2,
    })
    const { result } = renderHook(() => useInteractionGraph())

    await act(() => result.current.runTraversal("bfs", "usuario:1"))
    expect(result.current.traversal?.orden).toEqual(["usuario:1", "libro:1"])
    act(() => result.current.clearTraversal())
    expect(result.current.traversal).toBeNull()
  })

  it("diferencia 403 y permite reintentar la ultima solicitud", async () => {
    apiMock.onGet("/grafos/interacciones").replyOnce(403).onGet("/grafos/interacciones").reply(200, graphFixture())
    const { result } = renderHook(() => useInteractionGraph())

    await act(() => result.current.loadGlobal())
    expect(result.current.error).toMatchObject({ status: 403 })
    await act(() => result.current.retry())
    expect(result.current.snapshot).not.toBeNull()
    expect(result.current.error).toBeNull()
  })

  it("presenta un mensaje accionable ante un error de red", async () => {
    apiMock.onGet("/grafos/interacciones").networkError()
    const { result } = renderHook(() => useInteractionGraph())

    await act(() => result.current.loadGlobal())

    expect(result.current.error).toMatchObject({ status: null })
    expect(result.current.error?.message).toMatch(/conectar con la API/)
  })

  it("ignora una respuesta cancelada cuando comienza una consulta nueva", async () => {
    const first = graphFixture({ vertices: [graphFixture().vertices[0]], aristas: [] })
    const second = graphFixture()
    apiMock.onGet("/grafos/interacciones").reply((config) => {
      if (config.params.max_nodos === 100) {
        return new Promise((resolve) => setTimeout(() => resolve([200, first]), 40))
      }
      return [200, second]
    })
    const { result } = renderHook(() => useInteractionGraph())

    void result.current.loadGlobal(100)
    await act(() => result.current.loadGlobal(200))
    await waitFor(() => expect(result.current.snapshot?.vertices).toHaveLength(3))
  })
})
