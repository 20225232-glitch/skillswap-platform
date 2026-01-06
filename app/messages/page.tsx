"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { fetchAPI } from "@/lib/api"

interface Conversation {
  userId: string
  userName: string
  userProfileImage?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await fetchAPI("/api/messages/conversations")
        setConversations(data.conversations || [])
      } catch (error) {
        console.error("[v0] Error fetching conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  const filteredConversations = conversations.filter((conv) =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40">
        <div className="p-4 space-y-4">
          <h1 className="text-2xl font-bold">Chat</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-2xl h-12"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredConversations.map((conv) => (
              <Link
                key={conv.userId}
                href={`/messages/${conv.userId}`}
                className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={conv.userProfileImage || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary">{conv.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-semibold truncate">{conv.userName}</h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(conv.lastMessageTime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">No messages yet</h2>
            <p className="text-muted-foreground">
              {searchQuery ? "No conversations found" : "Start connecting with others to begin messaging!"}
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
