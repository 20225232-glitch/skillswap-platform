import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all conversations with last message
    const conversations = await sql`
      WITH last_messages AS (
        SELECT 
          CASE 
            WHEN sender_id = ${session.id} THEN receiver_id 
            ELSE sender_id 
          END as other_user_id,
          message_text,
          created_at,
          ROW_NUMBER() OVER (
            PARTITION BY CASE 
              WHEN sender_id = ${session.id} THEN receiver_id 
              ELSE sender_id 
            END 
            ORDER BY created_at DESC
          ) as rn
        FROM messages
        WHERE sender_id = ${session.id} OR receiver_id = ${session.id}
      ),
      unread_counts AS (
        SELECT sender_id, COUNT(*) as unread_count
        FROM messages
        WHERE receiver_id = ${session.id} AND is_read = false
        GROUP BY sender_id
      )
      SELECT 
        u.id as user_id,
        u.name as user_name,
        u.profile_image_url as user_profile_image,
        lm.message_text as last_message,
        lm.created_at as last_message_time,
        COALESCE(uc.unread_count, 0) as unread_count
      FROM last_messages lm
      JOIN users u ON lm.other_user_id = u.id
      LEFT JOIN unread_counts uc ON uc.sender_id = u.id
      WHERE lm.rn = 1
      ORDER BY lm.created_at DESC
    `

    return NextResponse.json({
      conversations: conversations.map((c) => ({
        userId: c.user_id,
        userName: c.user_name,
        userProfileImage: c.user_profile_image,
        lastMessage: c.last_message,
        lastMessageTime: c.last_message_time,
        unreadCount: Number(c.unread_count),
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
