import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Categoria, CategoriaCreate } from "@/lib/types"

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)

  async function listarCategorias() {
    setLoading(true)
    try {
      const response = await api.get<Categoria[]>("/categorias")
      setCategorias(response.data)
    } finally {
      setLoading(false)
    }
  }

  async function crearCategoria(data: CategoriaCreate) {
    await api.post("/categorias", data)
    await listarCategorias()
  }

  useEffect(() => {
    listarCategorias()
  }, [])

  return { categorias, loading, listarCategorias, crearCategoria }
}
