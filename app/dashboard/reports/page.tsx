"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowDownToLine,
  BarChart3,
  Calendar,
  Clock,
  Download,
  FileText,
  LineChartIcon,
  PieChartIcon,
  Share2,
} from "lucide-react"
import { BurndownChart } from "@/components/reports/burndown-chart"
import { VelocityChart } from "@/components/reports/velocity-chart"
import { TaskDistributionChart } from "@/components/reports/task-distribution-chart"
import { CycleTimeChart } from "@/components/reports/cycle-time-chart"
import { EstimationAccuracyChart } from "@/components/reports/estimation-accuracy-chart"
import { ReportFilters } from "@/components/reports/report-filters"
import { useTeam } from "@/contexts/team-context"

// Datos por defecto para cuando no hay equipo seleccionado
const defaultReportData = {
  metrics: {
    velocity: "25",
    tasksCompleted: "50",
    cycleTime: "4.5",
    estimationAccuracy: "75",
  },
}

export default function ReportsPage() {
  const { selectedTeam } = useTeam()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedProject, setSelectedProject] = useState("all")
  const [dateRange, setDateRange] = useState("last-30-days")
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(defaultReportData)

  // Cargar datos basados en el equipo seleccionado
  useEffect(() => {
    if (!selectedTeam) return

    setIsLoading(true)

    // Simulamos la carga de datos específicos del equipo
    const loadTeamData = () => {
      // Datos simulados para cada equipo
      const teamData: Record<string, any> = {
        desarrollo: {
          metrics: {
            velocity: "32",
            tasksCompleted: "87",
            cycleTime: "4.2",
            estimationAccuracy: "78",
          },
        },
        diseno: {
          metrics: {
            velocity: "24",
            tasksCompleted: "65",
            cycleTime: "3.8",
            estimationAccuracy: "82",
          },
        },
        marketing: {
          metrics: {
            velocity: "18",
            tasksCompleted: "42",
            cycleTime: "5.1",
            estimationAccuracy: "70",
          },
        },
      }

      // Obtener datos del equipo seleccionado o usar datos por defecto
      const data = teamData[selectedTeam.value] || defaultReportData

      // Actualizar el estado con los datos del equipo
      setReportData(data)
      setIsLoading(false)
    }

    // Cargar datos después de un breve retraso
    const timerId = setTimeout(loadTeamData, 300)
    return () => clearTimeout(timerId)
  }, [selectedTeam])

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Reportes - {selectedTeam.label}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Programar
          </Button>
        </div>
      </div>

      <ReportFilters
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Cargando reportes...</p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="velocity">Velocidad</TabsTrigger>
            <TabsTrigger value="burndown">Burndown</TabsTrigger>
            <TabsTrigger value="distribution">Distribución</TabsTrigger>
            <TabsTrigger value="time">Tiempo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Velocidad Promedio"
                value={reportData.metrics.velocity}
                unit="puntos/sprint"
                change="+4"
                trend="up"
                description="Basado en los últimos 3 sprints"
                icon={<BarChart3 className="h-4 w-4" />}
              />
              <MetricCard
                title="Tareas Completadas"
                value={reportData.metrics.tasksCompleted}
                unit="tareas"
                change="+12"
                trend="up"
                description="En los últimos 30 días"
                icon={<FileText className="h-4 w-4" />}
              />
              <MetricCard
                title="Tiempo de Ciclo"
                value={reportData.metrics.cycleTime}
                unit="días"
                change="-0.8"
                trend="down"
                description="Promedio para completar tareas"
                icon={<Clock className="h-4 w-4" />}
              />
              <MetricCard
                title="Precisión de Estimación"
                value={reportData.metrics.estimationAccuracy}
                unit="%"
                change="+5"
                trend="up"
                description="Tareas completadas según lo estimado"
                icon={<ArrowDownToLine className="h-4 w-4" />}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-muted-foreground" />
                    Velocidad del Equipo
                  </CardTitle>
                  <CardDescription>Puntos completados por sprint</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <VelocityChart height={300} />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChartIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                    Burndown del Sprint Actual
                  </CardTitle>
                  <CardDescription>Progreso del sprint actual vs. ideal</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <BurndownChart height={300} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                    Distribución de Tareas
                  </CardTitle>
                  <CardDescription>Por estado actual</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <TaskDistributionChart height={250} />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                    Tiempo de Ciclo
                  </CardTitle>
                  <CardDescription>Días promedio para completar tareas</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <CycleTimeChart height={250} />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ArrowDownToLine className="mr-2 h-5 w-5 text-muted-foreground" />
                    Precisión de Estimación
                  </CardTitle>
                  <CardDescription>Estimado vs. tiempo real</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                  <EstimationAccuracyChart height={250} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resto de pestañas de reportes */}
          <TabsContent value="velocity" className="space-y-4">
            {/* Contenido de la pestaña de velocidad */}
          </TabsContent>

          <TabsContent value="burndown" className="space-y-4">
            {/* Contenido de la pestaña de burndown */}
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            {/* Contenido de la pestaña de distribución */}
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            {/* Contenido de la pestaña de tiempo */}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  unit: string
  change: string
  trend: "up" | "down"
  description: string
  icon: React.ReactNode
}

function MetricCard({ title, value, unit, change, trend, description, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
            {change} {trend === "up" ? "↑" : "↓"}
          </span>{" "}
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

