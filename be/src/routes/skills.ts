import { Router } from "express"
import { requireAuth } from "../middleware/auth"
import { prisma } from "../config/db"

const router = Router()

// Get all skills for the authenticated user
router.get("/", requireAuth, async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: { user_id: req.user!.id },
      orderBy: { created_at: "desc" },
    })
    res.json({ skills })
  } catch (error) {
    console.error("Error fetching skills:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Create a new skill
router.post("/", requireAuth, async (req, res) => {
  try {
    const { skill_name, skill_category, skill_level, description, is_offering } = req.body

    if (!skill_name || !skill_category || !skill_level) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const skill = await prisma.skill.create({
      data: {
        user_id: req.user!.id,
        skill_name,
        skill_category,
        skill_level,
        description,
        is_offering: is_offering ?? true,
      },
    })

    res.json({ skill })
  } catch (error) {
    console.error("Error creating skill:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Delete a skill
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const skillId = Number.parseInt(req.params.id)

    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    })

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" })
    }

    if (skill.user_id !== req.user!.id) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    await prisma.skill.delete({
      where: { id: skillId },
    })

    res.json({ message: "Skill deleted successfully" })
  } catch (error) {
    console.error("Error deleting skill:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
