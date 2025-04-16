"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Datos de ejemplo para el gráfico de horas trabajadas
const data = [
  {
    name: "Ana M.",
    planificadas: 40,
    reales: 38,
  },
  {
    name: "Juan P.",
    planificadas: 35,
    reales: 32,
  },
  {
    name: "María L.",
    planificadas: 30,
    reales: 33,
  },
  {
    name: "Carlos R.",
    planificadas: 25,
    reales: 22,
  },
  {
    name: "Laura S.",
    planificadas: 20,
    reales: 18,
  },
]

export function HoursChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}h`}
        />
        <Tooltip formatter={(value) => [`${value} horas`, ""]} labelFormatter={(label) => `Miembro: ${label}`} />
        <Legend />
        <Bar dataKey="planificadas" name="Horas Planificadas" fill="#8884d8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="reales" name="Horas Reales" fill="#82ca9d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

