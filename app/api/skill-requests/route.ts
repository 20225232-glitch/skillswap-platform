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
    const { providerId, skillId, message } = body

    if (!providerId || !skillId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create skill request
    await sql`
      INSERT INTO skill_requests (requester_id, provider_id, skill_id, message, status)
      VALUES (${session.id}, ${providerId}, ${skillId}, ${message || null}, 'pending')
    `

    // Create notification for the provider
    const skill = await sql`
      SELECT skill_name FROM skills WHERE id = ${skillId}
    `

    if (skill.length > 0) {
      await sql`
        INSERT INTO notifications (user_id, type, title, message, link)
        VALUES (
          ${providerId},
          'skill_request',
          'New skill swap request!',
          ${`Someone wants to swap skills for ${skill[0].skill_name}`},
          '/requests'
        )
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error creating skill request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get requests where user is the provider
    const requests = await sql`
      SELECT 
        sr.id, sr.status, sr.message, sr.created_at,
        u.id as requester_id, u.name as requester_name, u.profile_image_url,
        s.skill_name, s.skill_category
      FROM skill_requests sr
      JOIN users u ON sr.requester_id = u.id
      JOIN skills s ON sr.skill_id = s.id
      WHERE sr.provider_id = ${session.id}
      ORDER BY sr.created_at DESC
    `

    return NextResponse.json({
      requests: requests.map((r) => ({
        id: r.id,
        status: r.status,
        message: r.message,
        createdAt: r.created_at,
        requester: {
          id: r.requester_id,
          name: r.requester_name,
          profileImageUrl: r.profile_image_url,
        },
        skill: {
          name: r.skill_name,
          category: r.skill_category,
        },
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching skill requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
