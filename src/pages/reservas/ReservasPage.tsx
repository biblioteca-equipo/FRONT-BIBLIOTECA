import { useState } from "react"
import type { FormEvent } from "react"
import { useReservas } from "@/hooks/useReservas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ReservasPage() {
  const { cola, loading, crearReserva, atenderSiguienteReserva } = useReservas()
  const [form, setForm] = useState({
    libro_id: "",
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    await crearReserva({
      libro_id: Number(form.libro_id),
    })

    setForm({ libro_id: "" })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Crear reserva</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Libro ID</Label>
              <Input
                type="number"
                value={form.libro_id}
                onChange={(e) => setForm({ ...form, libro_id: e.target.value })}
                required
              />
            </div>

            <Button className="self-end" type="submit">
              Crear reserva
            </Button>

            <Button className="self-end" type="button" variant="outline" onClick={atenderSiguienteReserva}>
              Atender siguiente
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cola de reservas</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <p>Cargando reservas...</p>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                {cola?.estructura} - {cola?.descripcion} - Total: {cola?.total ?? 0}
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuario ID</TableHead>
                    <TableHead>Libro ID</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha reserva</TableHead>
                    <TableHead>Fecha atención</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {(cola?.datos || []).map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell>{reserva.id}</TableCell>
                      <TableCell>{reserva.usuario_id}</TableCell>
                      <TableCell>{reserva.libro_id}</TableCell>
                      <TableCell>{reserva.estado}</TableCell>
                      <TableCell>{reserva.fecha_reserva}</TableCell>
                      <TableCell>{reserva.fecha_atencion || "-"}</TableCell>
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
