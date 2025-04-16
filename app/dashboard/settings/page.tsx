"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Moon, Save, Sun } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useThemePreview } from "@/components/theme-provider"

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { previewTheme, setPreviewTheme } = useThemePreview()
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)

  // Añadir estado para el tema seleccionado (vista previa)
  const [selectedTheme, setSelectedTheme] = useState(theme || "system")

  // Actualizar el tema seleccionado cuando cambia el tema actual
  useEffect(() => {
    setSelectedTheme(theme || "system")
  }, [theme])

  // Aplicar la vista previa del tema cuando cambia la pestaña o el tema seleccionado
  useEffect(() => {
    if (activeTab === "appearance") {
      // Guardar el tema actual como vista previa
      setPreviewTheme(selectedTheme)
    } else {
      // Restaurar el tema actual cuando salimos de la pestaña de apariencia
      setPreviewTheme(null)
    }
  }, [activeTab, selectedTheme, setPreviewTheme])

  // Restaurar el tema cuando se desmonta el componente
  useEffect(() => {
    return () => {
      setPreviewTheme(null)
    }
  }, [setPreviewTheme])

  // Estados para los formularios
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "Desarrollador de software con experiencia en metodologías ágiles y gestión de proyectos.",
    role: user?.role || "user",
  })

  const [notificationsForm, setNotificationsForm] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    mentionNotifications: true,
    taskAssignments: true,
    taskUpdates: true,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationsForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveProfile = () => {
    setIsSaving(true)
    // Simulación de guardado
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Perfil actualizado",
        description: "Los cambios en tu perfil han sido guardados correctamente.",
      })
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setIsSaving(true)
    // Simulación de guardado
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Preferencias de notificaciones actualizadas",
        description: "Tus preferencias de notificaciones han sido guardadas correctamente.",
      })
    }, 1000)
  }

  // Función para guardar el tema seleccionado
  const handleSaveAppearance = () => {
    setIsSaving(true)

    // Aplicar el tema seleccionado a toda la aplicación
    setTheme(selectedTheme)
    setPreviewTheme(null)

    // Simulación de guardado
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Preferencias de apariencia guardadas",
        description: "Tus preferencias de apariencia han sido actualizadas.",
      })
    }, 1000)
  }

  // Función para mostrar vista previa del tema
  const handleThemePreview = (theme: string) => {
    setSelectedTheme(theme)
    setPreviewTheme(theme)
  }

  return (
    <div className="space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        {/* Configuración de Perfil */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de Perfil</CardTitle>
              <CardDescription>Actualiza tu información personal y de contacto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Cambiar foto
                  </Button>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Profesional</CardTitle>
              <CardDescription>Actualiza tu información profesional y de rol.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={profileForm.role}
                    onValueChange={(value) => setProfileForm((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Usuario</SelectItem>
                      <SelectItem value="developer">Desarrollador</SelectItem>
                      <SelectItem value="designer">Diseñador</SelectItem>
                      <SelectItem value="product_manager">Product Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select defaultValue="development">
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Selecciona un departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Desarrollo</SelectItem>
                      <SelectItem value="design">Diseño</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Ventas</SelectItem>
                      <SelectItem value="hr">Recursos Humanos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Habilidades</Label>
                <Textarea
                  id="skills"
                  placeholder="JavaScript, React, Node.js, Scrum, Kanban..."
                  defaultValue="JavaScript, React, Next.js, TypeScript, Scrum, Kanban, Gestión de Proyectos"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Configuración de Apariencia */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tema</CardTitle>
              <CardDescription>Personaliza la apariencia de la aplicación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Modo de color</Label>
                <div className="flex flex-col md:flex-row gap-4">
                  <Card
                    className={`flex-1 cursor-pointer border-2 ${selectedTheme === "light" ? "border-primary" : "border-muted"}`}
                    onClick={() => handleThemePreview("light")}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
                      <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center border">
                        <Sun className="h-12 w-12 text-yellow-500" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">Claro</h3>
                        <p className="text-sm text-muted-foreground">Tema con fondo claro</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`flex-1 cursor-pointer border-2 ${selectedTheme === "dark" ? "border-primary" : "border-muted"}`}
                    onClick={() => handleThemePreview("dark")}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
                      <div className="h-24 w-24 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                        <Moon className="h-12 w-12 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">Oscuro</h3>
                        <p className="text-sm text-muted-foreground">Tema con fondo oscuro</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`flex-1 cursor-pointer border-2 ${selectedTheme === "system" ? "border-primary" : "border-muted"}`}
                    onClick={() => handleThemePreview("system")}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-white to-slate-900 flex items-center justify-center border">
                        <div className="flex">
                          <Sun className="h-8 w-8 text-yellow-500" />
                          <Moon className="h-8 w-8 text-slate-400 -ml-2" />
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">Sistema</h3>
                        <p className="text-sm text-muted-foreground">Sigue la configuración del sistema</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Densidad de la interfaz</Label>
                <Select defaultValue="comfortable">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la densidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Cómoda</SelectItem>
                    <SelectItem value="compact">Compacta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">Animaciones</Label>
                  <Switch id="animations" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Habilitar animaciones en la interfaz de usuario.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveAppearance} disabled={isSaving || selectedTheme === theme}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar preferencias
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Configuración de Notificaciones */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Configura cómo y cuándo quieres recibir notificaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Canales de notificación</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Notificaciones por correo</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones importantes por correo electrónico.
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationsForm.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">Notificaciones push</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones en tiempo real en tu navegador.
                      </p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationsForm.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weeklyDigest">Resumen semanal</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe un resumen semanal de la actividad de tus proyectos.
                      </p>
                    </div>
                    <Switch
                      id="weeklyDigest"
                      checked={notificationsForm.weeklyDigest}
                      onCheckedChange={(checked) => handleNotificationChange("weeklyDigest", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Tipos de notificaciones</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mentionNotifications">Menciones</Label>
                      <p className="text-sm text-muted-foreground">
                        Cuando alguien te menciona en un comentario o tarea.
                      </p>
                    </div>
                    <Switch
                      id="mentionNotifications"
                      checked={notificationsForm.mentionNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("mentionNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="taskAssignments">Asignación de tareas</Label>
                      <p className="text-sm text-muted-foreground">Cuando se te asigna una nueva tarea.</p>
                    </div>
                    <Switch
                      id="taskAssignments"
                      checked={notificationsForm.taskAssignments}
                      onCheckedChange={(checked) => handleNotificationChange("taskAssignments", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="taskUpdates">Actualizaciones de tareas</Label>
                      <p className="text-sm text-muted-foreground">Cuando hay cambios en tareas que estás siguiendo.</p>
                    </div>
                    <Switch
                      id="taskUpdates"
                      checked={notificationsForm.taskUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("taskUpdates", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveNotifications} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar preferencias
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

