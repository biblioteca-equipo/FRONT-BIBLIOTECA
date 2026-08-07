import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { AuthLayout } from "@/components/layout/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    email: "",
    password: "",
    telefono: "",
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError("")
    setSuccess("")

    try {
      await register({
        nombre: form.nombre,
        apellido: form.apellido,
        documento: form.documento,
        email: form.email,
        password: form.password,
        telefono: form.telefono || null,
      })

      setSuccess("Usuario registrado correctamente")

      setTimeout(() => {
        navigate("/login")
      }, 1000)
    } catch {
      setError("No se pudo registrar el usuario. Verifica los datos.")
    }
  }

  return (
    <AuthLayout title="Registro de usuario" subtitle="Crea una cuenta para acceder al sistema">
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        {error && (
          <p className="rounded-md bg-red-500/15 p-3 text-sm text-red-600 dark:text-red-300 md:col-span-2">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-md bg-green-500/15 p-3 text-sm text-green-700 dark:text-green-300 md:col-span-2">
            {success}
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-slate-900 dark:text-white">
            Nombre
          </Label>
          <Input
            id="nombre"
            value={form.nombre}
            onChange={(event) => setForm({ ...form, nombre: event.target.value })}
            className="bg-slate-100 text-slate-950 dark:bg-white/90"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido" className="text-slate-900 dark:text-white">
            Apellido
          </Label>
          <Input
            id="apellido"
            value={form.apellido}
            onChange={(event) => setForm({ ...form, apellido: event.target.value })}
            className="bg-slate-100 text-slate-950 dark:bg-white/90"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="documento" className="text-slate-900 dark:text-white">
            Documento
          </Label>
          <Input
            id="documento"
            value={form.documento}
            onChange={(event) => setForm({ ...form, documento: event.target.value })}
            className="bg-slate-100 text-slate-950 dark:bg-white/90"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono" className="text-slate-900 dark:text-white">
            Teléfono
          </Label>
          <Input
            id="telefono"
            value={form.telefono}
            onChange={(event) => setForm({ ...form, telefono: event.target.value })}
            className="bg-slate-100 text-slate-950 dark:bg-white/90"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-900 dark:text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="bg-slate-100 text-slate-950 dark:bg-white/90"
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
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="bg-slate-100 text-slate-950 dark:bg-white/90"
            required
          />
        </div>

        <Button
          type="submit"
          className="h-10 bg-violet-700 text-white hover:bg-violet-800 dark:bg-blue-600 dark:hover:bg-blue-700 md:col-span-2"
        >
          Registrarse
        </Button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-300 md:col-span-2">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-violet-700 underline dark:text-white">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
