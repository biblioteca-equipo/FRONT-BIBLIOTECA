import { useState } from "react"
import type { FormEvent } from "react"
import { useAutores } from "@/hooks/useAutores"
import { useCategorias } from "@/hooks/useCategorias"
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

export function LibrosPage() {
  const { libros, loading, crearLibro, buscarLibros, listarLibros } = useLibros()
  const { autores } = useAutores()
  const { categorias } = useCategorias()

  const [busqueda, setBusqueda] = useState("")

  const [form, setForm] = useState({
    autor_id: "",
    categoria_id: "",
    titulo: "",
    isbn: "",
    anio_publicacion: "",
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    await crearLibro({
      autor_id: Number(form.autor_id),
      categoria_id: Number(form.categoria_id),
      titulo: form.titulo,
      isbn: form.isbn || null,
      anio_publicacion: form.anio_publicacion ? Number(form.anio_publicacion) : null,
    })

    setForm({
      autor_id: "",
      categoria_id: "",
      titulo: "",
      isbn: "",
      anio_publicacion: "",
    })
  }

  async function handleBuscar(event: FormEvent) {
    event.preventDefault()

    if (!busqueda.trim()) {
      await listarLibros()
      return
    }

    await buscarLibros(busqueda)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Crear libro</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="autor_id">Autor</Label>

              <select
                id="autor_id"
                value={form.autor_id}
                onChange={(event) => setForm({ ...form, autor_id: event.target.value })}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">Seleccione un autor</option>

                {autores.map((autor) => (
                  <option key={autor.id} value={autor.id}>
                    {autor.id} - {autor.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria_id">Categoría</Label>

              <select
                id="categoria_id"
                value={form.categoria_id}
                onChange={(event) => setForm({ ...form, categoria_id: event.target.value })}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">Seleccione una categoría</option>

                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.id} - {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>

              <Input
                id="titulo"
                value={form.titulo}
                onChange={(event) => setForm({ ...form, titulo: event.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>

              <Input
                id="isbn"
                value={form.isbn}
                onChange={(event) => setForm({ ...form, isbn: event.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anio_publicacion">Año publicación</Label>

              <Input
                id="anio_publicacion"
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="Ej: 1967"
                value={form.anio_publicacion}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "")

                  setForm({
                    ...form,
                    anio_publicacion: value,
                  })
                }}
              />
            </div>

            <Button className="self-end" type="submit">
              Guardar libro
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buscar libros</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleBuscar} className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Buscar por título"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />

            <Button type="submit">Buscar</Button>

            <Button type="button" variant="outline" onClick={listarLibros}>
              Limpiar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Libros</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <p>Cargando libros...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor ID</TableHead>
                  <TableHead>Categoría ID</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {libros.map((libro) => (
                  <TableRow key={libro.id}>
                    <TableCell>{libro.id}</TableCell>
                    <TableCell>{libro.titulo}</TableCell>
                    <TableCell>{libro.autor_id}</TableCell>
                    <TableCell>{libro.categoria_id}</TableCell>
                    <TableCell>{libro.isbn || "-"}</TableCell>
                    <TableCell>{libro.anio_publicacion || "-"}</TableCell>
                    <TableCell>{libro.estado}</TableCell>
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
