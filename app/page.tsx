import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div
        className="relative min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `linear-gradient(rgba(89, 28, 44, 0.85), rgba(89, 28, 44, 0.75)), url('/diverse-students-collaborating-studying-together-i.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight">
            Find Your Perfect Study Partner
          </h1>
          <p className="text-xl md:text-2xl text-white/95 text-balance max-w-2xl mx-auto leading-relaxed">
            Connect with peers, collaborate on projects, and achieve academic excellence together
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="h-14 px-8 rounded-2xl text-lg bg-white text-primary hover:bg-white/90">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-2xl text-lg bg-transparent border-2 border-white text-white hover:bg-white/10"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Why SkillSwap Section */}
      <div className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-balance">Why skill swap?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Connect with Peers</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find like-minded individuals who share your interests and learning goals
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Exchange Skills</h3>
              <p className="text-muted-foreground leading-relaxed">
                Teach what you know and learn what you need in a mutually beneficial exchange
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Grow Together</h3>
              <p className="text-muted-foreground leading-relaxed">
                Build lasting connections while expanding your knowledge and capabilities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to start learning?</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Join thousands of learners exchanging skills and building connections
          </p>
          <Button asChild size="lg" className="h-14 px-8 rounded-2xl text-lg">
            <Link href="/signup">Create Your Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
