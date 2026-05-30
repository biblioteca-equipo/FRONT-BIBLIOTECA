import { CopyrightFooter } from "@/components/layout/CopyrightFooter"
import { Outlet } from "react-router-dom"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { ModeToggle } from "@/components/theme/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/AuthContext"

export function AppLayout() {
  const { logout } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />

      <main className="flex h-screen flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="p-0">
                <Sidebar mobile />
              </SheetContent>
            </Sheet>

            <h2 className="font-semibold">Sistema de Gestión de Biblioteca</h2>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" onClick={logout}>
              Salir
            </Button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </section>

        <CopyrightFooter />
      </main>
    </div>
  )
}
