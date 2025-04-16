"\"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { format, addMonths, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarView } from "@/components/calendar-view"
import { CalendarEventDialog } from "@/components/calendar-event-dialog"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Definir el tipo para un evento de calendario
export type CalendarEvent = {
  id: string
  title: string
  description?: string
  date: Date
  endDate?: Date
  startTime: string
  endTime: string
  color: string
  type: "meeting" | "deadline" | "event"
}

export default function CalendarPage() {
  const { user } = useAuth()
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Reunión de Sprint",
      description: "Revisión del progreso del sprint actual",
      date: new Date(new Date().setHours(14, 0, 0, 0)),
      endDate: new Date(new Date().setHours(15, 0, 0, 0)),
      startTime: "14:00",
      endTime: "15:00",
      color: "bg-red-500",
      type: "meeting",
    },
    {
      id: "2",
      title: "Revisión de Proyecto",
      description: "Presentación de avances al cliente",
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      startTime: "10:00",
      endTime: "11:30",
      color: "bg-blue-500",
      type: "meeting",
    },
    {
      id: "3",
      title: "Planificación de Sprint",
      description: "Planificación del próximo sprint",
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      startTime: "09:00",
      endTime: "11:00",
      color: "bg-red-500",
      type: "meeting",
    },
    {
      id: "4",
      title: "Entrega de Diseños",
      description: "Fecha límite para entregar los diseños finales",
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      startTime: "00:00",
      endTime: "23:59",
      color: "bg-blue-500",
      type: "deadline",
    },
    {
      id: "5",
      title: "Lanzamiento v1.0",
      description: "Lanzamiento oficial de la versión 1.0",
      date: new Date(new Date().setDate(new Date().getDate() + 14)),
      startTime: "09:00",
      endTime: "18:00",
      color: "bg-green-500",
      type: "event",
    },
  ])

  const nextMonth = () => {
    setDate(addMonths(date, 1))
  }

  const prevMonth = () => {
    setDate(subMonths(date, 1))
  }

  const handleSaveEvent = (eventData: any) => {
    // Crear un nuevo evento con los datos del formulario
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      color:
        eventData.eventType === "meeting"
          ? "bg-red-500"
          : eventData.eventType === "deadline"
            ? "bg-blue-500"
            : "bg-green-500",
      type: eventData.eventType as "meeting" | "deadline" | "event",
    }

    // Añadir el nuevo evento a la lista de eventos
    setEvents([...events, newEvent])

    // Cerrar el diálogo
    setShowEventDialog(false)

    // Mostrar alerta de éxito
    setShowSuccessAlert(true)

    // Ocultar la alerta después de 3 segundos
    setTimeout(() => {
      setShowSuccessAlert(false)
    }, 3000)
  }

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
        {user?.role === "admin" && (
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowEventDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Evento
            </Button>
          </div>
        )}
      </div>

      {showSuccessAlert && (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Evento creado correctamente y añadido al calendario.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" />
              <span className="capitalize">{format(date, "MMMM yyyy", { locale: es })}</span>
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setDate(new Date())}>
              Hoy
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week" | "day")}>
              <TabsList>
                <TabsTrigger value="month">Mes</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="day">Día</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <CalendarView
            date={date}
            view={view}
            events={events}
            onDateSelect={(date) => console.log("Selected date:", date)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-4 rounded-md border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{event.date}</span>
                      <span className="px-2">•</span>
                      <span>{event.time}</span>
                    </div>
                    {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                    <div className="flex items-center pt-2">
                      {event.attendees.map((attendee, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-background -ml-2 first:ml-0">
                          <AvatarImage src={attendee.avatar} alt={attendee.name} />
                          <AvatarFallback>{attendee.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                      {event.attendees.length > 0 && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {event.attendees.length} {event.attendees.length === 1 ? "asistente" : "asistentes"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {user?.role === "admin" && (
        <CalendarEventDialog open={showEventDialog} onOpenChange={setShowEventDialog} onSave={handleSaveEvent} />
      )}
    </div>
  )
}

// Datos de ejemplo
const upcomingEvents = [
  {
    title: "Reunión de Sprint",
    date: "Hoy",
    time: "14:00 - 15:00",
    description: "Revisión del progreso del sprint actual",
    attendees: [
      { name: "Ana M.", avatar: "/placeholder-user.jpg", initials: "AM" },
      { name: "Juan D.", avatar: "/placeholder-user.jpg", initials: "JD" },
      { name: "Teresa S.", avatar: "/placeholder-user.jpg", initials: "TS" },
      { name: "Roberto K.", avatar: "/placeholder-user.jpg", initials: "RK" },
    ],
  },
  {
    title: "Revisión de Proyecto",
    date: "Mañana",
    time: "10:00 - 11:30",
    description: "Presentación de avances al cliente",
    attendees: [
      { name: "Ana M.", avatar: "/placeholder-user.jpg", initials: "AM" },
      { name: "Juan D.", avatar: "/placeholder-user.jpg", initials: "JD" },
    ],
  },
  {
    title: "Planificación de Sprint",
    date: "Viernes",
    time: "09:00 - 11:00",
    description: "Planificación del próximo sprint",
    attendees: [
      { name: "Ana M.", avatar: "/placeholder-user.jpg", initials: "AM" },
      { name: "Juan D.", avatar: "/placeholder-user.jpg", initials: "JD" },
      { name: "Teresa S.", avatar: "/placeholder-user.jpg", initials: "TS" },
    ],
  },
  {
    title: "Fecha límite: Entrega de Diseños",
    date: "15 de Mayo",
    time: "Todo el día",
    description: "",
    attendees: [{ name: "Ana M.", avatar: "/placeholder-user.jpg", initials: "AM" }],
  },
]

