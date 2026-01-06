"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { HelpCircle, Plus, Filter, List, Calendar, Mail, Clock } from "lucide-react"
import Link from "next/link"
import { fetchAPI } from "@/lib/api"

type TabType = "activities" | "favorites" | "requests" | "past"

interface Activity {
  id: string
  title: string
  description: string
  location: string
  date: string
  participantsCount: number
}

export default function ForYouPage() {
  const [activeTab, setActiveTab] = useState<TabType>("requests")
  const [myActivities, setMyActivities] = useState<Activity[]>([])
  const [favorites, setFavorites] = useState<Activity[]>([])
  const [requests, setRequests] = useState<Activity[]>([])
  const [pastActivities, setPastActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesData, favoritesData, requestsData, pastData] = await Promise.all([
          fetchAPI("/api/activities/my-activities"),
          fetchAPI("/api/activities/favorites"),
          fetchAPI("/api/activities/requests"),
          fetchAPI("/api/activities/past"),
        ])
        setMyActivities(activitiesData.activities || [])
        setFavorites(favoritesData.activities || [])
        setRequests(requestsData.activities || [])
        setPastActivities(pastData.activities || [])
      } catch (error) {
        console.error("[v0] Error fetching activities data:", error)
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

    const data =
      activeTab === "activities"
        ? myActivities
        : activeTab === "favorites"
          ? favorites
          : activeTab === "requests"
            ? requests
            : pastActivities

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-4">
            {activeTab === "requests" ? (
              <Mail className="w-10 h-10 text-accent" />
            ) : activeTab === "past" ? (
              <Clock className="w-10 h-10 text-accent" />
            ) : (
              <Calendar className="w-10 h-10 text-accent" />
            )}
          </div>
          <h3 className="text-xl font-bold mb-2">
            {activeTab === "requests"
              ? "My Requests"
              : activeTab === "past"
                ? "Completed activities"
                : activeTab === "favorites"
                  ? "Favorites"
                  : "My activities"}
          </h3>
          <p className="text-muted-foreground text-center text-balance leading-relaxed max-w-sm">
            {activeTab === "requests" && "See members who've requested to join your activities here."}
            {activeTab === "past" && "After you attend an activity, it will be displayed here."}
            {activeTab === "favorites" && "Save activities you're interested in by tapping the heart icon."}
            {activeTab === "activities" && "Create your first activity to get started."}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4 p-4">
        {data.map((activity) => (
          <Link
            key={activity.id}
            href={`/activity/${activity.id}`}
            className="block bg-card rounded-3xl p-4 hover:shadow-md transition-shadow border border-border"
          >
            <h3 className="font-semibold text-lg mb-1">{activity.title}</h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{activity.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {activity.date}
              </div>
              <div className="flex items-center gap-1">
                <span>{activity.location}</span>
              </div>
            </div>
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
          <h1 className="text-2xl font-bold">For you</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Filter className="w-5 h-5 text-accent" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <List className="w-5 h-5 text-accent" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <HelpCircle className="w-5 h-5 text-accent" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center px-4 pb-3 gap-1">
          <button
            onClick={() => setActiveTab("activities")}
            className={`px-4 py-1 text-center font-medium transition-colors rounded-full whitespace-nowrap ${
              activeTab === "activities" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            My activities
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-4 py-1 text-center font-medium transition-colors rounded-full whitespace-nowrap ${
              activeTab === "favorites" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-1 text-center font-medium transition-colors rounded-full whitespace-nowrap ${
              activeTab === "requests" ? "text-accent" : "text-muted-foreground"
            }`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-4 py-1 text-center font-medium transition-colors rounded-full whitespace-nowrap ${
              activeTab === "past" ? "text-accent" : "text-muted-foreground"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {renderContent()}

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
