import { useState } from "react"
import type { FormEvent } from "react"
import { useCategorias } from "@/hooks/useCategorias"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CategoriasPage() {
  const { categorias, loading, crearCategoria } = useCategorias()
  const [form, setForm] = useState({ nombre: "", descripcion: "" })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    await crearCategoria({
      nombre: form.nombre,
      descripcion: form.descripcion || null,
    })

    setForm({ nombre: "", descripcion: "" })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Crear categoría</CardTitle>
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
              <Label>Descripción</Label>
              <Input
                value={form.descripcion}
                onChange={(event) => setForm({ ...form, descripcion: event.target.value })}
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
          <CardTitle>Categorías</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <p>Cargando categorías...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha creación</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categorias.map((categoria) => (
                  <TableRow key={categoria.id}>
                    <TableCell>{categoria.id}</TableCell>
                    <TableCell>{categoria.nombre}</TableCell>
                    <TableCell>{categoria.descripcion || "-"}</TableCell>
                    <TableCell>{categoria.created_at}</TableCell>
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
