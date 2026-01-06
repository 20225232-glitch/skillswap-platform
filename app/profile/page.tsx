"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, HelpCircle, Star, Ban, VolumeX, Shield, Crown } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: number
  name: string
  occupation: string
  email: string
  profileImageUrl?: string
  bio?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setProfile(data.user)
        }
      } catch (error) {
        console.error("[v0] Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error logging out:", error)
    }
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
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/help">
                <HelpCircle className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Get Premium Banner */}
        <div className="m-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl p-6 border border-amber-500/20">
          <div className="flex items-start gap-4">
            <Crown className="w-8 h-8 text-amber-500 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">Get Premium</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Unlock the app's best features.</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="m-4 bg-card rounded-3xl p-6 shadow-sm border border-border">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.profileImageUrl || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">{profile?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile?.name}</h2>
              <p className="text-sm text-muted-foreground">{profile?.occupation || "Student"}</p>
            </div>
          </div>

          {/* Edit Profile Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-primary text-sm">Edit profile</h3>
            <Link
              href="/edit-profile"
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Edit my profile information</span>
            </Link>
            <Link
              href="/edit-profile/pictures"
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Change profile pictures</span>
            </Link>
            <Link
              href="/edit-profile/location"
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <span>Change location</span>
            </Link>
            <Link
              href={`/user/${profile?.id}`}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>View my profile</span>
            </Link>
          </div>
        </div>

        {/* Other Options */}
        <div className="m-4 space-y-3">
          <Link
            href="/favorites"
            className="flex items-center gap-3 p-4 bg-card rounded-2xl hover:bg-muted/50 transition-colors border border-border"
          >
            <Star className="w-5 h-5" />
            <span>My favorites</span>
          </Link>
          <Link
            href="/blocked"
            className="flex items-center gap-3 p-4 bg-card rounded-2xl hover:bg-muted/50 transition-colors border border-border"
          >
            <Ban className="w-5 h-5" />
            <span>Blocked members</span>
          </Link>
          <Link
            href="/muted"
            className="flex items-center gap-3 p-4 bg-card rounded-2xl hover:bg-muted/50 transition-colors border border-border"
          >
            <VolumeX className="w-5 h-5" />
            <span>Muted members</span>
          </Link>
          <Link
            href="/blocked-activities"
            className="flex items-center gap-3 p-4 bg-card rounded-2xl hover:bg-muted/50 transition-colors border border-border"
          >
            <Shield className="w-5 h-5" />
            <span>Blocked activities</span>
          </Link>
        </div>

        {/* Support Section */}
        <div className="m-4 space-y-3">
          <h3 className="font-semibold text-primary text-sm px-4">Support</h3>
          <Link
            href="/help"
            className="flex items-center gap-3 p-4 bg-card rounded-2xl hover:bg-muted/50 transition-colors border border-border"
          >
            <HelpCircle className="w-5 h-5" />
            <div className="flex-1">
              <div className="font-medium">Do you need help?</div>
              <div className="text-sm text-muted-foreground">FAQs, Support, Contact</div>
            </div>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        </div>

        {/* Account Info */}
        <div className="m-4 p-4 text-center space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            You are registered with SkillSwap under the email address{" "}
            <span className="font-medium text-foreground">{profile?.email}</span>. Be sure to provide this email address
            when contacting support.
          </p>
          <p className="text-xs text-muted-foreground">Version: 2025.11.19</p>
        </div>

        {/* Logout Button */}
        <div className="m-4">
          <Button onClick={handleLogout} variant="destructive" className="w-full h-12 rounded-2xl">
            Logout
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
