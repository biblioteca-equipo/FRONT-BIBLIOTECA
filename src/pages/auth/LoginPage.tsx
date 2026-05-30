import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError("")

    try {
      await login({ email, password })
      navigate("/")
    } catch {
      setError("Credenciales incorrectas o error en el login")
    }
  }

  return (
    <AuthLayout title="Iniciar sesión" subtitle="Ingresa tus credenciales para acceder">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-md bg-red-500/15 p-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-900 dark:text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="bg-slate-100 text-slate-950 placeholder:text-slate-500 dark:bg-white/90 dark:text-slate-950"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-900 dark:text-white">
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="bg-slate-100 text-slate-950 placeholder:text-slate-500 dark:bg-white/90 dark:text-slate-950"
            required
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full bg-violet-700 text-white hover:bg-violet-800 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Entrar
        </Button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-violet-700 underline dark:text-white">
            Regístrate
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
