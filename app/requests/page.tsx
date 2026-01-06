"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SkillRequest {
  id: number
  status: string
  message: string
  createdAt: string
  requester: {
    id: number
    name: string
    profileImageUrl?: string
  }
  skill: {
    name: string
    category: string
  }
}

export default function RequestsPage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState<SkillRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/skill-requests")
      if (response.ok) {
        const data = await response.json()
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error("[v0] Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (requestId: number) => {
    try {
      const response = await fetch(`/api/skill-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      })

      if (!response.ok) {
        throw new Error("Failed to accept request")
      }

      toast({
        title: "Request accepted",
        description: "You can now start messaging!",
      })

      fetchRequests()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (requestId: number) => {
    try {
      const response = await fetch(`/api/skill-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject request")
      }

      toast({
        title: "Request rejected",
        description: "The request has been declined",
      })

      fetchRequests()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Skill Requests</h1>
          <p className="text-sm text-muted-foreground">People who want to swap skills with you</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-card rounded-2xl border border-border animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="p-4 bg-card rounded-2xl border border-border space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={request.requester.profileImageUrl || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {request.requester.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{request.requester.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      wants to learn <span className="font-medium text-foreground">{request.skill.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      request.status === "pending"
                        ? "bg-amber-500/10 text-amber-500"
                        : request.status === "accepted"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                {request.message && (
                  <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/20 pl-3">
                    {request.message}
                  </p>
                )}

                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReject(request.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-2xl text-destructive hover:text-destructive bg-transparent"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                    <Button onClick={() => handleAccept(request.id)} size="sm" className="flex-1 rounded-2xl">
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">No requests yet</h2>
            <p className="text-muted-foreground">When someone requests to swap skills with you, they'll appear here</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
