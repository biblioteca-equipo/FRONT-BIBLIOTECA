// ============================
// Imports
// ============================
import { useState } from "react"

import { api } from "@/lib/api"

import { NaryTreeViewer } from "@/components/libros/NaryTreeViewer"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// ============================
// Role Interface
// ============================
// El backend puede devolver el rol como texto:
// "ADMIN"
//
// O como un objeto:
// {
//   id: 1,
//   nombre: "ADMIN",
//   descripcion: "...",
//   created_at: "..."
// }
// ============================
interface RolResponse {
  id: number
  nombre: string
  descripcion?: string | null
  created_at?: string | null
}

// ============================
// Normalized N-Ary Node Data
// ============================
// Esta es la estructura que utilizará el frontend.
// El rol siempre debe quedar convertido en texto.
// ============================
interface NaryNodeData {
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

// ============================
// Normalized N-Ary Node
// ============================
interface NaryNodeResponse {
  key: string
  label: string
  data: NaryNodeData
  children: NaryNodeResponse[]
}

// ============================
// Raw API N-Ary Node
// ============================
// Representa la respuesta original del backend.
// Aquí rol puede llegar como string o como objeto.
// ============================
interface RawNaryNodeResponse {
  key: string
  label: string
  data: Omit<NaryNodeData, "rol"> & {
    rol?: string | RolResponse | null
  }
  children?: RawNaryNodeResponse[]
}

// ============================
// Normalized User Response
// ============================
interface UsuarioInteraccionesResponse {
  id: number
  nombre: string
  documento: string
  email: string
  rol: string
  estado: string
}

// ============================
// Raw User Response
// ============================
interface RawUsuarioInteraccionesResponse {
  id: number
  nombre: string
  documento: string
  email: string
  rol: string | RolResponse | null
  estado: string
}

// ============================
// Normalized Catalog Response
// ============================
// Esta estructura se guarda finalmente en el estado.
// ============================
interface CatalogoInteraccionesResponse {
  estructura: string
  relacion: string
  descripcion: string
  usuario: UsuarioInteraccionesResponse
  total_nodos: number
  total_prestamos: number
  total_reservas: number
  arbol: NaryNodeResponse | null
  recorrido_pre_order: NaryNodeResponse[]
}

// ============================
// Raw Catalog Response
// ============================
// Respuesta recibida directamente desde la API.
// ============================
interface RawCatalogoInteraccionesResponse {
  estructura: string
  relacion: string
  descripcion: string
  usuario: RawUsuarioInteraccionesResponse
  total_nodos: number
  total_prestamos: number
  total_reservas: number
  arbol: RawNaryNodeResponse | null
  recorrido_pre_order?: RawNaryNodeResponse[]
}

// ============================
// Get Role Name
// ============================
// Convierte el rol recibido en un texto que React
// pueda mostrar sin producir errores.
//
// Ejemplos:
// "ADMIN" -> "ADMIN"
// { nombre: "ADMIN" } -> "ADMIN"
// ============================
function obtenerNombreRol(
  rol: string | RolResponse | null | undefined
): string {
  if (!rol) {
    return "Sin rol"
  }

  if (typeof rol === "string") {
    return rol
  }

  return rol.nombre
}

// ============================
// Normalize N-Ary Node
// ============================
// Recorre recursivamente todos los nodos del árbol
// y convierte cualquier objeto rol en texto.
// ============================
function normalizarNodo(
  node: RawNaryNodeResponse
): NaryNodeResponse {
  const rolNormalizado = node.data.rol
    ? obtenerNombreRol(node.data.rol)
    : undefined

  return {
    key: node.key,
    label: node.label,
    data: {
      ...node.data,
      rol: rolNormalizado,
    },
    children: (node.children ?? []).map(normalizarNodo),
  }
}

// ============================
// Normalize API Response
// ============================
// Convierte toda la respuesta del backend a una
// estructura segura para ser renderizada en React.
// ============================
function normalizarRespuesta(
  data: RawCatalogoInteraccionesResponse
): CatalogoInteraccionesResponse {
  return {
    estructura: data.estructura,
    relacion: data.relacion,
    descripcion: data.descripcion,
    usuario: {
      ...data.usuario,
      rol: obtenerNombreRol(data.usuario.rol),
    },
    total_nodos: data.total_nodos,
    total_prestamos: data.total_prestamos,
    total_reservas: data.total_reservas,
    arbol: data.arbol
      ? normalizarNodo(data.arbol)
      : null,
    recorrido_pre_order: (
      data.recorrido_pre_order ?? []
    ).map(normalizarNodo),
  }
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

  const [
    catalogoInteracciones,
    setCatalogoInteracciones,
  ] = useState<CatalogoInteraccionesResponse | null>(
    null
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ============================
  // Load User Interactions
  // ============================
  // Consulta el backend para construir el árbol n-ario
  // de interacciones de un usuario específico.
  // ============================
  async function cargarInteraccionesUsuario() {
    const idIngresado = usuarioId.trim()
    const idNumerico = Number(idIngresado)

    if (!idIngresado) {
      setError(
        "Ingrese el ID del usuario para consultar sus interacciones."
      )
      return
    }

    if (
      !Number.isInteger(idNumerico) ||
      idNumerico <= 0
    ) {
      setError(
        "El ID del usuario debe ser un número entero mayor que cero."
      )
      return
    }

    try {
      setLoading(true)
      setError("")
      setCatalogoInteracciones(null)

      const response =
        await api.get<RawCatalogoInteraccionesResponse>(
          `/libros/catalogo/interacciones/usuario/${idNumerico}`
        )

      console.log(
        "Respuesta original de interacciones:",
        response.data
      )

      const respuestaNormalizada = normalizarRespuesta(
        response.data
      )

      console.log(
        "Respuesta normalizada:",
        respuestaNormalizada
      )

      setCatalogoInteracciones(
        respuestaNormalizada
      )
    } catch (error) {
      console.error(
        "Error cargando interacciones:",
        error
      )

      setCatalogoInteracciones(null)

      setError(
        "No se pudieron cargar las interacciones. Verifique que el usuario exista."
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================
  // Handle Enter Key
  // ============================
  function manejarTeclaEnter(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      void cargarInteraccionesUsuario()
    }
  }

  // ============================
  // Clear Search
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
          <CardTitle>
            Interacciones usuarios-libros
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Esta vista modela las interacciones entre los
            usuarios y los libros de la biblioteca mediante
            una estructura de datos no lineal.
          </p>

          <p>
            Se utiliza un{" "}
            <strong className="text-foreground">
              árbol n-ario
            </strong>{" "}
            para representar la relación Biblioteca →
            Usuario → Préstamos / Reservas → Libros.
          </p>
        </CardContent>
      </Card>

      {/* ============================
          Search Card
          ============================ */}
      <Card>
        <CardHeader>
          <CardTitle>
            Consultar usuario
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ingrese el ID de un usuario para visualizar
            sus préstamos, reservas y devoluciones en
            forma de árbol.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="number"
              min="1"
              placeholder="Ingrese ID del usuario, ejemplo: 1"
              value={usuarioId}
              onChange={(event) =>
                setUsuarioId(event.target.value)
              }
              onKeyDown={manejarTeclaEnter}
              disabled={loading}
            />

            <Button
              type="button"
              onClick={() =>
                void cargarInteraccionesUsuario()
              }
              disabled={loading}
            >
              {loading
                ? "Cargando..."
                : "Ver interacciones"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={limpiarConsulta}
              disabled={loading}
            >
              Limpiar
            </Button>
          </div>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ============================
          Results
          ============================ */}
      {catalogoInteracciones && (
        <Card>
          <CardHeader>
            <CardTitle>
              Árbol de interacciones
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* ============================
                Summary
                ============================ */}
            <div className="grid gap-3 rounded-md border p-4 text-sm text-muted-foreground md:grid-cols-4">
              <p>
                <strong className="text-foreground">
                  Estructura:
                </strong>{" "}
                {catalogoInteracciones.estructura}
              </p>

              <p>
                <strong className="text-foreground">
                  Usuario:
                </strong>{" "}
                {catalogoInteracciones.usuario.nombre}
              </p>

              <p>
                <strong className="text-foreground">
                  Préstamos:
                </strong>{" "}
                {catalogoInteracciones.total_prestamos}
              </p>

              <p>
                <strong className="text-foreground">
                  Reservas:
                </strong>{" "}
                {catalogoInteracciones.total_reservas}
              </p>
            </div>

            {/* ============================
                User Details
                ============================ */}
            <div className="grid gap-3 rounded-md border p-4 text-sm text-muted-foreground md:grid-cols-4">
              <p>
                <strong className="text-foreground">
                  ID usuario:
                </strong>{" "}
                {catalogoInteracciones.usuario.id}
              </p>

              <p>
                <strong className="text-foreground">
                  Documento:
                </strong>{" "}
                {catalogoInteracciones.usuario.documento}
              </p>

              <p>
                <strong className="text-foreground">
                  Rol:
                </strong>{" "}
                {catalogoInteracciones.usuario.rol}
              </p>

              <p>
                <strong className="text-foreground">
                  Estado:
                </strong>{" "}
                {catalogoInteracciones.usuario.estado}
              </p>
            </div>

            {/* ============================
                Contact Details
                ============================ */}
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">
                  Correo electrónico:
                </strong>{" "}
                {catalogoInteracciones.usuario.email}
              </p>
            </div>

            {/* ============================
                Relation Description
                ============================ */}
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">
                  Relación:
                </strong>{" "}
                {catalogoInteracciones.relacion}
              </p>

              <p className="mt-2">
                {catalogoInteracciones.descripcion}
              </p>
            </div>

            {/* ============================
                Concepts
                ============================ */}
            <div className="grid gap-3 rounded-md border p-4 text-sm text-muted-foreground md:grid-cols-3">
              <p>
                <strong className="text-foreground">
                  Préstamo:
                </strong>{" "}
                el usuario recibe un ejemplar físico de
                un libro.
              </p>

              <p>
                <strong className="text-foreground">
                  Reserva:
                </strong>{" "}
                el usuario solicita un libro para ser
                atendido posteriormente.
              </p>

              <p>
                <strong className="text-foreground">
                  Devolución:
                </strong>{" "}
                el usuario retorna un ejemplar previamente
                prestado.
              </p>
            </div>

            {/* ============================
                Empty Tree Message
                ============================ */}
            {!catalogoInteracciones.arbol && (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                El usuario existe, pero todavía no tiene
                préstamos ni reservas registrados.
              </div>
            )}

            {/* ============================
                Tree Graphic View
                ============================ */}
            {catalogoInteracciones.arbol && (
              <div className="rounded-md border p-4">
                <h3 className="mb-4 text-base font-bold">
                  Visualización gráfica Usuario →
                  Préstamos / Reservas → Libros
                </h3>

                <div className="overflow-x-auto overflow-y-hidden pb-4">
                  <NaryTreeViewer
                    node={catalogoInteracciones.arbol}
                    selectedIsbn=""
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}