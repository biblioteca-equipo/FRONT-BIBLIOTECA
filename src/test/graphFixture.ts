import type { GraphSnapshot } from "@/lib/types"


export function graphFixture(overrides: Partial<GraphSnapshot> = {}): GraphSnapshot {
  return {
    metadatos: {
      dirigido: true,
      ponderado: true,
      bipartito: true,
      total_vertices: 3,
      total_aristas: 2,
      peso_total: 3,
      tiempo_construccion_ms: 0.42,
      regla_peso: "prestamos_total + reservas_total",
      filtros: { max_nodos: 200 },
      truncado: false,
    },
    vertices: [
      { clave: "usuario:1", tipo: "usuario", id: 1, etiqueta: "Usuario 1", estado: "ACTIVO" },
      { clave: "usuario:2", tipo: "usuario", id: 2, etiqueta: "Usuario 2", estado: "ACTIVO" },
      { clave: "libro:1", tipo: "libro", id: 1, titulo: "Libro compartido", isbn: null, estado: "ACTIVO" },
    ],
    aristas: [
      {
        origen: "usuario:1",
        destino: "libro:1",
        peso: 2,
        prestamos_total: 1,
        prestamos_activos: 0,
        prestamos_devueltos: 1,
        prestamos_vencidos: 0,
        devoluciones_total: 1,
        reservas_total: 1,
        reservas_pendientes: 0,
        reservas_atendidas: 0,
        reservas_canceladas: 1,
        ultima_interaccion: "2026-08-07T15:30:00Z",
      },
      {
        origen: "usuario:2",
        destino: "libro:1",
        peso: 1,
        prestamos_total: 0,
        prestamos_activos: 0,
        prestamos_devueltos: 0,
        prestamos_vencidos: 0,
        devoluciones_total: 0,
        reservas_total: 1,
        reservas_pendientes: 1,
        reservas_atendidas: 0,
        reservas_canceladas: 0,
        ultima_interaccion: null,
      },
    ],
    ...overrides,
  }
}
