"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para los niveles del proyecto
const projectLevels = [
  {
    name: "Planificación",
    progress: 100,
    status: "completed",
  },
  {
    name: "Diseño",
    progress: 85,
    status: "in-progress",
  },
  {
    name: "Desarrollo",
    progress: 60,
    status: "in-progress",
  },
  {
    name: "Pruebas",
    progress: 30,
    status: "in-progress",
  },
  {
    name: "Despliegue",
    progress: 0,
    status: "pending",
  },
]

export function ProjectProgress() {
  return (
    <div className="space-y-6">
      {projectLevels.map((level) => (
        <div key={level.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{level.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{level.progress}%</span>
              <Badge
                variant={
                  level.status === "completed" ? "default" : level.status === "in-progress" ? "secondary" : "outline"
                }
              >
                {level.status === "completed"
                  ? "Completado"
                  : level.status === "in-progress"
                    ? "En progreso"
                    : "Pendiente"}
              </Badge>
            </div>
          </div>
          <Progress value={level.progress} className="h-2" />
          {level.status === "in-progress" && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Próximo hito:{" "}
                {level.name === "Diseño"
                  ? "Aprobación final de mockups"
                  : level.name === "Desarrollo"
                    ? "Completar módulo de usuarios"
                    : "Pruebas de integración"}
              </span>
              <span>{level.name === "Diseño" ? "2 días" : level.name === "Desarrollo" ? "5 días" : "10 días"}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

