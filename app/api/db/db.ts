// app/api/db/db.ts
import mysql from "mysql2/promise"

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "198422",
  database: "agil",
})
