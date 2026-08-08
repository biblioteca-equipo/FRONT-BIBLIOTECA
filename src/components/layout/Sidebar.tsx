// ============================
// Imports
// ============================
import { NavLink } from "react-router-dom"
import {
  BookOpen,
  Users,
  Tags,
  UserRound,
  ClipboardList,
  CalendarClock,
  History,
  Home,
  Network,
  GitBranch,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

// ============================
// Sidebar Menu
// ============================
// Opciones principales del menú lateral.
// Se agrega la vista "Árboles de libros" para visualizar
// las estructuras no lineales del proyecto.
const STAFF_ROLES = ["ADMIN", "BIBLIOTECARIO"]

const menu = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Usuarios", href: "/usuarios", icon: Users, roles: STAFF_ROLES },
  { title: "Autores", href: "/autores", icon: UserRound, roles: STAFF_ROLES },
  { title: "Categorías", href: "/categorias", icon: Tags, roles: STAFF_ROLES },
  { title: "Libros", href: "/libros", icon: BookOpen, roles: STAFF_ROLES },
  { title: "Árboles de libros", href: "/libros/arboles", icon: Network, roles: STAFF_ROLES },
  { title: "Interacciones", href: "/interacciones", icon: GitBranch, roles: STAFF_ROLES },
  { title: "Ejemplares", href: "/ejemplares", icon: ClipboardList, roles: STAFF_ROLES },
  { title: "Préstamos", href: "/prestamos", icon: CalendarClock, roles: STAFF_ROLES },
  { title: "Reservas", href: "/reservas", icon: ClipboardList, roles: STAFF_ROLES },
  { title: "Historial", href: "/historial", icon: History, roles: STAFF_ROLES },
]

// ============================
// Sidebar Props
// ============================
// Permite usar el sidebar en versión normal o móvil.
// ============================
interface SidebarProps {
  mobile?: boolean
}

// ============================
// Sidebar Component
// ============================
// Renderiza el menú lateral de navegación.
// ============================
export function Sidebar({ mobile = false }: SidebarProps) {
  const { user } = useAuth()
  const role = user?.rol.toUpperCase()
  const visibleItems = menu.filter(
    (item) => !item.roles || (role && item.roles.includes(role)),
  )

  return (
    <aside
      className={`h-screen w-64 shrink-0 overflow-y-auto border-r bg-background p-4 ${
        mobile ? "block" : "hidden md:block"
      }`}
    >
      <h1 className="mb-6 text-xl font-bold">Biblioteca</h1>

      <nav className="space-y-1 pb-6">
        {visibleItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/" || item.href === "/libros"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
