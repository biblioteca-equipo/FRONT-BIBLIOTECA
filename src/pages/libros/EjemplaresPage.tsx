import { useState } from "react"
import type { FormEvent } from "react"
import { useLibros } from "@/hooks/useLibros"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function EjemplaresPage() {
  const { libros, crearEjemplar } = useLibros()
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({
    libro_id: "",
    codigo_interno: "",
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setMessage("")

    await crearEjemplar({
      libro_id: Number(form.libro_id),
      codigo_interno: form.codigo_interno,
    })

    setForm({ libro_id: "", codigo_interno: "" })
    setMessage("Ejemplar creado correctamente")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Crear ejemplar</CardTitle>
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

            <div className="space-y-2">
              <Label>Código interno</Label>
              <Input
                value={form.codigo_interno}
                onChange={(e) => setForm({ ...form, codigo_interno: e.target.value })}
                required
              />
            </div>

            <Button className="self-end" type="submit">
              Guardar ejemplar
            </Button>
          </form>

          {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Libros disponibles para crear ejemplares</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libro ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {libros.map((libro) => (
                <TableRow key={libro.id}>
                  <TableCell>{libro.id}</TableCell>
                  <TableCell>{libro.titulo}</TableCell>
                  <TableCell>{libro.estado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
