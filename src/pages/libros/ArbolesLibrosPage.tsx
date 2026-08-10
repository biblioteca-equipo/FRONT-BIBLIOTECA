// ============================
// Imports
// ============================
import { useCallback, useEffect, useState } from "react"

import { api } from "@/lib/api"

import { AvlTreeViewer } from "@/components/libros/AvlTreeViewer"
import { NaryTreeViewer } from "@/components/libros/NaryTreeViewer"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ============================
// Libro Tree Item Interface
// ============================
// Define la información de un libro dentro de los árboles.
// ============================
interface LibroTreeItem {
  id: number
  autor_id: number
  categoria_id: number
  titulo: string
  isbn: string | null
  anio_publicacion: number | null
  estado: string
}

// ============================
// AVL Node Interface
// ============================
// Define la estructura de cada nodo del árbol AVL.
// ============================
interface AvlNodeResponse {
  key: string
  value: LibroTreeItem
  height: number
  left: AvlNodeResponse | null
  right: AvlNodeResponse | null
}

// ============================
// N-Ary Node Interface
// ============================
// Define la estructura de cada nodo del árbol n-ario.
// ============================
interface NaryNodeResponse {
  key: string
  label: string
  data: {
    tipo?: string
    id?: number
    titulo?: string
    isbn?: string | null
    autor_id?: number
    categoria_id?: number
    anio_publicacion?: number | null
    estado?: string
  }
  children: NaryNodeResponse[]
}

// ============================
// Catalogo AVL Response
// ============================
// Define la estructura básica de la respuesta del árbol AVL.
// ============================
interface CatalogoAvlResponse {
  estructura: string
  clave_ordenamiento: string
  descripcion: string
  total: number
  complejidad: {
    busqueda_lista: string
    busqueda_arbol_avl: string
    insercion_arbol_avl: string
    eliminacion_arbol_avl: string
  }
  arbol: AvlNodeResponse | null
  datos_ordenados: LibroTreeItem[]
}

// ============================
// Catalogo N-Ario Response
// ============================
// Define la estructura básica de la respuesta del árbol n-ario.
// ============================
interface CatalogoNarioResponse {
  estructura: string
  relacion: string
  descripcion: string
  total_nodos: number
  arbol: NaryNodeResponse | null
  recorrido_pre_order: NaryNodeResponse[]
}

// ============================
// Resultado ISBN Response
// ============================
// Define la respuesta de búsqueda por ISBN dentro del árbol AVL.
// Esta interfaz está basada en la respuesta real del backend.
// ============================
interface ResultadoIsbnResponse {
  found: boolean
  estructura: string
  clave_busqueda?: string
  message?: string
  book?: LibroTreeItem
}

// ============================
// Obtener Ruta AVL
// ============================
// Recorre el árbol AVL desde la raíz hasta el ISBN buscado.
// Esto permite mostrar visualmente la ruta seguida en la búsqueda.
// ============================
function obtenerRutaBusquedaAvl(node: AvlNodeResponse | null, isbn: string): string[] {
  const ruta: string[] = []
  let current = node

  while (current) {
    ruta.push(current.key)

    if (isbn === current.key) {
      break
    }

    if (isbn < current.key) {
      current = current.left
    } else {
      current = current.right
    }
  }

  return ruta
}

// ============================
// Arboles Libros Page
// ============================
// Vista dedicada a mostrar estructuras de datos no lineales
// aplicadas al catálogo de libros.
// ============================
export function ArbolesLibrosPage() {
  // ============================
  // States
  // ============================
  // Estados principales de los árboles, búsqueda, carga y error.
  // ============================
  const [catalogoAvl, setCatalogoAvl] = useState<CatalogoAvlResponse | null>(null)
  const [catalogoNario, setCatalogoNario] = useState<CatalogoNarioResponse | null>(null)
  const [isbnBusqueda, setIsbnBusqueda] = useState("")
  const [isbnSeleccionado, setIsbnSeleccionado] = useState("")
  const [resultadoIsbn, setResultadoIsbn] = useState<ResultadoIsbnResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ============================
  // Search Path
  // ============================
  // Calcula la ruta del ISBN seleccionado dentro del árbol AVL.
  // ============================
  const rutaBusquedaAvl = isbnSeleccionado
    ? obtenerRutaBusquedaAvl(catalogoAvl?.arbol || null, isbnSeleccionado)
    : []

  // ============================
  // Load Trees
  // ============================
  // Carga las dos estructuras no lineales.
  // ============================
  const cargarArboles = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const [avlResponse, naryResponse] = await Promise.all([
        api.get<CatalogoAvlResponse>("/libros/catalogo/arbol-avl"),
        api.get<CatalogoNarioResponse>("/libros/catalogo/arbol-nario"),
      ])
      setCatalogoAvl(avlResponse.data)
      setCatalogoNario(naryResponse.data)
    } catch {
      setError("No se pudieron cargar los árboles de libros.")
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================
  // Search ISBN In AVL
  // ============================
  // Busca un libro por ISBN usando el árbol AVL.
  // También guarda el ISBN encontrado para resaltarlo
  // dentro del árbol AVL y del árbol n-ario.
  // ============================
  async function buscarPorIsbnEnAvl() {
    if (!isbnBusqueda.trim()) {
      return
    }

    try {
      setError("")

      const isbn = isbnBusqueda.trim()

      const response = await api.get<ResultadoIsbnResponse>("/libros/catalogo/arbol-avl/buscar", {
        params: {
          isbn,
        },
      })

      setResultadoIsbn(response.data)

      if (response.data.found && response.data.book?.isbn) {
        setIsbnSeleccionado(response.data.book.isbn)
      } else {
        setIsbnSeleccionado("")
      }
    } catch {
      setIsbnSeleccionado("")
      setError("No se pudo buscar el libro dentro del árbol AVL.")
    }
  }

  // ============================
  // Clear Search
  // ============================
  // Limpia la búsqueda y quita el resaltado de los árboles.
  // ============================
  function limpiarBusqueda() {
    setIsbnBusqueda("")
    setResultadoIsbn(null)
    setIsbnSeleccionado("")
  }

  // ============================
  // Initial Load
  // ============================
  // Carga los árboles al ingresar a la vista.
  // ============================
  useEffect(() => {
    void cargarArboles()
  }, [cargarArboles])

  return (
    <div className="space-y-4">
      {/* ============================
          Header
          ============================ */}
      <Card>
        <CardHeader>
          <CardTitle>Árboles de libros</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Esta vista evidencia el uso de estructuras de datos no lineales dentro del sistema de
            biblioteca.
          </p>

          <p>
            Se implementa un <strong className="text-foreground">árbol AVL</strong> para búsqueda
            eficiente por ISBN y un <strong className="text-foreground">árbol n-ario</strong> para
            representar la jerarquía Biblioteca → Categorías → Libros.
          </p>

          <Button type="button" variant="outline" onClick={cargarArboles}>
            Recargar árboles
          </Button>
        </CardContent>
      </Card>

      {/* ============================
          Loading / Error
          ============================ */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Cargando árboles...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* ============================
          AVL Tree Card
          ============================ */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo como árbol AVL</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ============================
              AVL Summary
              ============================ */}
          <div className="grid gap-3 rounded-md border p-4 text-sm text-muted-foreground md:grid-cols-4">
            <p>
              <strong className="text-foreground">Estructura:</strong>{" "}
              {catalogoAvl?.estructura || "ÁRBOL AVL"}
            </p>

            <p>
              <strong className="text-foreground">Clave:</strong>{" "}
              {catalogoAvl?.clave_ordenamiento || "ISBN"}
            </p>

            <p>
              <strong className="text-foreground">Total:</strong> {catalogoAvl?.total ?? 0}
            </p>

            <p>
              <strong className="text-foreground">Búsqueda AVL:</strong>{" "}
              {catalogoAvl?.complejidad?.busqueda_arbol_avl || "O(log n)"}
            </p>
          </div>

          {/* ============================
              Complexity Comparison
              ============================ */}
          <div className="grid gap-3 rounded-md border p-4 text-sm text-muted-foreground md:grid-cols-2">
            <p>
              <strong className="text-foreground">Lista lineal:</strong>{" "}
              {catalogoAvl?.complejidad?.busqueda_lista || "O(n)"}
            </p>

            <p>
              <strong className="text-foreground">Árbol AVL:</strong>{" "}
              {catalogoAvl?.complejidad?.busqueda_arbol_avl || "O(log n)"}
            </p>
          </div>

          {/* ============================
              AVL Characteristics
              ============================ */}
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-md border p-4 text-sm">
              <p className="text-muted-foreground">Raíz del árbol</p>
              <p className="mt-1 font-bold text-foreground">{catalogoAvl?.arbol?.key || "-"}</p>
            </div>

            <div className="rounded-md border p-4 text-sm">
              <p className="text-muted-foreground">Altura</p>
              <p className="mt-1 font-bold text-foreground">{catalogoAvl?.arbol?.height ?? "-"}</p>
            </div>

            <div className="rounded-md border p-4 text-sm">
              <p className="text-muted-foreground">Clave usada</p>
              <p className="mt-1 font-bold text-foreground">
                {catalogoAvl?.clave_ordenamiento || "ISBN"}
              </p>
            </div>

            <div className="rounded-md border p-4 text-sm">
              <p className="text-muted-foreground">Total de libros</p>
              <p className="mt-1 font-bold text-foreground">{catalogoAvl?.total ?? 0}</p>
            </div>
          </div>

          {/* ============================
              AVL Efficiency Chart
              ============================ */}
          <div className="rounded-md border p-4">
            <h3 className="mb-4 text-base font-bold">Comparativa de eficiencia en búsqueda</h3>

            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Lista lineal</span>
                <span className="text-muted-foreground">
                  {catalogoAvl?.complejidad?.busqueda_lista || "O(n)"}
                </span>
              </div>

              <div className="h-4 rounded-full border bg-background">
                <div
                  className="h-full rounded-full bg-muted-foreground"
                  style={{ width: "100%" }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Recorre los libros uno por uno hasta encontrar el resultado.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Árbol AVL</span>
                <span className="text-muted-foreground">
                  {catalogoAvl?.complejidad?.busqueda_arbol_avl || "O(log n)"}
                </span>
              </div>

              <div className="h-4 rounded-full border bg-background">
                <div className="h-full rounded-full bg-primary" style={{ width: "35%" }} />
              </div>

              <p className="text-xs text-muted-foreground">
                Reduce comparaciones porque descarta ramas del árbol durante la búsqueda.
              </p>
            </div>
          </div>

          {/* ============================
              AVL Operations
              ============================ */}
          <div className="grid gap-3 rounded-md border p-4 text-sm text-muted-foreground md:grid-cols-3">
            <p>
              <strong className="text-foreground">Inserción:</strong>{" "}
              {catalogoAvl?.complejidad?.insercion_arbol_avl || "O(log n)"}
            </p>

            <p>
              <strong className="text-foreground">Búsqueda:</strong>{" "}
              {catalogoAvl?.complejidad?.busqueda_arbol_avl || "O(log n)"}
            </p>

            <p>
              <strong className="text-foreground">Eliminación:</strong>{" "}
              {catalogoAvl?.complejidad?.eliminacion_arbol_avl || "O(log n)"}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            {catalogoAvl?.descripcion || "Catálogo de libros organizado mediante árbol AVL."}
          </p>

          {/* ============================
              Search Form
              ============================ */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Buscar por ISBN, ejemplo: BIB-0011"
              value={isbnBusqueda}
              onChange={(event) => setIsbnBusqueda(event.target.value)}
            />

            <Button type="button" onClick={buscarPorIsbnEnAvl}>
              Buscar en AVL
            </Button>

            <Button type="button" variant="outline" onClick={limpiarBusqueda}>
              Limpiar
            </Button>
          </div>

          {/* ============================
              Search Result Details
              ============================ */}
          {resultadoIsbn && (
            <div className="rounded-md border p-4 text-sm">
              {resultadoIsbn.found && resultadoIsbn.book ? (
                <div className="space-y-4">
                  <p className="text-green-500">Libro encontrado y resaltado en los árboles.</p>

                  <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-md border p-3">
                      <p className="text-muted-foreground">Título</p>
                      <p className="font-bold text-foreground">{resultadoIsbn.book.titulo}</p>
                    </div>

                    <div className="rounded-md border p-3">
                      <p className="text-muted-foreground">ISBN</p>
                      <p className="font-bold text-foreground">{resultadoIsbn.book.isbn}</p>
                    </div>

                    <div className="rounded-md border p-3">
                      <p className="text-muted-foreground">ID libro</p>
                      <p className="font-bold text-foreground">{resultadoIsbn.book.id}</p>
                    </div>

                    <div className="rounded-md border p-3">
                      <p className="text-muted-foreground">Estado</p>
                      <p className="font-bold text-foreground">{resultadoIsbn.book.estado}</p>
                    </div>

                    <div className="rounded-md border p-3">
                      <p className="text-muted-foreground">Autor ID</p>
                      <p className="font-bold text-foreground">{resultadoIsbn.book.autor_id}</p>
                    </div>

                    <div className="rounded-md border p-3">
                      <p className="text-muted-foreground">Categoría ID</p>
                      <p className="font-bold text-foreground">{resultadoIsbn.book.categoria_id}</p>
                    </div>

                    <div className="rounded-md border p-3">
                      <p className="text-muted-foreground">Año publicación</p>
                      <p className="font-bold text-foreground">
                        {resultadoIsbn.book.anio_publicacion || "-"}
                      </p>
                    </div>

                    <div className="rounded-md border p-3">
                      <p className="text-muted-foreground">Estructura usada</p>
                      <p className="font-bold text-foreground">{resultadoIsbn.estructura}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-md border p-3">
                      <p className="text-muted-foreground">Ruta en árbol AVL</p>
                      <p className="mt-1 font-bold text-foreground">
                        {rutaBusquedaAvl.length > 0 ? rutaBusquedaAvl.join(" → ") : "-"}
                      </p>
                    </div>

                    <div className="rounded-md border p-3">
                      <p className="text-muted-foreground">Ubicación en árbol n-ario</p>
                      <p className="mt-1 font-bold text-foreground">
                        Biblioteca → Categoría {resultadoIsbn.book.categoria_id} →{" "}
                        {resultadoIsbn.book.titulo}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    El nodo con ISBN{" "}
                    <strong className="text-foreground">{resultadoIsbn.book.isbn}</strong> aparece
                    resaltado visualmente en el árbol AVL y en el árbol n-ario.
                  </p>
                </div>
              ) : (
                <p className="text-red-500">{resultadoIsbn.message}</p>
              )}
            </div>
          )}

          {/* ============================
              AVL Graphic View
              ============================ */}
          <div className="rounded-md border p-4 overflow-hidden">
            <h3 className="mb-4 text-base font-bold">Visualización gráfica del árbol AVL</h3>

            <AvlTreeViewer node={catalogoAvl?.arbol || null} selectedIsbn={isbnSeleccionado} />
          </div>
        </CardContent>
      </Card>

      {/* ============================
          N-Ary Tree Card
          ============================ */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo como árbol n-ario</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 rounded-md border p-4 text-sm text-muted-foreground md:grid-cols-3">
            <p>
              <strong className="text-foreground">Estructura:</strong>{" "}
              {catalogoNario?.estructura || "ÁRBOL N-ARIO"}
            </p>

            <p>
              <strong className="text-foreground">Relación:</strong>{" "}
              {catalogoNario?.relacion || "Biblioteca -> Categorías -> Libros"}
            </p>

            <p>
              <strong className="text-foreground">Total nodos:</strong>{" "}
              {catalogoNario?.total_nodos ?? 0}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            {catalogoNario?.descripcion ||
              "Representación jerárquica del catálogo mediante un árbol n-ario."}
          </p>

          {/* ============================
              N-Ary Graphic View
              ============================ */}
          <div className="rounded-md border p-4">
            <h3 className="mb-4 text-base font-bold">
              Visualización gráfica Biblioteca → Categorías → Libros
            </h3>

            <div className="overflow-x-auto overflow-y-hidden pb-4">
              <NaryTreeViewer node={catalogoNario?.arbol || null} selectedIsbn={isbnSeleccionado} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
