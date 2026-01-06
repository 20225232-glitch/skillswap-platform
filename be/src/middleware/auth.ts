import type { Request, Response, NextFunction } from "express"
import { verifySession, type SessionUser } from "../utils/auth"

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.session

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const user = await verifySession(token)

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired session" })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" })
  }
}
