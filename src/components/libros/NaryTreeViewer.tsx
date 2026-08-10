// ============================
// Interfaces
// ============================
// Define la estructura genérica de un nodo n-ario.
// Este componente se reutiliza para:
// - Biblioteca -> Categorías -> Libros
// - Biblioteca -> Usuario -> Préstamos / Reservas -> Libros
// ============================
interface NaryNode {
  key: string
  label: string
  data: {
    // ============================
    // Basic Node Data
    // ============================
    tipo?: string
    id?: number
    titulo?: string
    isbn?: string | null
    autor_id?: number
    categoria_id?: number
    anio_publicacion?: number | null
    estado?: string

    // ============================
    // User Data
    // ============================
    usuario_id?: number
    // ============================
    // Interaction Data
    // ============================
    interaccion?: string
    prestamo_id?: number
    reserva_id?: number
    ejemplar_id?: number
    codigo_ejemplar?: string
    estado_ejemplar?: string
    estado_libro?: string
    estado_prestamo?: string
    estado_reserva?: string

    // ============================
    // Date Data
    // ============================
    fecha_prestamo?: string | null
    fecha_limite?: string | null
    fecha_devolucion?: string | null
    fecha_reserva?: string | null
    fecha_atencion?: string | null

    // ============================
    // Extra Data
    // ============================
    descripcion?: string
  }
  children: NaryNode[]
}

interface NaryTreeViewerProps {
  node: NaryNode | null
  selectedIsbn?: string
}

interface NaryNodeBoxProps {
  node: NaryNode
  depth: number
  selectedIsbn?: string
}

// ============================
// Get Node Type Label
// ============================
// Convierte el tipo interno del nodo en una etiqueta
// más clara para mostrar en pantalla.
// ============================
function getNodeTypeLabel(tipo: string, depth: number) {
  const tipoNormalizado = tipo.toLowerCase()

  if (depth === 0) return "Raíz"
  if (tipoNormalizado === "categoria") return "Categoría"
  if (tipoNormalizado === "usuario") return "Usuario"
  if (tipoNormalizado === "prestamos") return "Préstamos"
  if (tipoNormalizado === "reservas") return "Reservas"
  if (tipoNormalizado === "libro") return "Libro"
  if (tipoNormalizado === "vacio") return "Sin datos"

  return tipo
}

// ============================
// Get Interaction Label
// ============================
// Muestra el estado funcional del libro dentro
// del árbol de interacciones.
// ============================
function getInteractionLabel(interaccion?: string) {
  if (!interaccion) {
    return ""
  }

  if (interaccion === "devolucion") {
    return "Devuelto"
  }

  if (interaccion === "prestamo") {
    return "Prestado"
  }

  if (interaccion === "reserva") {
    return "Reservado"
  }

  return interaccion
}

// ============================
// N-Ary Node Box
// ============================
// Renderiza cada nodo del árbol n-ario.
// Si el ISBN coincide con la búsqueda, se resalta.
// ============================
function NaryNodeBox({ node, depth, selectedIsbn }: NaryNodeBoxProps) {
  // ============================
  // Node Type Detection
  // ============================
  const tipo = node.data?.tipo || "nodo"
  const tipoNormalizado = tipo.toLowerCase()

  const isRoot = depth === 0
  const isCategoria = tipoNormalizado === "categoria"
  const isUsuario = tipoNormalizado === "usuario"
  const isPrestamos = tipoNormalizado === "prestamos"
  const isReservas = tipoNormalizado === "reservas"
  const isVacio = tipoNormalizado === "vacio"
  const isLibro = tipoNormalizado === "libro"
  const isSelected = Boolean(selectedIsbn && node.data?.isbn === selectedIsbn)

  // ============================
  // Visual Classes
  // ============================
  // Se asignan colores diferentes según el tipo de nodo.
  // Esto permite diferenciar categorías, usuarios,
  // préstamos, reservas y libros.
  const borderClass = isSelected
    ? "border-yellow-300 ring-2 ring-yellow-300"
    : isRoot
      ? "border-amber-400/70"
      : isCategoria
        ? "border-sky-400/70"
        : isUsuario
          ? "border-purple-400/70"
          : isPrestamos
            ? "border-orange-400/70"
            : isReservas
              ? "border-pink-400/70"
              : isLibro
                ? "border-emerald-400/70"
                : isVacio
                  ? "border-slate-400/50"
                  : "border-border"

  const badgeClass = isSelected
    ? "text-yellow-300"
    : isRoot
      ? "text-amber-300"
      : isCategoria
        ? "text-sky-300"
        : isUsuario
          ? "text-purple-300"
          : isPrestamos
            ? "text-orange-300"
            : isReservas
              ? "text-pink-300"
              : isLibro
                ? "text-emerald-300"
                : isVacio
                  ? "text-slate-300"
                  : "text-primary"

  return (
    <div
      className={`w-32 rounded-lg border bg-background px-2 py-2 text-center shadow-sm ${borderClass}`}
    >
      {/* ============================
          Node Type
          ============================ */}
      <p className={`text-[9px] font-bold uppercase leading-tight ${badgeClass}`}>
        {getNodeTypeLabel(tipo, depth)}
      </p>

      {/* ============================
          Node Label
          ============================ */}
      <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-tight text-foreground">
        {node.label}
      </p>

      {/* ============================
          ISBN
          ============================ */}
      {node.data?.isbn && (
        <p className="mt-1 text-[9px] text-muted-foreground">ISBN: {node.data.isbn}</p>
      )}

      {/* ============================
          Interaction Label
          ============================ */}
      {node.data?.interaccion && (
        <p className="mt-1 text-[9px] font-semibold text-muted-foreground">
          {getInteractionLabel(node.data.interaccion)}
        </p>
      )}

      {/* ============================
          Children Count
          ============================ */}
      {node.children?.length > 0 && (
        <p className="mt-1 text-[9px] text-muted-foreground">Hijos: {node.children.length}</p>
      )}

      {/* ============================
          Selected Badge
          ============================ */}
      {isSelected && (
        <p className="mt-1 rounded bg-yellow-300 px-1 py-0.5 text-[9px] font-bold text-black">
          BUSCADO
        </p>
      )}
    </div>
  )
}

// ============================
// N-Ary Tree Item Props
// ============================
interface NaryTreeItemProps {
  node: NaryNode
  depth: number
  selectedIsbn?: string
}

// ============================
// N-Ary Tree Item
// ============================
// Renderiza un nodo y todos sus hijos con líneas de conexión.
// ============================
function NaryTreeItem({ node, depth, selectedIsbn }: NaryTreeItemProps) {
  const children = node.children || []
  const hasChildren = children.length > 0

  return (
    <li
      className="
        relative list-none px-1 text-center
        before:absolute before:right-1/2 before:top-0 before:h-4 before:w-1/2 before:border-t before:border-border before:content-['']
        after:absolute after:left-1/2 after:top-0 after:h-4 after:w-1/2 after:border-t after:border-border after:content-['']
        first:before:border-0
        last:after:border-0
        only:before:border-0
        only:after:border-0
      "
    >
      <div
        className={`relative flex flex-col items-center ${
          depth > 0
            ? "pt-4 before:absolute before:left-1/2 before:top-0 before:h-4 before:w-px before:-translate-x-1/2 before:bg-border before:content-['']"
            : ""
        }`}
      >
        {/* ============================
            Current Node
            ============================ */}
        <NaryNodeBox node={node} depth={depth} selectedIsbn={selectedIsbn} />

        {/* ============================
            Children Nodes
            ============================ */}
        {hasChildren && (
          <ul className="relative mt-2 flex justify-center pt-4">
            {children.map((child) => (
              <NaryTreeItem
                key={child.key}
                node={child}
                depth={depth + 1}
                selectedIsbn={selectedIsbn}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

// ============================
// N-Ary Tree Viewer
// ============================
// Punto de entrada para visualizar el árbol n-ario completo.
// ============================
export function NaryTreeViewer({ node, selectedIsbn }: NaryTreeViewerProps) {
  if (!node) {
    return (
      <p className="text-sm text-muted-foreground">No hay datos para mostrar en el árbol n-ario.</p>
    )
  }

  return (
    <div className="w-max min-w-full">
      <div className="origin-top scale-[0.95]">
        <ul className="flex justify-center">
          <NaryTreeItem node={node} depth={0} selectedIsbn={selectedIsbn} />
        </ul>
      </div>
    </div>
  )
}
