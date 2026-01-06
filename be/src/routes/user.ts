import { Router } from "express"
import { requireAuth } from "../middleware/auth"

const router = Router()

// Get current user
router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user })
})

export default router
