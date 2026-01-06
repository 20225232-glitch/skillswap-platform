import { Router } from "express"
import { requireAuth } from "../middleware/auth"
import { prisma } from "../config/db"

const router = Router()

// Get current user with full profile
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        location: true,
        occupation: true,
        birth_date: true,
        gender: true,
        profile_image_url: true,
        latitude: true,
        longitude: true,
        radius_km: true,
        created_at: true,
        updated_at: true,
        last_login: true,
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

router.patch("/profile", requireAuth, async (req, res) => {
  try {
    const { name, bio, location, occupation, birth_date, gender, profile_image_url, latitude, longitude, radius_km } =
      req.body

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        name,
        bio,
        location,
        occupation,
        birth_date: birth_date ? new Date(birth_date) : undefined,
        gender,
        profile_image_url,
        latitude: latitude ? Number.parseFloat(latitude) : undefined,
        longitude: longitude ? Number.parseFloat(longitude) : undefined,
        radius_km,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        location: true,
        occupation: true,
        birth_date: true,
        gender: true,
        profile_image_url: true,
        latitude: true,
        longitude: true,
        radius_km: true,
      },
    })

    res.json({ user: updated })
  } catch (error) {
    console.error("Error updating profile:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
