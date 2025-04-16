"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Paperclip, Calendar, Clock, CheckSquare, Tag, Plus, Send, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { KanbanTask } from "@/components/task-dialog"

interface TaskDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: KanbanTask | null
  onEdit: () => void
}

export function TaskDetailDialog({ open, onOpenChange, task, onEdit }: TaskDetailDialogProps) {
  // Estados para las diferentes secciones
  const [activeTab, setActiveTab] = useState<"details" | "comments" | "attachments">("details")
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<
    Array<{
      id: string
      author: { name: string; avatar: string; initials: string }
      text: string
      date: string
    }>
  >([
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
  ])

  const [attachments, setAttachments] = useState<
    Array<{
      id: string
      name: string
      size: string
      type: string
      uploadedBy: string
      date: string
    }>
  >([
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
  ])

  // Función para añadir un nuevo comentario
  const handleAddComment = () => {
    if (!newComment.trim() || !task) return

    const newCommentObj = {
      id: `comment-${Date.now()}`,
      author: task.assignee,
      text: newComment,
      date: "Justo ahora",
    }

    setComments([...comments, newCommentObj])
    setNewComment("")
  }

  // Función para subir un archivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files.length || !task) return

    const file = files[0]
    const newAttachment = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type,
      uploadedBy: task.assignee.name,
      date: "Justo ahora",
    }

    setAttachments([...attachments, newAttachment])

    // Resetear el input de archivo
    e.target.value = ""
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
          <DialogDescription>
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
              Prioridad: {task.priority}
            </Badge>
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
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" />
                Descripción
              </h3>
              <p className="text-sm text-muted-foreground">{task.description || "Sin descripción"}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Asignado a
                </h3>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee.name}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Estado
                </h3>
                <span className="text-sm text-muted-foreground">En tablero Kanban</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Actividad reciente
              </h3>
              <div className="text-sm text-muted-foreground">
                <p>Última actualización: hace 2 días</p>
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

              <div className="flex gap-3 mt-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback>{task.assignee.initials}</AvatarFallback>
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
                <Input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
                <Button size="sm" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
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
                    <label htmlFor="file-upload" className="cursor-pointer">
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
            Cerrar
          </Button>
          <Button onClick={onEdit}>Editar tarea</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

