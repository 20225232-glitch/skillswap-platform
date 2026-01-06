# Skill Swap Platform - Application Flow & Architecture

## Overview

The Skill Swap Platform is a dating-app-style web application where users can connect to exchange skills and knowledge. Think "Tinder for Skills" - users browse profiles, like each other, and arrange skill exchanges.

## Technology Stack

**Frontend (Vercel):**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma Client (for type safety)

**Backend (Render):**
- Node.js + Express
- PostgreSQL (Neon)
- Prisma ORM
- JWT Authentication
- bcrypt for passwords

**Database:**
- Neon PostgreSQL (hosted)

## Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     USER (Browser)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (Vercel/Next.js)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages     │  │  Components  │  │  lib/api.ts  │      │
│  │ (UI/Router) │  │   (Reusable) │  │ (API Wrapper)│      │
│  └─────────────┘  └──────────────┘  └──────┬───────┘      │
└──────────────────────────────────────────────┼──────────────┘
                                               │ HTTP/REST
                                               ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Render/Express)                       │
│  ┌──────────────┐  ┌───────────────┐  ┌────────────┐      │
│  │ API Routes   │  │  Auth Logic   │  │  Business  │      │
│  │ /api/auth/*  │  │  (JWT/bcrypt) │  │   Logic    │      │
│  │ /api/users/* │  │               │  │            │      │
│  │ /api/skills/*│  │               │  │            │      │
│  └──────┬───────┘  └───────────────┘  └────────────┘      │
└─────────┼────────────────────────────────────────────────────┘
          │ Prisma ORM
          ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (Neon PostgreSQL)                     │
│  ┌─────────┐ ┌──────┐ ┌───────┐ ┌──────────┐ ┌─────────┐  │
│  │  users  │ │skills│ │matches│ │ messages │ │ reviews │  │
│  └─────────┘ └──────┘ └───────┘ └──────────┘ └─────────┘  │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## User Journey Flow

### 1. **Landing Page** (`/`)
\`\`\`
User arrives → Sees hero with students collaborating
              ↓
         Two CTA buttons:
         - "Get Started" → /signup
         - "Sign In" → /login
\`\`\`

### 2. **Authentication Flow**

**Signup** (`/signup`):
\`\`\`
User fills form:
- Name
- Email
- Password
- Occupation (Student, Professional, etc.)
  ↓
Frontend → POST /api/auth/signup → Backend
  ↓
Backend:
- Validates input
- Hashes password (bcrypt)
- Creates user in database
- Returns JWT token
  ↓
Frontend receives token → Stores in cookie → Redirect to /onboarding
\`\`\`

**Login** (`/login`):
\`\`\`
User enters:
- Email
- Password
  ↓
Frontend → POST /api/auth/login → Backend
  ↓
Backend:
- Finds user by email
- Compares password hash
- Generates JWT token
- Returns token + user data
  ↓
Frontend stores token → Redirect to /dashboard
\`\`\`

### 3. **Onboarding Flow** (`/onboarding`)

New users complete 3 steps:

**Step 1: Profile Setup**
\`\`\`
- Upload profile picture
- Enter bio/description
- Select gender
- Enter birthday
  ↓
Saves to database (users table)
\`\`\`

**Step 2: Interests Selection**
\`\`\`
User selects interests from categories:
- Outdoor (Camping, Hiking, etc.)
- Food & Drink (Cooking, Vegan, etc.)
- Arts & Culture
- Sports & Fitness
- Technology
  ↓
Saves to user_interests table (many-to-many)
\`\`\`

**Step 3: Location & Radius**
\`\`\`
- User enters location (city/address)
- Geocoded to lat/long
- User sets discovery radius (10-120 km)
  ↓
Saves location to users table
  ↓
Complete → Redirect to /dashboard
\`\`\`

### 4. **Main Application Flow**

The app has 5 main sections (bottom navigation):

#### **Activities Tab** (`/dashboard`)
\`\`\`
Shows:
1. "Meet nearby" grid
   - 2x4 grid of user profile cards
   - Photos + basic info
   - Distance from user
   - Tap card → View profile
   
2. Activity Feed
   - Recent skill requests
   - Upcoming exchanges
   - Activity cards with location/time
   - "Create an activity" FAB button
\`\`\`

**User Interaction:**
\`\`\`
User sees nearby users → Taps profile card
  ↓
View User Profile → Can:
- Like/Favorite (star icon)
- Message
- Request Skill Swap
  ↓
If both users like each other → "Match!" notification
\`\`\`

#### **For You Tab** (`/for-you`)

4 sub-tabs:
\`\`\`
1. My Activities
   - Skills user is offering
   - Active exchanges
   - Scheduled meetups

2. Favorites
   - Users user has favorited
   - Can message or request swap

3. Requests
   - Incoming skill swap requests
   - Accept/Reject buttons
   - See who wants to learn from you

4. Past
   - Completed exchanges
   - Option to review/rate
\`\`\`

**Skill Request Flow:**
\`\`\`
User A requests skill from User B
  ↓
POST /api/skill-requests
  ↓
Creates request in database (status: pending)
  ↓
User B sees in "Requests" tab
  ↓
User B accepts/rejects
  ↓
If accepted:
- Status → accepted
- Both users notified
- Can message to arrange meeting
\`\`\`

#### **Members Tab** (`/members`)

3 sub-tabs:
\`\`\`
1. Members
   - Grid of all users
   - Search functionality
   - Filter by interests
   - Premium upsell card

2. Viewers
   - Users who viewed your profile
   - "Tap profiles to become aware of you"
   - Empty state initially

3. Favorited Me
   - Users who favorited you
   - Can favorite back (mutual match)
   - Empty state: "Favorite members by tapping star"
\`\`\`

#### **Chat Tab** (`/messages`)
\`\`\`
Shows conversation list:
- User avatar + name
- Last message preview
- Timestamp
- Unread indicator
  ↓
Tap conversation → Individual chat view
  ↓
Real-time messages (polling every 3s)
- Send text messages
- See message history
- Back to conversations list
\`\`\`

#### **Profile Tab** (`/profile`)
\`\`\`
Shows user's own profile:
- Avatar + name + occupation
- Edit profile button
  
Sections:
- Edit Profile (name, bio, pictures, location)
- Get Premium (unlock features)
- My Favorites (saved users)
- Blocked Members
- Muted Members
- Support/Help
- App version info
  ↓
Settings icon → Privacy, notifications, etc.
\`\`\`

## Data Flow Examples

### Example 1: User Discovers & Connects

\`\`\`
1. User A opens /dashboard
   ↓
2. Frontend → GET /api/users/nearby?radius=50
   ↓
3. Backend queries database:
   - Find users within 50km
   - Exclude blocked users
   - Match interests
   ↓
4. Returns JSON array of users
   ↓
5. Frontend displays in grid
   ↓
6. User A taps User B's card
   ↓
7. Frontend → GET /api/users/{userId}
   ↓
8. Shows full profile
   ↓
9. User A taps star (favorite)
   ↓
10. Frontend → POST /api/favorites
    ↓
11. Backend creates favorite record
    ↓
12. If User B already favorited A:
    - Create match notification
    - Both users can now message
\`\`\`

### Example 2: Skill Exchange Request

\`\`\`
1. User A views User B's profile
   - Sees User B offers "Guitar Lessons"
   ↓
2. User A taps "Request Skill Swap"
   ↓
3. Frontend → POST /api/skill-requests
   Body: {
     requestedUserId: B_id,
     skillId: guitar_skill_id,
     message: "I'd love to learn guitar!",
     offeringSkillId: my_cooking_skill_id
   }
   ↓
4. Backend creates request (status: pending)
   ↓
5. User B opens /for-you → Requests tab
   ↓
6. Frontend → GET /api/skill-requests?type=incoming
   ↓
7. Shows User A's request
   ↓
8. User B taps "Accept"
   ↓
9. Frontend → PATCH /api/skill-requests/{id}
   Body: { status: "accepted" }
   ↓
10. Backend updates status + creates notification
    ↓
11. Both users can now message to arrange meeting
\`\`\`

## Database Schema Flow

\`\`\`
users
  ├── id (primary key)
  ├── email (unique)
  ├── password_hash
  ├── name
  ├── bio
  ├── occupation
  ├── latitude, longitude, radius
  └── created_at

skills (what users can teach)
  ├── id
  ├── user_id → users.id
  ├── title (e.g., "Guitar Lessons")
  ├── description
  ├── category
  └── skill_level

skill_requests (swap requests)
  ├── id
  ├── requester_id → users.id
  ├── requested_user_id → users.id
  ├── skill_id → skills.id
  ├── status (pending/accepted/rejected)
  └── created_at

favorites (likes)
  ├── id
  ├── user_id → users.id
  ├── favorited_user_id → users.id
  └── created_at

messages
  ├── id
  ├── sender_id → users.id
  ├── recipient_id → users.id
  ├── content
  └── created_at

reviews (after completed exchange)
  ├── id
  ├── reviewer_id → users.id
  ├── reviewed_user_id → users.id
  ├── skill_request_id → skill_requests.id
  ├── rating (1-5 stars)
  └── comment
\`\`\`

## Security Flow

### Authentication
\`\`\`
1. User logs in
   ↓
2. Backend validates credentials
   ↓
3. Backend generates JWT token:
   - Payload: { userId, email }
   - Signed with JWT_SECRET
   - Expiry: 7 days
   ↓
4. Token sent in HTTP-only cookie
   ↓
5. Every subsequent request:
   - Browser automatically sends cookie
   - Backend verifies token
   - Extracts user ID
   - Proceeds with request
\`\`\`

### Protected Routes
\`\`\`
Frontend (proxy.ts):
- Checks if user is logged in
- Redirects to /login if not

Backend:
- Validates JWT token
- Returns 401 if invalid
\`\`\`

## Key Features

1. **Real-time Updates**: Messages poll every 3 seconds
2. **Location-based Discovery**: Uses latitude/longitude + radius
3. **Matching System**: Mutual favorites create matches
4. **Skill Requests**: Formal process to request exchanges
5. **Reviews**: Rate users after completed exchanges
6. **Privacy**: Block/mute users, control visibility

## Is the Project Presentable?

**YES!** The project includes:
- Clean, modern maroon/white UI
- Professional design matching Meet5 inspiration
- Responsive layout (mobile-first)
- Complete user flows
- Real database integration
- Production-ready code structure

**Visual Quality:**
- Beautiful hero section with real student imagery
- Card-based layouts
- Smooth transitions
- Consistent spacing and typography
- Professional color scheme (maroon primary, white background)

**Functionality:**
- Complete authentication system
- User profiles with photos
- Discovery and matching
- Messaging system
- Skill request workflow
- Review system

The application is demo-ready and can be presented to stakeholders or used as a portfolio piece. All pages are functional and connected to a real database.
