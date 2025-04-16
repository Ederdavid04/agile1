"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Paperclip, Plus, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import dynamic from "next/dynamic"
import type { KanbanTask } from "@/components/task-dialog"
import { TaskDialog } from "@/components/task-dialog"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { TaskDetailDialog } from "@/components/task-detail-dialog"

// Importar el componente DndProvider de forma dinámica con SSR desactivado
const DndProviderWithNoSSR = dynamic(() => import("./dnd-provider").then((mod) => mod.DndProvider), { ssr: false })

const DroppableArea = dynamic(() => import("./dnd-provider").then((mod) => mod.DroppableArea), { ssr: false })

const DraggableItem = dynamic(() => import("./dnd-provider").then((mod) => mod.DraggableItem), { ssr: false })

// Definir tipos para las columnas
type Column = {
  id: string
  title: string
  tasks: KanbanTask[]
}

export type KanbanBoardRef = {
  addTask: (task: KanbanTask) => void
}

interface KanbanBoardProps {
  initialTasks?: Record<string, KanbanTask[]>
}

export const KanbanBoard = forwardRef<KanbanBoardRef, KanbanBoardProps>(({ initialTasks }, ref) => {
  // Estado para controlar si estamos en el cliente
  const [isClient, setIsClient] = useState(false)

  // Estado para el diálogo de edición
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null)

  // Estado para el diálogo de confirmación de eliminación
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; columnId: string } | null>(null)

  // Añadir un nuevo estado para el diálogo de detalles
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null)

  // Estado inicial del tablero
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "Por Hacer",
      tasks: initialTasks?.todo || [],
    },
    {
      id: "in-progress",
      title: "En Progreso",
      tasks: initialTasks?.["in-progress"] || [],
    },
    {
      id: "review",
      title: "En Revisión",
      tasks: initialTasks?.review || [],
    },
    {
      id: "done",
      title: "Completado",
      tasks: initialTasks?.done || [],
    },
  ])

  // Actualizar las columnas cuando cambien las tareas iniciales
  useEffect(() => {
    if (initialTasks) {
      // Solo actualizar las columnas después de que el componente esté montado en el cliente
      setColumns([
        {
          id: "todo",
          title: "Por Hacer",
          tasks: initialTasks.todo || [],
        },
        {
          id: "in-progress",
          title: "En Progreso",
          tasks: initialTasks["in-progress"] || [],
        },
        {
          id: "review",
          title: "En Revisión",
          tasks: initialTasks.review || [],
        },
        {
          id: "done",
          title: "Completado",
          tasks: initialTasks.done || [],
        },
      ])
    }
  }, [initialTasks])

  // Exponer métodos a través de la ref
  useImperativeHandle(ref, () => ({
    addTask: (task: KanbanTask) => {
      // Por defecto, añadir la tarea a la columna "Por Hacer"
      const newColumns = columns.map((column) => {
        if (column.id === "todo") {
          return {
            ...column,
            tasks: [...column.tasks, task],
          }
        }
        return column
      })
      setColumns(newColumns)
    },
  }))

  // Efecto para establecer isClient a true después del montaje
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Modificar la función handleDragEnd para imprimir el resultado y asegurarnos de que estamos recibiendo los datos correctos
  const handleDragEnd = (result: any) => {
    console.log("Drag end result:", result)

    const { destination, source, draggableId } = result

    // Si no hay destino, no hacer nada
    if (!destination) {
      console.log("No destination, returning")
      return
    }

    // Si el destino es el mismo que el origen (misma columna y misma posición), no hacer nada
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      console.log("Same destination as source, returning")
      return
    }

    console.log("Processing drag end...")
    console.log("Source:", source)
    console.log("Destination:", destination)

    // Encontrar la columna de origen y destino
    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) {
      console.log("Could not find source or destination column")
      console.log("Source column:", sourceColumn)
      console.log("Destination column:", destColumn)
      return
    }

    // Crear nuevas columnas para actualizar el estado
    const newColumns = [...columns]

    // Encontrar la tarea que se está moviendo
    const task = sourceColumn.tasks[source.index]
    console.log("Moving task:", task)

    // Si es la misma columna, reordenar las tareas
    if (source.droppableId === destination.droppableId) {
      console.log("Same column, reordering tasks")
      const newTasks = [...sourceColumn.tasks]
      // Eliminar la tarea de la posición original
      newTasks.splice(source.index, 1)
      // Insertar la tarea en la nueva posición
      newTasks.splice(destination.index, 0, task)

      // Actualizar la columna con las tareas reordenadas
      const columnIndex = columns.findIndex((col) => col.id === source.droppableId)
      newColumns[columnIndex] = {
        ...sourceColumn,
        tasks: newTasks,
      }
    } else {
      console.log("Different columns, moving task between columns")
      // Si son columnas diferentes, eliminar de una e insertar en otra
      const sourceColIndex = columns.findIndex((col) => col.id === source.droppableId)
      const destColIndex = columns.findIndex((col) => col.id === destination.droppableId)

      // Eliminar la tarea de la columna de origen
      const newSourceTasks = [...sourceColumn.tasks]
      newSourceTasks.splice(source.index, 1)

      // Añadir la tarea a la columna de destino
      const newDestTasks = [...destColumn.tasks]
      newDestTasks.splice(destination.index, 0, task)

      // Actualizar ambas columnas
      newColumns[sourceColIndex] = {
        ...sourceColumn,
        tasks: newSourceTasks,
      }

      newColumns[destColIndex] = {
        ...destColumn,
        tasks: newDestTasks,
      }
    }

    console.log("Updating columns state")
    // Actualizar el estado
    setColumns(newColumns)
  }

  // Función para añadir una nueva tarea
  const handleAddTask = (columnId: string) => {
    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: "Nueva tarea",
      description: "Descripción de la nueva tarea",
      priority: "Media",
      assignee: {
        name: "Sin asignar",
        avatar: "/placeholder-user.jpg",
        initials: "NA",
      },
      comments: 0,
      attachments: 0,
    }

    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [...column.tasks, newTask],
        }
      }
      return column
    })

    setColumns(newColumns)
  }

  // Función para editar una tarea
  const handleEditTask = (task: KanbanTask, columnId: string) => {
    setEditingTask(task)
    setShowEditDialog(true)
  }

  // Función para guardar los cambios de una tarea editada
  const handleSaveEditedTask = (updatedTask: KanbanTask) => {
    const newColumns = columns.map((column) => {
      return {
        ...column,
        tasks: column.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      }
    })

    setColumns(newColumns)
    setShowEditDialog(false)
    setEditingTask(null)
  }

  // Función para preparar la eliminación de una tarea
  const handlePrepareDeleteTask = (taskId: string, columnId: string) => {
    setTaskToDelete({ id: taskId, columnId })
    setShowDeleteDialog(true)
  }

  // Función para confirmar la eliminación de una tarea
  const handleConfirmDeleteTask = () => {
    if (!taskToDelete) return

    const newColumns = columns.map((column) => {
      if (column.id === taskToDelete.columnId) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskToDelete.id),
        }
      }
      return column
    })

    setColumns(newColumns)
    setShowDeleteDialog(false)
    setTaskToDelete(null)
  }

  // Añadir una nueva función para manejar el clic en una tarea
  const handleTaskClick = (task: KanbanTask) => {
    setSelectedTask(task)
    setShowDetailDialog(true)
  }

  // Añadir una función para abrir el diálogo de edición desde el diálogo de detalles
  const handleEditFromDetails = () => {
    if (selectedTask) {
      setEditingTask(selectedTask)
      setShowDetailDialog(false)
      setShowEditDialog(true)
    }
  }

  // Renderizar la versión estática (para SSR o cuando no está disponible DnD)
  const renderStaticBoard = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{column.title}</h3>
            <Badge variant="outline">{column.tasks.length}</Badge>
          </div>
          <div className="space-y-4 min-h-[200px]">
            {column.tasks.map((task) => (
              <Card
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{task.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditTask(task, column.id)
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePrepareDeleteTask(task.id, column.id)
                          }}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Badge
                    variant="outline"
                    className={
                      task.priority === "Alta"
                        ? "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                        : task.priority === "Media"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                          : "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                    }
                  >
                    {task.priority}
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

  // Renderizar la versión con drag and drop
  const renderDndBoard = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {columns.map((column) => (
        <div
          key={column.id}
          className="space-y-4"
          onDragOver={(e) => {
            e.preventDefault()
            e.currentTarget.classList.add("bg-muted/50")
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove("bg-muted/50")
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.currentTarget.classList.remove("bg-muted/50")

            // Obtener los datos de la tarea arrastrada
            const taskId = e.dataTransfer.getData("taskId")
            const sourceColumnId = e.dataTransfer.getData("sourceColumnId")
            const sourceIndex = Number.parseInt(e.dataTransfer.getData("sourceIndex"))

            // Si la columna de destino es la misma que la de origen, no hacer nada
            if (sourceColumnId === column.id) return

            // Encontrar la columna de origen y destino
            const sourceColumn = columns.find((col) => col.id === sourceColumnId)
            const destColumn = column

            if (!sourceColumn) return

            // Crear nuevas columnas para actualizar el estado
            const newColumns = [...columns]

            // Encontrar la tarea que se está moviendo
            const task = sourceColumn.tasks[sourceIndex]

            // Eliminar la tarea de la columna de origen
            const sourceColIndex = columns.findIndex((col) => col.id === sourceColumnId)
            const newSourceTasks = [...sourceColumn.tasks]
            newSourceTasks.splice(sourceIndex, 1)

            // Añadir la tarea a la columna de destino
            const destColIndex = columns.findIndex((col) => col.id === column.id)
            const newDestTasks = [...destColumn.tasks]
            newDestTasks.push(task)

            // Actualizar ambas columnas
            newColumns[sourceColIndex] = {
              ...sourceColumn,
              tasks: newSourceTasks,
            }

            newColumns[destColIndex] = {
              ...destColumn,
              tasks: newDestTasks,
            }

            // Actualizar el estado
            setColumns(newColumns)
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{column.title}</h3>
            <Badge variant="outline">{column.tasks.length}</Badge>
          </div>
          <div className="space-y-4 min-h-[200px] p-1 rounded-md">
            {column.tasks.map((task, index) => (
              <Card
                key={task.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTaskClick(task)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("taskId", task.id)
                  e.dataTransfer.setData("sourceColumnId", column.id)
                  e.dataTransfer.setData("sourceIndex", index.toString())
                  e.currentTarget.classList.add("opacity-50")
                }}
                onDragEnd={(e) => {
                  e.currentTarget.classList.remove("opacity-50")
                }}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{task.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditTask(task, column.id)
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePrepareDeleteTask(task.id, column.id)
                          }}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Badge
                    variant="outline"
                    className={
                      task.priority === "Alta"
                        ? "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                        : task.priority === "Media"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                          : "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                    }
                  >
                    {task.priority}
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

  return (
    <>
      {isClient ? renderDndBoard() : renderStaticBoard()}

      {/* Diálogo de edición de tarea */}
      <TaskDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveEditedTask}
        boardType="kanban"
        editTask={editingTask}
        mode={editingTask ? "edit" : "create"}
      />

      {/* Diálogo de confirmación de eliminación */}
      <DeleteConfirmation
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDeleteTask}
      />

      <TaskDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        task={selectedTask}
        onEdit={handleEditFromDetails}
      />
    </>
  )
})

KanbanBoard.displayName = "KanbanBoard"

