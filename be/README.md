# SkillSwap Backend

Express.js backend server with Prisma ORM for the SkillSwap platform.

## Setup Instructions

### 1. Install Dependencies

```bash
cd be
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `be/` folder:

```env
DATABASE_URL="your_neon_database_url"
JWT_SECRET="your_super_secret_jwt_key_min_32_chars"
PORT=4000
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

**Getting your values**:
- `DATABASE_URL`: Available in your Vercel environment variables (already connected to Neon)
- `JWT_SECRET`: Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `PORT`: 4000 (default backend port)
- `FRONTEND_URL`: http://localhost:3000 for local development

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

### 4. Sync Database Schema (First Time Only)

```bash
npm run prisma:push
```

This syncs your Prisma schema with the existing Neon database.

### 5. Seed the Database with Test Users

```bash
npm run prisma:seed
```

This creates 4 test users with secure hashed passwords:

| Email | Password | Name |
|-------|----------|------|
| alice@skillswap.com | SecurePass123! | Alice Johnson |
| bob@skillswap.com | SecurePass123! | Bob Martinez |
| carol@skillswap.com | SecurePass123! | Carol Chen |
| david@skillswap.com | SecurePass123! | David Kim |

### 6. Start the Development Server

```bash
npm run dev
```

The backend will start on **http://localhost:4000**

### 7. Verify It's Running

Visit http://localhost:4000/health - you should see:
```json
{"status":"ok","message":"SkillSwap Backend is running"}
```

## Quick Start Commands

```bash
# Full setup from scratch
cd be
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run dev
```

## API Endpoints

### Authentication (Public)

- `POST /api/auth/signup` - Create a new account
  ```json
  {
    "email": "user@example.com",
    "password": "YourSecurePassword123!",
    "name": "Your Name"
  }
  ```

- `POST /api/auth/login` - Login with credentials
  ```json
  {
    "email": "user@example.com",
    "password": "YourSecurePassword123!"
  }
  ```

- `POST /api/auth/logout` - Logout current user

### User (Protected)

- `GET /api/user/me` - Get current user profile (requires authentication)

## Security Features

- **Password Hashing**: bcrypt with 12 rounds (industry standard)
- **JWT Authentication**: Secure tokens with 7-day expiration
- **HTTP-Only Cookies**: Session tokens stored securely
- **Type Safety**: Full TypeScript with Prisma Client
- **Input Validation**: Required fields checked on all endpoints
- **CORS Protection**: Configured for frontend origin only

## Project Structure

```
be/
├── prisma/
│   ├── schema.prisma   # Database schema definition
│   └── seed.ts         # Database seeding script
├── src/
│   ├── config/
│   │   └── db.ts       # Prisma Client singleton
│   ├── middleware/
│   │   └── auth.ts     # Authentication middleware
│   ├── routes/
│   │   ├── auth.ts     # Auth endpoints
│   │   └── user.ts     # User endpoints
│   ├── utils/
│   │   └── auth.ts     # Password & JWT utilities
│   └── index.ts        # Express server setup
└── package.json
```

## Database Models

The Prisma schema includes:
- **User**: User accounts with profiles
- **Skill**: Skills offered by users
- **Interest**: User interests and hobbies
- **SkillRequest**: Skill exchange requests
- **Message**: Direct messages between users
- **Review**: User reviews and ratings
- **Notification**: User notifications
- **Favorite**: Favorited users
- **BlockedUser**: Blocked users list

## Development Tips

### View Database with Prisma Studio

```bash
npx prisma studio
```

Opens a GUI at http://localhost:5555 to browse and edit data.

### Reset Database (Careful!)

```bash
npx prisma db push --force-reset
npm run prisma:seed
```

This will delete all data and reseed with test users.

### Check Prisma Schema

```bash
npx prisma validate
```

Validates your schema for errors.

## Troubleshooting

### "Prisma Client not generated"
```bash
npm run prisma:generate
```

### "Cannot connect to database"
- Check your `DATABASE_URL` in `.env`
- Verify Neon database is running
- Ensure no firewall blocking connections

### "JWT_SECRET is required"
- Make sure `.env` file exists in `be/` folder
- Generate a secure secret with the command above
- Minimum 32 characters recommended

## Production Deployment

1. Set environment variables in your hosting platform
2. Run `npm run build` to compile TypeScript
3. Run `npm start` to start the production server
4. Use `NODE_ENV=production` for production mode
</markdown>
