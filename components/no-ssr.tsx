"use client"

import { useEffect, useState, type ReactNode } from "react"

export function NoSSR({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // No renderizar nada durante SSR
  if (!mounted) {
    return null
  }

  return <>{children}</>
}

