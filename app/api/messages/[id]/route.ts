import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const otherUserId = Number.parseInt(params.id)

    if (Number.isNaN(otherUserId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    // Get messages between current user and other user
    const messages = await sql`
      SELECT id, sender_id, receiver_id, message_text, is_read, created_at
      FROM messages
      WHERE 
        (sender_id = ${session.id} AND receiver_id = ${otherUserId})
        OR (sender_id = ${otherUserId} AND receiver_id = ${session.id})
      ORDER BY created_at ASC
    `

    // Mark messages as read
    await sql`
      UPDATE messages
      SET is_read = true
      WHERE sender_id = ${otherUserId} AND receiver_id = ${session.id} AND is_read = false
    `

    return NextResponse.json({
      messages: messages.map((m) => ({
        id: m.id,
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        messageText: m.message_text,
        isRead: m.is_read,
        createdAt: m.created_at,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
