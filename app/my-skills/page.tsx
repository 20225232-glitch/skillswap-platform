"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Skill {
  id: number
  skillName: string
  skillCategory: string
  skillLevel: string
  description: string
  isOffering: boolean
  createdAt: string
}

export default function MySkillsPage() {
  const { toast } = useToast()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills")
      if (response.ok) {
        const data = await response.json()
        setSkills(data.skills || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching skills:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (skillId: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) {
      return
    }

    try {
      const response = await fetch(`/api/skills/${skillId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete skill")
      }

      toast({
        title: "Skill deleted",
        description: "Your skill has been removed",
      })

      fetchSkills()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/profile">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">My Skills</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-card rounded-2xl border border-border animate-pulse">
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : skills.length > 0 ? (
          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 bg-card rounded-2xl border border-border space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{skill.skillName}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          skill.isOffering ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        {skill.isOffering ? "Offering" : "Seeking"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {skill.skillCategory} • {skill.skillLevel}
                    </p>
                    {skill.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-2xl bg-transparent" asChild>
                    <Link href={`/edit-skill/${skill.id}`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(skill.id)}
                    className="flex-1 rounded-2xl text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">No skills yet</h2>
            <p className="text-muted-foreground mb-4">Start by adding your first skill!</p>
            <Button asChild className="rounded-2xl">
              <Link href="/post-skill">Add Skill</Link>
            </Button>
          </div>
        )}

        {skills.length > 0 && (
          <Button asChild className="w-full mt-6 h-12 rounded-2xl">
            <Link href="/post-skill">
              <Plus className="w-5 h-5 mr-2" />
              Add Another Skill
            </Link>
          </Button>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
