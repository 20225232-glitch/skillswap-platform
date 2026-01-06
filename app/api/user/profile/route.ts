import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await sql`
      SELECT 
        u.id, u.email, u.name, u.bio, u.occupation, u.gender, u.birth_date,
        u.location, u.latitude, u.longitude, u.radius_km, u.profile_image_url,
        u.created_at,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('id', i.id, 'name', i.name, 'category', i.category)
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'
        ) as interests,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', s.id, 
              'skill_name', s.skill_name,
              'skill_category', s.skill_category,
              'skill_level', s.skill_level,
              'description', s.description,
              'is_offering', s.is_offering
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as skills
      FROM users u
      LEFT JOIN user_interests ui ON u.id = ui.user_id
      LEFT JOIN interests i ON ui.interest_id = i.id
      LEFT JOIN skills s ON u.id = s.user_id
      WHERE u.id = ${session.id}
      GROUP BY u.id
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: users[0] })
  } catch (error) {
    console.error("[v0] Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { occupation, gender, birthDate, bio, location, latitude, longitude, radius, interests, profileImageUrl } =
      body

    // Update user profile
    await sql`
      UPDATE users
      SET 
        occupation = COALESCE(${occupation}, occupation),
        gender = COALESCE(${gender}, gender),
        birth_date = COALESCE(${birthDate}, birth_date),
        bio = COALESCE(${bio}, bio),
        location = COALESCE(${location}, location),
        latitude = COALESCE(${latitude}, latitude),
        longitude = COALESCE(${longitude}, longitude),
        radius_km = COALESCE(${radius}, radius_km),
        profile_image_url = COALESCE(${profileImageUrl}, profile_image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${session.id}
    `

    // Update interests if provided
    if (interests && Array.isArray(interests)) {
      // First, delete existing interests
      await sql`DELETE FROM user_interests WHERE user_id = ${session.id}`

      // Then add new interests
      for (const interestName of interests) {
        const interestResult = await sql`
          SELECT id FROM interests WHERE name = ${interestName}
        `

        if (interestResult.length > 0) {
          await sql`
            INSERT INTO user_interests (user_id, interest_id)
            VALUES (${session.id}, ${interestResult[0].id})
            ON CONFLICT DO NOTHING
          `
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
