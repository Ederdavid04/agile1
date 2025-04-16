"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Error al cargar el calendario</CardTitle>
          </div>
          <CardDescription>Ha ocurrido un error al intentar cargar la página del calendario.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Detalles del error: {error.message || "Error desconocido"}</p>
          {error.digest && <p className="mt-2 text-xs text-muted-foreground">ID del error: {error.digest}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={() => reset()} className="w-full">
            Intentar de nuevo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

