"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Bell, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Notification {
  id: number
  type: string
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications")
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-border">
            {notifications.map((notif) => (
              <Link
                key={notif.id}
                href={notif.link || "/dashboard"}
                className={`block p-4 hover:bg-muted/50 transition-colors ${!notif.isRead ? "bg-primary/5" : ""}`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{notif.title}</h3>
                    {notif.message && <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notif.isRead && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">No notifications</h2>
            <p className="text-muted-foreground">You're all caught up!</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
