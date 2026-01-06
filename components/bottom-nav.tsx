"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Calendar, Users, MessageCircle, User } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Activities", icon: MapPin },
    { href: "/for-you", label: "For you", icon: Calendar },
    { href: "/explore", label: "Members", icon: Users },
    { href: "/messages", label: "Chat", icon: MessageCircle },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
