import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create 4 test users with hashed passwords
  const users = [
    {
      email: "alice@skillswap.com",
      password: "SecurePass123!",
      name: "Alice Johnson",
      bio: "Full-stack developer passionate about teaching web development and learning graphic design.",
      location: "San Francisco, CA",
      occupation: "Software Engineer",
      gender: "female",
      latitude: 37.7749,
      longitude: -122.4194,
      radius_km: 25,
    },
    {
      email: "bob@skillswap.com",
      password: "SecurePass123!",
      name: "Bob Martinez",
      bio: "Professional photographer looking to trade photography lessons for cooking classes.",
      location: "Austin, TX",
      occupation: "Photographer",
      gender: "male",
      latitude: 30.2672,
      longitude: -97.7431,
      radius_km: 20,
    },
    {
      email: "carol@skillswap.com",
      password: "SecurePass123!",
      name: "Carol Chen",
      bio: "Yoga instructor and wellness coach. Open to skill exchanges in fitness and nutrition.",
      location: "Seattle, WA",
      occupation: "Yoga Instructor",
      gender: "female",
      latitude: 47.6062,
      longitude: -122.3321,
      radius_km: 30,
    },
    {
      email: "david@skillswap.com",
      password: "SecurePass123!",
      name: "David Kim",
      bio: "Marketing specialist and language enthusiast. I teach Korean and want to learn Spanish.",
      location: "New York, NY",
      occupation: "Marketing Manager",
      gender: "male",
      latitude: 40.7128,
      longitude: -74.006,
      radius_km: 15,
    },
  ]

  for (const userData of users) {
    const { password, ...userInfo } = userData

    // Hash password with bcrypt (12 rounds for strong security)
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userInfo,
        password_hash: hashedPassword,
      },
    })

    console.log(`✅ Created user: ${user.name} (${user.email})`)
  }

  console.log("🎉 Database seed completed successfully!")
  console.log("\n📝 Test credentials:")
  console.log("Email: alice@skillswap.com | Password: SecurePass123!")
  console.log("Email: bob@skillswap.com | Password: SecurePass123!")
  console.log("Email: carol@skillswap.com | Password: SecurePass123!")
  console.log("Email: david@skillswap.com | Password: SecurePass123!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
