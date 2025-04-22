import { db } from "../../db/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { teamValue: string } }) {
  // Buscar el equipo por valor
  const [equipoRows]: any = await db.query("SELECT id FROM equipo WHERE valor = ?", [params.teamValue])

  if (!equipoRows || equipoRows.length === 0) {
    return NextResponse.json([]) // No hay equipo con ese valor
  }

  const equipoId = equipoRows[0].id

  // Buscar miembros de ese equipo
  const [miembros]: any = await db.query(
    "SELECT id, nombre AS name, rol, correo AS email, avatar FROM miembro WHERE id_equipo = ?",
    [equipoId]
  )

  return NextResponse.json(miembros)
}
