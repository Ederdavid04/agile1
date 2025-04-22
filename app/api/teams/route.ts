import { db } from "../db/db"
import { NextResponse } from "next/server"

export async function GET() {
  const [rows] = await db.query("SELECT id, nombre as label, valor FROM equipo")
  return NextResponse.json(rows)
}
