"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Heart, X } from "lucide-react"
import Link from "next/link"

interface Skill {
  id: number
  skillName: string
  skillCategory: string
  skillLevel: string
  description: string
}

interface User {
  id: number
  name: string
  occupation: string
  bio?: string
  location?: string
  profileImageUrl?: string
  skills: Skill[]
}

export default function ExplorePage() {
  const [users, setUsers] = useState<User[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/explore")
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const currentUser = users[currentIndex]

  const handleLike = async () => {
    if (!currentUser) return

    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      })
      setCurrentIndex((prev) => prev + 1)
    } catch (error) {
      console.error("[v0] Error liking user:", error)
    }
  }

  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40">
        <div className="p-4 space-y-4">
          <h1 className="text-2xl font-bold">
            Explore <span className="text-primary">Skills</span>
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search skills or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-2xl h-12"
            />
          </div>
        </div>
      </div>

      {currentUser ? (
        <div className="p-4 max-w-2xl mx-auto">
          {/* Card Stack */}
          <div className="relative aspect-[3/4] mb-6">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary/5 rounded-3xl overflow-hidden shadow-lg">
              {currentUser.profileImageUrl ? (
                <img
                  src={currentUser.profileImageUrl || "/placeholder.svg"}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary">{currentUser.name.charAt(0)}</span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* User Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-3">
                <div>
                  <h2 className="text-3xl font-bold">{currentUser.name}</h2>
                  <p className="text-lg text-white/90">{currentUser.occupation || "Student"}</p>
                  {currentUser.location && <p className="text-sm text-white/80">{currentUser.location}</p>}
                </div>

                {currentUser.bio && (
                  <p className="text-sm text-white/90 leading-relaxed line-clamp-3">{currentUser.bio}</p>
                )}

                {currentUser.skills && currentUser.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skills.slice(0, 3).map((skill) => (
                      <span key={skill.id} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                        {skill.skillName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6">
            <Button
              size="lg"
              variant="outline"
              onClick={handleSkip}
              className="h-16 w-16 rounded-full border-2 hover:border-destructive hover:text-destructive bg-transparent"
            >
              <X className="w-6 h-6" />
            </Button>

            <Button asChild size="lg" variant="outline" className="h-16 px-8 rounded-full border-2 bg-transparent">
              <Link href={`/user/${currentUser.id}`}>View Profile</Link>
            </Button>

            <Button size="lg" onClick={handleLike} className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90">
              <Heart className="w-6 h-6" />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} / {users.length}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">No more profiles</h2>
            <p className="text-muted-foreground">Check back later for new members!</p>
            <Button asChild className="rounded-2xl">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
