"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

// Crear un contexto para la vista previa del tema
export const ThemePreviewContext = React.createContext<{
  previewTheme: string | null
  setPreviewTheme: (theme: string | null) => void
}>({
  previewTheme: null,
  setPreviewTheme: () => {},
})

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Estado para la vista previa del tema
  const [previewTheme, setPreviewTheme] = React.useState<string | null>(null)

  // Aplicar la vista previa del tema si está establecida
  React.useEffect(() => {
    if (previewTheme) {
      // Guardar el tema actual en un atributo de datos en el elemento html
      const html = document.documentElement
      const currentTheme = html.getAttribute("data-theme") || props.defaultTheme || "system"
      html.setAttribute("data-original-theme", currentTheme)

      // Aplicar el tema de vista previa
      html.setAttribute("data-theme", previewTheme)

      // Aplicar la clase dark si corresponde
      if (previewTheme === "dark") {
        html.classList.add("dark")
      } else if (previewTheme === "light") {
        html.classList.remove("dark")
      } else if (previewTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        if (systemTheme === "dark") {
          html.classList.add("dark")
        } else {
          html.classList.remove("dark")
        }
      }
    } else {
      // Restaurar el tema original si no hay vista previa
      const html = document.documentElement
      const originalTheme = html.getAttribute("data-original-theme")
      if (originalTheme) {
        // Restaurar el tema original
        html.setAttribute("data-theme", originalTheme)

        if (originalTheme === "dark") {
          html.classList.add("dark")
        } else if (originalTheme === "light") {
          html.classList.remove("dark")
        } else if (originalTheme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
          if (systemTheme === "dark") {
            html.classList.add("dark")
          } else {
            html.classList.remove("dark")
          }
        }
        html.removeAttribute("data-original-theme")
      }
    }
  }, [previewTheme, props.defaultTheme])

  return (
    <ThemePreviewContext.Provider value={{ previewTheme, setPreviewTheme }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemePreviewContext.Provider>
  )
}

// Hook para usar la vista previa del tema
export function useThemePreview() {
  return React.useContext(ThemePreviewContext)
}