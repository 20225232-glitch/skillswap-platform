"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: number
  senderId: number
  messageText: string
  createdAt: string
  isRead: boolean
}

interface UserInfo {
  id: number
  name: string
  profileImageUrl?: string
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const meResponse = await fetch("/api/auth/me")
        if (meResponse.ok) {
          const meData = await meResponse.json()
          setCurrentUserId(meData.user?.id)
        }

        // Fetch other user info
        const userResponse = await fetch(`/api/users/${params.id}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserInfo(userData.user)
        }

        // Fetch messages
        const messagesResponse = await fetch(`/api/messages/${params.id}`)
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json()
          setMessages(messagesData.messages || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching chat data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Poll for new messages every 3 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/messages/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages || [])
        }
      } catch (error) {
        console.error("[v0] Error polling messages:", error)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [params.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!messageText.trim()) return

    setSending(true)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: params.id,
          messageText: messageText.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setMessageText("")

      // Refresh messages
      const messagesResponse = await fetch(`/api/messages/${params.id}`)
      if (messagesResponse.ok) {
        const data = await messagesResponse.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-40">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage src={userInfo?.profileImageUrl || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary/10 text-primary">{userInfo?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-semibold">{userInfo?.name}</h2>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => {
            const isOwn = message.senderId === currentUserId
            return (
              <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{message.messageText}</p>
                  <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-2xl h-12"
            disabled={sending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={sending || !messageText.trim()}
            className="h-12 w-12 rounded-full"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
