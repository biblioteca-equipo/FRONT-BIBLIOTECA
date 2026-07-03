// ============================
// Imports
// ============================
import { useState } from "react"

import { api } from "@/lib/api"

import { NaryTreeViewer } from "@/components/libros/NaryTreeViewer"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ============================
// N-Ary Node Interface
// ============================
// Define la estructura del árbol n-ario usado para
// representar interacciones entre usuarios y libros.
// ============================
interface NaryNodeResponse {
  key: string
  label: string
  data: {
    tipo?: string
    id?: number
    titulo?: string
    isbn?: string | null
    estado?: string

    usuario_id?: number
    nombre?: string
    apellido?: string
    documento?: string
    email?: string
    rol?: string

    interaccion?: string
    prestamo_id?: number
    reserva_id?: number
    ejemplar_id?: number
    codigo_ejemplar?: string
    estado_ejemplar?: string
    estado_libro?: string
    estado_prestamo?: string
    estado_reserva?: string

    fecha_prestamo?: string | null
    fecha_limite?: string | null
    fecha_devolucion?: string | null
    fecha_reserva?: string | null
    fecha_atencion?: string | null

    descripcion?: string
  }
  children: NaryNodeResponse[]
}

// ============================
// Catalogo Interacciones Response
// ============================
// Define la respuesta del endpoint:
// /libros/catalogo/interacciones/usuario/{usuario_id}
// ============================
interface CatalogoInteraccionesResponse {
  estructura: string
  relacion: string
  descripcion: string
  usuario: {
    id: number
    nombre: string
    documento: string
    email: string
    rol: string
    estado: string
  }
  total_nodos: number
  total_prestamos: number
  total_reservas: number
  arbol: NaryNodeResponse | null
  recorrido_pre_order: NaryNodeResponse[]
}

// ============================
// Interacciones Usuarios Page
// ============================
// Vista dedicada a modelar la relación:
// Biblioteca -> Usuario -> Préstamos / Reservas -> Libros.
// ============================
export function InteraccionesUsuariosPage() {
  // ============================
  // States
  // ============================
  const [usuarioId, setUsuarioId] = useState("")
  const [catalogoInteracciones, setCatalogoInteracciones] =
    useState<CatalogoInteraccionesResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ============================
  // Load User Interactions
  // ============================
  // Consulta el backend para construir el árbol n-ario
  // de interacciones de un usuario específico.
  // ============================
  async function cargarInteraccionesUsuario() {
    if (!usuarioId.trim()) {
      setError("Ingrese el ID del usuario para consultar sus interacciones.")
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await api.get<CatalogoInteraccionesResponse>(
        `/libros/catalogo/interacciones/usuario/${usuarioId.trim()}`
      )

      setCatalogoInteracciones(response.data)
    } catch (error) {
      console.error("Error cargando interacciones:", error)
      setCatalogoInteracciones(null)
      setError("No se pudieron cargar las interacciones. Verifique que el usuario exista.")
    } finally {
      setLoading(false)
    }
  }

  // ============================
  // Clear Search
  // ============================
  // Limpia el formulario y la visualización.
  // ============================
  function limpiarConsulta() {
    setUsuarioId("")
    setCatalogoInteracciones(null)
    setError("")
  }

  return (
    <div className="space-y-4">
      {/* ============================
          Header
          ============================ */}
      <Card>
        <CardHeader>
          <CardTitle>Interacciones usuarios-libros</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Esta vista modela las interacciones entre los usuarios y los libros de la biblioteca
            mediante una estructura de datos no lineal.
          </p>

          <p>
            Se utiliza un <strong className="text-foreground">árbol n-ario</strong> para representar
            la relación Biblioteca → Usuario → Préstamos / Reservas → Libros.
          </p>
        </CardContent>
      </Card>

      {/* ============================
          Search Card
          ============================ */}
      <Card>
        <CardHeader>
          <CardTitle>Consultar usuario</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ingrese el ID de un usuario para visualizar sus préstamos, reservas y devoluciones en
            forma de árbol.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Ingrese ID del usuario, ejemplo: 1"
              value={usuarioId}
              onChange={(event) => setUsuarioId(event.target.value)}
            />

            <Button type="button" onClick={cargarInteraccionesUsuario} disabled={loading}>
              {loading ? "Cargando..." : "Ver interacciones"}
            </Button>

            <Button type="button" variant="outline" onClick={limpiarConsulta}>
              Limpiar
            </Button>
          </div>

          {error && <div className="rounded-md border p-4 text-sm text-red-500">{error}</div>}
        </CardContent>
      </Card>

      {/* ============================
          Results
          ============================ */}
      {catalogoInteracciones && (
        <Card>
          <CardHeader>
            <CardTitle>Árbol de interacciones</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* ============================
                Summary
                ============================ */}
            <div className="grid gap-3 rounded-md border p-4 text-sm text-muted-foreground md:grid-cols-4">
              <p>
                <strong className="text-foreground">Estructura:</strong>{" "}
                {catalogoInteracciones.estructura}
              </p>

              <p>
                <strong className="text-foreground">Usuario:</strong>{" "}
                {catalogoInteracciones.usuario.nombre}
              </p>

              <p>
                <strong className="text-foreground">Préstamos:</strong>{" "}
                {catalogoInteracciones.total_prestamos}
              </p>

              <p>
                <strong className="text-foreground">Reservas:</strong>{" "}
                {catalogoInteracciones.total_reservas}
              </p>
            </div>

            {/* ============================
                User Details
                ============================ */}
            <div className="grid gap-3 rounded-md border p-4 text-sm text-muted-foreground md:grid-cols-4">
              <p>
                <strong className="text-foreground">ID usuario:</strong>{" "}
                {catalogoInteracciones.usuario.id}
              </p>

              <p>
                <strong className="text-foreground">Documento:</strong>{" "}
                {catalogoInteracciones.usuario.documento}
              </p>

              <p>
                <strong className="text-foreground">Rol:</strong>{" "}
                {catalogoInteracciones.usuario.rol}
              </p>

              <p>
                <strong className="text-foreground">Estado:</strong>{" "}
                {catalogoInteracciones.usuario.estado}
              </p>
            </div>

            {/* ============================
                Relation Description
                ============================ */}
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Relación:</strong>{" "}
                {catalogoInteracciones.relacion}
              </p>

              <p className="mt-2">{catalogoInteracciones.descripcion}</p>
            </div>

            {/* ============================
                Concepts
                ============================ */}
            <div className="grid gap-3 rounded-md border p-4 text-sm text-muted-foreground md:grid-cols-3">
              <p>
                <strong className="text-foreground">Préstamo:</strong> el usuario recibe un ejemplar
                físico de un libro.
              </p>

              <p>
                <strong className="text-foreground">Reserva:</strong> el usuario solicita un libro
                para ser atendido posteriormente.
              </p>

              <p>
                <strong className="text-foreground">Devolución:</strong> el usuario retorna un
                ejemplar previamente prestado.
              </p>
            </div>

            {/* ============================
                Tree Graphic View
                ============================ */}
            <div className="rounded-md border p-4">
              <h3 className="mb-4 text-base font-bold">
                Visualización gráfica Usuario → Préstamos / Reservas → Libros
              </h3>

              <div className="overflow-x-auto overflow-y-hidden pb-4">
                <NaryTreeViewer node={catalogoInteracciones.arbol || null} selectedIsbn="" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
