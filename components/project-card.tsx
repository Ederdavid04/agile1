import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Users } from "lucide-react"

interface ProjectCardProps {
  title: string
  description: string
  progress: number
  dueDate: string
  members: number
  tasks: {
    total: number
    completed: number
  }
}

export function ProjectCard({ title, description, progress, dueDate, members, tasks }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{dueDate}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{members} miembros</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="text-sm text-muted-foreground">
          {tasks.completed} de {tasks.total} tareas completadas
        </div>
      </CardFooter>
    </Card>
  )
}

