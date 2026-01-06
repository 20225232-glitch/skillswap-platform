"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { fetchAPI } from "@/lib/api"

const INTEREST_OPTIONS = [
  { name: "Camping", category: "outdoor" },
  { name: "Summer", category: "outdoor" },
  { name: "Hiking", category: "outdoor" },
  { name: "Autumn", category: "outdoor" },
  { name: "Nature", category: "outdoor" },
  { name: "Picnic", category: "outdoor" },
  { name: "Spring", category: "outdoor" },
  { name: "Garden", category: "outdoor" },
  { name: "Beach", category: "outdoor" },
  { name: "Winter", category: "outdoor" },
  { name: "Walks", category: "outdoor" },
  { name: "Gardening", category: "outdoor" },
  { name: "Vegan", category: "food" },
  { name: "Champagne", category: "food" },
  { name: "Fries", category: "food" },
  { name: "Vodka", category: "food" },
  { name: "Sweets", category: "food" },
  { name: "Cooking", category: "food" },
  { name: "Bar", category: "food" },
  { name: "Dining out", category: "food" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    occupation: "",
    gender: "",
    birthDate: "",
    bio: "",
  })

  const [location, setLocation] = useState({
    location: "",
    radius: 100,
  })

  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else {
      if (selectedInterests.length < 20) {
        setSelectedInterests([...selectedInterests, interest])
      }
    }
  }

  const handleComplete = async () => {
    setLoading(true)

    try {
      await fetchAPI("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({
          ...profileData,
          ...location,
          interests: selectedInterests,
        }),
      })

      toast({
        title: "Profile complete!",
        description: "Welcome to SkillSwap",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {step === 1 && "Profile"}
            {step === 2 && "Your Interests"}
            {step === 3 && "Where would you like to attend activities?"}
          </h1>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                placeholder="Student"
                value={profileData.occupation}
                onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                className="rounded-2xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label>Choose your gender.</Label>
              <div className="flex gap-2">
                {["Woman", "Man", "Others"].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setProfileData({ ...profileData, gender })}
                    className={`flex-1 py-3 px-4 rounded-2xl border-2 transition-colors ${
                      profileData.gender === gender
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">My birthday</Label>
              <Input
                id="birthDate"
                type="date"
                value={profileData.birthDate}
                onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                className="rounded-2xl h-12"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                If you're uncomfortable entering your full date of birth, please indicate your birth year. This helps us
                suggest better members for you.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Profile description</Label>
              <Textarea
                id="bio"
                placeholder="Hello, I'm new to SkillSwap!"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="rounded-2xl min-h-32"
              />
            </div>

            <Button onClick={() => setStep(2)} className="w-full h-12 rounded-2xl text-base">
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">What types of activities are you interested in?</p>
                <span className="text-sm text-primary font-medium">{selectedInterests.length}/20</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Outdoor</h3>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.filter((i) => i.category === "outdoor").map((interest) => (
                      <button
                        key={interest.name}
                        onClick={() => toggleInterest(interest.name)}
                        className={`px-4 py-2 rounded-full border transition-colors ${
                          selectedInterests.includes(interest.name)
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        {interest.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Food & Drink</h3>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.filter((i) => i.category === "food").map((interest) => (
                      <button
                        key={interest.name}
                        onClick={() => toggleInterest(interest.name)}
                        className={`px-4 py-2 rounded-full border transition-colors ${
                          selectedInterests.includes(interest.name)
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        {interest.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={() => setStep(3)} className="w-full h-12 rounded-2xl text-base">
              Continue
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Gönyeli"
                value={location.location}
                onChange={(e) => setLocation({ ...location, location: e.target.value })}
                className="rounded-2xl h-12"
              />
            </div>

            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-2xl overflow-hidden">
                <img src="/images/5944829380641098850.jpg" alt="Location map" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Selected radius: {location.radius} km</Label>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  value={location.radius}
                  onChange={(e) => setLocation({ ...location, radius: Number.parseInt(e.target.value) })}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, oklch(0.72 0.15 35) 0%, oklch(0.72 0.15 35) ${
                      ((location.radius - 10) / 110) * 100
                    }%, oklch(0.95 0.01 35) ${((location.radius - 10) / 110) * 100}%, oklch(0.95 0.01 35) 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10 km</span>
                  <span>120 km</span>
                </div>
              </div>
            </div>

            <Button onClick={handleComplete} disabled={loading} className="w-full h-12 rounded-2xl text-base">
              {loading ? "Setting up..." : "Complete"}
            </Button>
          </div>
        )}

        {step > 1 && (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            className="w-full mt-4 rounded-2xl text-muted-foreground"
          >
            Back
          </Button>
        )}
      </div>
    </div>
  )
}
