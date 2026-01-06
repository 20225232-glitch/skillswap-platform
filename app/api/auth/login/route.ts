import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const users = await sql`
      SELECT id, email, name, password_hash FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Update last login
    await sql`
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ${user.id}
    `

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
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
