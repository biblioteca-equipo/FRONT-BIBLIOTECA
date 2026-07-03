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
  rol?: string
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
