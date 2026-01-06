import { Router } from "express"
import { requireAuth } from "../middleware/auth"

const router = Router()

// Get profile viewers (users who viewed my profile)
router.get("/viewers", requireAuth, async (req, res) => {
  try {
    // This would require tracking profile views in the database
    // For now, return empty array
    res.json({ viewers: [] })
  } catch (error) {
    console.error("Error fetching profile viewers:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
