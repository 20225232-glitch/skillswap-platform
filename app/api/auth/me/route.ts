import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ user: null })
    }

    // Get full user data
    const users = await sql`
      SELECT id, email, name, bio, occupation, gender, birth_date, location, 
             latitude, longitude, radius_km, profile_image_url, created_at
      FROM users 
      WHERE id = ${session.id}
    `

    if (users.length === 0) {
      return NextResponse.json({ user: null })
    }

    const user = users[0]

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Get session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
