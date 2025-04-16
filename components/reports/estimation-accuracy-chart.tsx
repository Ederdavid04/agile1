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
  Line,
  ComposedChart,
} from "recharts"

interface EstimationAccuracyChartProps {
  height: number
  detailed?: boolean
}

export function EstimationAccuracyChart({ height, detailed = false }: EstimationAccuracyChartProps) {
  // En una aplicación real, estos datos vendrían de una API
  const data = [
    { task: "Tarea 1", estimated: 5, actual: 6, accuracy: 83 },
    { task: "Tarea 2", estimated: 8, actual: 7, accuracy: 88 },
    { task: "Tarea 3", estimated: 3, actual: 4, accuracy: 75 },
    { task: "Tarea 4", estimated: 5, actual: 5, accuracy: 100 },
    { task: "Tarea 5", estimated: 13, actual: 18, accuracy: 72 },
    { task: "Tarea 6", estimated: 2, actual: 1.5, accuracy: 75 },
  ]

  if (detailed) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="task" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="estimated" fill="#94a3b8" name="Tiempo Estimado (días)" />
          <Bar yAxisId="left" dataKey="actual" fill="#3b82f6" name="Tiempo Real (días)" />
          <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#10b981" name="Precisión (%)" />
          <ReferenceLine
            yAxisId="right"
            y={80}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            label={{ value: "Objetivo: 80%", position: "insideBottomRight" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="task" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="estimated" fill="#94a3b8" name="Estimado" />
        <Bar dataKey="actual" fill="#3b82f6" name="Real" />
      </BarChart>
    </ResponsiveContainer>
  )
}

