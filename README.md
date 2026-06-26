# LFG14 Challenge — Web App

React + Vite + Tailwind + Supabase PWA for the LFG14 14-day fitness challenge.

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial LFG14 web app"
git remote add origin https://github.com/YOUR_USERNAME/lfg14-web.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to vercel.com and sign in
2. Click Add New → Project
3. Import your lfg14-web GitHub repository
4. Vercel auto-detects it as a Vite project — leave all build settings as default

### 3. Add Environment Variables

In Vercel project settings → Environment Variables, add:

VITE_SUPABASE_URL        = https://picktlrdkudimippkker.supabase.co
VITE_SUPABASE_ANON_KEY   = your anon key

### 4. Deploy

Click Deploy. You'll get a URL like https://lfg14-web.vercel.app

### 5. Test on iPhone Safari

1. Open the Vercel URL in Safari on iPhone
2. Tap Share → Add to Home Screen
3. The app installs as a full-screen PWA (no browser bar)
4. Test login, workout logging, and CSV export

---

## Local Development

```bash
bun install
bun run dev
```

Copy .env.example to .env.local and fill in your Supabase credentials.

## Environment Variables

VITE_SUPABASE_URL      — Your Supabase project URL
VITE_SUPABASE_ANON_KEY — Your Supabase anon/publishable key
