import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notifications = await sql`
      SELECT id, type, title, message, link, is_read, created_at
      FROM notifications
      WHERE user_id = ${session.id}
      ORDER BY created_at DESC
      LIMIT 50
    `

    // Mark as read
    await sql`
      UPDATE notifications
      SET is_read = true
      WHERE user_id = ${session.id} AND is_read = false
    `

    return NextResponse.json({
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        isRead: n.is_read,
        createdAt: n.created_at,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
