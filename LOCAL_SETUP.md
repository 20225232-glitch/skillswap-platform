# Local Development Setup Guide

## Prerequisites

Before you start, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- A code editor (VS Code recommended)
- Your Neon database URL
- Your Render backend URL

## Step-by-Step Installation

### 1. Clone or Download the Project

```bash
# If using git
git clone <your-repo-url>
cd skill-swap-platform

# Or download ZIP and extract
```

### 2. Install Dependencies

```bash
npm install
```

**Common Issues:**
- **Error: "Cannot find module"** - Delete `node_modules` and `package-lock.json`, then run `npm install` again
- **Permission errors on Mac/Linux** - Use `sudo npm install` or fix npm permissions
- **Network timeout** - Try `npm install --legacy-peer-deps` or use a VPN

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:

```env
DATABASE_URL="postgresql://neondb_owner:npg_XbHjleN3cSA8@ep-billowing-shadow-ah5hiy16-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_BACKEND_URL="https://skillswapneu-graduation-project.onrender.com"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="rHxdpyz4ANd5J5NoP3XOBTjQUahNKhwdd-9zI_UxO71VPwlGZyCFZLePATfjCIht-AEyZnNAyCBJw_5Hw0CT0w"
```

**Common Issues:**
- **Variables not loading** - Make sure file is named `.env.local` NOT `.env`
- **NEXT_PUBLIC_ prefix required** - Client-side variables MUST start with `NEXT_PUBLIC_`
- **Quotes in values** - Use quotes around URLs with special characters

### 4. Setup Prisma Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to Neon database
npm run prisma:push

# Optional: Open Prisma Studio to view data
npm run prisma:studio
```

**Common Issues:**
- **Database connection error** - Check your DATABASE_URL is correct
- **SSL errors** - Ensure `?sslmode=require` is in your connection string
- **Migration errors** - Use `npx prisma migrate reset` to reset (WARNING: deletes all data)

### 5. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

**Common Issues:**
- **Port 3000 already in use** - Kill the process using port 3000 or use `PORT=3001 npm run dev`
- **Module not found errors** - Run `npm install` again
- **Blank white screen** - Check browser console for errors (F12)

### 6. Verify Everything Works

Open these URLs to test:
- Homepage: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Signup: `http://localhost:3000/signup`

## Common Challenges & Solutions

### Challenge 1: "Failed to fetch" during Login/Signup

**Cause:** Backend on Render is not responding or CORS not enabled

**Solutions:**
1. Check if backend is running: Visit `https://skillswapneu-graduation-project.onrender.com/api/health`
2. Backend might be asleep (free Render services sleep) - Wait 30-60 seconds and try again
3. Add CORS to your Express backend (see BACKEND_REQUIREMENTS.md)

### Challenge 2: Database Schema Mismatch

**Cause:** Your Neon database schema doesn't match Prisma schema

**Solutions:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or push schema without reset
npx prisma db push --force-reset
```

### Challenge 3: Images Not Loading

**Cause:** Image paths incorrect or files missing

**Solutions:**
- Check `public/` folder has all images
- Use correct paths: `/images/filename.jpg` not `./images/filename.jpg`
- Clear Next.js cache: `rm -rf .next` then `npm run dev`

### Challenge 4: TypeScript Errors

**Cause:** Type mismatches or outdated types

**Solutions:**
```bash
# Regenerate Prisma types
npm run prisma:generate

# Clear TypeScript cache
rm -rf .next node_modules/.cache

# Restart your code editor
```

### Challenge 5: Styles Not Applying

**Cause:** Tailwind not compiling or cache issues

**Solutions:**
- Check `globals.css` is imported in `app/layout.tsx`
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Check Tailwind config: `npx tailwindcss -i ./app/globals.css -o ./test.css` to test

### Challenge 6: Authentication Not Working

**Cause:** Backend not setting cookies properly or JWT issues

**Solutions:**
1. Check browser console for errors
2. Check Network tab (F12) to see API responses
3. Verify JWT_SECRET matches between frontend and backend
4. Check cookies in DevTools → Application → Cookies

## Development Workflow

```bash
# Start development
npm run dev

# In another terminal, watch database
npm run prisma:studio

# Check types
npm run type-check

# Format code
npm run format
```

## Building for Production

```bash
# Create production build
npm run build

# Test production build locally
npm start

# Deploy to Vercel
vercel deploy
```

## Getting Help

If you encounter issues not covered here:
1. Check browser console (F12) for errors
2. Check terminal for build errors
3. Read TROUBLESHOOTING.md for backend issues
4. Check BACKEND_REQUIREMENTS.md for API specifications

## Quick Start (TL;DR)

```bash
# Install
npm install

# Setup env
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
npm run prisma:generate
npm run prisma:push

# Start
npm run dev
```

Visit `http://localhost:3000` and you're ready to go!
