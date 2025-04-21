import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "198422",
      database: "agil",
    })

    const [rows] = await connection.execute(
      "SELECT id, nombre AS name, email, rol AS role, avatar FROM usuario WHERE email = ? AND contrasena = ?",
      [email, password]
    )

    await connection.end()

    // Verificar si se encontró un usuario
    if (Array.isArray(rows) && rows.length === 1) {
      return NextResponse.json({ success: true, user: rows[0] })
    } else {
      return NextResponse.json({ success: false, message: "Credenciales incorrectas" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error de conexión:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
