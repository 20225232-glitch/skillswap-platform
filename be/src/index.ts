import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/user"
import dotenv from "dotenv"

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

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "SkillSwap Backend is running" })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
})
