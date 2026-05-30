import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { EstructuraResponse, Reserva, ReservaCreate } from "@/lib/types"

export function useReservas() {
  const [cola, setCola] = useState<EstructuraResponse<Reserva> | null>(null)
  const [loading, setLoading] = useState(false)

  async function listarColaReservas() {
    setLoading(true)
    try {
      const response = await api.get<EstructuraResponse<Reserva>>("/reservas/cola")
      setCola(response.data)
    } finally {
      setLoading(false)
    }
  }

  async function crearReserva(data: ReservaCreate) {
    await api.post("/reservas", data)
    await listarColaReservas()
  }

  async function atenderSiguienteReserva() {
    await api.put("/reservas/atender-siguiente")
    await listarColaReservas()
  }

  useEffect(() => {
    listarColaReservas()
  }, [])

  return { cola, loading, listarColaReservas, crearReserva, atenderSiguienteReserva }
}
