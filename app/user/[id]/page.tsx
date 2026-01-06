"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Heart, MessageCircle, Star, MoreVertical } from "lucide-react"
import Link from "next/link"

interface Skill {
  id: number
  skillName: string
  skillCategory: string
  skillLevel: string
  description: string
  isOffering: boolean
}

interface UserProfile {
  id: number
  name: string
  occupation: string
  bio: string
  location: string
  profileImageUrl?: string
  skills: Skill[]
  interests: Array<{ name: string; category: string }>
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProfile(data.user)
          setIsFavorite(data.isFavorite || false)
        }
      } catch (error) {
        console.error("[v0] Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [params.id])

  const handleFavorite = async () => {
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: params.id }),
      })
      setIsFavorite(true)
    } catch (error) {
      console.error("[v0] Error adding favorite:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">User not found</h2>
          <Button onClick={() => router.back()} className="rounded-2xl">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-40">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-24">
        {/* Profile Header */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.profileImageUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.occupation}</p>
              {profile.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {profile.location}
                </p>
              )}
            </div>
          </div>

          {profile.bio && (
            <div className="space-y-2">
              <h3 className="font-semibold">About</h3>
              <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <h3 className="font-semibold text-lg">Skills</h3>
            <div className="space-y-3">
              {profile.skills.map((skill) => (
                <div key={skill.id} className="p-4 bg-card rounded-2xl border border-border">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{skill.skillName}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            skill.isOffering ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {skill.isOffering ? "Offering" : "Seeking"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {skill.skillCategory} • {skill.skillLevel}
                      </p>
                      {skill.description && <p className="text-sm text-muted-foreground">{skill.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests Section */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <h3 className="font-semibold text-lg">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span key={index} className="px-3 py-1 bg-muted rounded-full text-sm">
                  {interest.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleFavorite}
            disabled={isFavorite}
            className="h-14 rounded-2xl border-2 bg-transparent"
          >
            {isFavorite ? <Star className="w-5 h-5 fill-primary text-primary" /> : <Star className="w-5 h-5" />}
          </Button>
          <Button size="lg" className="flex-1 h-14 rounded-2xl" asChild>
            <Link href={`/messages/${params.id}`}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Send Message
            </Link>
          </Button>
          <Button size="lg" className="h-14 px-8 rounded-2xl" asChild>
            <Link href={`/request-swap/${params.id}`}>
              <Heart className="w-5 h-5 mr-2" />
              Request Swap
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
