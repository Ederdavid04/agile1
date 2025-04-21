"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function UserNav() {
  const { user, logout } = useAuth()  // Obtener el usuario del contexto de autenticación
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) {
    return null // Si no hay usuario, no renderizamos nada
  }

  // Asegurarse de que user.name esté definido antes de usarlo
  const userName = user.name || "Usuario Anónimo"  // Nombre predeterminado si no está disponible
  const userInitial = userName.charAt(0).toUpperCase()  // Inicial del nombre del usuario (mayúscula)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* Si no hay imagen de avatar, mostrar la inicial del nombre */}
            <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={userName} />
            <AvatarFallback>{userInitial}</AvatarFallback> {/* Aquí mostramos la primera letra del nombre */}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {/* Aquí mostramos el nombre completo del usuario en el menú */}
            <p className="text-sm font-medium leading-none">{userName}</p>  
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>  {/* Email del usuario */}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Perfil
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Configuración
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Cerrar Sesión
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
