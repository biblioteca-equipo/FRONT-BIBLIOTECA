import { useHistorial } from "@/hooks/useHistorial"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function HistorialPage() {
  const { historial, ultimaAccion, loading } = useHistorial()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Última acción</CardTitle>
        </CardHeader>

        <CardContent>
          {ultimaAccion ? (
            <div className="space-y-1 text-sm">
              <p><strong>Acción:</strong> {ultimaAccion.tipo_accion}</p>
              <p><strong>Entidad:</strong> {ultimaAccion.entidad}</p>
              <p><strong>Descripción:</strong> {ultimaAccion.descripcion}</p>
              <p><strong>Fecha:</strong> {ultimaAccion.created_at}</p>
            </div>
          ) : (
            <p>No hay última acción registrada.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial como pila</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <p>Cargando historial...</p>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {historial?.estructura} - {historial?.descripcion} - Total: {historial?.total ?? 0}
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Entidad</TableHead>
                    <TableHead>Entidad ID</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {(historial?.datos || []).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.tipo_accion}</TableCell>
                      <TableCell>{item.entidad}</TableCell>
                      <TableCell>{item.entidad_id}</TableCell>
                      <TableCell>{item.descripcion}</TableCell>
                      <TableCell>{item.created_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
