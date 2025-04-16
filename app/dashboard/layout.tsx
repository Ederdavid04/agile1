import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Suspense } from "react"
import { TeamSwitcher } from "@/components/team-switcher"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex flex-1 items-center gap-4 md:gap-6">
            <a href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="text-primary">Agile PM</span>
            </a>
            <TeamSwitcher />
            <Suspense fallback={<div className="flex-1" />}>
              <DashboardNav className="hidden md:flex" />
            </Suspense>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserNav />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  )
}

