import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Placeholder data - in production, this would query actual activities
    const activities = [
      {
        id: 1,
        title: "JavaScript Study Group",
        description: "Join us for a collaborative coding session focusing on React and Next.js",
        category: "Programming",
        date: "2026-01-10",
        time: "14:00",
        location: "Central Library",
        participantsCount: 5,
        maxParticipants: 10,
        organizer: {
          id: 2,
          name: "Alex Johnson",
          profileImageUrl: null,
        },
      },
      {
        id: 2,
        title: "Guitar Jam Session",
        description: "Bring your guitar and let's play some music together!",
        category: "Music",
        date: "2026-01-12",
        time: "18:00",
        location: "Music Studio",
        participantsCount: 3,
        maxParticipants: 8,
        organizer: {
          id: 3,
          name: "Sarah Miller",
          profileImageUrl: null,
        },
      },
    ]

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("[v0] Error fetching activities:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
