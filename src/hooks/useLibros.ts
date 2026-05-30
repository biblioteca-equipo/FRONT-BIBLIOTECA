import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { EjemplarCreate, Libro, LibroCreate } from "@/lib/types"

export function useLibros() {
  const [libros, setLibros] = useState<Libro[]>([])
  const [catalogo, setCatalogo] = useState<unknown[]>([])
  const [loading, setLoading] = useState(false)

  async function listarLibros() {
    setLoading(true)
    try {
      const response = await api.get<Libro[]>("/libros")
      setLibros(response.data)
    } finally {
      setLoading(false)
    }
  }

  async function listarCatalogo() {
    const response = await api.get<unknown[]>("/libros/catalogo/lista")
    setCatalogo(response.data)
  }

  async function buscarLibros(titulo: string) {
    const response = await api.get<Libro[]>("/libros/buscar", {
      params: { titulo },
    })
    setLibros(response.data)
  }

  async function crearLibro(data: LibroCreate) {
    await api.post("/libros", data)
    await listarLibros()
  }

  async function crearEjemplar(data: EjemplarCreate) {
    await api.post("/libros/ejemplares", data)
  }

  useEffect(() => {
    listarLibros()
    listarCatalogo()
  }, [])

  return {
    libros,
    catalogo,
    loading,
    listarLibros,
    listarCatalogo,
    buscarLibros,
    crearLibro,
    crearEjemplar,
  }
}
