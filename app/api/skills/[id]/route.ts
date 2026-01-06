import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const skillId = Number.parseInt(params.id)

    if (Number.isNaN(skillId)) {
      return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 })
    }

    // Delete only if the skill belongs to the user
    await sql`
      DELETE FROM skills 
      WHERE id = ${skillId} AND user_id = ${session.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting skill:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
