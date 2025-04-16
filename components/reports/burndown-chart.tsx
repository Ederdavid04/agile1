"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface BurndownChartProps {
  height: number
  detailed?: boolean
}

export function BurndownChart({ height, detailed = false }: BurndownChartProps) {
  // En una aplicación real, estos datos vendrían de una API
  const data = [
    { day: "Día 1", remaining: 45, ideal: 45 },
    { day: "Día 2", remaining: 42, ideal: 40 },
    { day: "Día 3", remaining: 38, ideal: 35 },
    { day: "Día 4", remaining: 35, ideal: 30 },
    { day: "Día 5", remaining: 30, ideal: 25 },
    { day: "Día 6", remaining: 27, ideal: 20 },
    { day: "Día 7", remaining: 25, ideal: 15 },
    { day: "Día 8", remaining: 20, ideal: 10 },
    { day: "Día 9", remaining: 18, ideal: 5 },
    { day: "Día 10", remaining: 18, ideal: 0 },
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="remaining" stroke="#3b82f6" name="Puntos Restantes" strokeWidth={2} />
        <Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeDasharray="5 5" name="Línea Ideal" />
        {detailed && (
          <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeDasharray="3 3" name="Proyección" />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

