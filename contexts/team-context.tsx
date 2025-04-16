"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Definir el tipo de miembro del equipo
export type TeamMember = {
  id: string
  name: string
  role: string
  email: string
  avatar?: string
}

// Definir el tipo de equipo
export type Team = {
  label: string
  value: string
}

// Definir el tipo del contexto de equipo
type TeamContextType = {
  teams: Team[]
  addTeam: (team: Team) => void
  members: TeamMember[]
  selectedTeam: Team
  setSelectedTeam: (team: Team) => void
  addMember: (member: TeamMember) => void
  removeMember: (id: string) => void
  isLoading: boolean
}

// Crear el contexto
const TeamContext = createContext<TeamContextType | undefined>(undefined)

// Proveedor del contexto
export function TeamProvider({ children }: { children: ReactNode }) {
  // Lista de equipos disponibles
  const [teams, setTeams] = useState<Team[]>([
    {
      label: "Equipo de Desarrollo",
      value: "desarrollo",
    },
    {
      label: "Equipo de Diseño",
      value: "diseno",
    },
    {
      label: "Equipo de Marketing",
      value: "marketing",
    },
  ])

  // Equipo seleccionado actualmente
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0])

  const [isLoading, setIsLoading] = useState(true)
  const [members, setMembers] = useState<TeamMember[]>([])

  // Datos de ejemplo para miembros del equipo
  const defaultTeamMembers: Record<string, TeamMember[]> = {
    desarrollo: [
      {
        id: "1",
        name: "Ana Martínez",
        role: "Product Owner",
        email: "ana@ejemplo.com",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: "2",
        name: "Juan Pérez",
        role: "Scrum Master",
        email: "juan@ejemplo.com",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: "3",
        name: "María López",
        role: "Desarrollador Frontend",
        email: "maria@ejemplo.com",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: "4",
        name: "Carlos Rodríguez",
        role: "Desarrollador Backend",
        email: "carlos@ejemplo.com",
        avatar: "/placeholder-user.jpg",
      },
    ],
    diseno: [
      {
        id: "5",
        name: "Laura Sánchez",
        role: "Diseñador UX/UI",
        email: "laura@ejemplo.com",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: "6",
        name: "Pedro Gómez",
        role: "Diseñador Gráfico",
        email: "pedro@ejemplo.com",
        avatar: "/placeholder-user.jpg",
      },
    ],
    marketing: [
      {
        id: "7",
        name: "Sofía Torres",
        role: "Marketing Manager",
        email: "sofia@ejemplo.com",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: "8",
        name: "Miguel Álvarez",
        role: "Content Creator",
        email: "miguel@ejemplo.com",
        avatar: "/placeholder-user.jpg",
      },
    ],
  }

  // Efecto para cargar los miembros del equipo cuando cambia el equipo seleccionado
  useEffect(() => {
    const loadTeamMembers = async () => {
      setIsLoading(true)
      try {
        // Simulamos una llamada a API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Cargar miembros según el equipo seleccionado
        const teamKey = selectedTeam.value as keyof typeof defaultTeamMembers
        const teamMembers = defaultTeamMembers[teamKey] || []

        setMembers(teamMembers)
      } catch (error) {
        console.error("Error loading team members:", error)
        setMembers([])
      } finally {
        setIsLoading(false)
      }
    }

    loadTeamMembers()
  }, [selectedTeam])

  // Función para añadir un equipo
  const addTeam = (team: Team) => {
    setTeams([...teams, team])
  }

  // Función para añadir un miembro al equipo
  const addMember = (member: TeamMember) => {
    setMembers([...members, member])
  }

  // Función para eliminar un miembro del equipo
  const removeMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id))
  }

  return (
    <TeamContext.Provider
      value={{
        teams,
        addTeam,
        members,
        selectedTeam,
        setSelectedTeam,
        addMember,
        removeMember,
        isLoading,
      }}
    >
      {children}
    </TeamContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export function useTeam() {
  const context = useContext(TeamContext)
  if (context === undefined) {
    throw new Error("useTeam debe ser usado dentro de un TeamProvider")
  }
  return context
}

