# Backend API Requirements for Render

Your Node.js + Express backend on Render must implement these endpoints for the frontend to work.

## Base URL
- Production: `https://skillswapneu-graduation-project.onrender.com`
- All endpoints should be prefixed with `/api`

## Required CORS Configuration

**CRITICAL**: Your Express backend MUST have CORS enabled to allow requests from Vercel:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app',
    // Add your actual Vercel domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Authentication Endpoints

### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullName": "John Doe",
  "username": "johndoe"
}
```

**Success Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "username": "johndoe"
  },
  "token": "jwt_token_here"
}
```

**Set-Cookie Header:** `auth-token=jwt_token; HttpOnly; Secure; SameSite=None`

---

### POST `/api/auth/login`
Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "username": "johndoe"
  },
  "token": "jwt_token_here"
}
```

**Set-Cookie Header:** `auth-token=jwt_token; HttpOnly; Secure; SameSite=None`

---

### POST `/api/auth/logout`
Log out current user.

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET `/api/auth/me`
Get current authenticated user profile.

**Headers Required:** `Authorization: Bearer {token}` OR Cookie: `auth-token={token}`

**Success Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "username": "johndoe",
  "bio": "Student developer",
  "location": "New York",
  "profileImage": "url",
  "interests": ["coding", "music"],
  "createdAt": "2025-01-01T00:00:00Z"
}
```

---

## User Profile Endpoints

### GET `/api/users/me`
Get full current user profile with skills.

**Success Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "username": "johndoe",
  "bio": "...",
  "location": "...",
  "profileImage": "...",
  "interests": [...],
  "skills": [...]
}
```

---

### PUT `/api/users/profile`
Update user profile.

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "bio": "Updated bio",
  "location": "San Francisco",
  "interests": ["design", "art"]
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "fullName": "Jane Doe",
  "bio": "Updated bio",
  // ... updated fields
}
```

---

### GET `/api/users/nearby`
Get users within specified radius.

**Query Parameters:**
- `lat`: Latitude (required)
- `lng`: Longitude (required)
- `radius`: Radius in kilometers (default: 50)

**Success Response (200):**
```json
{
  "users": [
    {
      "id": "uuid",
      "fullName": "User Name",
      "username": "username",
      "profileImage": "url",
      "bio": "...",
      "distance": 5.2,
      "skills": [...]
    }
  ]
}
```

---

### GET `/api/users/:id`
Get specific user profile.

**Success Response (200):**
```json
{
  "id": "uuid",
  "fullName": "User Name",
  "username": "username",
  "bio": "...",
  "location": "...",
  "profileImage": "...",
  "skills": [...],
  "reviews": [...]
}
```

---

## Skills Endpoints

### POST `/api/skills`
Create a new skill offering.

**Request Body:**
```json
{
  "title": "Web Development Tutoring",
  "description": "I can teach JavaScript and React",
  "category": "Technology",
  "level": "Intermediate"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Web Development Tutoring",
  "description": "...",
  "category": "Technology",
  "level": "Intermediate",
  "createdAt": "..."
}
```

---

### GET `/api/skills`
Get all skills with optional filters.

**Query Parameters:**
- `category`: Filter by category (optional)
- `search`: Search in title/description (optional)
- `userId`: Get skills for specific user (optional)

**Success Response (200):**
```json
{
  "skills": [
    {
      "id": "uuid",
      "userId": "uuid",
      "user": {
        "fullName": "John Doe",
        "username": "johndoe",
        "profileImage": "..."
      },
      "title": "Web Development Tutoring",
      "description": "...",
      "category": "Technology",
      "level": "Intermediate",
      "createdAt": "..."
    }
  ]
}
```

---

### GET `/api/skills/:id`
Get specific skill details.

**Success Response (200):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "user": { ... },
  "title": "...",
  "description": "...",
  "category": "...",
  "level": "...",
  "createdAt": "..."
}
```

---

### PUT `/api/skills/:id`
Update skill (owner only).

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

---

### DELETE `/api/skills/:id`
Delete skill (owner only).

**Success Response (200):**
```json
{
  "message": "Skill deleted successfully"
}
```

---

## Match/Request Endpoints

### POST `/api/requests`
Request a skill swap.

**Request Body:**
```json
{
  "skillId": "uuid",
  "message": "Hi, I'd like to learn from you!"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "requesterId": "uuid",
  "skillId": "uuid",
  "message": "...",
  "status": "pending",
  "createdAt": "..."
}
```

---

### GET `/api/requests`
Get requests for current user.

**Query Parameters:**
- `type`: "sent" or "received"

**Success Response (200):**
```json
{
  "requests": [
    {
      "id": "uuid",
      "requester": { ... },
      "skill": { ... },
      "message": "...",
      "status": "pending",
      "createdAt": "..."
    }
  ]
}
```

---

### PATCH `/api/requests/:id`
Accept or reject a request.

**Request Body:**
```json
{
  "status": "accepted" // or "rejected"
}
```

---

## Favorites Endpoints

### POST `/api/favorites`
Add user to favorites.

**Request Body:**
```json
{
  "favoriteUserId": "uuid"
}
```

---

### GET `/api/favorites`
Get user's favorite users.

**Success Response (200):**
```json
{
  "favorites": [
    {
      "id": "uuid",
      "fullName": "...",
      "username": "...",
      "profileImage": "...",
      "bio": "..."
    }
  ]
}
```

---

### DELETE `/api/favorites/:userId`
Remove user from favorites.

---

## Messages Endpoints

### POST `/api/messages`
Send a message.

**Request Body:**
```json
{
  "receiverId": "uuid",
  "content": "Hello!"
}
```

---

### GET `/api/messages/conversations`
Get list of conversations.

**Success Response (200):**
```json
{
  "conversations": [
    {
      "user": {
        "id": "uuid",
        "fullName": "...",
        "username": "...",
        "profileImage": "..."
      },
      "lastMessage": {
        "content": "...",
        "createdAt": "...",
        "read": false
      },
      "unreadCount": 2
    }
  ]
}
```

---

### GET `/api/messages/:userId`
Get messages with specific user.

**Success Response (200):**
```json
{
  "messages": [
    {
      "id": "uuid",
      "senderId": "uuid",
      "receiverId": "uuid",
      "content": "...",
      "read": false,
      "createdAt": "..."
    }
  ]
}
```

---

### PATCH `/api/messages/:id/read`
Mark message as read.

---

## Reviews Endpoints

### POST `/api/reviews`
Create a review.

**Request Body:**
```json
{
  "reviewedUserId": "uuid",
  "rating": 5,
  "comment": "Great experience!"
}
```

---

### GET `/api/reviews/:userId`
Get reviews for a user.

**Success Response (200):**
```json
{
  "reviews": [
    {
      "id": "uuid",
      "reviewer": {
        "fullName": "...",
        "username": "...",
        "profileImage": "..."
      },
      "rating": 5,
      "comment": "...",
      "createdAt": "..."
    }
  ],
  "averageRating": 4.8
}
```

---

## Notifications Endpoints

### GET `/api/notifications`
Get user notifications.

**Success Response (200):**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "request",
      "message": "New skill request from John",
      "read": false,
      "createdAt": "..."
    }
  ]
}
```

---

### PATCH `/api/notifications/:id/read`
Mark notification as read.

---

## Error Responses

All endpoints should return appropriate error responses:

**400 Bad Request:**
```json
{
  "error": "Validation failed",
  "details": ["Email is required", "Password must be at least 8 characters"]
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "error": "You don't have permission to perform this action"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Prisma Schema

Your backend should use this Prisma schema (or equivalent):

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  fullName      String
  username      String    @unique
  bio           String?
  location      String?
  latitude      Float?
  longitude     Float?
  profileImage  String?
  interests     String[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  skills        Skill[]
  sentRequests  Request[] @relation("Requester")
  receivedRequests Request[] @relation("SkillOwner")
  favorites     Favorite[] @relation("User")
  favoritedBy   Favorite[] @relation("FavoriteUser")
  sentMessages  Message[] @relation("Sender")
  receivedMessages Message[] @relation("Receiver")
  givenReviews  Review[] @relation("Reviewer")
  receivedReviews Review[] @relation("ReviewedUser")
  notifications Notification[]
}

model Skill {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  description String
  category    String
  level       String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  requests    Request[]
}

model Request {
  id          String   @id @default(uuid())
  requesterId String
  requester   User     @relation("Requester", fields: [requesterId], references: [id])
  skillId     String
  skill       Skill    @relation(fields: [skillId], references: [id], onDelete: Cascade)
  message     String
  status      String   @default("pending") // pending, accepted, rejected
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Favorite {
  id             String   @id @default(uuid())
  userId         String
  user           User     @relation("User", fields: [userId], references: [id], onDelete: Cascade)
  favoriteUserId String
  favoriteUser   User     @relation("FavoriteUser", fields: [favoriteUserId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())
  
  @@unique([userId, favoriteUserId])
}

model Message {
  id         String   @id @default(uuid())
  senderId   String
  sender     User     @relation("Sender", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId String
  receiver   User     @relation("Receiver", fields: [receiverId], references: [id], onDelete: Cascade)
  content    String
  read       Boolean  @default(false)
  createdAt  DateTime @default(now())
}

model Review {
  id             String   @id @default(uuid())
  reviewerId     String
  reviewer       User     @relation("Reviewer", fields: [reviewerId], references: [id], onDelete: Cascade)
  reviewedUserId String
  reviewedUser   User     @relation("ReviewedUser", fields: [reviewedUserId], references: [id], onDelete: Cascade)
  rating         Int
  comment        String?
  createdAt      DateTime @default(now())
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## Testing Your Backend

Use these curl commands to test your endpoints:

```bash
# Test signup
curl -X POST https://skillswapneu-graduation-project.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","username":"testuser"}'

# Test login
curl -X POST https://skillswapneu-graduation-project.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
