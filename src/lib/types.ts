export interface Usuario {
  id: number
  nombre: string
  apellido: string
  documento: string
  email: string
  rol: string
  telefono: string | null
  estado: string
  last_login: string | null
}

export interface UsuarioCreate {
  nombre: string
  apellido: string
  documento: string
  email: string
  password: string
  telefono?: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface Autor {
  id: number
  nombre: string
  nacionalidad: string | null
  created_at: string
}

export interface AutorCreate {
  nombre: string
  nacionalidad?: string | null
}

export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  created_at: string
}

export interface CategoriaCreate {
  nombre: string
  descripcion?: string | null
}

export interface Libro {
  id: number
  autor_id: number
  categoria_id: number
  titulo: string
  isbn: string | null
  anio_publicacion: number | null
  estado: string
}

export interface LibroCreate {
  autor_id: number
  categoria_id: number
  titulo: string
  isbn?: string | null
  anio_publicacion?: number | null
}

export interface Ejemplar {
  id: number
  libro_id: number
  codigo_interno: string
  estado: string
}

export interface EjemplarCreate {
  libro_id: number
  codigo_interno: string
}

export interface Prestamo {
  id: number
  usuario_id: number
  ejemplar_id: number
  fecha_prestamo: string
  fecha_limite: string
  fecha_devolucion: string | null
  estado: string
}

export interface PrestamoCreate {
  usuario_id: number
  ejemplar_id: number
}

export interface Reserva {
  id: number
  usuario_id: number
  libro_id: number
  estado: string
  fecha_reserva: string
  fecha_atencion: string | null
}

export interface ReservaCreate {
  libro_id: number
}

export interface HistorialItem {
  id: number
  tipo_accion: string
  entidad: string
  entidad_id: number
  descripcion: string
  created_at: string
}

export interface EstructuraResponse<T> {
  estructura: string
  descripcion: string
  total: number
  datos: T[]
}

export interface CatalogoLibro {
  id: number
  titulo: string
  isbn: string | null
  estado: string
}

export interface CatalogoListaResponse {
  estructura: string
  descripcion: string
  total: number
  datos: CatalogoLibro[]
}

export interface GraphUserVertex {
  clave: string
  tipo: "usuario"
  id: number
  etiqueta: string
  estado: string
}

export interface GraphBookVertex {
  clave: string
  tipo: "libro"
  id: number
  titulo: string
  isbn: string | null
  estado: string
}

export type GraphVertex = GraphUserVertex | GraphBookVertex

export interface GraphEdge {
  origen: string
  destino: string
  peso: number
  prestamos_total: number
  prestamos_activos: number
  prestamos_devueltos: number
  prestamos_vencidos: number
  devoluciones_total: number
  reservas_total: number
  reservas_pendientes: number
  reservas_atendidas: number
  reservas_canceladas: number
  ultima_interaccion: string | null
}

export interface GraphMetadata {
  dirigido: true
  ponderado: true
  bipartito: true
  total_vertices: number
  total_aristas: number
  peso_total: number
  tiempo_construccion_ms: number
  regla_peso: "prestamos_total + reservas_total"
  filtros: Record<string, string | number | boolean | null>
  truncado: boolean
}

export interface GraphSnapshot {
  metadatos: GraphMetadata
  vertices: GraphVertex[]
  aristas: GraphEdge[]
}

export interface GraphNeighborsResponse {
  metadatos: GraphMetadata
  vertice: GraphVertex
  vecinos: GraphVertex[]
  aristas: GraphEdge[]
}

export interface GraphTraversalResponse {
  algoritmo: "bfs" | "dfs"
  inicio: string
  orden: string[]
  total_visitados: number
}

export interface GraphFilters {
  usuario: string
  libro: string
  interaccion: "todas" | "prestamos" | "devoluciones" | "reservas"
  estado:
    | "todos"
    | "prestamo_activo"
    | "prestamo_devuelto"
    | "prestamo_vencido"
    | "reserva_pendiente"
    | "reserva_atendida"
    | "reserva_cancelada"
}

export type GraphSelection =
  | { kind: "vertex"; key: string }
  | { kind: "edge"; source: string; target: string }
