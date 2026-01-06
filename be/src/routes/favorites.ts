import { Router } from "express"
import { requireAuth } from "../middleware/auth"
import { prisma } from "../config/db"

const router = Router()

// Get all favorites for the authenticated user
router.get("/", requireAuth, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { user_id: req.user!.id },
      include: {
        favorited_user: {
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
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    })
    res.json({ favorites })
  } catch (error) {
    console.error("Error fetching favorites:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get users who favorited me
router.get("/favorited-me", requireAuth, async (req, res) => {
  try {
    const favoritedBy = await prisma.favorite.findMany({
      where: { favorited_user_id: req.user!.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_image_url: true,
            location: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    })
    res.json({ favoritedBy })
  } catch (error) {
    console.error("Error fetching favorited by:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Add a favorite
router.post("/", requireAuth, async (req, res) => {
  try {
    const { favorited_user_id } = req.body

    if (!favorited_user_id) {
      return res.status(400).json({ error: "favorited_user_id is required" })
    }

    const favorite = await prisma.favorite.create({
      data: {
        user_id: req.user!.id,
        favorited_user_id,
      },
    })

    res.json({ favorite })
  } catch (error) {
    console.error("Error adding favorite:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Remove a favorite
router.delete("/", requireAuth, async (req, res) => {
  try {
    const { favorited_user_id } = req.body

    if (!favorited_user_id) {
      return res.status(400).json({ error: "favorited_user_id is required" })
    }

    await prisma.favorite.delete({
      where: {
        user_id_favorited_user_id: {
          user_id: req.user!.id,
          favorited_user_id,
        },
      },
    })

    res.json({ message: "Favorite removed successfully" })
  } catch (error) {
    console.error("Error removing favorite:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
