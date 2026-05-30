export function CopyrightFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-background px-4 py-3 text-center text-xs text-muted-foreground">
      © {year} Sistema de Gestión de Biblioteca. Todos los derechos reservados.
      <br />
      Desarrollado por Juan Esteban Cajio, Angel Eduardo Medina y Jader Montoya.
    </footer>
  )
}
