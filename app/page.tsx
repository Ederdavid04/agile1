import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Clock, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navegación */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-primary">Agile PM</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
            Características
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
            Testimonios
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
            Precios
          </Link>
        </nav>
        <div className="ml-4">
          <Link href="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Gestión Ágil de Proyectos
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Simplifica la gestión de tus proyectos con nuestra plataforma ágil. Organiza tareas, colabora con tu
                  equipo y entrega resultados de calidad.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/login">
                  <Button size="lg" className="gap-1">
                    Comenzar ahora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Conoce más
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Dashboard Preview"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center border shadow-xl"
                height="310"
                src="/placeholder.svg?height=620&width=1100"
                width="550"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Características
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Todo lo que necesitas para gestionar tus proyectos
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nuestra plataforma ofrece todas las herramientas necesarias para implementar metodologías ágiles en tu
                equipo y mejorar la productividad.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Tableros Kanban</h3>
                <p className="text-muted-foreground">
                  Visualiza el flujo de trabajo con tableros personalizables que se adaptan a tu metodología.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Colaboración en Equipo</h3>
                <p className="text-muted-foreground">
                  Trabaja de forma colaborativa con tu equipo, asigna tareas y realiza seguimiento en tiempo real.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Seguimiento de Tiempo</h3>
                <p className="text-muted-foreground">
                  Controla el tiempo dedicado a cada tarea y optimiza la planificación de tus sprints.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Testimonios
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Lo que dicen nuestros clientes</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre cómo nuestra plataforma ha ayudado a equipos de todo el mundo a mejorar su productividad.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  "Desde que implementamos Agile PM, hemos reducido nuestro tiempo de entrega en un 30% y mejorado la
                  satisfacción del cliente."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-muted">
                    <img
                      alt="Avatar"
                      className="rounded-full"
                      height="40"
                      src="/placeholder.svg?height=40&width=40"
                      style={{
                        aspectRatio: "40/40",
                        objectFit: "cover",
                      }}
                      width="40"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">María González</p>
                    <p className="text-xs text-muted-foreground">CTO, TechSolutions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  "La visibilidad que nos da Agile PM sobre nuestros proyectos ha sido clave para identificar cuellos de
                  botella y mejorar nuestros procesos."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-muted">
                    <img
                      alt="Avatar"
                      className="rounded-full"
                      height="40"
                      src="/placeholder.svg?height=40&width=40"
                      style={{
                        aspectRatio: "40/40",
                        objectFit: "cover",
                      }}
                      width="40"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Carlos Rodríguez</p>
                    <p className="text-xs text-muted-foreground">Product Manager, InnovateCorp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Precios */}
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Precios
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Planes simples y transparentes</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Elige el plan que mejor se adapte a las necesidades de tu equipo.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-8">
            <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Básico</h3>
                <div className="text-3xl font-bold">$9.99</div>
                <p className="text-sm text-muted-foreground">Por usuario / mes</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Tableros Kanban</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Hasta 5 proyectos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Soporte por email</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Button className="w-full">Comenzar gratis</Button>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border border-primary p-6 shadow-sm">
              <div className="space-y-4">
                <div className="inline-block rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                  Popular
                </div>
                <h3 className="text-xl font-bold">Profesional</h3>
                <div className="text-3xl font-bold">$19.99</div>
                <p className="text-sm text-muted-foreground">Por usuario / mes</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Todo lo del plan Básico</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Proyectos ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Reportes avanzados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Soporte prioritario</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Button className="w-full">Comenzar prueba gratuita</Button>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border p-6 shadow-sm">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Empresarial</h3>
                <div className="text-3xl font-bold">$49.99</div>
                <p className="text-sm text-muted-foreground">Por usuario / mes</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Todo lo del plan Profesional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Integraciones avanzadas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Seguridad empresarial</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Soporte 24/7</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Button className="w-full" variant="outline">
                  Contactar ventas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Comienza a gestionar tus proyectos hoy mismo
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Únete a miles de equipos que ya han mejorado su productividad con Agile PM.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="gap-1">
                  Comenzar ahora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  Conoce más
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 md:py-12 bg-background border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <span className="text-primary">Agile PM</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Simplifica la gestión de tus proyectos con nuestra plataforma ágil.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Twitter
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  LinkedIn
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  GitHub
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Producto</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Características
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Precios
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Testimonios
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Empresa</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Acerca de
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Contacto
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Términos
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Privacidad
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Agile PM. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

