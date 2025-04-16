"use client"
import type { ReactNode } from "react"
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Componente wrapper para DndContext
export function DndProvider({
  children,
  onDragEnd,
}: {
  children: ReactNode
  onDragEnd: (result: any) => void
}) {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    // Solo procesamos si el elemento se soltó sobre un elemento diferente
    if (active.id !== over.id) {
      // Extraer información del evento
      const activeId = String(active.id)
      const overId = String(over.id)

      // Extraer el ID del contenedor del ID del elemento
      // Asumimos que el ID tiene el formato "columnId-taskId"
      const activeIdParts = activeId.split("-")
      const overIdParts = overId.split("-")

      const activeContainer = activeIdParts[0]
      const overContainer = overIdParts[0]

      // Encontrar los índices
      // Esto es una simplificación, en una implementación real
      // deberíamos obtener los índices de manera más robusta
      const activeIndex = Number.parseInt(activeIdParts[1]) || 0
      const overIndex = Number.parseInt(overIdParts[1]) || 0

      // Crear un resultado en el formato esperado por el componente padre
      const result = {
        draggableId: activeId,
        source: {
          droppableId: activeContainer,
          index: activeIndex,
        },
        destination: {
          droppableId: overContainer,
          index: overIndex,
        },
      }

      console.log("DndProvider handleDragEnd result:", result)
      onDragEnd(result)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  )
}

// Componente para área droppable
export function DroppableArea({
  droppableId,
  children,
}: {
  droppableId: string
  children: (provided: any, snapshot: any) => ReactNode
}) {
  // Crear un objeto "provided" similar al que proporciona react-beautiful-dnd
  const provided = {
    innerRef: (el: HTMLDivElement) => {},
    droppableProps: {},
    placeholder: null,
  }

  return (
    <div data-droppable-id={droppableId} className="min-h-[200px]">
      {children(provided, { isDraggingOver: false })}
    </div>
  )
}

// Componente para elementos arrastrables
export function DraggableItem({
  draggableId,
  index,
  children,
}: {
  draggableId: string
  index: number
  children: (provided: any, snapshot: any) => ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: draggableId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Crear un objeto similar al que proporciona react-beautiful-dnd
  const provided = {
    draggableProps: {
      ...attributes,
      style,
    },
    dragHandleProps: listeners,
    innerRef: setNodeRef,
  }

  return children(provided, { isDragging })
}

export default {
  DndProvider,
  DroppableArea,
  DraggableItem,
}

