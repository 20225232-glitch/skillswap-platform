import { Router } from "express"
import { requireAuth } from "../middleware/auth"
import { prisma } from "../config/db"

const router = Router()

// Get all users
router.get("/all", requireAuth, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: req.user!.id },
      },
      select: {
        id: true,
        name: true,
        bio: true,
        location: true,
        occupation: true,
        profile_image_url: true,
        skills_offered: {
          select: {
            skill_name: true,
            skill_category: true,
            skill_level: true,
          },
        },
      },
      take: 50,
    })
    res.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get nearby users (based on location)
router.get("/nearby", requireAuth, async (req, res) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { latitude: true, longitude: true, radius_km: true },
    })

    if (!currentUser?.latitude || !currentUser?.longitude) {
      return res.json({ users: [] })
    }

    // Simple implementation - in production, use PostGIS for proper geo queries
    const users = await prisma.user.findMany({
      where: {
        id: { not: req.user!.id },
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        bio: true,
        location: true,
        occupation: true,
        profile_image_url: true,
        latitude: true,
        longitude: true,
        skills_offered: {
          select: {
            skill_name: true,
            skill_category: true,
          },
        },
      },
      take: 20,
    })

    res.json({ users })
  } catch (error) {
    console.error("Error fetching nearby users:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get users for explore page
router.get("/explore", requireAuth, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: req.user!.id },
      },
      select: {
        id: true,
        name: true,
        bio: true,
        location: true,
        occupation: true,
        profile_image_url: true,
        skills_offered: {
          select: {
            skill_name: true,
            skill_category: true,
            skill_level: true,
          },
        },
      },
      take: 30,
      orderBy: { created_at: "desc" },
    })
    res.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get a specific user by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        bio: true,
        location: true,
        occupation: true,
        profile_image_url: true,
        created_at: true,
        skills_offered: {
          select: {
            id: true,
            skill_name: true,
            skill_category: true,
            skill_level: true,
            description: true,
            is_offering: true,
          },
        },
        reviews_received: {
          select: {
            id: true,
            rating: true,
            review_text: true,
            created_at: true,
            reviewer: {
              select: {
                id: true,
                name: true,
                profile_image_url: true,
              },
            },
          },
          orderBy: { created_at: "desc" },
          take: 10,
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
