"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { HelpCircle, Star, Eye, Search } from "lucide-react"
import Link from "next/link"
import { fetchAPI } from "@/lib/api"

type TabType = "members" | "viewers" | "favorited"

interface User {
  id: string
  name: string
  occupation: string
  profilePicture: string | null
}

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState<TabType>("favorited")
  const [members, setMembers] = useState<User[]>([])
  const [viewers, setViewers] = useState<User[]>([])
  const [favoritedMe, setFavoritedMe] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, viewersData, favoritedData] = await Promise.all([
          fetchAPI("/api/users/all"),
          fetchAPI("/api/profile/viewers"),
          fetchAPI("/api/favorites/favorited-me"),
        ])
        setMembers(membersData.users || [])
        setViewers(viewersData.viewers || [])
        setFavoritedMe(favoritedData.users || [])
      } catch (error) {
        console.error("[v0] Error fetching members data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      )
    }

    const data = activeTab === "members" ? members : activeTab === "viewers" ? viewers : favoritedMe

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-4">
            {activeTab === "favorited" ? (
              <Star className="w-10 h-10 text-accent" />
            ) : activeTab === "viewers" ? (
              <Eye className="w-10 h-10 text-accent" />
            ) : (
              <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            )}
          </div>
          <h3 className="text-xl font-bold mb-2">
            {activeTab === "favorited" ? "Favorited me" : activeTab === "viewers" ? "My profile viewers" : "Members"}
          </h3>
          <p className="text-muted-foreground text-center text-balance leading-relaxed max-w-sm">
            {activeTab === "favorited" &&
              "No one has favorited your profile yet. Favorite members by tapping the star if you find them interesting."}
            {activeTab === "viewers" &&
              "No one has viewed your profile yet. Tap on other profiles so that members become aware of you. You can favorite members you find interesting with a star."}
            {activeTab === "members" && "No members found."}
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {data.map((user) => (
          <Link
            key={user.id}
            href={`/user/${user.id}`}
            className="aspect-[3/4] bg-gradient-to-b from-primary/5 to-primary/10 rounded-3xl overflow-hidden relative group"
          >
            {user.profilePicture ? (
              <img
                src={user.profilePicture || "/placeholder.svg"}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{user.name.charAt(0)}</span>
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <h3 className="font-semibold text-white">{user.name}</h3>
              <p className="text-sm text-white/80">{user.occupation || "Student"}</p>
            </div>
            <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Star className="w-5 h-5 text-accent" />
            </button>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Members</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <HelpCircle className="w-5 h-5 text-accent" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center px-4 pb-3">
          <button
            onClick={() => setActiveTab("members")}
            className={`flex-1 text-center pb-2 font-medium transition-colors ${
              activeTab === "members" ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground"
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab("viewers")}
            className={`flex-1 text-center pb-2 font-medium transition-colors ${
              activeTab === "viewers" ? "text-accent border-b-2 border-accent" : "text-muted-foreground"
            }`}
          >
            Viewers
          </button>
          <button
            onClick={() => setActiveTab("favorited")}
            className={`flex-1 text-center pb-2 font-medium transition-colors ${
              activeTab === "favorited" ? "text-accent border-b-2 border-accent" : "text-muted-foreground"
            }`}
          >
            Favorited me
          </button>
        </div>
      </div>

      {renderContent()}

      {/* Search FAB */}
      {searchOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Search members..."
                className="flex-1 h-12 px-4 rounded-2xl border border-border bg-background"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      <Button
        size="icon"
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg bg-accent hover:bg-accent/90"
        onClick={() => setSearchOpen(true)}
      >
        <Search className="w-5 h-5" />
      </Button>

      <BottomNav />
    </div>
  )
}
