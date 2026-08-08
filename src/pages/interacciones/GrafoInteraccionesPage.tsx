import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { GraphDetailPanel } from "@/components/interacciones/GraphDetailPanel"
import { InteractionGraphViewer } from "@/components/interacciones/InteractionGraphViewer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useInteractionGraph } from "@/hooks/useInteractionGraph"
import {
  EMPTY_GRAPH_FILTERS,
  filterGraphSnapshot,
} from "@/lib/interactionGraph"
import type { GraphFilters, GraphSelection } from "@/lib/types"


function positiveId(value: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

export function GrafoInteraccionesPage() {
  const graph = useInteractionGraph()
  const [maxNodes, setMaxNodes] = useState("200")
  const [userId, setUserId] = useState("")
  const [bookId, setBookId] = useState("")
  const [filters, setFilters] = useState<GraphFilters>(EMPTY_GRAPH_FILTERS)
  const [selection, setSelection] = useState<GraphSelection | null>(null)
  const [algorithm, setAlgorithm] = useState<"bfs" | "dfs">("bfs")
  const [startKey, setStartKey] = useState("")
  const [validationError, setValidationError] = useState("")
  const initialLoad = graph.loadGlobal

  useEffect(() => {
    void initialLoad(200)
  }, [initialLoad])

  const filteredSnapshot = useMemo(
    () => graph.snapshot ? filterGraphSnapshot(graph.snapshot, filters) : null,
    [filters, graph.snapshot],
  )

  function selectGraphElement(nextSelection: GraphSelection) {
    setSelection(nextSelection)
    if (nextSelection.kind === "vertex") setStartKey(nextSelection.key)
  }

  function loadGlobal() {
    const limit = positiveId(maxNodes)
    if (!limit || limit > 1000) {
      setValidationError("El límite debe estar entre 1 y 1000 nodos.")
      return
    }
    setValidationError("")
    setSelection(null)
    void graph.loadGlobal(limit)
  }

  function runUserQuery(neighborsOnly: boolean) {
    const id = positiveId(userId)
    if (!id) {
      setValidationError("Ingresa un ID de usuario entero y positivo.")
      return
    }
    setValidationError("")
    setSelection(null)
    void (neighborsOnly ? graph.loadUserNeighbors(id) : graph.loadUser(id))
  }

  function runBookQuery() {
    const id = positiveId(bookId)
    if (!id) {
      setValidationError("Ingresa un ID de libro entero y positivo.")
      return
    }
    setValidationError("")
    setSelection(null)
    void graph.loadBookPredecessors(id)
  }

  function runTraversal() {
    if (!startKey) {
      setValidationError("Selecciona un vértice o indica una clave inicial.")
      return
    }
    setValidationError("")
    void graph.runTraversal(algorithm, startKey)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Grafo de interacciones usuarios-libros</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Red dirigida, ponderada y bipartita construida desde préstamos y reservas.
            Cada libro compartido aparece una sola vez y puede recibir aristas de varios usuarios.
          </p>
          <Link className="font-semibold text-primary underline" to="/interacciones/arbol">
            Abrir la visualización n-aria de la actividad anterior
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Alcance de la consulta</CardTitle></CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="max-nodes" className="text-sm font-medium">Grafo global</label>
            <div className="flex gap-2">
              <Input id="max-nodes" type="number" min="1" max="1000" value={maxNodes}
                onChange={(event) => setMaxNodes(event.target.value)} />
              <Button onClick={loadGlobal} disabled={graph.loading}>Cargar</Button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="graph-user" className="text-sm font-medium">Usuario</label>
            <Input id="graph-user" type="number" min="1" value={userId}
              onChange={(event) => setUserId(event.target.value)} placeholder="ID de usuario" />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => runUserQuery(false)} disabled={graph.loading}>
                Subgrafo
              </Button>
              <Button variant="outline" onClick={() => runUserQuery(true)} disabled={graph.loading}>
                Libros vecinos
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="graph-book" className="text-sm font-medium">Libro</label>
            <Input id="graph-book" type="number" min="1" value={bookId}
              onChange={(event) => setBookId(event.target.value)} placeholder="ID de libro" />
            <Button variant="outline" onClick={runBookQuery} disabled={graph.loading}>
              Usuarios relacionados
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Filtros y recorrido</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input aria-label="Filtrar usuario" placeholder="ID o clave de usuario"
            value={filters.usuario}
            onChange={(event) => setFilters({ ...filters, usuario: event.target.value })} />
          <Input aria-label="Filtrar libro" placeholder="ID, clave o título de libro"
            value={filters.libro}
            onChange={(event) => setFilters({ ...filters, libro: event.target.value })} />
          <select aria-label="Tipo de interacción" className="rounded-md border bg-background px-3 py-2 text-sm"
            value={filters.interaccion}
            onChange={(event) => setFilters({ ...filters, interaccion: event.target.value as GraphFilters["interaccion"] })}>
            <option value="todas">Todas las interacciones</option>
            <option value="prestamos">Préstamos</option>
            <option value="devoluciones">Devoluciones</option>
            <option value="reservas">Reservas</option>
          </select>
          <select aria-label="Estado agregado" className="rounded-md border bg-background px-3 py-2 text-sm"
            value={filters.estado}
            onChange={(event) => setFilters({ ...filters, estado: event.target.value as GraphFilters["estado"] })}>
            <option value="todos">Todos los estados</option>
            <option value="prestamo_activo">Préstamo activo</option>
            <option value="prestamo_devuelto">Préstamo devuelto</option>
            <option value="prestamo_vencido">Préstamo vencido</option>
            <option value="reserva_pendiente">Reserva pendiente</option>
            <option value="reserva_atendida">Reserva atendida</option>
            <option value="reserva_cancelada">Reserva cancelada</option>
          </select>
          <Button variant="outline" onClick={() => setFilters(EMPTY_GRAPH_FILTERS)}>Limpiar filtros</Button>
          <select aria-label="Algoritmo de recorrido" className="rounded-md border bg-background px-3 py-2 text-sm"
            value={algorithm} onChange={(event) => setAlgorithm(event.target.value as "bfs" | "dfs")}>
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
          </select>
          <Input aria-label="Clave inicial" value={startKey}
            onChange={(event) => setStartKey(event.target.value)} placeholder="usuario:1" />
          <Button onClick={runTraversal} disabled={graph.loading || !graph.snapshot}>Ejecutar recorrido</Button>
        </CardContent>
      </Card>

      {(validationError || graph.error) && (
        <div role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-600">
          <p>{validationError || graph.error?.message}</p>
          {graph.error && <Button className="mt-3" variant="outline" onClick={() => void graph.retry()}>Reintentar</Button>}
        </div>
      )}

      {graph.loading && <p role="status" className="rounded-md border p-4">Cargando grafo...</p>}

      {filteredSnapshot && (
        <>
          {filteredSnapshot.metadatos.truncado && (
            <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
              La respuesta fue truncada. Reduce el alcance con un usuario, libro o filtros.
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardContent className="pt-6"><strong>Vértices:</strong> {filteredSnapshot.metadatos.total_vertices}</CardContent></Card>
            <Card><CardContent className="pt-6"><strong>Aristas:</strong> {filteredSnapshot.metadatos.total_aristas}</CardContent></Card>
            <Card><CardContent className="pt-6"><strong>Peso total:</strong> {filteredSnapshot.metadatos.peso_total}</CardContent></Card>
            <Card><CardContent className="pt-6"><strong>Construcción:</strong> {filteredSnapshot.metadatos.tiempo_construccion_ms.toFixed(2)} ms</CardContent></Card>
          </div>

          {filteredSnapshot.vertices.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">
              No hay relaciones que cumplan el alcance y los filtros actuales.
            </CardContent></Card>
          ) : (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
              <InteractionGraphViewer
                vertices={filteredSnapshot.vertices}
                edges={filteredSnapshot.aristas}
                selection={selection}
                traversalOrder={graph.traversal?.orden}
                onSelect={selectGraphElement}
              />
              <GraphDetailPanel snapshot={filteredSnapshot} selection={selection} />
            </div>
          )}

          {graph.traversal && (
            <Card>
              <CardHeader><CardTitle>Orden {graph.traversal.algoritmo.toUpperCase()}</CardTitle></CardHeader>
              <CardContent className="text-sm">{graph.traversal.orden.join(" → ")}</CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
