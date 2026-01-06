import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const skills = await sql`
      SELECT 
        id, skill_name, skill_category, skill_level, description, 
        is_offering, created_at
      FROM skills
      WHERE user_id = ${session.id}
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      skills: skills.map((s) => ({
        id: s.id,
        skillName: s.skill_name,
        skillCategory: s.skill_category,
        skillLevel: s.skill_level,
        description: s.description,
        isOffering: s.is_offering,
        createdAt: s.created_at,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching skills:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { skillName, skillCategory, skillLevel, description, isOffering } = body

    if (!skillName || !skillCategory || !skillLevel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await sql`
      INSERT INTO skills (user_id, skill_name, skill_category, skill_level, description, is_offering)
      VALUES (${session.id}, ${skillName}, ${skillCategory}, ${skillLevel}, ${description || null}, ${isOffering})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error creating skill:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
