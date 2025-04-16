import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { TeamMember } from "@/contexts/team-context"

interface TeamMembersProps {
  members: TeamMember[]
  isLoading: boolean
}

export function TeamMembers({ members, isLoading }: TeamMembersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>Cargando miembros del equipo...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Asegurarnos de que members no sea undefined
  const teamMembers = members || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Miembros del Equipo</CardTitle>
        <CardDescription>{teamMembers.length} miembros activos en el proyecto</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <div className="ml-auto">
                <Badge variant="outline">{member.role}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

