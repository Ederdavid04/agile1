"use client"

import { useState, useEffect } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { CalendarEvent } from "@/app/dashboard/calendar/page"

interface CalendarViewProps {
  date: Date
  view: "month" | "week" | "day"
  events: CalendarEvent[]
  onDateSelect: (date: Date) => void
}

export function CalendarView({ date, view, events, onDateSelect }: CalendarViewProps) {
  const [days, setDays] = useState<Date[]>([])

  useEffect(() => {
    let daysToShow: Date[] = []

    if (view === "month") {
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)
      const startDate = startOfWeek(monthStart, { locale: es })
      const endDate = endOfWeek(monthEnd, { locale: es })

      daysToShow = eachDayOfInterval({ start: startDate, end: endDate })
    } else if (view === "week") {
      const weekStart = startOfWeek(date, { locale: es })
      const weekEnd = endOfWeek(date, { locale: es })

      daysToShow = eachDayOfInterval({ start: weekStart, end: weekEnd })
    } else if (view === "day") {
      daysToShow = [date]
    }

    setDays(daysToShow)
  }, [date, view])

  // Función para obtener eventos de un día específico
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), day))
  }

  // Renderizar vista de mes
  const renderMonthView = () => {
    const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

    return (
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="h-10 flex items-center justify-center font-medium text-sm">
            {day}
          </div>
        ))}

        {days.map((day, i) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = day.getMonth() === date.getMonth()

          return (
            <div
              key={i}
              className={cn(
                "min-h-[100px] p-1 border border-border rounded-md",
                isCurrentMonth ? "bg-card" : "bg-muted/30",
                isToday(day) && "ring-2 ring-primary/20",
              )}
              onClick={() => onDateSelect(day)}
            >
              <div
                className={cn(
                  "text-sm font-medium h-6 flex items-center justify-center rounded-md",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-xs px-1 py-0.5 rounded truncate",
                      event.color,
                      event.color.includes("bg-red") && "text-white",
                      event.color.includes("bg-blue") && "text-white",
                      event.color.includes("bg-green") && "text-white",
                    )}
                    title={event.title}
                  >
                    {event.startTime} {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-1">+{dayEvents.length - 3} más</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Renderizar vista de semana
  const renderWeekView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="flex flex-col">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r"></div>
          {days.map((day, i) => (
            <div key={i} className={cn("p-2 text-center font-medium", isToday(day) && "bg-primary/10")}>
              <div>{format(day, "EEE", { locale: es })}</div>
              <div
                className={cn(
                  "inline-flex items-center justify-center h-6 w-6 rounded-full text-sm",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-8 divide-x h-[600px] overflow-y-auto">
          <div className="flex flex-col text-xs text-muted-foreground">
            {hours.map((hour) => (
              <div key={hour} className="h-12 border-b px-2 text-right">
                {hour}:00
              </div>
            ))}
          </div>

          {days.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day)

            return (
              <div key={dayIndex} className={cn("relative", isToday(day) && "bg-primary/5")}>
                {hours.map((hour) => (
                  <div key={hour} className="h-12 border-b"></div>
                ))}

                {dayEvents.map((event) => {
                  const startHour = Number.parseInt(event.startTime.split(":")[0])
                  const startMinute = Number.parseInt(event.startTime.split(":")[1]) || 0
                  const endHour = Number.parseInt(event.endTime.split(":")[0])
                  const endMinute = Number.parseInt(event.endTime.split(":")[1]) || 0

                  const top = (startHour + startMinute / 60) * 48
                  const height = (endHour + endMinute / 60 - (startHour + startMinute / 60)) * 48

                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute left-0 right-0 mx-1 p-1 rounded text-xs overflow-hidden",
                        event.color,
                        event.color.includes("bg-red") && "text-white",
                        event.color.includes("bg-blue") && "text-white",
                        event.color.includes("bg-green") && "text-white",
                      )}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                      }}
                      title={event.title}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div>
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Renderizar vista de día
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const dayEvents = getEventsForDay(date)

    return (
      <div className="flex flex-col">
        <div className="text-center p-2 font-medium border-b">
          <div>{format(date, "EEEE", { locale: es })}</div>
          <div
            className={cn(
              "inline-flex items-center justify-center h-8 w-8 rounded-full text-lg",
              isToday(date) && "bg-primary text-primary-foreground",
            )}
          >
            {format(date, "d")}
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] divide-x h-[600px] overflow-y-auto">
          <div className="flex flex-col text-sm text-muted-foreground">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b px-2 text-right py-1">
                {hour}:00
              </div>
            ))}
          </div>

          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b"></div>
            ))}

            {dayEvents.map((event) => {
              const startHour = Number.parseInt(event.startTime.split(":")[0])
              const startMinute = Number.parseInt(event.startTime.split(":")[1]) || 0
              const endHour = Number.parseInt(event.endTime.split(":")[0])
              const endMinute = Number.parseInt(event.endTime.split(":")[1]) || 0

              const top = (startHour + startMinute / 60) * 64
              const height = (endHour + endMinute / 60 - (startHour + startMinute / 60)) * 64

              return (
                <div
                  key={event.id}
                  className={cn(
                    "absolute left-0 right-0 mx-2 p-2 rounded text-sm overflow-hidden",
                    event.color,
                    event.color.includes("bg-red") && "text-white",
                    event.color.includes("bg-blue") && "text-white",
                    event.color.includes("bg-green") && "text-white",
                  )}
                  style={{
                    top: `${top}px`,
                    height: `${Math.max(height, 32)}px`,
                  }}
                  title={event.title}
                >
                  <div className="font-medium">{event.title}</div>
                  <div>
                    {event.startTime} - {event.endTime}
                  </div>
                  {event.description && height > 50 && <div className="text-xs mt-1">{event.description}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {view === "month" && renderMonthView()}
      {view === "week" && renderWeekView()}
      {view === "day" && renderDayView()}
    </div>
  )
}

