import type { ReactElement } from "react"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

import {
  AuthContext,
  type AuthContextType,
} from "@/context/AuthContext"
import type { Usuario } from "@/lib/types"


export const adminUser: Usuario = {
  id: 1,
  nombre: "Admin",
  apellido: "Pruebas",
  documento: "TEST-ADMIN",
  email: "admin@example.com",
  rol: "ADMIN",
  telefono: null,
  estado: "ACTIVO",
  last_login: null,
}

export function buildAuthContext(
  overrides: Partial<AuthContextType> = {},
): AuthContextType {
  return {
    token: "test-token",
    user: adminUser,
    loading: false,
    login: async () => undefined,
    register: async () => undefined,
    logout: () => undefined,
    ...overrides,
  }
}

interface RenderWithAuthOptions {
  route?: string
  auth?: Partial<AuthContextType>
}

export function renderWithAuth(
  ui: ReactElement,
  { route = "/", auth = {} }: RenderWithAuthOptions = {},
) {
  const authValue = buildAuthContext(auth)
  return {
    authValue,
    ...render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AuthContext.Provider>,
    ),
  }
}
