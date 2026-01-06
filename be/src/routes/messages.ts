import { Router } from "express"
import { requireAuth } from "../middleware/auth"
import { prisma } from "../config/db"

const router = Router()

// Get all conversations for the authenticated user
router.get("/conversations", requireAuth, async (req, res) => {
  try {
    // Get all unique users the current user has messaged with
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ sender_id: req.user!.id }, { receiver_id: req.user!.id }],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profile_image_url: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profile_image_url: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    })

    // Group by conversation partner
    const conversationsMap = new Map()
    messages.forEach((msg) => {
      const partnerId = msg.sender_id === req.user!.id ? msg.receiver_id : msg.sender_id
      const partner = msg.sender_id === req.user!.id ? msg.receiver : msg.sender

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          id: partnerId,
          userName: partner.name,
          avatar: partner.profile_image_url,
          lastMessage: msg.message_text,
          timestamp: msg.created_at,
          unread: msg.receiver_id === req.user!.id && !msg.is_read,
        })
      }
    })

    const conversations = Array.from(conversationsMap.values())
    res.json({ conversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get messages between current user and another user
router.get("/:userId", requireAuth, async (req, res) => {
  try {
    const otherUserId = Number.parseInt(req.params.userId)

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender_id: req.user!.id, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: req.user!.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profile_image_url: true,
          },
        },
      },
      orderBy: { created_at: "asc" },
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        sender_id: otherUserId,
        receiver_id: req.user!.id,
        is_read: false,
      },
      data: { is_read: true },
    })

    res.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Send a message
router.post("/", requireAuth, async (req, res) => {
  try {
    const { receiver_id, message_text, request_id } = req.body

    if (!receiver_id || !message_text) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const message = await prisma.message.create({
      data: {
        sender_id: req.user!.id,
        receiver_id,
        message_text,
        request_id: request_id || null,
      },
    })

    res.json({ message })
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
