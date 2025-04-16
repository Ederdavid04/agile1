"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TaskDistributionChartProps {
  height: number
  detailed?: boolean
}

export function TaskDistributionChart({ height, detailed = false }: TaskDistributionChartProps) {
  // En una aplicación real, estos datos vendrían de una API
  const data = [
    { name: "Por Hacer", value: 12, color: "#94a3b8" },
    { name: "En Progreso", value: 8, color: "#f59e0b" },
    { name: "En Revisión", value: 5, color: "#3b82f6" },
    { name: "Completado", value: 27, color: "#10b981" },
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={detailed ? 120 : 80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

