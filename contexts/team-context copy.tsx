'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

export type TeamMember = {
  id: string
  name: string
  role: string
  email: string
  avatar?: string
}

export type Team = {
  label: string
  value: string
}

type TeamContextType = {
  teams: Team[]
  addTeam: (team: Team) => void
  members: TeamMember[]
  selectedTeam: Team | null
  setSelectedTeam: (team: Team) => void
  addMember: (member: TeamMember) => void
  removeMember: (id: string) => void
  isLoading: boolean
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export function TeamProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Cargar equipos al montar
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const res = await fetch('/api/teams')
        const data: Team[] = await res.json()
        setTeams(data)
        if (data.length > 0) {
          setSelectedTeam(data[0])
        }
      } catch (err) {
        console.error('Error cargando equipos:', err)
      }
    }
    

    loadTeams()
  }, [])

  // Cargar miembros cuando cambia el equipo seleccionado
  useEffect(() => {
    const loadMembers = async () => {
      if (!selectedTeam) return
      setIsLoading(true)
      try {
        const res = await fetch(`/api/team-members?teamId=${selectedTeam.value}`)
        const data: TeamMember[] = await res.json()
        setMembers(data)
      } catch (err) {
        console.error('Error cargando miembros del equipo:', err)
        setMembers([])
      } finally {
        setIsLoading(false)
      }
    }

    loadMembers()
  }, [selectedTeam])

  const addTeam = (team: Team) => {
    setTeams([...teams, team])
  }

  const addMember = (member: TeamMember) => {
    setMembers([...members, member])
  }

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

export function useTeam() {
  const context = useContext(TeamContext)
  if (context === undefined) {
    throw new Error('useTeam debe ser usado dentro de un TeamProvider')
  }
  return context
}
