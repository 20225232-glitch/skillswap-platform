import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, occupation, gender, birthDate } = body

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, name, occupation, gender, birth_date)
      VALUES (${email}, ${passwordHash}, ${name}, ${occupation || null}, ${gender || null}, ${birthDate || null})
      RETURNING id, email, name
    `

    const user = result[0]

    // Create session
    const token = await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
