import { Router } from "express"
import { requireAuth } from "../middleware/auth"
import { prisma } from "../config/db"

const router = Router()

// Get all skill requests for the authenticated user
router.get("/", requireAuth, async (req, res) => {
  try {
    const [requestsMade, requestsReceived] = await Promise.all([
      prisma.skillRequest.findMany({
        where: { requester_id: req.user!.id },
        include: {
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
      }),
      prisma.skillRequest.findMany({
        where: { provider_id: req.user!.id },
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
      }),
    ])

    res.json({ requestsMade, requestsReceived })
  } catch (error) {
    console.error("Error fetching skill requests:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create a new skill request
router.post("/", requireAuth, async (req, res) => {
  try {
    const { provider_id, skill_id, message } = req.body

    if (!provider_id || !skill_id) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const skillRequest = await prisma.skillRequest.create({
      data: {
        requester_id: req.user!.id,
        provider_id,
        skill_id,
        message,
        status: "pending",
      },
    })

    res.json({ skillRequest })
  } catch (error) {
    console.error("Error creating skill request:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update skill request status
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const requestId = Number.parseInt(req.params.id)
    const { status } = req.body

    if (!status || !["pending", "accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const skillRequest = await prisma.skillRequest.findUnique({
      where: { id: requestId },
    })

    if (!skillRequest) {
      return res.status(404).json({ error: "Skill request not found" })
    }

    // Only the provider can update the status
    if (skillRequest.provider_id !== req.user!.id) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const updated = await prisma.skillRequest.update({
      where: { id: requestId },
      data: { status },
    })

    res.json({ skillRequest: updated })
  } catch (error) {
    console.error("Error updating skill request:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
