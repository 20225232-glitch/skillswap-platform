import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get users with their skills
    const users = await sql`
      SELECT 
        u.id, u.name, u.occupation, u.bio, u.location, u.profile_image_url,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', s.id,
              'skillName', s.skill_name,
              'skillCategory', s.skill_category,
              'skillLevel', s.skill_level,
              'description', s.description
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as skills
      FROM users u
      LEFT JOIN skills s ON u.id = s.user_id
      WHERE u.id != ${session.id}
      GROUP BY u.id
      ORDER BY RANDOM()
      LIMIT 50
    `

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        occupation: u.occupation,
        bio: u.bio,
        location: u.location,
        profileImageUrl: u.profile_image_url,
        skills: u.skills,
      })),
    })
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
