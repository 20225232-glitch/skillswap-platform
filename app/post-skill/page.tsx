"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const SKILL_CATEGORIES = [
  "Programming",
  "Design",
  "Music",
  "Language",
  "Sports",
  "Cooking",
  "Photography",
  "Writing",
  "Marketing",
  "Business",
  "Other",
]

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"]

export default function PostSkillPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    skillName: "",
    skillCategory: "",
    skillLevel: "",
    description: "",
    isOffering: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to post skill")
      }

      toast({
        title: "Success!",
        description: "Your skill has been posted",
      })

      router.push("/my-skills")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post skill. Please try again.",
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
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Post a Skill</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Offering or Seeking */}
          <div className="space-y-2">
            <Label>I am...</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isOffering: true })}
                className={`flex-1 py-3 px-4 rounded-2xl border-2 transition-colors ${
                  formData.isOffering
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                Offering this skill
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isOffering: false })}
                className={`flex-1 py-3 px-4 rounded-2xl border-2 transition-colors ${
                  !formData.isOffering
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                Seeking this skill
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillName">Skill Name *</Label>
            <Input
              id="skillName"
              placeholder="e.g., Guitar Lessons, Web Development, Spanish Language"
              value={formData.skillName}
              onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
              className="rounded-2xl h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillCategory">Category *</Label>
            <select
              id="skillCategory"
              value={formData.skillCategory}
              onChange={(e) => setFormData({ ...formData, skillCategory: e.target.value })}
              className="w-full h-12 px-4 rounded-2xl border border-input bg-background"
              required
            >
              <option value="">Select a category</option>
              {SKILL_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillLevel">Skill Level *</Label>
            <select
              id="skillLevel"
              value={formData.skillLevel}
              onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
              className="w-full h-12 px-4 rounded-2xl border border-input bg-background"
              required
            >
              <option value="">Select your level</option>
              {SKILL_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell others about your skill and what you're looking for in a swap..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-2xl min-h-32"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 h-12 rounded-2xl bg-transparent" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 h-12 rounded-2xl">
              {loading ? "Posting..." : "Post Skill"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
