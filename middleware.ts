import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const { pathname } = request.nextUrl

  // Verificar si la ruta comienza con /dashboard
  if (pathname.startsWith("/dashboard")) {
    // Verificar si hay un token en las cookies (simulando autenticación)
    const authToken = request.cookies.get("auth_token")?.value

    // Si no hay token, redirigir al login
    if (!authToken) {
      const loginUrl = new URL("/login", request.url)
      // Guardar la URL original para redirigir después del login
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Si el usuario ya está autenticado y trata de acceder a login, redirigirlo al dashboard
  if (pathname === "/login") {
    const authToken = request.cookies.get("auth_token")?.value
    if (authToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}

