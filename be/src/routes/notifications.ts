import { Router } from "express"
import { requireAuth } from "../middleware/auth"
import { prisma } from "../config/db"

const router = Router()

// Get all notifications for the authenticated user
router.get("/", requireAuth, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: req.user!.id },
      orderBy: { created_at: "desc" },
      take: 50,
    })
    res.json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Mark notification as read
router.patch("/:id/read", requireAuth, async (req, res) => {
  try {
    const notificationId = Number.parseInt(req.params.id)

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" })
    }

    if (notification.user_id !== req.user!.id) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    })

    res.json({ notification: updated })
  } catch (error) {
    console.error("Error updating notification:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
