"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

// Tipo de usuario
type User = {
  id: string    
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string
}

// Tipo del contexto
type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      Cookies.set("auth_token", "authenticated", { expires: 7 })
    }
    setIsLoading(false)
  }, [])

  // Función de login real desde backend
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        console.error("Credenciales incorrectas")
        return false
      }

      const data = await response.json()

      const loggedUser: User = {
        id: data.id,
        name: data.nombre,
        email: data.email,
        role: data.rol,
        avatar: data.avatar || "/placeholder-user.jpg",
      }

      setUser(loggedUser)
      localStorage.setItem("user", JSON.stringify(loggedUser))
      Cookies.set("auth_token", "authenticated", { expires: 7 })

      return true
    } catch (error) {
      console.error("Error en el login:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    Cookies.remove("auth_token")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
