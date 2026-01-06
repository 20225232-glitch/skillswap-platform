# SkillSwap Platform

A modern skill-swapping platform built with Next.js frontend and Express backend. Connect with peers, exchange skills, and build meaningful learning relationships.

## 🏗️ Project Structure

This is a monorepo with two services:

- **Root folder** - Next.js 16 frontend application
- **`be/`** - Express.js backend API server

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Your Neon database is already connected (via Vercel integration)

### 1. Backend Setup

```bash
# Navigate to backend
cd be

# Install dependencies
npm install

# Create .env file
# You need to add these variables:
# - DATABASE_URL (get from Vercel env vars or Neon dashboard)
# - JWT_SECRET (generate a random string)
# - PORT=4000
# - FRONTEND_URL=http://localhost:3000

# Start backend server
npm run dev
```

The backend runs on **http://localhost:4000**

### 2. Frontend Setup

```bash
# From root directory
npm install

# Create .env.local file
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:4000" > .env.local

# Start frontend server
npm run dev
```

The frontend runs on **http://localhost:3000**

## 📚 Documentation

- **[Backend Setup Guide](be/README.md)** - Complete backend setup instructions

## 🛠️ Tech Stack

### Frontend (Root)
- Next.js 16 with App Router
- React 19.2
- TypeScript
- Tailwind CSS v4
- shadcn/ui components

### Backend (`be/`)
- Node.js + Express
- TypeScript
- Neon PostgreSQL (raw SQL queries)
- JWT authentication (jose)
- bcryptjs password hashing

## 🗄️ Database Schema

Your Neon database includes:

- **users** - User accounts with authentication
- **skills** - Skills offered or wanted by users
- **interests** - Available skill categories
- **user_interests** - User's selected interests
- **skill_requests** - Swap requests between users
- **messages** - Direct messaging
- **notifications** - User notifications
- **reviews** - Peer reviews after skill swaps
- **favorites** - Saved favorite users
- **blocked_users** - User blocking system

## 🔐 Authentication Flow

1. User signs up with email/password (hashed with bcrypt)
2. Backend creates JWT token and sets HTTP-only cookie
3. Frontend includes cookie automatically in requests
4. Protected routes verify JWT token via middleware

## 📋 Key Features

✅ User authentication (signup/login/logout)  
✅ JWT-based secure sessions  
✅ Password hashing with bcrypt  
✅ Interest-based skill matching  
✅ Direct messaging between users  
✅ Skill request management  
✅ User reviews and ratings  
✅ Favorites and blocking system

## 🔧 Development

### Run Both Servers

Terminal 1 (Backend):
```bash
cd be && npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

Visit http://localhost:3000 to see the app!

## 📝 Environment Variables

### Backend (`be/.env`)
```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_super_secret_key
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

## 🐛 Troubleshooting

**"Failed to fetch" errors**: Make sure the backend is running on port 4000 before starting the frontend.

**Database connection errors**: Verify your `DATABASE_URL` in `be/.env` matches your Neon database connection string.

**Authentication not working**: Check that `JWT_SECRET` is set in `be/.env` and is a strong random string (at least 32 characters).

**CORS errors**: Ensure `FRONTEND_URL` in `be/.env` matches your frontend URL.

## 📦 Deployment

### Frontend
Already connected to Vercel! Just push to your GitHub repository.

### Backend
Deploy to Render, Railway, or any Node.js hosting:
```bash
cd be
npm run build
npm start
```

Update environment variables in your hosting platform and set `FRONTEND_URL` to your production Vercel URL.

---

Built with ❤️ using Next.js 16 and Express
