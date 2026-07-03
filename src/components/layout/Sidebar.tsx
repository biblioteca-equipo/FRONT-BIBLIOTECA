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
} from "lucide-react"

// ============================
// Sidebar Menu
// ============================
// Opciones principales del menú lateral.
// Se agrega la vista "Árboles de libros" para visualizar
// las estructuras no lineales del proyecto.
const menu = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Usuarios", href: "/usuarios", icon: Users },
  { title: "Autores", href: "/autores", icon: UserRound },
  { title: "Categorías", href: "/categorias", icon: Tags },
  { title: "Libros", href: "/libros", icon: BookOpen },
  { title: "Árboles de libros", href: "/libros/arboles", icon: Network },
  { title: "Ejemplares", href: "/ejemplares", icon: ClipboardList },
  { title: "Préstamos", href: "/prestamos", icon: CalendarClock },
  { title: "Reservas", href: "/reservas", icon: ClipboardList },
  { title: "Historial", href: "/historial", icon: History },
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
  return (
    <aside
      className={`h-screen w-64 shrink-0 overflow-y-auto border-r bg-background p-4 ${
        mobile ? "block" : "hidden md:block"
      }`}
    >
      <h1 className="mb-6 text-xl font-bold">Biblioteca</h1>

      <nav className="space-y-1 pb-6">
        {menu.map((item) => {
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
