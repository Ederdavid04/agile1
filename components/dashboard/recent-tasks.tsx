"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para las tareas recientes
const recentTasks = [
  {
    id: "TASK-8782",
    title: "Implementar autenticación de usuarios",
    status: "En progreso",
    priority: "Alta",
    assignee: {
      name: "María López",
      avatar: "/placeholder-user.jpg",
      initials: "ML",
    },
    dueDate: "2023-05-10",
  },
  {
    id: "TASK-7878",
    title: "Diseñar la interfaz de usuario del dashboard",
    status: "Completada",
    priority: "Media",
    assignee: {
      name: "Laura Sánchez",
      avatar: "/placeholder-user.jpg",
      initials: "LS",
    },
    dueDate: "2023-05-05",
  },
  {
    id: "TASK-5562",
    title: "Implementar API para gestión de tareas",
    status: "En revisión",
    priority: "Alta",
    assignee: {
      name: "Carlos Rodríguez",
      avatar: "/placeholder-user.jpg",
      initials: "CR",
    },
    dueDate: "2023-05-12",
  },
  {
    id: "TASK-9087",
    title: "Corregir bugs en la vista de calendario",
    status: "Por hacer",
    priority: "Baja",
    assignee: {
      name: "Juan Pérez",
      avatar: "/placeholder-user.jpg",
      initials: "JP",
    },
    dueDate: "2023-05-15",
  },
  {
    id: "TASK-4093",
    title: "Optimizar rendimiento de la aplicación",
    status: "En progreso",
    priority: "Media",
    assignee: {
      name: "María López",
      avatar: "/placeholder-user.jpg",
      initials: "ML",
    },
    dueDate: "2023-05-18",
  },
  {
    id: "TASK-2359",
    title: "Implementar notificaciones en tiempo real",
    status: "Por hacer",
    priority: "Alta",
    assignee: {
      name: "Carlos Rodríguez",
      avatar: "/placeholder-user.jpg",
      initials: "CR",
    },
    dueDate: "2023-05-20",
  },
]

export function RecentTasks() {
  const [filter, setFilter] = useState("all")

  // Filtrar tareas según el estado seleccionado
  const filteredTasks =
    filter === "all"
      ? recentTasks
      : recentTasks.filter((task) =>
          filter === "pending"
            ? task.status === "Por hacer" || task.status === "En progreso"
            : task.status === "Completada",
        )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tareas Recientes</CardTitle>
            <CardDescription>{filteredTasks.length} tareas encontradas</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("all")}
            >
              Todas
            </Badge>
            <Badge
              variant={filter === "pending" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("pending")}
            >
              Pendientes
            </Badge>
            <Badge
              variant={filter === "completed" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("completed")}
            >
              Completadas
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between space-x-4 rounded-md border p-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{task.title}</p>
                  <Badge
                    variant={
                      task.status === "Completada"
                        ? "success"
                        : task.status === "En progreso"
                          ? "default"
                          : task.status === "En revisión"
                            ? "warning"
                            : "secondary"
                    }
                  >
                    {task.status}
                  </Badge>
                </div>
                <div className="flex items-center pt-2 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <span className="mr-1">ID:</span>
                    <span className="font-mono">{task.id}</span>
                  </span>
                  <span className="px-2">•</span>
                  <span>Vence: {task.dueDate}</span>
                  <span className="px-2">•</span>
                  <span>Prioridad: {task.priority}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

