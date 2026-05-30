import { useState } from "react"
import type { FormEvent } from "react"
import { useAutores } from "@/hooks/useAutores"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function AutoresPage() {
  const { autores, loading, crearAutor } = useAutores()
  const [form, setForm] = useState({ nombre: "", nacionalidad: "" })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    await crearAutor({
      nombre: form.nombre,
      nacionalidad: form.nacionalidad || null,
    })

    setForm({ nombre: "", nacionalidad: "" })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Crear autor</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={form.nombre}
                onChange={(event) => setForm({ ...form, nombre: event.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Nacionalidad</Label>
              <Input
                value={form.nacionalidad}
                onChange={(event) => setForm({ ...form, nacionalidad: event.target.value })}
              />
            </div>

            <Button className="self-end" type="submit">
              Guardar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Autores</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <p>Cargando autores...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Nacionalidad</TableHead>
                  <TableHead>Fecha creación</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {autores.map((autor) => (
                  <TableRow key={autor.id}>
                    <TableCell>{autor.id}</TableCell>
                    <TableCell>{autor.nombre}</TableCell>
                    <TableCell>{autor.nacionalidad || "-"}</TableCell>
                    <TableCell>{autor.created_at}</TableCell>
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
