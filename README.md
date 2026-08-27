# 🎓 IIT Bhubaneswar CGPA Calculator & Academic Tracker

An interactive, high-performance web application designed for B.Tech students at **IIT Bhubaneswar** to track, calculate, and predict SGPA and CGPA across all 8 semesters using official department curricula and grading rules.

🔗 **Live Application**: [IIT Bhubaneswar CGPA Calculator & Academic Tracker](https://iitbbs-cgpa-calculator.vercel.app/)

---

## 🌟 Key Features & Progress Made

- **Branch-Specific 8-Semester Curricula**: Pre-loaded official course catalogs, codes, and credit weightages for all 7 B.Tech departments:
  - 💻 **Computer Science & Engineering (CSE)**
  - ⚡ **Electrical Engineering (EE)**
  - 📡 **Electronics & Communication Engineering (ECE)**
  - ⚙️ **Mechanical Engineering (ME)**
  - 🏗️ **Civil Engineering (CE)**
  - 🔬 **Metallurgical & Materials Engineering (MM / MEMS)**
  - ⚛️ **Engineering Physics (EP)**
- **Real-Time Instant SGPA & CGPA Calculation**: Computes Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA) instantaneously based on the official IIT Bhubaneswar 10-point letter grading scale:
  - `EX`: 10 | `A`: 9 | `B`: 8 | `C`: 7 | `D`: 6 | `P`: 5 | `F`: 0
- **Modern Single-Viewport Landing Page**: Features a 100vh hero section with automatic cross-fading campus photography (Admin, SMS, SECS, SIF, SMMME), retro pixel dot-matrix typography, and department trust badges.
- **Animated Statistics Counter**: 4-column animated metric display tracking active branches, courses cataloged, grading accuracy, and student usage.
- **Custom Course & Semester Management**:
  - Add official catalog courses or user-defined custom courses with custom codes and credits.
  - Dynamically modify course credits, letter grades, or delete individual courses and semesters.
  - Interactive course autocomplete combobox for quick course selection.
- **Privacy-First Local Persistence**: Student grade data is saved safely in the browser's `localStorage` (`iitbbs_academic_tracker_v1`). No login required, zero personal data collected.
- **Anonymous Page Analytics System**: Built-in privacy-friendly visit counter integrated with Supabase RLS and custom PostgreSQL RPC procedures (`get_visit_stats`).
- **Glassmorphic UI & Theme Engine**: VisionOS-inspired glassmorphism with instant Dark and Light mode toggling and system preference detection.

---

## 🚀 Live Demo

Access the live application directly in your browser:
👉 **[IIT Bhubaneswar CGPA Calculator & Academic Tracker](https://iitbbs-cgpa-calculator.vercel.app/)**

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router & React Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom Glassmorphism System
- **Fonts**: `GeistSans`, `GeistMono`, and Google Font [`DotGothic16`](https://fonts.google.com/specimen/DotGothic16)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Analytics**: [Supabase](https://supabase.com/) (`@supabase/ssr`) with PostgreSQL Row Level Security (RLS)
- **Hosting & CI/CD**: [Vercel](https://vercel.com/)

---

## 📂 Project Structure

```
iitbbs-cgpa-calculator/
├── DATA/                   # Official syllabus source documents (.docx per department)
│   ├── CS/                 # Computer Science & Engineering
│   ├── EE/                 # Electrical Engineering
│   ├── ECE/                # Electronics & Communication Engineering
│   ├── ME/                 # Mechanical Engineering
│   ├── Civil/              # Civil Engineering
│   ├── MM/                 # Metallurgical & Materials Engineering
│   └── EP/                 # Engineering Physics
├── public/                 # Static campus imagery and visual assets
│   └── Images/             # High-res hero slides (hero-admin, hero-[#dept], etc.)
├── src/
│   ├── app/                # Next.js 14 App Router routes & endpoints
│   │   ├── api/            # Serverless API routes
│   │   │   ├── track-visit/ # POST endpoint for recording page visits
│   │   │   └── visit-stats/ # GET endpoint for retrieving analytics metrics
│   │   ├── calculator/     # Branch-specific calculator route ([branch])
│   │   ├── dashboard/      # Main tracker dashboard and semester views
│   │   ├── select-branch/  # Department selection cards
│   │   ├── globals.css     # Design tokens, keyframe animations, glass utilities
│   │   ├── layout.tsx      # Global root layout with VisitTracker mounted
│   │   └── page.tsx        # Single-viewport landing page
│   ├── components/         # Reusable React UI components
│   │   ├── AddCourseModal.tsx       # Modal for adding courses from catalog or custom
│   │   ├── AddSemesterButton.tsx    # Button to append new semesters
│   │   ├── CourseCombobox.tsx       # Searchable catalog course selector
│   │   ├── CourseManager.tsx        # Table view for single semester course editing
│   │   ├── CurriculumDashboard.tsx  # Main 8-semester CGPA tracker grid
│   │   ├── DeleteSemesterButton.tsx # Semester deletion confirmation component
│   │   ├── GradeSelector.tsx        # Interactive letter grade picker
│   │   ├── LandingHero.tsx          # Single-viewport hero with background slideshow
│   │   ├── Onboarding.tsx           # Initial department setup flow
│   │   ├── ThemeProvider.tsx        # Dark/Light theme context provider
│   │   ├── ThemeToggle.tsx          # Animated theme toggle button
│   │   └── VisitTracker.tsx         # Client component for silent analytics tracking
│   ├── data/               # Official branch curricula definitions
│   │   └── coursesData.ts  # Pre-loaded course codes, titles, credits, and branches
│   └── lib/                # Utility modules & helpers
│       ├── curricula.ts    # Branch curriculum schemas and types
│       ├── grading.ts      # Core SGPA & CGPA calculation logic
│       ├── storage.ts      # LocalStorage wrapper for client-side state
│       ├── visitStats.ts   # Helper for fetching page visit statistics
│       └── supabase/       # Supabase client/server instantiation modules
├── supabase/               # Database SQL migrations & schema definitions
│   └── schema.sql          # Tables, RLS policies, and get_visit_stats RPC function
├── .env.local              # Local environment variables configuration
├── next.config.mjs         # Next.js framework configuration
├── package.json            # NPM dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## ⚡ Quick Start & Development

### Prerequisites

- **Node.js**: `v18.17.0` or higher (`v20.x` recommended)
- **Package Manager**: `npm` (v9+)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bhuvan-0412/iitbbs-cgpa-calculator.git
   cd iitbbs-cgpa-calculator-1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Deployment

The application is deployed on Vercel and configured for automatic continuous deployment on commits to the `main` branch.

- **Live URL**: [https://iitbbs-cgpa-calculator.vercel.app/](https://iitbbs-cgpa-calculator.vercel.app/)

To deploy your own instance to Vercel:
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Set the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Click **Deploy**.

---

## 🤝 Contributing

Contributions, feature suggestions, and curriculum data updates are welcome!

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

All rights reserved by the author unless stated otherwise.
