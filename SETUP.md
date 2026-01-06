# SkillSwap Platform - Setup Guide

This guide will walk you through setting up the SkillSwap platform locally.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Git** for version control
- **Neon PostgreSQL** database account (already provided)
- **Backend API** running on Render (already deployed)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 16
- React 19
- Prisma
- TypeScript
- Tailwind CSS
- shadcn/ui components

### 2. Environment Configuration

Create a \`.env\` file in the root directory:

```bash
cp .env.example .env
```

The \`.env\` file should contain:

```env
DATABASE_URL="postgresql://neondb_owner:npg_XbHjleN3cSA8@ep-billowing-shadow-ah5hiy16-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXT_PUBLIC_BACKEND_URL="https://skillswapneu-graduation-project.onrender.com"
NEXT_PUBLIC_APP_URL="https://skillswapneu-graduation-project-1.onrender.com"
JWT_SECRET="rHxdpyz4ANd5J5NoP3XOBTjQUahNKhwdd-9zI_UxO71VPwlGZyCFZLePATfjCIht-AEyZnNAyCBJw_5Hw0CT0w"
EMAIL_VERIFICATION_TTL_SECONDS=7200
RESEND_API_KEY="re_8N3ntHQQ_AByvsPQAPEAbsz261TAx3fZu"
NODE_ENV="development"
PORT=3000
```

### 3. Database Setup with Prisma

Generate the Prisma Client:

```bash
npm run prisma:generate
```

Push the database schema to Neon:

```bash
npm run prisma:push
```

This will create all necessary tables in your Neon PostgreSQL database.

### 4. Verify Database Connection

Open Prisma Studio to view your database:

```bash
npm run prisma:studio
```

This opens a web interface at \`http://localhost:5555\` where you can browse your database tables.

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at \`http://localhost:3000\`

## Backend Configuration

Your Node.js/Express backend should be configured with:

### Required Environment Variables

```env
DATABASE_URL="<your-neon-database-url>"
JWT_SECRET="<your-jwt-secret>"
PORT=10000
NODE_ENV="production"
```

### Required API Endpoints

Make sure your backend implements these endpoints:

#### Authentication
- \`POST /api/auth/signup\`
- \`POST /api/auth/login\`
- \`POST /api/auth/logout\`
- \`GET /api/auth/me\`

#### Users
- \`GET /api/users/nearby\`
- \`GET /api/users/all\`
- \`GET /api/users/:id\`
- \`PUT /api/user/profile\`

#### Activities
- \`GET /api/activities/my-activities\`
- \`GET /api/activities/nearby\`
- \`GET /api/activities/favorites\`
- \`GET /api/activities/requests\`
- \`GET /api/activities/past\`

#### Messages
- \`GET /api/messages/conversations\`
- \`GET /api/messages/:id\`
- \`POST /api/messages\`

#### Profile
- \`GET /api/profile/viewers\`
- \`GET /api/favorites/favorited-me\`

## Troubleshooting

### Database Connection Issues

If you can't connect to the database:

1. Verify your DATABASE_URL is correct
2. Check that your IP is allowed in Neon's security settings
3. Ensure SSL mode is enabled (\`sslmode=require\`)

### Backend API Issues

If the frontend can't reach the backend:

1. Verify NEXT_PUBLIC_BACKEND_URL is correct
2. Check that your backend is running
3. Ensure CORS is configured to allow your frontend URL
4. Check browser console for specific error messages

### Prisma Issues

If Prisma commands fail:

```bash
# Regenerate Prisma Client
npm run prisma:generate

# Reset and re-push schema
npx prisma migrate reset
npm run prisma:push
```

### Build Issues

If the build fails:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Testing the Application

### 1. Create an Account

1. Navigate to \`http://localhost:3000\`
2. Click "Get Started" or "Sign In"
3. Fill in the signup form
4. Complete the onboarding process

### 2. Test Core Features

- ✅ View nearby users on Dashboard
- ✅ Browse Members page (Members, Viewers, Favorited me tabs)
- ✅ Check For You page (Activities, Favorites, Requests, Past tabs)
- ✅ Send messages in Chat
- ✅ View and edit Profile
- ✅ Create activities
- ✅ Search and filter users

## Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set these in Vercel:

- \`DATABASE_URL\`
- \`NEXT_PUBLIC_BACKEND_URL\`
- \`NEXT_PUBLIC_APP_URL\`
- \`JWT_SECRET\`

## Next Steps

- Implement remaining API endpoints in your backend
- Add real-time features with WebSockets
- Set up email notifications
- Implement image upload for profile pictures
- Add payment integration for premium features
- Set up analytics and monitoring

## Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Review backend logs on Render
3. Check Prisma Studio for database state
4. Review the README.md for additional documentation

---

Happy coding! 🚀
```

```tsx file="" isHidden
