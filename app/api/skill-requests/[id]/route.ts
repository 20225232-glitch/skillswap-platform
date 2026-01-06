import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    const requestId = Number.parseInt(params.id)

    if (Number.isNaN(requestId)) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 })
    }

    if (!status || !["accepted", "rejected", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update the request status
    await sql`
      UPDATE skill_requests
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${requestId} AND provider_id = ${session.id}
    `

    // Create notification for the requester
    const requestInfo = await sql`
      SELECT requester_id FROM skill_requests WHERE id = ${requestId}
    `

    if (requestInfo.length > 0) {
      const notificationMessage =
        status === "accepted" ? "Your skill swap request was accepted!" : "Your skill swap request was declined"

      await sql`
        INSERT INTO notifications (user_id, type, title, message, link)
        VALUES (
          ${requestInfo[0].requester_id},
          'request_update',
          ${notificationMessage},
          '',
          '/requests'
        )
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating skill request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
