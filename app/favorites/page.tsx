"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Star } from "lucide-react"
import Link from "next/link"

interface FavoriteUser {
  id: number
  name: string
  occupation: string
  bio?: string
  location?: string
  profileImageUrl?: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorites")
        if (response.ok) {
          const data = await response.json()
          setFavorites(data.favorites || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching favorites:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

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
          <h1 className="text-xl font-bold">My Favorites</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-card rounded-2xl border border-border animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="space-y-3">
            {favorites.map((user) => (
              <Link
                key={user.id}
                href={`/user/${user.id}`}
                className="block p-4 bg-card rounded-2xl border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.profileImageUrl || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.occupation}</p>
                    {user.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {user.location}
                      </p>
                    )}
                  </div>
                  <Star className="w-5 h-5 fill-primary text-primary" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-4">Start adding people to your favorites!</p>
            <Button asChild className="rounded-2xl">
              <Link href="/explore">Explore Members</Link>
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
