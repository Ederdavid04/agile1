"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Calendar, LayoutDashboard, ListTodo, Settings, Trello } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface DashboardNavProps {
  className?: string
}

export function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Definir los elementos de navegación según el rol del usuario
  const navItems =
    user?.role === "admin"
      ? [
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "Tablero Kanban",
            href: "/dashboard/board",
            icon: Trello,
          },
          {
            title: "Backlog",
            href: "/dashboard/backlog",
            icon: ListTodo,
          },
          {
            title: "Calendario",
            href: "/dashboard/calendario",
            icon: Calendar,
          },
          {
            title: "Reportes",
            href: "/dashboard/reports",
            icon: BarChart3,
          },
          {
            title: "Configuración",
            href: "/dashboard/settings",
            icon: Settings,
          },
        ]
      : [
          {
            title: "Mis Tareas",
            href: "/dashboard",
            icon: Trello,
          },
          {
            title: "Backlog",
            href: "/dashboard/backlog",
            icon: ListTodo,
          },
          {
            title: "Calendario",
            href: "/dashboard/calendario",
            icon: Calendar,
          },
        ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

