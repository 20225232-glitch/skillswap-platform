"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Plus, Bell, Search, Filter, MoreVertical } from "lucide-react"
import Link from "next/link"
import { fetchAPI } from "@/lib/api"

interface User {
  id: string
  name: string
  occupation: string
  profilePicture: string | null
  bio?: string
  location?: string
}

interface Activity {
  id: string
  title: string
  location: string
  date: string
  participants: User[]
}

export default function DashboardPage() {
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, activitiesData] = await Promise.all([
          fetchAPI("/api/users/nearby"),
          fetchAPI("/api/activities/nearby"),
        ])
        setNearbyUsers(usersData.users || [])
        setActivities(activitiesData.activities || [])
      } catch (error) {
        console.error("[v0] Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">
              skill<span className="text-primary">swap</span>
            </h1>
            <p className="text-sm text-muted-foreground">Gönyeli</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/search">
                <Search className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Filter className="w-5 h-5 text-accent" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Activities List */}
      {activities.length > 0 && (
        <div className="p-4 space-y-4">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/activity/${activity.id}`}
              className="block bg-card rounded-3xl p-4 border border-border hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-1">{activity.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
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
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{activity.date}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {activity.participants.slice(0, 3).map((participant, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background -ml-2 first:ml-0"
                  >
                    {participant.profilePicture ? (
                      <img
                        src={participant.profilePicture || "/placeholder.svg"}
                        alt={participant.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {participant.name.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="p-4">
        <div className="bg-accent/10 rounded-3xl p-6 space-y-2">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-accent" />
          </div>
          <h3 className="font-semibold text-lg">Got questions? Our FAQ has answers!</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">Tap here to see more information.</p>
        </div>
      </div>

      {/* Meet Nearby Section */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Meet nearby</h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-muted rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : nearbyUsers.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {nearbyUsers.slice(0, 6).map((user) => (
              <Link
                key={user.id}
                href={`/user/${user.id}`}
                className="aspect-[3/4] bg-gradient-to-b from-primary/20 to-primary/5 rounded-3xl overflow-hidden relative group"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-white/80">{user.occupation || "Student"}</p>
                </div>
                <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gradient-to-b from-accent/20 to-accent/5 rounded-3xl flex items-center justify-center relative"
              >
                <Plus className="w-8 h-8 text-accent/40" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Activity FAB */}
      <Button size="lg" className="fixed bottom-20 right-4 h-14 px-6 rounded-full shadow-lg" asChild>
        <Link href="/post-skill">
          <Plus className="w-5 h-5 mr-2" />
          Create an activity
        </Link>
      </Button>

      <BottomNav />
    </div>
  )
}
