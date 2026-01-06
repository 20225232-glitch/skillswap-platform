import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SkillSwap - Exchange Skills, Build Connections",
  description: "Connect with people to swap skills and learn together",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
