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
    const { revieweeId, rating, reviewText } = body

    if (!revieweeId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if review already exists
    const existing = await sql`
      SELECT id FROM reviews 
      WHERE reviewer_id = ${session.id} AND reviewee_id = ${revieweeId}
    `

    if (existing.length > 0) {
      return NextResponse.json({ error: "You have already reviewed this user" }, { status: 409 })
    }

    // Create review
    await sql`
      INSERT INTO reviews (reviewer_id, reviewee_id, rating, review_text)
      VALUES (${session.id}, ${revieweeId}, ${rating}, ${reviewText || null})
    `

    // Create notification
    await sql`
      INSERT INTO notifications (user_id, type, title, message, link)
      VALUES (
        ${revieweeId},
        'review',
        'New review',
        ${`You received a ${rating}-star review`},
        ${`/user/${session.id}`}
      )
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error creating review:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const reviews = await sql`
      SELECT 
        r.id, r.rating, r.review_text, r.created_at,
        u.id as reviewer_id, u.name as reviewer_name, u.profile_image_url
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.reviewee_id = ${userId}
      ORDER BY r.created_at DESC
    `

    // Calculate average rating
    const avgResult = await sql`
      SELECT AVG(rating)::numeric(10,1) as avg_rating, COUNT(*) as review_count
      FROM reviews
      WHERE reviewee_id = ${userId}
    `

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        reviewText: r.review_text,
        createdAt: r.created_at,
        reviewer: {
          id: r.reviewer_id,
          name: r.reviewer_name,
          profileImageUrl: r.profile_image_url,
        },
      })),
      averageRating: avgResult[0]?.avg_rating ? Number.parseFloat(avgResult[0].avg_rating) : 0,
      reviewCount: Number(avgResult[0]?.review_count || 0),
    })
  } catch (error) {
    console.error("[v0] Error fetching reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
