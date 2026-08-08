import type {
  GraphBookVertex,
  GraphEdge,
  GraphFilters,
  GraphNeighborsResponse,
  GraphSnapshot,
  GraphVertex,
} from "@/lib/types"


export const EMPTY_GRAPH_FILTERS: GraphFilters = {
  usuario: "",
  libro: "",
  interaccion: "todas",
  estado: "todos",
}

function normalizeVertex(vertex: GraphVertex): GraphVertex {
  if (vertex.tipo === "libro") {
    return { ...vertex, isbn: vertex.isbn ?? null }
  }
  return vertex
}

function normalizeEdge(edge: GraphEdge): GraphEdge {
  return { ...edge, ultima_interaccion: edge.ultima_interaccion ?? null }
}

export function normalizeGraphSnapshot(snapshot: GraphSnapshot): GraphSnapshot {
  return {
    ...snapshot,
    vertices: snapshot.vertices.map(normalizeVertex),
    aristas: snapshot.aristas.map(normalizeEdge),
  }
}

export function neighborsToSnapshot(
  response: GraphNeighborsResponse,
): GraphSnapshot {
  return normalizeGraphSnapshot({
    metadatos: response.metadatos,
    vertices: [response.vertice, ...response.vecinos],
    aristas: response.aristas,
  })
}

function matchesInteraction(edge: GraphEdge, filters: GraphFilters) {
  if (filters.interaccion === "prestamos") return edge.prestamos_total > 0
  if (filters.interaccion === "devoluciones") return edge.devoluciones_total > 0
  if (filters.interaccion === "reservas") return edge.reservas_total > 0
  return true
}

function matchesStatus(edge: GraphEdge, filters: GraphFilters) {
  const counters = {
    prestamo_activo: edge.prestamos_activos,
    prestamo_devuelto: edge.prestamos_devueltos,
    prestamo_vencido: edge.prestamos_vencidos,
    reserva_pendiente: edge.reservas_pendientes,
    reserva_atendida: edge.reservas_atendidas,
    reserva_cancelada: edge.reservas_canceladas,
  }
  return filters.estado === "todos" || counters[filters.estado] > 0
}

export function filterGraphSnapshot(
  snapshot: GraphSnapshot,
  filters: GraphFilters,
): GraphSnapshot {
  const vertices = new Map(snapshot.vertices.map((vertex) => [vertex.clave, vertex]))
  const userQuery = filters.usuario.trim().toLowerCase()
  const bookQuery = filters.libro.trim().toLowerCase()

  const edges = snapshot.aristas.filter((edge) => {
    const user = vertices.get(edge.origen)
    const book = vertices.get(edge.destino) as GraphBookVertex | undefined
    const userMatches =
      !userQuery ||
      edge.origen.toLowerCase().includes(userQuery) ||
      String(user?.id ?? "").includes(userQuery)
    const bookMatches =
      !bookQuery ||
      edge.destino.toLowerCase().includes(bookQuery) ||
      String(book?.id ?? "").includes(bookQuery) ||
      book?.titulo.toLowerCase().includes(bookQuery)
    return (
      userMatches &&
      Boolean(bookMatches) &&
      matchesInteraction(edge, filters) &&
      matchesStatus(edge, filters)
    )
  })

  const filtersActive = Boolean(
    userQuery ||
    bookQuery ||
    filters.interaccion !== "todas" ||
    filters.estado !== "todos",
  )
  const visibleKeys = new Set(edges.flatMap((edge) => [edge.origen, edge.destino]))
  const filteredVertices = filtersActive
    ? snapshot.vertices.filter((vertex) => visibleKeys.has(vertex.clave))
    : snapshot.vertices

  return {
    ...snapshot,
    metadatos: {
      ...snapshot.metadatos,
      total_vertices: filteredVertices.length,
      total_aristas: edges.length,
      peso_total: edges.reduce((total, edge) => total + edge.peso, 0),
    },
    vertices: filteredVertices,
    aristas: edges,
  }
}

export function graphVertexLabel(vertex: GraphVertex) {
  return vertex.tipo === "usuario" ? vertex.etiqueta : vertex.titulo
}
