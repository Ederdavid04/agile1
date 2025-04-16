"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { KanbanBoard } from "@/components/kanban-board"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { TaskDialog, type KanbanTask } from "@/components/task-dialog"
import { useTeam } from "@/contexts/team-context"

// Datos por defecto para cuando no hay equipo seleccionado
const defaultTasks: Record<string, KanbanTask[]> = {
  todo: [
    {
      id: "task-default-1",
      title: "Tarea de ejemplo",
      description: "Esta es una tarea de ejemplo",
      priority: "Media",
      assignee: {
        name: "Usuario",
        avatar: "/placeholder-user.jpg",
        initials: "US",
      },
      comments: 0,
      attachments: 0,
    },
  ],
  "in-progress": [],
  review: [],
  done: [],
}

export default function BoardPage() {
  const { selectedTeam } = useTeam()
  const [showAlert, setShowAlert] = useState(true)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [initialTasks, setInitialTasks] = useState<Record<string, KanbanTask[]>>(defaultTasks)
  const [isLoading, setIsLoading] = useState(false)

  // Referencia al componente de tablero
  const kanbanRef = useRef<{ addTask: (task: KanbanTask) => void } | null>(null)

  // Cargar datos basados en el equipo seleccionado
  useEffect(() => {
    if (!selectedTeam) return

    setIsLoading(true)

    // Simulamos la carga de datos específicos del equipo
    const loadTeamData = () => {
      // Datos simulados para cada equipo
      const teamData: Record<string, Record<string, KanbanTask[]>> = {
        desarrollo: {
          todo: [
            {
              id: "task-1-dev",
              title: "Implementar autenticación OAuth",
              description: "Integrar sistema de autenticación con proveedores externos",
              priority: "Alta",
              assignee: {
                name: "Juan D.",
                avatar: "/placeholder-user.jpg",
                initials: "JD",
              },
              comments: 5,
              attachments: 1,
            },
            {
              id: "task-2-dev",
              title: "Optimizar consultas de base de datos",
              description: "Mejorar el rendimiento de las consultas principales",
              priority: "Media",
              assignee: {
                name: "Roberto K.",
                avatar: "/placeholder-user.jpg",
                initials: "RK",
              },
              comments: 2,
              attachments: 0,
            },
          ],
          "in-progress": [
            {
              id: "task-3-dev",
              title: "Implementar API REST",
              description: "Crear endpoints para el nuevo módulo",
              priority: "Alta",
              assignee: {
                name: "Ana M.",
                avatar: "/placeholder-user.jpg",
                initials: "AM",
              },
              comments: 3,
              attachments: 2,
            },
          ],
          review: [],
          done: [],
        },
        diseno: {
          todo: [
            {
              id: "task-1-design",
              title: "Diseñar nueva página de inicio",
              description: "Crear mockups y prototipos para la nueva página de inicio",
              priority: "Alta",
              assignee: {
                name: "Laura P.",
                avatar: "/placeholder-user.jpg",
                initials: "LP",
              },
              comments: 4,
              attachments: 3,
            },
          ],
          "in-progress": [
            {
              id: "task-2-design",
              title: "Crear iconos personalizados",
              description: "Diseñar set de iconos para la aplicación",
              priority: "Media",
              assignee: {
                name: "Carlos M.",
                avatar: "/placeholder-user.jpg",
                initials: "CM",
              },
              comments: 1,
              attachments: 5,
            },
          ],
          review: [
            {
              id: "task-3-design",
              title: "Actualizar guía de estilos",
              description: "Revisar y actualizar la guía de estilos corporativa",
              priority: "Baja",
              assignee: {
                name: "Laura P.",
                avatar: "/placeholder-user.jpg",
                initials: "LP",
              },
              comments: 2,
              attachments: 1,
            },
          ],
          done: [],
        },
        marketing: {
          todo: [
            {
              id: "task-1-mkt",
              title: "Planificar campaña de redes sociales",
              description: "Definir estrategia para el lanzamiento del producto",
              priority: "Alta",
              assignee: {
                name: "Sofía R.",
                avatar: "/placeholder-user.jpg",
                initials: "SR",
              },
              comments: 3,
              attachments: 0,
            },
          ],
          "in-progress": [
            {
              id: "task-2-mkt",
              title: "Crear contenido para blog",
              description: "Redactar artículos sobre las nuevas funcionalidades",
              priority: "Media",
              assignee: {
                name: "Miguel A.",
                avatar: "/placeholder-user.jpg",
                initials: "MA",
              },
              comments: 1,
              attachments: 2,
            },
          ],
          review: [],
          done: [
            {
              id: "task-3-mkt",
              title: "Análisis de competencia",
              description: "Investigar estrategias de la competencia",
              priority: "Media",
              assignee: {
                name: "Sofía R.",
                avatar: "/placeholder-user.jpg",
                initials: "SR",
              },
              comments: 4,
              attachments: 3,
            },
          ],
        },
      }

      // Obtener datos del equipo seleccionado o usar datos por defecto
      const data = teamData[selectedTeam.value] || defaultTasks

      // Actualizar el estado con los datos del equipo
      setInitialTasks(data)
      setIsLoading(false)
    }

    // Cargar datos después de un breve retraso
    const timerId = setTimeout(loadTeamData, 300)
    return () => clearTimeout(timerId)
  }, [selectedTeam])

  // Función para manejar la creación de tareas
  const handleSaveTask = (taskData: KanbanTask) => {
    try {
      if (kanbanRef.current) {
        kanbanRef.current.addTask(taskData)
      }
      setShowTaskDialog(false)
    } catch (error) {
      console.error("Error al guardar la tarea:", error)
    }
  }

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tablero Kanban - {selectedTeam.label}</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowTaskDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>
      </div>

      {showAlert && (
        <Alert className="bg-blue-50 border-blue-200 mb-4">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-600">
            ¡Nuevo! Ahora puedes arrastrar y soltar las tareas entre columnas para cambiar su estado.
            <Button variant="link" className="text-blue-600 p-0 h-auto ml-2" onClick={() => setShowAlert(false)}>
              Entendido
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Cargando tablero...</p>
        </div>
      ) : (
        <KanbanBoard ref={kanbanRef} initialTasks={initialTasks} />
      )}

      <TaskDialog open={showTaskDialog} onOpenChange={setShowTaskDialog} onSave={handleSaveTask} boardType="kanban" />
    </div>
  )
}

