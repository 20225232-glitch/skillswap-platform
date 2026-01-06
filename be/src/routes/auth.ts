import { Router } from "express"
import { prisma } from "../config/db"
import { hashPassword, verifyPassword, createSession } from "../utils/auth"

const router = Router()

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    // Create session
    const token = await createSession({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    })

    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.json({ user: newUser })
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

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password_hash: true,
      },
    })

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    })

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

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
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
