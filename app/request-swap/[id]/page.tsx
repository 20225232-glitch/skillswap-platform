"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

interface Skill {
  id: number
  skillName: string
  skillCategory: string
  skillLevel: string
}

interface UserProfile {
  id: number
  name: string
  skills: Skill[]
}

export default function RequestSwapPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProfile(data.user)
        }
      } catch (error) {
        console.error("[v0] Error fetching profile:", error)
      }
    }

    fetchProfile()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSkillId) {
      toast({
        title: "Select a skill",
        description: "Please select which skill you're interested in",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/skill-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: params.id,
          skillId: selectedSkillId,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send request")
      }

      toast({
        title: "Request sent!",
        description: "Your skill swap request has been sent",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const offeringSkills = profile.skills.filter((s) => s.isOffering)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Request Skill Swap</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-primary/5 rounded-2xl">
            <p className="text-sm text-muted-foreground leading-relaxed">
              You're requesting a skill swap with <span className="font-semibold text-foreground">{profile.name}</span>.
              Select which skill you're interested in and introduce yourself!
            </p>
          </div>

          {offeringSkills.length > 0 ? (
            <>
              <div className="space-y-2">
                <Label>Select a skill *</Label>
                <div className="space-y-2">
                  {offeringSkills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => setSelectedSkillId(skill.id)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-colors ${
                        selectedSkillId === skill.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <h3 className="font-semibold">{skill.skillName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {skill.skillCategory} • {skill.skillLevel}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Introduce yourself and explain why you'd like to swap skills..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-2xl min-h-32"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl bg-transparent"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 h-12 rounded-2xl">
                  {loading ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {profile.name} doesn't have any skills listed yet. Check back later!
              </p>
              <Button onClick={() => router.back()} className="mt-4 rounded-2xl">
                Go Back
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
