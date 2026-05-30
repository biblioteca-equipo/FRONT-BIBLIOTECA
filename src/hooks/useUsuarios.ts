import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Usuario } from "@/lib/types"

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)

  async function listarUsuarios() {
    setLoading(true)
    try {
      const response = await api.get<Usuario[]>("/usuarios")
      setUsuarios(response.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    listarUsuarios()
  }, [])

  return { usuarios, loading, listarUsuarios }
}
