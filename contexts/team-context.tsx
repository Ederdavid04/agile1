// contexts/team-context.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Team = {
  label: string
  value: string
}

export type TeamMember = {
  id: number
  name: string
  role: string
  email: string
  avatar: string
}

interface TeamContextProps {
  teams: Team[]
  selectedTeam: Team | null
  setSelectedTeam: (team: Team) => void
  addTeam: (team: Omit<Team, "value">) => Promise<void>
  loading: boolean
  members: TeamMember[]
  membersLoading: boolean
}

const TeamContext = createContext<TeamContextProps | undefined>(undefined)

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [membersLoading, setMembersLoading] = useState<boolean>(false)

  // Obtener equipos desde la API
  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/teams")
      const data = await res.json()
      setTeams(data)
    } catch (error) {
      console.error("Error al obtener equipos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedTeam) return
      setMembersLoading(true)
      try {
        const res = await fetch(`/api/teams/${selectedTeam.value}/members`)
        const data = await res.json()
        setMembers(data)
      } catch (error) {
        console.error("Error al obtener miembros:", error)
        setMembers([])
      } finally {
        setMembersLoading(false)
      }
    }

    fetchMembers()
  }, [selectedTeam])

  const addTeam = async (team: Omit<Team, "value">) => {
    try {
      const newTeam = {
        label: team.label,
        value: team.label.toLowerCase().replace(/\s+/g, "-"),
      }

      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam),
      })

      if (!res.ok) throw new Error("Error al crear equipo")

      const createdTeam: Team = await res.json()
      setTeams((prev) => [...prev, createdTeam])
    } catch (error) {
      console.error("Error al agregar equipo:", error)
    }
  }

  return (
    <TeamContext.Provider
      value={{
        teams,
        selectedTeam,
        setSelectedTeam,
        addTeam,
        loading,
        members,
        membersLoading,
      }}
    >
      {children}
    </TeamContext.Provider>
  )
}

export const useTeam = () => {
  const context = useContext(TeamContext)
  if (!context) throw new Error("useTeam debe usarse dentro de TeamProvider")
  return context
}
