# SkillSwap Frontend

Next.js frontend application for the SkillSwap platform.

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
cd fe
npm install
\`\`\`

### 2. Set Up Environment Variables

Create a `.env.local` file:

\`\`\`bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
\`\`\`

### 3. Start the Development Server

\`\`\`bash
npm run dev
\`\`\`

The frontend will start on http://localhost:3000

## Important Notes

- Make sure the backend server is running before using the frontend
- The backend must be running on the URL specified in `NEXT_PUBLIC_BACKEND_URL`

## Project Structure

\`\`\`
fe/
├── app/              # Next.js app directory
│   ├── page.tsx      # Landing page
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── hooks/           # React hooks
├── lib/             # Utilities
└── public/          # Static assets (favicon, images)
