import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { graphVertexLabel } from "@/lib/interactionGraph"
import type { GraphSelection, GraphSnapshot } from "@/lib/types"


interface GraphDetailPanelProps {
  snapshot: GraphSnapshot
  selection: GraphSelection | null
}

export function GraphDetailPanel({ snapshot, selection }: GraphDetailPanelProps) {
  if (!selection) {
    return (
      <Card>
        <CardHeader><CardTitle>Detalle</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Selecciona un vértice o una arista para revisar sus atributos públicos.
        </CardContent>
      </Card>
    )
  }

  if (selection.kind === "vertex") {
    const vertex = snapshot.vertices.find((item) => item.clave === selection.key)
    if (!vertex) return null
    return (
      <Card>
        <CardHeader><CardTitle>Vértice {vertex.clave}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Tipo:</strong> {vertex.tipo}</p>
          <p><strong>Etiqueta:</strong> {graphVertexLabel(vertex)}</p>
          <p><strong>Estado:</strong> {vertex.estado}</p>
          {vertex.tipo === "libro" && <p><strong>ISBN:</strong> {vertex.isbn ?? "Sin ISBN"}</p>}
        </CardContent>
      </Card>
    )
  }

  const edge = snapshot.aristas.find(
    (item) => item.origen === selection.source && item.destino === selection.target,
  )
  if (!edge) return null
  return (
    <Card>
      <CardHeader><CardTitle>Arista agregada</CardTitle></CardHeader>
      <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
        <p><strong>Origen:</strong> {edge.origen}</p>
        <p><strong>Destino:</strong> {edge.destino}</p>
        <p><strong>Peso:</strong> {edge.peso}</p>
        <p><strong>Préstamos:</strong> {edge.prestamos_total}</p>
        <p><strong>Activos:</strong> {edge.prestamos_activos}</p>
        <p><strong>Devueltos:</strong> {edge.prestamos_devueltos}</p>
        <p><strong>Vencidos:</strong> {edge.prestamos_vencidos}</p>
        <p><strong>Devoluciones:</strong> {edge.devoluciones_total}</p>
        <p><strong>Reservas:</strong> {edge.reservas_total}</p>
        <p><strong>Pendientes:</strong> {edge.reservas_pendientes}</p>
        <p><strong>Atendidas:</strong> {edge.reservas_atendidas}</p>
        <p><strong>Canceladas:</strong> {edge.reservas_canceladas}</p>
        <p className="sm:col-span-2">
          <strong>Última interacción:</strong> {edge.ultima_interaccion ?? "Sin fecha"}
        </p>
      </CardContent>
    </Card>
  )
}
