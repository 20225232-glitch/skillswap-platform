"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Star } from "lucide-react"

interface UserInfo {
  id: number
  name: string
}

export default function WriteReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setUserInfo(data.user)
        }
      } catch (error) {
        console.error("[v0] Error fetching user:", error)
      }
    }

    fetchUser()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revieweeId: params.id,
          rating,
          reviewText: reviewText.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit review")
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })

      router.push(`/user/${params.id}`)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Write Review</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {userInfo && (
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">How was your experience with</p>
              <h2 className="text-2xl font-bold">{userInfo.name}?</h2>
            </div>
          )}

          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              placeholder="Share your experience with others..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
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
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
