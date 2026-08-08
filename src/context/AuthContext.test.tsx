import { useState } from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { AuthProvider, useAuth } from "@/context/AuthContext"
import { adminUser } from "@/test/render"
import { apiMock } from "@/test/apiMock"


function AuthProbe() {
  const auth = useAuth()
  const [error, setError] = useState("")

  return (
    <div>
      <span>{auth.loading ? "cargando" : "listo"}</span>
      <span>{auth.user?.email ?? "sin usuario"}</span>
      <button
        onClick={() => {
          auth.login({ email: "admin@example.com", password: "Secret123!" }).catch(() => {
            setError("fallo")
          })
        }}
      >
        iniciar
      </button>
      <span>{error}</span>
    </div>
  )
}

describe("AuthProvider", () => {
  it("carga el usuario actual cuando existe un token", async () => {
    localStorage.setItem("token", "persisted-token")
    apiMock.onGet("/auth/me").reply(200, adminUser)

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    expect(await screen.findByText(adminUser.email)).toBeInTheDocument()
    expect(screen.getByText("listo")).toBeInTheDocument()
    expect(apiMock.history.get[0].headers?.Authorization).toBe(
      "Bearer persisted-token",
    )
  })

  it("inicia sesion y consulta la identidad con el cliente API simulado", async () => {
    const user = userEvent.setup()
    apiMock.onPost("/auth/login-json").reply(200, {
      access_token: "new-token",
      token_type: "bearer",
    })
    apiMock.onGet("/auth/me").reply(200, adminUser)

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>,
    )

    await waitFor(() => expect(screen.getByText("listo")).toBeInTheDocument())
    await user.click(screen.getByRole("button", { name: "iniciar" }))

    expect(await screen.findByText(adminUser.email)).toBeInTheDocument()
    expect(localStorage.getItem("token")).toBe("new-token")
  })
})
