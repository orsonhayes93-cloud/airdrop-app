# Frontend API Configuration

After deploying your backend to Cloudflare Workers, you need to update the frontend to point to your backend URL.

## Setup Steps

### 1. Local Development (Replit)
By default, the frontend calls `http://localhost:5000` (same server). No configuration needed.

### 2. Production (Netlify)
After deploying to Cloudflare Workers:

1. Create or update `.env` file in the project root:
```
VITE_API_URL=https://your-backend.workers.dev
```

2. Push to GitHub
3. Netlify will automatically rebuild with the new environment variable

### 3. Environment Variables in Netlify
If deploying to Netlify:

1. Go to Netlify Dashboard
2. Site Settings → Build & Deploy → Environment
3. Add a new variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.workers.dev`

## Testing
- Locally: API calls go to `http://localhost:5000/api/*`
- On Netlify: API calls go to `https://your-backend.workers.dev/api/*`

You can verify in browser DevTools (Network tab) to see which URL is being called.
