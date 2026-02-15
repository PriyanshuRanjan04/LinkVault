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
