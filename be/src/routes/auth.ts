import { Router } from "express"
import { sql } from "../config/db"
import { hashPassword, verifyPassword, createSession } from "../utils/auth"

const router = Router()

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Check if user exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)

    const newUser = await sql`
      INSERT INTO users (email, password_hash, name, created_at, updated_at)
      VALUES (${email}, ${hashedPassword}, ${name}, NOW(), NOW())
      RETURNING id, email, name
    `

    const user = newUser[0]

    // Create session
    const token = await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user
    const users = await sql`
      SELECT id, email, name, password_hash FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = users[0]

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Create session
    const token = await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("session")
  res.json({ message: "Logged out successfully" })
})

export default router
