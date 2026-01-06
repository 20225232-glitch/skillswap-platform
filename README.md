# SkillSwap Platform

A modern skill-swapping platform with separate frontend (Next.js) and backend (Express) services. Connect with peers, exchange skills, and build meaningful learning relationships.

## 🏗️ Project Structure

This project is split into two main folders:

- **`fe/`** - Next.js 16 frontend application
- **`be/`** - Express.js backend API server

Each folder has its own README with specific setup instructions.

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd be
npm install
cp .env.example .env
# Edit .env with your database URL and JWT secret
# Run SQL scripts on your Neon database (see be/README.md)
npm run dev
```

The backend runs on **http://localhost:4000**

### 2. Frontend Setup

```bash
cd fe
npm install
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:4000" > .env.local
npm run dev
```

The frontend runs on **http://localhost:3000**

## 📚 Documentation

- **[Backend Setup Guide](be/README.md)** - Complete backend setup with database migration steps
- **[Frontend Setup Guide](fe/README.md)** - Frontend configuration and development

## 🛠️ Tech Stack

### Frontend (`fe/`)
- Next.js 16 with App Router
- React 19.2
- TypeScript
- Tailwind CSS v4 (Maroon & White theme)
- shadcn/ui components

### Backend (`be/`)
- Node.js + Express
- TypeScript
- Neon PostgreSQL (no ORM - raw SQL)
- JWT authentication (jose)
- bcryptjs password hashing

## 🗄️ Database Schema

The platform includes the following tables:

- **users** - User accounts with authentication
- **interests** - Available skills/interests
- **user_interests** - User's selected interests (teaching/learning)
- **matches** - Skill swap matches between users
- **messages** - Direct messaging

See `be/scripts/001_initial_schema.sql` for complete schema.

## 🔐 Authentication Flow

1. User signs up with email/password (hashed with bcrypt)
2. Backend creates JWT token and sets HTTP-only cookie
3. Frontend includes cookie automatically in requests
4. Protected routes verify JWT token via middleware

## 🎨 Design System

**Color Palette**: Maroon & White theme
- Primary: Rich maroon `oklch(0.35 0.12 15)`
- Accent: Soft coral `oklch(0.72 0.15 35)`
- Background: White
- Rounded corners: `--radius: 1.5rem`

**Typography**: Geist Sans for all text

## 📋 Key Features

✅ User authentication (signup/login/logout)  
✅ JWT-based secure sessions  
✅ Password hashing with bcrypt  
✅ Interest-based skill matching  
✅ Direct messaging between users  
✅ Match management system  
✅ Clean separation of frontend/backend  

## 🔧 Development

### Run Both Servers

Terminal 1 (Backend):
```bash
cd be && npm run dev
```

Terminal 2 (Frontend):
```bash
cd fe && npm run dev
```

### Database Migrations

SQL migration scripts are in `be/scripts/`. Run them manually on your Neon database in order:

1. `001_initial_schema.sql` - Creates all tables
2. `002_seed_interests.sql` - Adds starter interests/skills

## 🚨 Important Notes

- **No Prisma**: This project uses raw SQL queries with `@neondatabase/serverless`
- **Manual Migrations**: Run SQL scripts directly on Neon database
- **Two Separate Servers**: Frontend (3000) and Backend (4000) run independently
- **Environment Variables**: Both folders need their own `.env` files

## 📝 Environment Variables

### Backend (`be/.env`)
```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_super_secret_key
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### Frontend (`fe/.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

## 🐛 Troubleshooting

**"Failed to fetch" errors**: Make sure the backend is running on port 4000 before starting the frontend.

**Database connection errors**: Verify your `DATABASE_URL` in `be/.env` is correct and the SQL scripts have been run.

**Authentication not working**: Check that `JWT_SECRET` is set in `be/.env` and is a strong random string.

## 📦 Deployment

### Frontend
Deploy to Vercel:
```bash
cd fe
vercel deploy
```

### Backend
Deploy to Render, Railway, or any Node.js hosting:
```bash
cd be
npm run build
npm start
```

Update CORS settings in backend to allow your production frontend URL.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using Next.js 16 and Express
