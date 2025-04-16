"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Filter, Plus, Search, ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTeam } from "@/contexts/team-context"
import { useAuth } from "@/contexts/auth-context"

// Datos por defecto para cuando no hay equipo seleccionado
const defaultBacklogItems = [
  {
    id: "PBI-default",
    title: "Item de ejemplo",
    priority: "Media",
    estimation: "5 puntos",
    assignee: {
      name: "Usuario",
      avatar: "/placeholder-user.jpg",
      initials: "US",
    },
  },
]

export default function BacklogPage() {
  const { selectedTeam } = useTeam()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [backlogItems, setBacklogItems] = useState<any[]>(defaultBacklogItems)

  // Cargar datos basados en el equipo seleccionado
  useEffect(() => {
    if (!selectedTeam) return

    setIsLoading(true)

    // Simulamos la carga de datos específicos del equipo
    const loadTeamData = () => {
      // Datos simulados para cada equipo
      const teamData: Record<string, any[]> = {
        desarrollo: [
          {
            id: "PBI-1-dev",
            title: "Implementar autenticación de usuarios",
            priority: "Alta",
            estimation: "8 puntos",
            assignee: {
              name: "Juan D.",
              avatar: "/placeholder-user.jpg",
              initials: "JD",
            },
          },
          {
            id: "PBI-2-dev",
            title: "Optimizar consultas de base de datos",
            priority: "Alta",
            estimation: "5 puntos",
            assignee: {
              name: "Roberto K.",
              avatar: "/placeholder-user.jpg",
              initials: "RK",
            },
          },
          {
            id: "PBI-3-dev",
            title: "Implementar API REST",
            priority: "Media",
            estimation: "13 puntos",
            assignee: {
              name: "Ana M.",
              avatar: "/placeholder-user.jpg",
              initials: "AM",
            },
          },
          {
            id: "PBI-4-dev",
            title: "Diseñar interfaz de usuario",
            priority: "Media",
            estimation: "5 puntos",
            assignee: {
              name: "Miembro",
              avatar: "/placeholder-user.jpg",
              initials: "MI",
            },
          },
        ],
        diseno: [
          {
            id: "PBI-1-design",
            title: "Diseñar nueva página de inicio",
            priority: "Alta",
            estimation: "5 puntos",
            assignee: {
              name: "Laura P.",
              avatar: "/placeholder-user.jpg",
              initials: "LP",
            },
          },
          {
            id: "PBI-2-design",
            title: "Crear iconos personalizados",
            priority: "Baja",
            estimation: "3 puntos",
            assignee: {
              name: "Carlos M.",
              avatar: "/placeholder-user.jpg",
              initials: "CM",
            },
          },
          {
            id: "PBI-3-design",
            title: "Actualizar guía de estilos",
            priority: "Media",
            estimation: "3 puntos",
            assignee: {
              name: "Miembro",
              avatar: "/placeholder-user.jpg",
              initials: "MI",
            },
          },
        ],
        marketing: [
          {
            id: "PBI-1-mkt",
            title: "Planificar campaña de redes sociales",
            priority: "Alta",
            estimation: "8 puntos",
            assignee: {
              name: "Sofía R.",
              avatar: "/placeholder-user.jpg",
              initials: "SR",
            },
          },
          {
            id: "PBI-2-mkt",
            title: "Crear contenido para blog",
            priority: "Media",
            estimation: "5 puntos",
            assignee: {
              name: "Miguel A.",
              avatar: "/placeholder-user.jpg",
              initials: "MA",
            },
          },
          {
            id: "PBI-3-mkt",
            title: "Análisis de competencia",
            priority: "Baja",
            estimation: "3 puntos",
            assignee: {
              name: "Sofía R.",
              avatar: "/placeholder-user.jpg",
              initials: "SR",
            },
          },
          {
            id: "PBI-4-mkt",
            title: "Diseñar materiales promocionales",
            priority: "Media",
            estimation: "5 puntos",
            assignee: {
              name: "Miembro",
              avatar: "/placeholder-user.jpg",
              initials: "MI",
            },
          },
        ],
      }

      // Obtener datos del equipo seleccionado o usar datos por defecto
      const data = teamData[selectedTeam.value] || defaultBacklogItems

      // Actualizar el estado con los datos del equipo
      setBacklogItems(data)
      setIsLoading(false)
    }

    // Cargar datos después de un breve retraso
    const timerId = setTimeout(loadTeamData, 300)
    return () => clearTimeout(timerId)
  }, [selectedTeam])

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Backlog de Producto - {selectedTeam.label}</h1>
        {user?.role === "admin" && (
          <div className="flex items-center gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Item
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Items del Backlog</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="search"
                placeholder="Buscar items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Por Prioridad</DropdownMenuItem>
                  <DropdownMenuItem>Por Fecha</DropdownMenuItem>
                  <DropdownMenuItem>Por Título</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Cargando backlog...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estimación</TableHead>
                  <TableHead>Asignado a</TableHead>
                  {user?.role === "admin" && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {backlogItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.priority === "Alta"
                            ? "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                            : item.priority === "Media"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                              : "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                        }
                      >
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.estimation}</TableCell>
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.assignee.avatar} alt="Avatar" />
                        <AvatarFallback>{item.assignee.initials}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    {user?.role === "admin" && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Añadir a Sprint</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

