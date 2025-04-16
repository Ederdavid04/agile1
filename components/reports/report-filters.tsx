"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

interface ReportFiltersProps {
  selectedProject: string
  onProjectChange: (value: string) => void
  dateRange: string
  onDateRangeChange: (value: string) => void
}

export function ReportFilters({ selectedProject, onProjectChange, dateRange, onDateRangeChange }: ReportFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="project-select">
                Proyecto
              </label>
              <Select value={selectedProject} onValueChange={onProjectChange}>
                <SelectTrigger id="project-select">
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los proyectos</SelectItem>
                  <SelectItem value="redesign">Rediseño de Plataforma</SelectItem>
                  <SelectItem value="mobile">App Móvil v2.0</SelectItem>
                  <SelectItem value="payments">Sistema de Pagos</SelectItem>
                  <SelectItem value="database">Migración de Base de Datos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="date-range-select">
                Período
              </label>
              <Select value={dateRange} onValueChange={onDateRangeChange}>
                <SelectTrigger id="date-range-select">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Últimos 7 días</SelectItem>
                  <SelectItem value="last-30-days">Últimos 30 días</SelectItem>
                  <SelectItem value="last-90-days">Últimos 90 días</SelectItem>
                  <SelectItem value="current-sprint">Sprint actual</SelectItem>
                  <SelectItem value="last-3-sprints">Últimos 3 sprints</SelectItem>
                  <SelectItem value="custom">Personalizado...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="team-select">
                Equipo
              </label>
              <Select defaultValue="all">
                <SelectTrigger id="team-select">
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los equipos</SelectItem>
                  <SelectItem value="development">Equipo de Desarrollo</SelectItem>
                  <SelectItem value="design">Equipo de Diseño</SelectItem>
                  <SelectItem value="marketing">Equipo de Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button variant="outline" size="sm" className="ml-auto">
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

