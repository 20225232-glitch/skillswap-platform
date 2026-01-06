# SkillSwap Backend

Express.js backend server for the SkillSwap platform.

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
cd be
npm install
\`\`\`

### 2. Set Up Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your actual values:

\`\`\`env
DATABASE_URL=your_neon_database_url_here
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=4000
FRONTEND_URL=http://localhost:3000
\`\`\`

**Important**: 
- Get your `DATABASE_URL` from your Neon dashboard
- Generate a strong random string for `JWT_SECRET`
- The `FRONTEND_URL` should match where your Next.js frontend runs

### 3. Run Database Migrations

The SQL scripts in the `scripts/` folder need to be executed on your Neon database:

**Option 1: Using Neon SQL Editor (Recommended)**
1. Go to your Neon dashboard
2. Open the SQL Editor
3. Copy and paste the contents of `scripts/001_initial_schema.sql`
4. Execute it
5. Repeat for `scripts/002_seed_interests.sql`

**Option 2: Using psql**
\`\`\`bash
psql "your_neon_connection_string" -f scripts/001_initial_schema.sql
psql "your_neon_connection_string" -f scripts/002_seed_interests.sql
\`\`\`

### 4. Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

The backend will start on http://localhost:4000

### 5. Verify It's Running

Visit http://localhost:4000/health - you should see:
\`\`\`json
{"status":"ok","message":"SkillSwap Backend is running"}
\`\`\`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout current user

### User

- `GET /api/user/me` - Get current user info (requires authentication)

## Project Structure

\`\`\`
be/
├── src/
│   ├── config/        # Database and config
│   ├── middleware/    # Express middleware (auth)
│   ├── routes/        # API route handlers
│   ├── utils/         # Utility functions (auth, etc.)
│   └── index.ts       # Server entry point
├── scripts/           # SQL migration scripts
└── package.json
\`\`\`

## Notes

- No Prisma ORM is used - we use raw SQL queries with @neondatabase/serverless
- Authentication uses JWT tokens stored in HTTP-only cookies
- Passwords are hashed with bcrypt (12 rounds)
