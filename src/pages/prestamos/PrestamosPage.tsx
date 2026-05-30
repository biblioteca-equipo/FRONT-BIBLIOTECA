import { useState } from "react"
import type { FormEvent } from "react"
import { usePrestamos } from "@/hooks/usePrestamos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PrestamosPage() {
  const { prestamos, loading, crearPrestamo, devolverPrestamo } = usePrestamos()
  const [form, setForm] = useState({
    usuario_id: "",
    ejemplar_id: "",
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    await crearPrestamo({
      usuario_id: Number(form.usuario_id),
      ejemplar_id: Number(form.ejemplar_id),
    })

    setForm({ usuario_id: "", ejemplar_id: "" })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Crear préstamo</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Usuario ID</Label>
              <Input
                type="number"
                value={form.usuario_id}
                onChange={(e) => setForm({ ...form, usuario_id: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Ejemplar ID</Label>
              <Input
                type="number"
                value={form.ejemplar_id}
                onChange={(e) => setForm({ ...form, ejemplar_id: e.target.value })}
                required
              />
            </div>

            <Button className="self-end" type="submit">
              Crear préstamo
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préstamos</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <p>Cargando préstamos...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuario ID</TableHead>
                  <TableHead>Ejemplar ID</TableHead>
                  <TableHead>Fecha préstamo</TableHead>
                  <TableHead>Fecha límite</TableHead>
                  <TableHead>Fecha devolución</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {prestamos.map((prestamo) => (
                  <TableRow key={prestamo.id}>
                    <TableCell>{prestamo.id}</TableCell>
                    <TableCell>{prestamo.usuario_id}</TableCell>
                    <TableCell>{prestamo.ejemplar_id}</TableCell>
                    <TableCell>{prestamo.fecha_prestamo}</TableCell>
                    <TableCell>{prestamo.fecha_limite}</TableCell>
                    <TableCell>{prestamo.fecha_devolucion || "-"}</TableCell>
                    <TableCell>{prestamo.estado}</TableCell>
                    <TableCell>
                      {prestamo.estado !== "DEVUELTO" && (
                        <Button size="sm" onClick={() => devolverPrestamo(prestamo.id)}>
                          Devolver
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
