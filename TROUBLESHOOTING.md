# Troubleshooting Guide

## "Failed to fetch" Error

This error typically means:

### 1. CORS Not Configured
**Problem:** Your Render backend isn't allowing requests from Vercel.

**Solution:** Add CORS middleware to your Express app:

\`\`\`javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
\`\`\`

### 2. Backend Not Running
**Problem:** Your Render service is sleeping or crashed.

**Check:**
- Visit: `https://skillswapneu-graduation-project.onrender.com/health`
- Check Render dashboard for service status

**Solution:** Wake up the service or check logs in Render dashboard.

### 3. Wrong API Routes
**Problem:** Backend endpoints don't match frontend expectations.

**Check:** Your backend routes should be:
- `/api/auth/signup` (not `/auth/signup` or `/signup`)
- `/api/auth/login` (not `/auth/login` or `/login`)

### 4. Network/Firewall Issues
**Problem:** Network blocking requests.

**Test locally:**
\`\`\`bash
curl https://skillswapneu-graduation-project.onrender.com/api/auth/signup
\`\`\`

If this fails, your backend has issues.

---

## Development Mode

For local development without backend:

1. **Use mock data:**
   - The app includes fallback mock responses
   - Works offline for UI development

2. **Run backend locally:**
   \`\`\`bash
   # In your backend repo
   npm run dev
   \`\`\`
   
   Then update `.env.local`:
   \`\`\`
   NEXT_PUBLIC_BACKEND_URL=http://localhost:10000
   \`\`\`

---

## Common Issues

### "Unauthorized" errors
- Check if JWT token is being sent in cookies
- Verify token hasn't expired
- Check backend JWT_SECRET matches

### "Validation failed" errors
- Check request body matches expected format
- Verify all required fields are sent

### Data not loading
- Open browser DevTools → Network tab
- Check if API calls are being made
- Look at response status and body

---

## Backend Checklist

Ensure your Render backend has:

- [ ] CORS enabled for Vercel domain
- [ ] Environment variables set (DATABASE_URL, JWT_SECRET, etc.)
- [ ] Prisma migrations run
- [ ] All required endpoints implemented
- [ ] Error handling middleware
- [ ] Health check endpoint: `/health`

---

## Quick Backend Health Check

Add this to your Express app:

\`\`\`javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected' // Check Prisma connection
  });
});
\`\`\`

Test it: `https://skillswapneu-graduation-project.onrender.com/health`
