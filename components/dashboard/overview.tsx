"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Datos de ejemplo para el gráfico
const data = [
  {
    name: "Día 1",
    total: 45,
    actual: 43,
  },
  {
    name: "Día 2",
    total: 40,
    actual: 38,
  },
  {
    name: "Día 3",
    total: 35,
    actual: 32,
  },
  {
    name: "Día 4",
    total: 30,
    actual: 28,
  },
  {
    name: "Día 5",
    total: 25,
    actual: 24,
  },
  {
    name: "Día 6",
    total: 20,
    actual: 19,
  },
  {
    name: "Día 7",
    total: 15,
    actual: 16,
  },
  {
    name: "Día 8",
    total: 10,
    actual: 13,
  },
  {
    name: "Día 9",
    total: 5,
    actual: 8,
  },
  {
    name: "Día 10",
    total: 0,
    actual: 0,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#adfa1d" strokeWidth={2} name="Ideal" />
        <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} name="Real" />
      </LineChart>
    </ResponsiveContainer>
  )
}

