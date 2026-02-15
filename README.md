# LinkVault

![LinkVault Banner](https://img.shields.io/badge/Status-Feature%20Complete-success?style=for-the-badge) ![Tech Stack](https://img.shields.io/badge/Stack-Next.js_Supabase_Tailwind-blue?style=for-the-badge)

**LinkVault** is a modern, AI-powered bookmark manager that helps you save, organize, and rediscover your favorite web content. It leverages **Groq's LLaMA 3** model to automatically generate meaningful titles, summaries, and tags for every link you save. Built with **Next.js 14**, **Supabase**, and **Tailwind CSS**, it features real-time synchronization across devices and a beautiful, animation-rich dark mode interface.

---

## 🚀 Key Features

- **✨ AI-Powered Organization**: Automatically generates concise titles, summaries, and relevant tags for any URL using LLaMA 3 (via Groq).
- **⚡ Real-Time Sync**: Instant updates across all open tabs and devices using Supabase Realtime.
- **🔐 Secure Authentication**: One-click Google Sign-In with Row Level Security (RLS) ensuring your data is private.
- **🎨 Beautiful UI/UX**: sophisticated dark mode design with glassmorphism, micro-interactions, and smooth animations (Framer Motion-like feel).
- **🔍 Smart Search & Filtering**: Instantly search by title, URL, or tags.
- **📱 Fully Responsive**: Optimized experience for desktop, tablet, and mobile devices.

---

## 🛠 Tech Stack

| Category       | Tool / Technology                  | Purpose                                      |
|----------------|------------------------------------|----------------------------------------------|
| **Framework**  | Next.js 16 (App Router)            | Full-stack React framework with SSR/SSG      |
| **Styling**    | Tailwind CSS v4                    | Utility-first CSS framework                  |
| **Database**   | Supabase (PostgreSQL)              | Managed database with auth and realtime      |
| **Auth**       | Supabase Auth + Google OAuth       | Secure authentication                        |
| **AI Model**   | Groq API (LLaMA 3 — 8B)           | Ultra-fast AI inference for text generation   |
| **Scraping**   | Cheerio                            | Server-side HTML parsing for metadata        |
| **Realtime**   | Supabase Realtime                  | WebSocket-based live data synchronization    |
| **Icons**      | Lucide React                       | Modern, consistent icon set                  |
| **Deployment** | Vercel                             | Production hosting and CI/CD                 |

---

## 🏗 Architecture

```mermaid
graph TD
    Client[Client (Browser)] -->|Auth & Data Sync| Supabase
    Client -->|Add URL| NextAPI[Next.js API Route (/api/ai-enhance)]
    
    subgraph "AI Enhancement Pipeline"
        NextAPI -->|Fetch HTML| Cheerio[Cheerio Scraper]
        Cheerio -->|Extract Metadata| NextAPI
        NextAPI -->|Prompt| Groq[Groq API (LLaMA 3)]
        Groq -->|Structured JSON| NextAPI
    end
    
    NextAPI -->|Suggested Title/Tags| Client
    Client -->|Save Bookmark| Supabase[Supabase DB]
    Supabase -.->|Realtime Event (Insert/Delete)| Client
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase project (Text extraction & Auth enabled)
- A Groq API Key

### 1. Clone the repository
```bash
git clone https://github.com/PriyanshuRanjan04/LinkVault.git
cd LinkVault
```

### 2. Install dependencies
```bash
npm install
# Note for Windows Powershell users:
# cmd /c "npm install"
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Email (Optional)
RESEND_API_KEY=your_resend_api_key
```

### 4. Run database migrations
Execute the SQL commands in `schema.sql` in your Supabase SQL Editor to set up tables and policies.

### 5. Start the development server
```bash
npm run dev
# Windows Powershell:
# cmd /c "npm run dev"
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

---

# 🚧 Engineering Challenges & Solutions

This project was built using **Next.js (App Router) + Supabase + TypeScript**, and during development and deployment, several real-world architectural and production-level challenges were encountered. Below is a detailed breakdown of the most significant issues and how they were resolved.

---

## 1️⃣ State Synchronization & Rendering Inconsistency (Next.js App Router)

### 🧩 Problem

After inserting a bookmark:

* The database insert succeeded.
* The new row appeared in Supabase.
* The UI did not update immediately.
* The bookmark only appeared after a manual refresh.

However, deletion worked instantly.

This indicated a frontend state management issue rather than a backend failure.

---

### 🔍 Root Cause

The Client Component:

```tsx
const [bookmarks, setBookmarks] = useState(initialBookmarks)
```

Also included:

```tsx
useEffect(() => {
  setBookmarks(initialBookmarks)
}, [initialBookmarks])
```

When a new bookmark was added:

1. Local state updated optimistically.
2. Server component re-rendered.
3. Old `initialBookmarks` were passed again.
4. `useEffect` reset the state with stale data.
5. The newly added bookmark disappeared.

This created a **server-prop vs client-state conflict**.

---

### ✅ Solution

* Removed the `useEffect` syncing server props.
* Established the Client Component as the single source of truth.
* Used the inserted row returned from Supabase to update state immediately.

Final pattern:

```tsx
const { data } = await supabase
  .from("bookmarks")
  .insert(newBookmark)
  .select()
  .single()

if (data) {
  setBookmarks(prev => [data, ...prev])
}
```

---

### 🚀 Result

* Instant UI updates
* No reliance on `router.refresh()`
* No manual refresh required
* Clean separation between server data fetching and client mutations

---

## 2️⃣ Optimistic UI & Stale State Bugs

### 🧩 Problem

Adding multiple bookmarks quickly resulted in duplicate entries or inconsistent ordering.

---

### 🔍 Root Cause

Using:

```tsx
setBookmarks([newBookmark, ...bookmarks])
```

This captured a stale closure value of `bookmarks` during rapid operations.

---

### ✅ Solution

Switched to functional state updates:

```tsx
setBookmarks(prev => [newBookmark, ...prev])
```

This ensures the latest state is always used.

---

### 🚀 Result

* No duplicates
* Stable ordering
* Predictable state behavior under concurrent interactions

---

## 3️⃣ Supabase Row Level Security (RLS) Configuration

### 🧩 Problem

During development:

* Inserts failed silently.
* Select queries returned empty arrays.
* Potential risk of users accessing others’ data.

---

### 🔍 Root Cause

RLS policies were either incomplete or not defined for all operations.

Supabase requires explicit policies for:

* SELECT
* INSERT
* UPDATE
* DELETE

---

### ✅ Solution

Enabled RLS and created policies enforcing:

```sql
auth.uid() = user_id
```

for all CRUD operations.

Also ensured:

* Single-column primary key (`id`)
* Proper indexing
* Full coverage of operations

---

### 🚀 Result

* Complete data isolation
* Secure multi-user environment
* Predictable CRUD behavior

---

## 4️⃣ Next.js Server vs Client Component Confusion

### 🧩 Problem

Experienced hydration errors and unexpected behavior when mixing hooks and server-side logic.

---

### 🔍 Root Cause

* Using hooks in Server Components
* Not marking interactive components with `"use client"`
* Passing server data incorrectly into client logic

---

### ✅ Solution

Established strict separation:

**Server Component**

* Fetches initial data
* Performs auth checks
* No hooks

**Client Component**

* Handles state
* Handles mutations
* Manages UI interactivity

---

### 🚀 Result

* No hydration errors
* Faster initial loads (SSR)
* Clean architectural boundaries

---

## 5️⃣ OAuth Redirect & Authentication Flow Issues

### 🧩 Problem

After Google login:

* Users saw intermediate pages.
* Incorrect redirect flow.
* 404 errors after redeployment.

---

### 🔍 Root Cause

* Incorrect callback redirection
* Outdated redirect URLs after Vercel domain change
* Landing page not checking authenticated state

---

### ✅ Solution

* Redirected `/auth/callback` directly to `/dashboard`
* Added user checks on landing/login pages
* Updated OAuth redirect URLs after each redeploy

---

### 🚀 Result

Clean flow:

Landing → Login → Dashboard
Logout → Landing

No intermediate pages. No redirect loops.

---

## 6️⃣ Deployment Caching & Vercel Build Issues

### 🧩 Problem

After pushing new code:

* Live site showed old version
* Changes only appeared after re-importing the project

---

### 🔍 Root Cause

Multiple layers of caching:

* Next.js build cache
* Vercel CDN cache
* Browser cache

---

### ✅ Solution

* Purged CDN and data cache
* Redeployed without reusing build cache
* Added unique build IDs
* Tested in incognito mode

---

### 🚀 Result

Deployments now reflect changes immediately after rebuild.

---

## 7️⃣ Runtime vs Build-Time Environment Variable Failure

### 🧩 Problem

Production build failed due to missing API key.

---

### 🔍 Root Cause

Third-party SDK was initialized at module scope, executing during build time when environment variables were unavailable.

---

### ✅ Solution

Moved client initialization inside the request handler:

* Ensures execution at runtime only
* Prevents build-time crashes

---

### 🚀 Result

Stable production builds without environment-related failures.

---

## 8️⃣ Database Schema Evolution Without Downtime

### 🧩 Problem

Needed to introduce:

* Tags (array field)
* Favorites (boolean)
* Sorting features

Without breaking existing data.

---

### ✅ Solution

* Used `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
* Set sensible default values
* Added indexes for performance
* Updated TypeScript types

---

### 🚀 Result

* Zero downtime migration
* Backward compatibility
* Improved query performance

---

## 9️⃣ Favicon Reliability & Graceful Degradation

### 🧩 Problem

Some bookmark favicons failed to load, causing broken UI elements.

---

### ✅ Solution

* Implemented favicon fallback system
* Displayed first letter of domain when favicon fails
* Added error handlers to image elements

---

### 🚀 Result

* No broken UI elements
* Consistent visual appearance
* Improved UX reliability

---

# 🧠 Key Engineering Takeaways

* Avoid syncing server props into client state unless absolutely necessary.
* Use functional state updates when working with asynchronous mutations.
* Treat caching (build, CDN, browser) as separate layers.
* Separate Server and Client Components strictly in Next.js App Router.
* Implement complete RLS policies in Supabase for secure multi-user systems.
* Initialize third-party SDKs lazily to avoid build-time failures.
* Always implement graceful fallbacks for external dependencies.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
