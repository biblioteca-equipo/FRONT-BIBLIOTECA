import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const items = [
  { title: "Usuarios", path: "/usuarios", description: "Listado de usuarios registrados" },
  { title: "Autores", path: "/autores", description: "Crear y listar autores" },
  { title: "Categorías", path: "/categorias", description: "Crear y listar categorías" },
  { title: "Libros", path: "/libros", description: "Crear, buscar y listar libros" },
  { title: "Ejemplares", path: "/ejemplares", description: "Crear ejemplares por libro" },
  { title: "Préstamos", path: "/prestamos", description: "Crear y devolver préstamos" },
  { title: "Reservas", path: "/reservas", description: "Crear y atender reservas FIFO" },
  { title: "Historial", path: "/historial", description: "Ver historial como pila LIFO" },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Biblioteca</h1>
        <p className="text-muted-foreground">
          Panel principal del sistema de gestión de biblioteca.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link key={item.path} to={item.path}>
            <Card className="h-full transition hover:bg-muted">
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
