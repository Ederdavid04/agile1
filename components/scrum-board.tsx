"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Paperclip, Plus, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import dynamic from "next/dynamic"
import type { ScrumTask } from "@/components/task-dialog"
import { TaskDialog } from "@/components/task-dialog"
import { DeleteConfirmation } from "@/components/delete-confirmation"

// Importar el componente DndProvider de forma dinámica con SSR desactivado
const DndProviderWithNoSSR = dynamic(() => import("./dnd-provider").then((mod) => mod.DndProvider), { ssr: false })

const DroppableArea = dynamic(() => import("./dnd-provider").then((mod) => mod.DroppableArea), { ssr: false })

const DraggableItem = dynamic(() => import("./dnd-provider").then((mod) => mod.DraggableItem), { ssr: false })

// Definir tipos para las columnas y sprints
type Column = {
  id: string
  title: string
  tasks: ScrumTask[]
}

type Sprint = {
  id: string
  name: string
  startDate: string
  endDate: string
  progress: number
  columns: Column[]
}

export type ScrumBoardRef = {
  addTask: (task: ScrumTask) => void
}

export const ScrumBoard = forwardRef<ScrumBoardRef, {}>((props, ref) => {
  // Estado para controlar si estamos en el cliente
  const [isClient, setIsClient] = useState(false)

  // Usar useEffect para establecer isClient a true después del montaje
  useEffect(() => {
    setIsClient(true)
  }, [])
  const [activeTab, setActiveTab] = useState("sprint-1")

  // Estado para el diálogo de edición
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<ScrumTask | null>(null)

  // Estado para el diálogo de confirmación de eliminación
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; columnId: string; sprintId: string } | null>(null)

  // Estado inicial de los sprints
  const [sprints, setSprints] = useState<Sprint[]>([
    {
      id: "sprint-1",
      name: "Sprint 1",
      startDate: "1 Mayo",
      endDate: "15 Mayo",
      progress: 65,
      columns: [
        {
          id: "todo-sprint-1",
          title: "Por Hacer",
          tasks: [
            {
              id: "task-1-sprint-1",
              title: "Diseñar nueva página de inicio",
              description: "Crear mockups y prototipos para la nueva página de inicio",
              points: 5,
              assignee: {
                name: "Ana M.",
                avatar: "/placeholder-user.jpg",
                initials: "AM",
              },
              comments: 3,
              attachments: 2,
            },
          ],
        },
        {
          id: "in-progress-sprint-1",
          title: "En Progreso",
          tasks: [
            {
              id: "task-2-sprint-1",
              title: "Implementar autenticación OAuth",
              description: "Integrar sistema de autenticación con proveedores externos",
              points: 8,
              assignee: {
                name: "Juan D.",
                avatar: "/placeholder-user.jpg",
                initials: "JD",
              },
              comments: 5,
              attachments: 1,
            },
          ],
        },
        {
          id: "review-sprint-1",
          title: "En Revisión",
          tasks: [
            {
              id: "task-3-sprint-1",
              title: "Optimizar consultas de base de datos",
              description: "Mejorar el rendimiento de las consultas principales",
              points: 3,
              assignee: {
                name: "Roberto K.",
                avatar: "/placeholder-user.jpg",
                initials: "RK",
              },
              comments: 2,
              attachments: 0,
            },
          ],
        },
        {
          id: "done-sprint-1",
          title: "Completado",
          tasks: [
            {
              id: "task-4-sprint-1",
              title: "Crear documentación de API",
              description: "Documentar endpoints y parámetros de la API REST",
              points: 2,
              assignee: {
                name: "Teresa S.",
                avatar: "/placeholder-user.jpg",
                initials: "TS",
              },
              comments: 1,
              attachments: 3,
            },
          ],
        },
      ],
    },
    {
      id: "sprint-2",
      name: "Sprint 2",
      startDate: "16 Mayo",
      endDate: "31 Mayo",
      progress: 10,
      columns: [
        {
          id: "todo-sprint-2",
          title: "Por Hacer",
          tasks: [
            {
              id: "task-5-sprint-2",
              title: "Implementar sistema de notificaciones",
              description: "Crear sistema de notificaciones en tiempo real",
              points: 8,
              assignee: {
                name: "Juan D.",
                avatar: "/placeholder-user.jpg",
                initials: "JD",
              },
              comments: 2,
              attachments: 0,
            },
            {
              id: "task-6-sprint-2",
              title: "Diseñar página de perfil de usuario",
              description: "Crear mockups y prototipos para la página de perfil",
              points: 5,
              assignee: {
                name: "Ana M.",
                avatar: "/placeholder-user.jpg",
                initials: "AM",
              },
              comments: 1,
              attachments: 1,
            },
          ],
        },
        {
          id: "in-progress-sprint-2",
          title: "En Progreso",
          tasks: [
            {
              id: "task-7-sprint-2",
              title: "Integrar pasarela de pagos",
              description: "Implementar integración con Stripe",
              points: 13,
              assignee: {
                name: "Teresa S.",
                avatar: "/placeholder-user.jpg",
                initials: "TS",
              },
              comments: 3,
              attachments: 2,
            },
          ],
        },
        {
          id: "review-sprint-2",
          title: "En Revisión",
          tasks: [],
        },
        {
          id: "done-sprint-2",
          title: "Completado",
          tasks: [],
        },
      ],
    },
  ])

  // Exponer métodos a través de la ref
  useImperativeHandle(ref, () => ({
    addTask: (task: ScrumTask) => {
      // Añadir la tarea al sprint activo en la columna "Por Hacer"
      const newSprints = sprints.map((sprint) => {
        if (sprint.id === activeTab) {
          return {
            ...sprint,
            columns: sprint.columns.map((column) => {
              // Buscar la columna "Por Hacer" del sprint activo
              if (column.id.startsWith("todo")) {
                return {
                  ...column,
                  tasks: [...column.tasks, task],
                }
              }
              return column
            }),
          }
        }
        return sprint
      })
      setSprints(newSprints)
    },
  }))

  // Manejar el final del arrastre
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // Si no hay destino o el destino es el mismo que el origen, no hacer nada
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    // Encontrar el sprint activo
    const activeSprint = sprints.find((sprint) => sprint.id === activeTab)
    if (!activeSprint) return

    // Encontrar la columna de origen y destino
    const sourceColumn = activeSprint.columns.find((col) => col.id === source.droppableId)
    const destColumn = activeSprint.columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    // Crear nuevos sprints para actualizar el estado
    const newSprints = [...sprints]
    const sprintIndex = newSprints.findIndex((sprint) => sprint.id === activeTab)

    // Encontrar la tarea que se está moviendo
    const task = sourceColumn.tasks[source.index]

    // Eliminar la tarea de la columna de origen
    const newSourceTasks = [...sourceColumn.tasks]
    newSourceTasks.splice(source.index, 1)

    // Añadir la tarea a la columna de destino
    const newDestTasks = [...destColumn.tasks]
    newDestTasks.splice(destination.index, 0, task)

    // Actualizar las columnas en el sprint
    const sourceColIndex = activeSprint.columns.findIndex((col) => col.id === source.droppableId)
    const destColIndex = activeSprint.columns.findIndex((col) => col.id === destination.droppableId)

    newSprints[sprintIndex].columns[sourceColIndex] = {
      ...sourceColumn,
      tasks: newSourceTasks,
    }

    newSprints[sprintIndex].columns[destColIndex] = {
      ...destColumn,
      tasks: newDestTasks,
    }

    // Actualizar el estado
    setSprints(newSprints)
  }

  // Función para añadir una nueva tarea
  const handleAddTask = (columnId: string) => {
    const newTask: ScrumTask = {
      id: `task-${Date.now()}`,
      title: "Nueva tarea",
      description: "Descripción de la nueva tarea",
      points: 3,
      assignee: {
        name: "Sin asignar",
        avatar: "/placeholder-user.jpg",
        initials: "NA",
      },
      comments: 0,
      attachments: 0,
    }

    const newSprints = sprints.map((sprint) => {
      if (sprint.id === activeTab) {
        return {
          ...sprint,
          columns: sprint.columns.map((column) => {
            if (column.id === columnId) {
              return {
                ...column,
                tasks: [...column.tasks, newTask],
              }
            }
            return column
          }),
        }
      }
      return sprint
    })

    setSprints(newSprints)
  }

  // Función para crear un nuevo sprint
  const handleAddSprint = () => {
    const sprintNumber = sprints.length + 1
    const newSprint: Sprint = {
      id: `sprint-${sprintNumber}`,
      name: `Sprint ${sprintNumber}`,
      startDate: "1 Junio",
      endDate: "15 Junio",
      progress: 0,
      columns: [
        {
          id: `todo-sprint-${sprintNumber}`,
          title: "Por Hacer",
          tasks: [],
        },
        {
          id: `in-progress-sprint-${sprintNumber}`,
          title: "En Progreso",
          tasks: [],
        },
        {
          id: `review-sprint-${sprintNumber}`,
          title: "En Revisión",
          tasks: [],
        },
        {
          id: `done-sprint-${sprintNumber}`,
          title: "Completado",
          tasks: [],
        },
      ],
    }

    setSprints([...sprints, newSprint])
    setActiveTab(newSprint.id)
  }

  // Función para editar una tarea
  const handleEditTask = (task: ScrumTask, columnId: string, sprintId: string) => {
    setEditingTask(task)
    setShowEditDialog(true)
  }

  // Función para guardar los cambios de una tarea editada
  const handleSaveEditedTask = (updatedTask: ScrumTask) => {
    const newSprints = sprints.map((sprint) => {
      return {
        ...sprint,
        columns: sprint.columns.map((column) => {
          return {
            ...column,
            tasks: column.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
          }
        }),
      }
    })

    setSprints(newSprints)
    setShowEditDialog(false)
    setEditingTask(null)
  }

  // Función para preparar la eliminación de una tarea
  const handlePrepareDeleteTask = (taskId: string, columnId: string, sprintId: string) => {
    setTaskToDelete({ id: taskId, columnId, sprintId })
    setShowDeleteDialog(true)
  }

  // Función para confirmar la eliminación de una tarea
  const handleConfirmDeleteTask = () => {
    if (!taskToDelete) return

    const newSprints = sprints.map((sprint) => {
      if (sprint.id === taskToDelete.sprintId) {
        return {
          ...sprint,
          columns: sprint.columns.map((column) => {
            if (column.id === taskToDelete.columnId) {
              return {
                ...column,
                tasks: column.tasks.filter((task) => task.id !== taskToDelete.id),
              }
            }
            return column
          }),
        }
      }
      return sprint
    })

    setSprints(newSprints)
    setShowDeleteDialog(false)
    setTaskToDelete(null)
  }

  // Renderizar el tablero estático (para SSR)
  const renderStaticBoard = (sprint: Sprint) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {sprint.columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{column.title}</h3>
            <Badge variant="outline">{column.tasks.length}</Badge>
          </div>
          <div className="space-y-4 min-h-[200px]">
            {column.tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{task.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTask(task, column.id, sprint.id)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handlePrepareDeleteTask(task.id, column.id, sprint.id)}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {task.points} puntos
                  </Badge>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="flex items-center">
                      <MessageSquare className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">{task.comments}</span>
                    </div>
                    <div className="flex items-center">
                      <Paperclip className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">{task.attachments}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
            <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => handleAddTask(column.id)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Tarea
            </Button>
          </div>
        </div>
      ))}
    </div>
  )

  // Renderizar el tablero con drag and drop
  const renderDndBoard = (sprint: Sprint) => (
    <DndProviderWithNoSSR onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {sprint.columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{column.title}</h3>
              <Badge variant="outline">{column.tasks.length}</Badge>
            </div>
            <DroppableArea droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-4 min-h-[200px] p-1 rounded-md ${snapshot.isDraggingOver ? "bg-muted/50" : ""}`}
                >
                  {column.tasks.map((task, index) => (
                    <DraggableItem key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${snapshot.isDragging ? "opacity-70 shadow-lg" : ""}`}
                        >
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{task.title}</CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditTask(task, column.id, sprint.id)}>
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handlePrepareDeleteTask(task.id, column.id, sprint.id)}
                                  >
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <CardDescription className="line-clamp-2 text-xs">{task.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                              {task.points} puntos
                            </Badge>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <div className="flex items-center">
                                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">{task.comments}</span>
                              </div>
                              <div className="flex items-center">
                                <Paperclip className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">{task.attachments}</span>
                              </div>
                            </div>
                          </CardFooter>
                        </Card>
                      )}
                    </DraggableItem>
                  ))}
                  {provided.placeholder}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => handleAddTask(column.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Tarea
                  </Button>
                </div>
              )}
            </DroppableArea>
          </div>
        ))}
      </div>
    </DndProviderWithNoSSR>
  )

  // Renderizar el tablero
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            {sprints.map((sprint) => (
              <TabsTrigger key={sprint.id} value={sprint.id}>
                {sprint.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button onClick={handleAddSprint}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Sprint
        </Button>
      </div>

      {sprints.map((sprint) => (
        <TabsContent key={sprint.id} value={sprint.id} className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle>{sprint.name}</CardTitle>
                  <CardDescription>
                    {sprint.startDate} - {sprint.endDate}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{sprint.progress}%</span>
                  <Progress value={sprint.progress} className="w-[100px] h-2" />
                </div>
              </div>
            </CardHeader>
          </Card>

          {isClient ? renderDndBoard(sprint) : renderStaticBoard(sprint)}
        </TabsContent>
      ))}

      {/* Diálogo de edición de tarea */}
      <TaskDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveEditedTask}
        boardType="scrum"
        editTask={editingTask}
        mode={editingTask ? "edit" : "create"}
      />

      {/* Diálogo de confirmación de eliminación */}
      <DeleteConfirmation
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDeleteTask}
      />
    </div>
  )
})

ScrumBoard.displayName = "ScrumBoard"

