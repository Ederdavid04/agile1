"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Paperclip, Plus, Send, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Tipo para las tareas Kanban
export type KanbanTask = {
  id: string
  title: string
  description: string
  priority: string
  assignee: {
    name: string
    avatar: string
    initials: string
  }
  comments: number
  attachments: number
}

// Tipo para las tareas Scrum
export type ScrumTask = {
  id: string
  title: string
  description: string
  points: number
  assignee: {
    name: string
    avatar: string
    initials: string
  }
  comments: number
  attachments: number
}

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (taskData: KanbanTask | ScrumTask) => void
  boardType: "kanban" | "scrum"
  editTask?: KanbanTask | ScrumTask
  mode?: "create" | "edit"
}

// Datos de ejemplo para los usuarios
const teamMembers = [
  { name: "Ana M.", avatar: "/placeholder-user.jpg", initials: "AM" },
  { name: "Juan D.", avatar: "/placeholder-user.jpg", initials: "JD" },
  { name: "Teresa S.", avatar: "/placeholder-user.jpg", initials: "TS" },
  { name: "Roberto K.", avatar: "/placeholder-user.jpg", initials: "RK" },
  { name: "Sin asignar", avatar: "/placeholder-user.jpg", initials: "NA" },
]

export function TaskDialog({ open, onOpenChange, onSave, boardType, editTask, mode = "create" }: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("Media")
  const [points, setPoints] = useState(3)
  const [assignee, setAssignee] = useState(teamMembers[4].name) // "Sin asignar" por defecto
  const [activeTab, setActiveTab] = useState<"details" | "comments" | "attachments">("details")

  // Estados para comentarios y archivos
  const [comments, setComments] = useState<
    Array<{
      id: string
      author: { name: string; avatar: string; initials: string }
      text: string
      date: string
    }>
  >([])

  const [attachments, setAttachments] = useState<
    Array<{
      id: string
      name: string
      size: string
      type: string
      uploadedBy: string
      date: string
    }>
  >([])

  const [newComment, setNewComment] = useState("")

  // Cargar datos de la tarea si estamos en modo edición
  useEffect(() => {
    if (mode === "edit" && editTask) {
      setTitle(editTask.title)
      setDescription(editTask.description)
      if ("priority" in editTask) {
        setPriority(editTask.priority)
      }
      if ("points" in editTask) {
        setPoints(editTask.points)
      }
      setAssignee(editTask.assignee.name)

      // Cargar comentarios y archivos de ejemplo si hay comentarios o archivos
      if (editTask.comments > 0) {
        setComments(
          [
            {
              id: "comment-1",
              author: { name: "Ana M.", avatar: "/placeholder-user.jpg", initials: "AM" },
              text: "Creo que deberíamos revisar el diseño una vez más antes de implementarlo.",
              date: "Hace 2 días",
            },
            {
              id: "comment-2",
              author: { name: "Juan D.", avatar: "/placeholder-user.jpg", initials: "JD" },
              text: "Estoy de acuerdo, hay algunos detalles que podríamos mejorar.",
              date: "Hace 1 día",
            },
          ].slice(0, editTask.comments),
        )
      }

      if (editTask.attachments > 0) {
        setAttachments(
          [
            {
              id: "file-1",
              name: "mockup-homepage.png",
              size: "2.4 MB",
              type: "image/png",
              uploadedBy: "Ana M.",
              date: "Hace 3 días",
            },
            {
              id: "file-2",
              name: "requirements.pdf",
              size: "1.2 MB",
              type: "application/pdf",
              uploadedBy: "Juan D.",
              date: "Hace 5 días",
            },
          ].slice(0, editTask.attachments),
        )
      }
    } else {
      // Resetear el formulario en modo creación
      setTitle("")
      setDescription("")
      setPriority("Media")
      setPoints(3)
      setAssignee(teamMembers[4].name)
      setComments([])
      setAttachments([])
    }
  }, [mode, editTask])

  // Función para añadir un nuevo comentario
  const handleAddComment = () => {
    if (!newComment.trim()) return

    const assigneeObj = teamMembers.find((member) => member.name === assignee) || teamMembers[4]

    const newCommentObj = {
      id: `comment-${Date.now()}`,
      author: assigneeObj,
      text: newComment,
      date: "Justo ahora",
    }

    setComments([...comments, newCommentObj])
    setNewComment("")
  }

  // Función para subir un archivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files.length) return

    const file = files[0]
    const assigneeObj = teamMembers.find((member) => member.name === assignee) || teamMembers[4]

    const newAttachment = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type,
      uploadedBy: assigneeObj.name,
      date: "Justo ahora",
    }

    setAttachments([...attachments, newAttachment])

    // Resetear el input de archivo
    e.target.value = ""
  }

  // Función para guardar la tarea
  const handleSave = () => {
    // Encontrar el objeto de usuario asignado
    const assigneeObj = teamMembers.find((member) => member.name === assignee) || teamMembers[4]

    let taskData: KanbanTask | ScrumTask

    if (boardType === "kanban") {
      taskData = {
        id: editTask ? editTask.id : `task-${Date.now()}`,
        title: title || "Sin título",
        description: description || "",
        priority,
        assignee: assigneeObj,
        comments: comments.length,
        attachments: attachments.length,
      }
    } else {
      taskData = {
        id: editTask ? editTask.id : `task-${Date.now()}`,
        title: title || "Sin título",
        description: description || "",
        points,
        assignee: assigneeObj,
        comments: comments.length,
        attachments: attachments.length,
      }
    }

    try {
      onSave(taskData)
    } catch (error) {
      console.error("Error al guardar la tarea:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Crear Nueva Tarea" : "Editar Tarea"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Añade una nueva tarea al tablero. Completa todos los campos necesarios."
              : "Modifica los detalles de la tarea existente."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-1">
              Comentarios <Badge variant="secondary">{comments.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="attachments" className="flex items-center gap-1">
              Archivos <Badge variant="secondary">{attachments.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Título de la tarea"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción de la tarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {boardType === "kanban" ? (
                <div className="grid gap-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="points">Puntos</Label>
                  <Input
                    id="points"
                    type="number"
                    placeholder="Puntos de la tarea"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="assignee">Asignar a</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar miembro" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.name} value={member.name}>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          {member.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4 pt-4">
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 rounded-md border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{comment.author.name}</span>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No hay comentarios</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={(teamMembers.find((m) => m.name === assignee) || teamMembers[4]).avatar}
                    alt={assignee}
                  />
                  <AvatarFallback>
                    {(teamMembers.find((m) => m.name === assignee) || teamMembers[4]).initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Añadir un comentario..."
                    className="min-h-[80px]"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Archivos adjuntos</h3>
              <div>
                <Input type="file" id="file-upload-dialog" className="hidden" onChange={handleFileUpload} />
                <Button size="sm" asChild>
                  <label htmlFor="file-upload-dialog" className="cursor-pointer">
                    <Plus className="h-4 w-4 mr-2" />
                    Subir archivo
                  </label>
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {attachments.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-md">
                      <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>Subido por {file.uploadedBy}</span>
                        <span>•</span>
                        <span>{file.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <a href="#" download className="flex items-center justify-center">
                        <Paperclip className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => {
                        setAttachments(attachments.filter((a) => a.id !== file.id))
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {attachments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Paperclip className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No hay archivos adjuntos</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <label htmlFor="file-upload-dialog" className="cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Subir archivo
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!title}>
            {mode === "create" ? "Guardar Tarea" : "Actualizar Tarea"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

