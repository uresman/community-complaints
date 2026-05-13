# CivicVoice — Community Complaint System

A full-stack community complaint management platform built with **Next.js 14**, **Supabase**, and deployable to **Vercel** in minutes.

## Features

- 📋 **Submit Complaints** — Categorized, prioritized, with optional anonymity
- 🔍 **Browse & Filter** — Filter by category, status, sort by date or votes
- 📍 **Track Complaints** — Use tracking ID + email to follow up
- ▲ **Community Upvotes** — Show support for issues that matter
- 🛡️ **Admin Dashboard** — Manage statuses, add official responses
- 🎨 **Distinctive Design** — Editorial newspaper aesthetic, fully responsive

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase (optional) |
| Hosting | Vercel |
| Styling | Tailwind CSS |
| Language | TypeScript |

---

## 🚀 Deploy in 5 Steps

### Step 1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **API Keys** (Settings → API)
3. Open the **SQL Editor** and run the migration:

```sql
-- Copy and run the contents of:
-- supabase/migrations/001_initial_schema.sql
```

### Step 2 — Clone and Configure

```bash
git clone <your-repo>
cd community-complaints
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### Step 3 — Test Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 4 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/community-complaints.git
git push -u origin main
```

### Step 5 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy** 🎉

---

## 📁 Project Structure

```
community-complaints/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── complaints/
│   │   ├── page.tsx                # Browse complaints
│   │   ├── new/page.tsx            # Submit form
│   │   └── [id]/page.tsx           # Complaint detail
│   ├── track/
│   │   └── page.tsx                # Track by ID
│   ├── admin/
│   │   └── page.tsx                # Admin dashboard
│   └── api/
│       └── complaints/
│           ├── route.ts            # GET all, POST new
│           ├── track/route.ts      # Track by ID+email
│           └── [id]/
│               ├── route.ts        # GET, PATCH, DELETE
│               └── upvote/route.ts # POST upvote
├── components/
│   ├── Navbar.tsx
│   ├── StatsBar.tsx
│   ├── UpvoteButton.tsx
│   └── AdminComplaintCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   └── server.ts               # Server + Admin client
│   └── utils.ts                    # Helpers & constants
├── types/
│   └── index.ts                    # TypeScript types
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql  # Database schema
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/complaints` | List all complaints |
| POST | `/api/complaints` | Submit new complaint |
| GET | `/api/complaints/:id` | Get single complaint |
| PATCH | `/api/complaints/:id` | Update status/notes (admin) |
| DELETE | `/api/complaints/:id` | Delete complaint (admin) |
| POST | `/api/complaints/:id/upvote` | Upvote a complaint |
| GET | `/api/complaints/track` | Track by ID + email |

## Customization

- **Branding**: Edit `app/layout.tsx` metadata and `components/Navbar.tsx`
- **Categories**: Update `types/index.ts` and `lib/utils.ts`
- **Colors**: Edit `tailwind.config.js` and `app/globals.css`
- **Admin Auth**: Add Supabase Auth to the admin routes for production security
- **Email Notifications**: Add Resend or SendGrid in the POST API route

## Security Notes

⚠️ The admin panel currently has no authentication. For production:
1. Add Supabase Auth or NextAuth
2. Protect `/admin` and `/api/complaints/[id]` PATCH/DELETE routes
3. Consider rate limiting the POST endpoint

---

Built with ❤️ using Next.js + Supabase
