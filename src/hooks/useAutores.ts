import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Autor, AutorCreate } from "@/lib/types"

export function useAutores() {
  const [autores, setAutores] = useState<Autor[]>([])
  const [loading, setLoading] = useState(false)

  async function listarAutores() {
    setLoading(true)
    try {
      const response = await api.get<Autor[]>("/autores")
      setAutores(response.data)
    } finally {
      setLoading(false)
    }
  }

  async function crearAutor(data: AutorCreate) {
    await api.post("/autores", data)
    await listarAutores()
  }

  useEffect(() => {
    listarAutores()
  }, [])

  return { autores, loading, listarAutores, crearAutor }
}
