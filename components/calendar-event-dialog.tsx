"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CalendarEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (eventData: any) => void
}

export function CalendarEventDialog({ open, onOpenChange, onSave }: CalendarEventDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [eventType, setEventType] = useState<"meeting" | "deadline" | "event">("meeting")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que la hora de fin sea posterior a la hora de inicio
    if (startTime >= endTime) {
      alert("La hora de fin debe ser posterior a la hora de inicio")
      return
    }

    // Crear objeto con los datos del evento
    const eventData = {
      title,
      description,
      date,
      startTime,
      endTime,
      eventType,
    }

    // Llamar a la función onSave con los datos del evento
    onSave(eventData)

    // Limpiar el formulario
    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDate(new Date())
    setStartTime("09:00")
    setEndTime("10:00")
    setEventType("meeting")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Evento</DialogTitle>
            <DialogDescription>Completa los detalles para crear un nuevo evento en el calendario.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del evento"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción del evento"
                className="resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Hora de inicio</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">Hora de fin</Label>
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Tipo de evento</Label>
              <RadioGroup
                value={eventType}
                onValueChange={(value) => setEventType(value as "meeting" | "deadline" | "event")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="meeting" id="meeting" />
                  <Label htmlFor="meeting" className="cursor-pointer">
                    Reunión
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="deadline" id="deadline" />
                  <Label htmlFor="deadline" className="cursor-pointer">
                    Fecha límite
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="event" id="event" />
                  <Label htmlFor="event" className="cursor-pointer">
                    Evento
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Evento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

