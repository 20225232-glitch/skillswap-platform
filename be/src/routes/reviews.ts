import { Router } from "express"
import { requireAuth } from "../middleware/auth"
import { prisma } from "../config/db"

const router = Router()

// Create a review
router.post("/", requireAuth, async (req, res) => {
  try {
    const { reviewee_id, request_id, rating, review_text } = req.body

    if (!reviewee_id || !request_id || !rating) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" })
    }

    const review = await prisma.review.create({
      data: {
        reviewer_id: req.user!.id,
        reviewee_id,
        request_id,
        rating,
        review_text,
      },
    })

    res.json({ review })
  } catch (error) {
    console.error("Error creating review:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
