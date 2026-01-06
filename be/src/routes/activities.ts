import { Router } from "express"
import { requireAuth } from "../middleware/auth"
import { prisma } from "../config/db"

const router = Router()

// Get nearby activities (skill requests)
router.get("/nearby", requireAuth, async (req, res) => {
  try {
    const activities = await prisma.skillRequest.findMany({
      where: {
        status: "pending",
        requester_id: { not: req.user!.id },
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profile_image_url: true,
            location: true,
          },
        },
        skill: {
          select: {
            skill_name: true,
            skill_category: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 20,
    })
    res.json({ activities })
  } catch (error) {
    console.error("Error fetching nearby activities:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get my activities
router.get("/my-activities", requireAuth, async (req, res) => {
  try {
    const activities = await prisma.skillRequest.findMany({
      where: {
        OR: [{ requester_id: req.user!.id }, { provider_id: req.user!.id }],
        status: { in: ["pending", "accepted"] },
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profile_image_url: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            profile_image_url: true,
          },
        },
        skill: {
          select: {
            skill_name: true,
            skill_category: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    })
    res.json({ activities })
  } catch (error) {
    console.error("Error fetching my activities:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get pending requests
router.get("/requests", requireAuth, async (req, res) => {
  try {
    const requests = await prisma.skillRequest.findMany({
      where: {
        provider_id: req.user!.id,
        status: "pending",
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profile_image_url: true,
          },
        },
        skill: {
          select: {
            skill_name: true,
            skill_category: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    })
    res.json({ requests })
  } catch (error) {
    console.error("Error fetching requests:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get past activities
router.get("/past", requireAuth, async (req, res) => {
  try {
    const activities = await prisma.skillRequest.findMany({
      where: {
        OR: [{ requester_id: req.user!.id }, { provider_id: req.user!.id }],
        status: { in: ["completed", "rejected"] },
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            profile_image_url: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            profile_image_url: true,
          },
        },
        skill: {
          select: {
            skill_name: true,
            skill_category: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      take: 30,
    })
    res.json({ activities })
  } catch (error) {
    console.error("Error fetching past activities:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get favorited activities
router.get("/favorites", requireAuth, async (req, res) => {
  try {
    // Get skills from favorited users
    const favorites = await prisma.favorite.findMany({
      where: { user_id: req.user!.id },
      include: {
        favorited_user: {
          select: {
            id: true,
            name: true,
            profile_image_url: true,
            skills_offered: {
              select: {
                id: true,
                skill_name: true,
                skill_category: true,
                description: true,
              },
            },
          },
        },
      },
    })

    res.json({ favorites })
  } catch (error) {
    console.error("Error fetching favorite activities:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
