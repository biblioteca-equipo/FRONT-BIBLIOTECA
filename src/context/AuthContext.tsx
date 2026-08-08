import { createContext, useContext, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { LoginRequest, TokenResponse, Usuario, UsuarioCreate } from "@/lib/types"

export interface AuthContextType {
  token: string | null
  user: Usuario | null
  loading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: UsuarioCreate) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadUser() {
    try {
      const currentToken = localStorage.getItem("token")

      if (!currentToken) {
        setLoading(false)
        return
      }

      const response = await api.get<Usuario>("/auth/me")
      setUser(response.data)
    } catch {
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(data: LoginRequest) {
    const response = await api.post<TokenResponse>("/auth/login-json", data)

    localStorage.setItem("token", response.data.access_token)
    setToken(response.data.access_token)

    await loadUser()
  }

  async function register(data: UsuarioCreate) {
    await api.post("/auth/register", data)
  }

  function logout() {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    window.location.href = "/login"
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider")
  }

  return context
}
