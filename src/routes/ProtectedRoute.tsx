// src/routes/ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, user, loading } = useAuth()

  if (loading) {
    return <div className="p-6">Cargando...</div>
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const normalizedRole = user?.rol.toUpperCase()
  if (allowedRoles && (!normalizedRole || !allowedRoles.includes(normalizedRole))) {
    return (
      <div role="alert" className="p-6 text-sm text-red-600 dark:text-red-300">
        No tienes permisos para acceder a esta sección.
      </div>
    )
  }

  return <Outlet />
}
