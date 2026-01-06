import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/user"
import dotenv from "dotenv"

import skillsRoutes from "./routes/skills"
import usersRoutes from "./routes/users"
import favoritesRoutes from "./routes/favorites"
import skillRequestsRoutes from "./routes/skill-requests"
import messagesRoutes from "./routes/messages"
import notificationsRoutes from "./routes/notifications"
import reviewsRoutes from "./routes/reviews"
import activitiesRoutes from "./routes/activities"
import profileRoutes from "./routes/profile"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

app.use("/api/skills", skillsRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/favorites", favoritesRoutes)
app.use("/api/skill-requests", skillRequestsRoutes)
app.use("/api/messages", messagesRoutes)
app.use("/api/notifications", notificationsRoutes)
app.use("/api/reviews", reviewsRoutes)
app.use("/api/activities", activitiesRoutes)
app.use("/api/profile", profileRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "SkillSwap Backend is running" })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
})
