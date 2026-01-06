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
    const { receiverId, messageText } = body

    if (!receiverId || !messageText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert message
    await sql`
      INSERT INTO messages (sender_id, receiver_id, message_text)
      VALUES (${session.id}, ${receiverId}, ${messageText})
    `

    // Create notification
    await sql`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        ${receiverId},
        'message',
        'New message',
        'You have a new message',
        ${`/messages/${session.id}`}
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
