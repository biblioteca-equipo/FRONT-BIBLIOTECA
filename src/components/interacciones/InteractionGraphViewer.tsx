import { graphVertexLabel } from "@/lib/interactionGraph"
import type {
  GraphEdge,
  GraphSelection,
  GraphVertex,
} from "@/lib/types"


interface InteractionGraphViewerProps {
  vertices: GraphVertex[]
  edges: GraphEdge[]
  selection: GraphSelection | null
  traversalOrder?: string[]
  onSelect: (selection: GraphSelection) => void
}

interface Point {
  x: number
  y: number
}

export function InteractionGraphViewer({
  vertices,
  edges,
  selection,
  traversalOrder = [],
  onSelect,
}: InteractionGraphViewerProps) {
  const uniqueVertices = new Map(vertices.map((vertex) => [vertex.clave, vertex]))
  const users = [...uniqueVertices.values()]
    .filter((vertex) => vertex.tipo === "usuario")
    .sort((left, right) => left.clave.localeCompare(right.clave))
  const books = [...uniqueVertices.values()]
    .filter((vertex) => vertex.tipo === "libro")
    .sort((left, right) => left.clave.localeCompare(right.clave))
  const height = Math.max(420, Math.max(users.length, books.length) * 105 + 100)
  const positions = new Map<string, Point>()
  users.forEach((vertex, index) => positions.set(vertex.clave, { x: 170, y: 80 + index * 105 }))
  books.forEach((vertex, index) => positions.set(vertex.clave, { x: 730, y: 80 + index * 105 }))
  const traversalIndex = new Map(traversalOrder.map((key, index) => [key, index + 1]))

  function selectWithKeyboard(
    event: React.KeyboardEvent<SVGGElement>,
    nextSelection: GraphSelection,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onSelect(nextSelection)
    }
  }

  return (
    <div className="max-h-[42rem] min-h-[28rem] overflow-auto rounded-md border bg-muted/20">
      <svg
        role="img"
        aria-label="Grafo bipartito de interacciones entre usuarios y libros"
        viewBox={`0 0 900 ${height}`}
        className="min-w-[900px]"
        style={{ height }}
      >
        <defs>
          <marker id="graph-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" className="fill-slate-500" />
          </marker>
        </defs>

        <text x="170" y="35" textAnchor="middle" className="fill-current text-base font-bold">
          Usuarios
        </text>
        <text x="730" y="35" textAnchor="middle" className="fill-current text-base font-bold">
          Libros
        </text>

        {edges.map((edge) => {
          const source = positions.get(edge.origen)
          const target = positions.get(edge.destino)
          if (!source || !target) return null
          const selected = selection?.kind === "edge" &&
            selection.source === edge.origen && selection.target === edge.destino
          const edgeSelection: GraphSelection = {
            kind: "edge",
            source: edge.origen,
            target: edge.destino,
          }
          return (
            <g
              key={`${edge.origen}-${edge.destino}`}
              role="button"
              tabIndex={0}
              aria-label={`Relacion ${edge.origen} hacia ${edge.destino}, peso ${edge.peso}`}
              onClick={() => onSelect(edgeSelection)}
              onKeyDown={(event) => selectWithKeyboard(event, edgeSelection)}
              className="cursor-pointer"
            >
              <line
                x1={source.x + 66}
                y1={source.y}
                x2={target.x - 72}
                y2={target.y}
                markerEnd="url(#graph-arrow)"
                className={selected ? "stroke-violet-500" : "stroke-slate-400"}
                strokeWidth={selected ? 4 : 2}
              />
              <line
                x1={source.x + 66}
                y1={source.y}
                x2={target.x - 72}
                y2={target.y}
                stroke="transparent"
                strokeWidth="18"
              />
              <text
                x={(source.x + target.x) / 2}
                y={(source.y + target.y) / 2 - 8}
                textAnchor="middle"
                className="fill-current text-xs font-semibold"
              >
                peso {edge.peso}
              </text>
            </g>
          )
        })}

        {[...users, ...books].map((vertex) => {
          const position = positions.get(vertex.clave)
          if (!position) return null
          const selected = selection?.kind === "vertex" && selection.key === vertex.clave
          const visitPosition = traversalIndex.get(vertex.clave)
          const vertexSelection: GraphSelection = { kind: "vertex", key: vertex.clave }
          return (
            <g
              key={vertex.clave}
              role="button"
              tabIndex={0}
              aria-label={`${vertex.tipo} ${graphVertexLabel(vertex)}`}
              onClick={() => onSelect(vertexSelection)}
              onKeyDown={(event) => selectWithKeyboard(event, vertexSelection)}
              className="cursor-pointer"
              transform={`translate(${position.x}, ${position.y})`}
            >
              <rect
                x="-65"
                y="-31"
                width="130"
                height="62"
                rx="12"
                className={
                  selected
                    ? "fill-violet-600 stroke-violet-300"
                    : visitPosition
                      ? "fill-amber-500 stroke-amber-200"
                      : vertex.tipo === "usuario"
                        ? "fill-sky-600 stroke-sky-300"
                        : "fill-emerald-600 stroke-emerald-300"
                }
                strokeWidth="3"
              />
              <text y="-4" textAnchor="middle" className="fill-white text-xs font-bold">
                {graphVertexLabel(vertex).slice(0, 22)}
              </text>
              <text y="15" textAnchor="middle" className="fill-white text-[10px]">
                {vertex.clave}
              </text>
              {visitPosition && (
                <g transform="translate(55,-27)">
                  <circle r="13" className="fill-slate-950 stroke-white" />
                  <text y="4" textAnchor="middle" className="fill-white text-[10px] font-bold">
                    {visitPosition}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
