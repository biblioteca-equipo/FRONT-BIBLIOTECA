// ============================
// Interfaces
// ============================
interface AvlNode {
  key: string
  value: {
    id: number
    autor_id: number
    categoria_id: number
    titulo: string
    isbn: string | null
    anio_publicacion: number | null
    estado: string
  }
  height: number
  left: AvlNode | null
  right: AvlNode | null
}

interface AvlTreeViewerProps {
  node: AvlNode | null
  selectedIsbn?: string
}

interface NodeBoxProps {
  node: AvlNode
  depth: number
  selectedIsbn?: string
}

// ============================
// Node Box
// ============================
// Renderiza cada nodo del árbol AVL.
// Si el ISBN coincide con la búsqueda, se resalta.
// ============================
function NodeBox({ node, depth, selectedIsbn }: NodeBoxProps) {
  const isLeaf = !node.left && !node.right
  const isRoot = depth === 0
  const isSelected = Boolean(selectedIsbn && selectedIsbn === node.key)

  const borderClass = isSelected
    ? "border-yellow-300 ring-2 ring-yellow-300"
    : isRoot
      ? "border-amber-400/70"
      : isLeaf
        ? "border-emerald-400/70"
        : "border-sky-400/70"

  const badgeClass = isSelected
    ? "text-yellow-300"
    : isRoot
      ? "text-amber-300"
      : isLeaf
        ? "text-emerald-300"
        : "text-sky-300"

  return (
    <div
      className={`w-32 rounded-lg border bg-background px-3 py-2 text-center shadow-sm ${borderClass}`}
    >
      <p className={`text-[9px] font-bold leading-tight ${badgeClass}`}>ISBN: {node.key}</p>

      <p className="mt-1 line-clamp-2 text-xs font-semibold leading-tight text-foreground">
        {node.value?.titulo}
      </p>

      <p className="mt-1 text-[10px] text-muted-foreground">Altura: {node.height}</p>

      {isSelected && (
        <p className="mt-1 rounded bg-yellow-300 px-1 py-0.5 text-[9px] font-bold text-black">
          BUSCADO
        </p>
      )}
    </div>
  )
}

// ============================
// Tree Item Props
// ============================
interface AvlTreeItemProps {
  node: AvlNode
  depth: number
  branchLabel?: string
  selectedIsbn?: string
}

// ============================
// AVL Tree Item
// ============================
// Renderiza un nodo y sus hijos con líneas de conexión.
// ============================
function AvlTreeItem({ node, depth, branchLabel, selectedIsbn }: AvlTreeItemProps) {
  const children = [
    node.left ? { key: "left", label: "Izq.", node: node.left } : null,
    node.right ? { key: "right", label: "Der.", node: node.right } : null,
  ].filter(Boolean) as { key: string; label: string; node: AvlNode }[]

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
        {branchLabel && (
          <span className="mb-1 rounded border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground">
            {branchLabel}
          </span>
        )}

        <NodeBox node={node} depth={depth} selectedIsbn={selectedIsbn} />

        {hasChildren && (
          <ul className="relative mt-2 flex justify-center pt-4">
            {children.map((child) => (
              <AvlTreeItem
                key={`${child.key}-${child.node.key}`}
                node={child.node}
                depth={depth + 1}
                branchLabel={child.label}
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
// AVL Tree Viewer
// ============================
// Punto de entrada para visualizar el árbol AVL completo.
// ============================
export function AvlTreeViewer({ node, selectedIsbn }: AvlTreeViewerProps) {
  if (!node) {
    return (
      <p className="text-sm text-muted-foreground">No hay datos para mostrar en el árbol AVL.</p>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="origin-top scale-[0.95]">
        <ul className="flex justify-center">
          <AvlTreeItem node={node} depth={0} selectedIsbn={selectedIsbn} />
        </ul>
      </div>
    </div>
  )
}
