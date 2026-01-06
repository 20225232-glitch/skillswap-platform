# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Neon database already set up (✅ Already done in your project)

## Setup Steps

### 1. Install Dependencies
```bash
cd be
npm install
```

### 2. Create Environment File
Create a `.env` file in the `be/` directory:

```env
DATABASE_URL="postgresql://..."  # Your Neon database URL (already in Vercel env vars)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
```

### 3. Generate Prisma Client (IMPORTANT!)
This step fixes TypeScript errors by generating type-safe database types:

```bash
npm run prisma:generate
```

### 4. Sync Database Schema
Push your Prisma schema to the database:

```bash
npm run prisma:push
```

### 5. Seed Database with Test Users
Create 4 test users with hashed passwords:

```bash
npm run prisma:seed
```

This creates:
- **alice@skillswap.com** | Password: `SecurePass123!`
- **bob@skillswap.com** | Password: `SecurePass123!`
- **carol@skillswap.com** | Password: `SecurePass123!`
- **david@skillswap.com** | Password: `SecurePass123!`

All passwords are securely hashed with bcrypt (12 rounds).

### 6. Start Backend Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Verify It's Working

Test signup:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

Test login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@skillswap.com","password":"SecurePass123!"}'
```

## Common Issues

### TypeScript Error: "password_hash does not exist"
**Solution:** Run `npm run prisma:generate` to generate Prisma Client types.

### Database Connection Error
**Solution:** Check your `DATABASE_URL` in `.env` matches your Neon database URL.

### Port Already in Use
**Solution:** Change `PORT` in `.env` or kill the process using port 5000.

## Security Notes

✅ **Passwords are ALWAYS hashed** - Using bcrypt with 12 rounds (industry standard)
✅ **Never stored as plain text** - Database only contains `password_hash` field
✅ **HTTP-only cookies** - Session tokens protected from XSS attacks
✅ **JWT tokens** - Secure authentication with 7-day expiration

The plain text passwords you see in seed.ts are ONLY for creating test accounts. They are immediately hashed before storing in the database.
