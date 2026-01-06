import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Add to favorites
    await sql`
      INSERT INTO favorites (user_id, favorited_user_id)
      VALUES (${session.id}, ${userId})
      ON CONFLICT DO NOTHING
    `

    // Create notification for the favorited user
    await sql`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        ${userId},
        'favorite',
        'New connection!',
        'Someone added you to their favorites',
        ${`/user/${session.id}`}
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error adding favorite:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const favorites = await sql`
      SELECT 
        u.id, u.name, u.occupation, u.bio, u.location, u.profile_image_url
      FROM favorites f
      JOIN users u ON f.favorited_user_id = u.id
      WHERE f.user_id = ${session.id}
      ORDER BY f.created_at DESC
    `

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error("[v0] Error fetching favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
