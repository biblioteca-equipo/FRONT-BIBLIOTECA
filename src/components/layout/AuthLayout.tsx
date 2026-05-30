import type { ReactNode } from "react"
import { BookOpen } from "lucide-react"
import { ModeToggle } from "@/components/theme/mode-toggle"
import { CopyrightFooter } from "@/components/layout/CopyrightFooter"

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="relative flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ddd6fe,_transparent_35%),radial-gradient(circle_at_bottom_right,_#bae6fd,_transparent_30%)] opacity-80 dark:bg-[radial-gradient(circle_at_top_left,_#4c1d95,_transparent_35%),radial-gradient(circle_at_bottom_right,_#0e7490,_transparent_30%)] dark:opacity-70" />

      <div className="absolute right-4 top-4 z-20">
        <ModeToggle />
      </div>

      <section className="relative z-10 flex flex-1 items-center justify-center overflow-hidden px-4 py-6">
        <div className="grid h-[calc(100vh-120px)] w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 md:grid-cols-2">
          <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-violet-950 via-purple-700 to-fuchsia-500 p-8 text-center text-white md:flex">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -right-12 top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute bottom-0 left-0 h-44 w-full bg-gradient-to-t from-pink-300/30 to-transparent" />

            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-center gap-3">
                <BookOpen className="h-10 w-10" />

                <div className="text-left">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                    Sistema
                  </p>
                  <h1 className="text-2xl font-black tracking-wide">
                    Biblioteca
                  </h1>
                </div>
              </div>

              <div>
                <h2 className="text-4xl font-black uppercase tracking-wide">
                  Bienvenidos
                </h2>
                <p className="mt-4 text-base text-white/90">
                  Acceso seguro al sistema de gestión de biblioteca.
                </p>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 items-center justify-center bg-white p-5 text-slate-950 dark:bg-slate-950 dark:text-white md:p-8">
            <div className="w-full max-w-md">
              <div className="mb-5 text-center">
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {subtitle}
                </p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 shrink-0">
        <CopyrightFooter />
      </div>
    </main>
  )
}
