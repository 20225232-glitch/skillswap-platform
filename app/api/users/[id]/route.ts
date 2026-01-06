import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(params.id)

    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    // Get user profile with skills and interests
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
              'description', s.description,
              'isOffering', s.is_offering
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as skills,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('name', i.name, 'category', i.category)
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'
        ) as interests
      FROM users u
      LEFT JOIN skills s ON u.id = s.user_id
      LEFT JOIN user_interests ui ON u.id = ui.user_id
      LEFT JOIN interests i ON ui.interest_id = i.id
      WHERE u.id = ${userId}
      GROUP BY u.id
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is in favorites
    const favorites = await sql`
      SELECT 1 FROM favorites 
      WHERE user_id = ${session.id} AND favorited_user_id = ${userId}
    `

    return NextResponse.json({
      user: {
        id: users[0].id,
        name: users[0].name,
        occupation: users[0].occupation,
        bio: users[0].bio,
        location: users[0].location,
        profileImageUrl: users[0].profile_image_url,
        skills: users[0].skills,
        interests: users[0].interests,
      },
      isFavorite: favorites.length > 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
