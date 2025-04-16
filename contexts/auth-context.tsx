"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

// Definir el tipo de usuario
type User = {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string
}

// Definir el tipo del contexto de autenticación
type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Efecto para cargar el usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      // Asegurarse de que la cookie de autenticación esté presente
      Cookies.set("auth_token", "authenticated", { expires: 7 })
    }
    setIsLoading(false)
  }, [])

  // Modificar la función de login para usar las credenciales correctas
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulación de una llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Usuarios de prueba con las credenciales correctas
      const users: Record<string, User> = {
        "admin@ejemplo.com": {
          id: "1",
          name: "Admin User",
          email: "admin@ejemplo.com",
          role: "admin",
          avatar: "/placeholder-user.jpg",
        },
        "miembro@ejemplo.com": {
          id: "2",
          name: "Regular User",
          email: "miembro@ejemplo.com",
          role: "user",
          avatar: "/placeholder-user.jpg",
        },
      }

      // Verificar credenciales con las contraseñas correctas
      if (email === "admin@ejemplo.com" && password === "Password1!") {
        const loggedUser = users[email]
        setUser(loggedUser)
        localStorage.setItem("user", JSON.stringify(loggedUser))
        // Establecer cookie de autenticación
        Cookies.set("auth_token", "authenticated", { expires: 7 })
        return true
      } else if (email === "miembro@ejemplo.com" && password === "Member123!") {
        const loggedUser = users[email]
        setUser(loggedUser)
        localStorage.setItem("user", JSON.stringify(loggedUser))
        // Establecer cookie de autenticación
        Cookies.set("auth_token", "authenticated", { expires: 7 })
        return true
      }

      return false
    } catch (error) {
      console.error("Error during login:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Función de cierre de sesión
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    // Eliminar la cookie de autenticación
    Cookies.remove("auth_token")
    // Redirigir al login
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

