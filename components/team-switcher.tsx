"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTeam } from "@/contexts/team-context"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {}

export function TeamSwitcher({ className }: TeamSwitcherProps) {
  const { teams, selectedTeam, setSelectedTeam, addTeam } = useTeam()
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [newTeamName, setNewTeamName] = React.useState("")

  const createNewTeam = () => {
    if (!newTeamName.trim()) return

    const newTeam = {
      label: newTeamName,
      value: newTeamName.toLowerCase().replace(/\s+/g, "-"),
    }

    addTeam(newTeam)
    setSelectedTeam(newTeam)
    setNewTeamName("")
    setShowNewTeamDialog(false)
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Seleccionar equipo"
            className={cn("w-[200px] justify-between", className)}
          >
            {selectedTeam ? (
              <>
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage src={`https://avatar.vercel.sh/${selectedTeam.value}.png`} alt={selectedTeam.label} />
                  <AvatarFallback>{selectedTeam.label.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {selectedTeam.label}
              </>
            ) : (
              <>Seleccionar equipo</>
            )}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar equipo..." />
            <CommandEmpty>No se encontraron equipos.</CommandEmpty>
            <CommandList>
              <CommandGroup heading="Equipos">
              {teams.map((team, index) => (
            <CommandItem
              key={team.value || index} // ← alternativo seguro si hay duplicados
              onSelect={() => {
                setSelectedTeam(team)
                setOpen(false)
              }}
              className="text-sm"
            >
              <Avatar className="mr-2 h-5 w-5">
                <AvatarImage src={`https://avatar.vercel.sh/${team.value}.png`} alt={team.label} />
                <AvatarFallback>{team.label.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {team.label}
              <CheckIcon
                className={cn(
                  "ml-auto h-4 w-4",
                  selectedTeam?.value === team.value ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}

              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setShowNewTeamDialog(true)
                  }}
                >
                  <PlusCircledIcon className="mr-2 h-5 w-5" />
                  Crear Equipo
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear equipo</DialogTitle>
          <DialogDescription>Añade un nuevo equipo para colaborar con tus compañeros.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del equipo</Label>
            <Input
              id="name"
              placeholder="Acme Inc."
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={createNewTeam}>Continuar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
