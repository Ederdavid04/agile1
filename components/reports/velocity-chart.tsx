"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface VelocityChartProps {
  height: number
  detailed?: boolean
}

export function VelocityChart({ height, detailed = false }: VelocityChartProps) {
  // En una aplicación real, estos datos vendrían de una API
  const data = [
    { sprint: "Sprint 1", committed: 30, completed: 25 },
    { sprint: "Sprint 2", committed: 35, completed: 32 },
    { sprint: "Sprint 3", committed: 40, completed: 38 },
    { sprint: "Sprint 4", committed: 38, completed: 40 },
    { sprint: "Sprint 5", committed: 42, completed: 39 },
  ]

  // Calcular el promedio de puntos completados
  const average = data.reduce((sum, item) => sum + item.completed, 0) / data.length

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sprint" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="committed" fill="#94a3b8" name="Puntos Comprometidos" />
        <Bar dataKey="completed" fill="#3b82f6" name="Puntos Completados" />
        <ReferenceLine
          y={average}
          stroke="#f59e0b"
          strokeDasharray="3 3"
          label={{ value: `Promedio: ${average.toFixed(1)}`, position: "insideBottomRight" }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

