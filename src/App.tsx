// ============================
// Imports
// ============================
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { AppLayout } from "@/components/layout/AppLayout"

import { LoginPage } from "@/pages/auth/LoginPage"
import { RegisterPage } from "@/pages/auth/RegisterPage"

import { DashboardPage } from "@/pages/dashboard/DashboardPage"
import { UsuariosPage } from "@/pages/usuarios/UsuariosPage"
import { AutoresPage } from "@/pages/autores/AutoresPage"
import { CategoriasPage } from "@/pages/categorias/CategoriasPage"
import { LibrosPage } from "@/pages/libros/LibrosPage"
import { ArbolesLibrosPage } from "@/pages/libros/ArbolesLibrosPage"
import { InteraccionesUsuariosPage } from "@/pages/interacciones/InteraccionesUsuariosPage"
import { EjemplaresPage } from "@/pages/libros/EjemplaresPage"
import { PrestamosPage } from "@/pages/prestamos/PrestamosPage"
import { ReservasPage } from "@/pages/reservas/ReservasPage"
import { HistorialPage } from "@/pages/historial/HistorialPage"

// ============================
// App
// ============================
// Configuración principal de rutas de la aplicación.
// Se protegen las rutas internas mediante ProtectedRoute.
// ============================
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============================
            Public Routes
            ============================ */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* ============================
            Protected Routes
            ============================ */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/autores" element={<AutoresPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />

            {/* ============================
                Books Routes
                ============================ */}
            <Route path="/libros" element={<LibrosPage />} />
            <Route path="/libros/arboles" element={<ArbolesLibrosPage />} />
            <Route path="/interacciones" element={<InteraccionesUsuariosPage />} />
            <Route path="/ejemplares" element={<EjemplaresPage />} />

            <Route path="/prestamos" element={<PrestamosPage />} />
            <Route path="/reservas" element={<ReservasPage />} />
            <Route path="/historial" element={<HistorialPage />} />
          </Route>
        </Route>

        {/* ============================
            Fallback Route
            ============================ */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
