import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Activity {
  user: {
    name: string
    avatar: string
    initials: string
  }
  action: string
  item: string
  time: string
}

interface RecentActivityProps {
  activities?: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  // Datos por defecto si no se proporcionan actividades
  const defaultActivities = [
    {
      user: {
        name: "Ana M.",
        avatar: "/placeholder-user.jpg",
        initials: "AM",
      },
      action: "completó la tarea",
      item: "Diseñar página de inicio",
      time: "hace 10 minutos",
    },
    {
      user: {
        name: "Juan D.",
        avatar: "/placeholder-user.jpg",
        initials: "JD",
      },
      action: "comentó en",
      item: "Implementar autenticación",
      time: "hace 25 minutos",
    },
    {
      user: {
        name: "Teresa S.",
        avatar: "/placeholder-user.jpg",
        initials: "TS",
      },
      action: "creó la tarea",
      item: "Optimizar consultas SQL",
      time: "hace 1 hora",
    },
    {
      user: {
        name: "Roberto K.",
        avatar: "/placeholder-user.jpg",
        initials: "RK",
      },
      action: "movió la tarea",
      item: "Integrar API de pagos",
      time: "hace 2 horas",
    },
  ]

  const displayActivities = activities || defaultActivities

  return (
    <div className="space-y-4">
      {displayActivities.map((activity, index) => (
        <div key={index} className="flex items-start gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
              <span className="font-medium">{activity.item}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

