import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current user's location
    const currentUser = await sql`
      SELECT latitude, longitude, radius_km FROM users WHERE id = ${session.id}
    `

    if (currentUser.length === 0) {
      return NextResponse.json({ users: [] })
    }

    // For now, just get all users except current user
    // In production, you'd calculate distance using haversine formula
    const users = await sql`
      SELECT 
        id, name, occupation, bio, location, profile_image_url
      FROM users 
      WHERE id != ${session.id}
      ORDER BY RANDOM()
      LIMIT 20
    `

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        occupation: u.occupation,
        bio: u.bio,
        location: u.location,
        profileImageUrl: u.profile_image_url,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching nearby users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
