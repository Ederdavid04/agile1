// app/api/login/route.ts
import { NextResponse } from "next/server"
import { db } from "../db/db"

// ajusta la ruta según dónde esté tu archivo

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    const [rows] = await db.execute(
      "SELECT id, nombre AS name, email, rol AS role, avatar FROM usuario WHERE email = ? AND contrasena = ?",
      [email, password]
    )

    if (Array.isArray(rows) && rows.length) {
      return NextResponse.json({ success: true, user: rows[0] })
    } else {
      return NextResponse.json({ success: false, message: "Credenciales incorrectas" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error de conexión:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
