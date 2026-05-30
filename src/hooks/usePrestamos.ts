import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Prestamo, PrestamoCreate } from "@/lib/types"

export function usePrestamos() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [loading, setLoading] = useState(false)

  async function listarPrestamos() {
    setLoading(true)
    try {
      const response = await api.get<Prestamo[]>("/prestamos")
      setPrestamos(response.data)
    } finally {
      setLoading(false)
    }
  }

  async function crearPrestamo(data: PrestamoCreate) {
    await api.post("/prestamos", data)
    await listarPrestamos()
  }

  async function devolverPrestamo(prestamoId: number) {
    await api.put(`/prestamos/${prestamoId}/devolver`)
    await listarPrestamos()
  }

  useEffect(() => {
    listarPrestamos()
  }, [])

  return { prestamos, loading, listarPrestamos, crearPrestamo, devolverPrestamo }
}
