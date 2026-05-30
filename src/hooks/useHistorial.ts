import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { EstructuraResponse, HistorialItem } from "@/lib/types"

export function useHistorial() {
  const [historial, setHistorial] = useState<EstructuraResponse<HistorialItem> | null>(null)
  const [ultimaAccion, setUltimaAccion] = useState<HistorialItem | null>(null)
  const [loading, setLoading] = useState(false)

  async function listarHistorial() {
    setLoading(true)
    try {
      const response = await api.get<EstructuraResponse<HistorialItem>>("/historial/pila")
      setHistorial(response.data)
    } finally {
      setLoading(false)
    }
  }

  async function obtenerUltimaAccion() {
    const response = await api.get<HistorialItem>("/historial/ultima-accion")
    setUltimaAccion(response.data)
  }

  useEffect(() => {
    listarHistorial()
    obtenerUltimaAccion()
  }, [])

  return { historial, ultimaAccion, loading, listarHistorial, obtenerUltimaAccion }
}
