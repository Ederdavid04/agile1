"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface CycleTimeChartProps {
  height: number
  detailed?: boolean
}

export function CycleTimeChart({ height, detailed = false }: CycleTimeChartProps) {
  // En una aplicación real, estos datos vendrían de una API
  const data = [
    { week: "Semana 1", time: 5.2, average: 4.2 },
    { week: "Semana 2", time: 4.8, average: 4.2 },
    { week: "Semana 3", time: 4.5, average: 4.2 },
    { week: "Semana 4", time: 4.0, average: 4.2 },
    { week: "Semana 5", time: 3.8, average: 4.2 },
    { week: "Semana 6", time: 3.5, average: 4.2 },
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="time" stroke="#3b82f6" name="Días" strokeWidth={2} />
        <Line type="monotone" dataKey="average" stroke="#94a3b8" strokeDasharray="5 5" name="Promedio" />
        {detailed && (
          <ReferenceLine
            y={3.0}
            stroke="#10b981"
            strokeDasharray="3 3"
            label={{ value: "Objetivo", position: "insideBottomRight" }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

