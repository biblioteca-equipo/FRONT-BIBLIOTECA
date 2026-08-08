import { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"

import { api } from "@/lib/api"
import {
  neighborsToSnapshot,
  normalizeGraphSnapshot,
} from "@/lib/interactionGraph"
import type {
  GraphNeighborsResponse,
  GraphSnapshot,
  GraphTraversalResponse,
} from "@/lib/types"


interface GraphRequestError {
  message: string
  status: number | null
}

function requestError(error: unknown): GraphRequestError {
  if (!axios.isAxiosError(error)) {
    return { message: "Ocurrió un error inesperado al consultar el grafo.", status: null }
  }
  if (error.response?.status === 403) {
    return { message: "No tienes permisos para consultar el grafo.", status: 403 }
  }
  if (error.response?.status === 404) {
    return {
      message: String(error.response.data?.detail ?? "El recurso solicitado no existe."),
      status: 404,
    }
  }
  return {
    message: "No fue posible conectar con la API. Revisa el servicio e inténtalo de nuevo.",
    status: error.response?.status ?? null,
  }
}

export function useInteractionGraph() {
  const [snapshot, setSnapshot] = useState<GraphSnapshot | null>(null)
  const [traversal, setTraversal] = useState<GraphTraversalResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<GraphRequestError | null>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const retryRef = useRef<(() => Promise<void>) | null>(null)

  const execute = useCallback(async <T,>(
    request: (signal: AbortSignal) => Promise<T>,
    onSuccess: (result: T) => void,
  ) => {
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setLoading(true)
    setError(null)

    try {
      const result = await request(controller.signal)
      if (!controller.signal.aborted) onSuccess(result)
    } catch (requestFailure) {
      if (!axios.isCancel(requestFailure) && !controller.signal.aborted) {
        setError(requestError(requestFailure))
      }
    } finally {
      if (controllerRef.current === controller) setLoading(false)
    }
  }, [])

  const loadSnapshot = useCallback((path: string, params?: Record<string, number>) => {
    const action = () => execute(
      async (signal) => {
        const response = await api.get<GraphSnapshot>(path, { params, signal })
        return response.data
      },
      (data) => {
        setSnapshot(normalizeGraphSnapshot(data))
        setTraversal(null)
      },
    )
    retryRef.current = action
    return action()
  }, [execute])

  const loadNeighbors = useCallback((path: string) => {
    const action = () => execute(
      async (signal) => {
        const response = await api.get<GraphNeighborsResponse>(path, { signal })
        return response.data
      },
      (data) => {
        setSnapshot(neighborsToSnapshot(data))
        setTraversal(null)
      },
    )
    retryRef.current = action
    return action()
  }, [execute])

  const loadGlobal = useCallback(
    (maxNodes = 200) => loadSnapshot("/grafos/interacciones", { max_nodos: maxNodes }),
    [loadSnapshot],
  )
  const loadUser = useCallback(
    (userId: number) => loadSnapshot(`/grafos/interacciones/usuarios/${userId}`),
    [loadSnapshot],
  )
  const loadUserNeighbors = useCallback(
    (userId: number) => loadNeighbors(`/grafos/interacciones/usuarios/${userId}/libros`),
    [loadNeighbors],
  )
  const loadBookPredecessors = useCallback(
    (bookId: number) => loadNeighbors(`/grafos/interacciones/libros/${bookId}/usuarios`),
    [loadNeighbors],
  )

  const runTraversal = useCallback((algorithm: "bfs" | "dfs", start: string) => {
    const action = () => execute(
      async (signal) => {
        const response = await api.get<GraphTraversalResponse>(
          "/grafos/interacciones/recorridos",
          { params: { algoritmo: algorithm, inicio: start }, signal },
        )
        return response.data
      },
      setTraversal,
    )
    retryRef.current = action
    return action()
  }, [execute])

  const retry = useCallback(
    () => retryRef.current?.() ?? Promise.resolve(),
    [],
  )

  useEffect(() => () => controllerRef.current?.abort(), [])

  return {
    snapshot,
    traversal,
    loading,
    error,
    loadGlobal,
    loadUser,
    loadUserNeighbors,
    loadBookPredecessors,
    runTraversal,
    clearTraversal: () => setTraversal(null),
    retry,
  }
}
