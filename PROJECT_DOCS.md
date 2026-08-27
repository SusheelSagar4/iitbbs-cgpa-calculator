# Project Documentation — IIT Bhubaneswar CGPA Calculator & Academic Tracker

## 1. Project Overview

The **IIT Bhubaneswar CGPA Calculator & Academic Tracker** is a client-centric web application built for B.Tech students at IIT Bhubaneswar. It provides interactive, branch-specific 8-semester academic tracking, live Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA) prediction, and customizable course management.

### Key Objectives & Functionality
- **Official B.Tech Curriculum Pre-loading**: Covers 7 major departments (Computer Science & Engineering, Electrical Engineering, Electronics & Communication Engineering, Mechanical Engineering, Civil Engineering, Metallurgical & Materials Engineering, Engineering Physics) pre-populated with official course codes, credit allocations, and course names.
- **Real-Time Grade Calculation**: Computes SGPA and CGPA instantaneously based on the official IIT Bhubaneswar 10-point letter grading scale (`EX`: 10, `A`: 9, `B`: 8, `C`: 7, `D`: 6, `P`: 5, `F`: 0).
- **Interactive Campus Experience**: Features a scroll-driven hero cross-fading through high-resolution campus building imagery (Admin Building, SMS, SECS, SIF, SMMME).
- **Flexible Customization**: Allows students to add official or custom courses, modify course credits/grades, delete courses/semesters, and switch academic departments seamlessly.
- **Client-Side Persistence & Theming**: Persists student progress locally in `localStorage` without mandatory cloud authentication, paired with a glassmorphic VisionOS-inspired theme system (Dark/Light mode).

### Architecture at a Glance
- **Framework**: Built on Next.js 14 (App Router) using React 18 and TypeScript.
- **Styling**: Tailwind CSS enhanced with custom Glassmorphism/VisionOS design system rules defined in `src/app/globals.css`.
- **State Management & Data Flow**: 
  - Local state in React components for interactive UI elements.
  - LocalStorage wrapper (`src/lib/storage.ts`) acting as the primary client persistence engine (`iitbbs_academic_tracker_v1`).
  - Helper libraries for grading calculations (`src/lib/grading.ts`) and course catalog definitions (`src/data/coursesData.ts`).
- **Database / Backend Integration (Prepared)**: Supabase SSR integration (`@supabase/ssr`, `src/lib/supabase/`) and SQL schema (`supabase/schema.sql`) prepared for optional cloud sync.

---

## 2. File-by-File Breakdown

### Root & Configuration Files

#### [`package.json`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/package.json)
- **Purpose**: Defines project dependencies, scripts (`dev`, `build`, `start`, `lint`), and version information.
- **Exports/Contents**: NPM package manifest configuration.
- **Interacts with**: `node_modules`, Next.js CLI, Tailwind CSS, TypeScript, ESLint.

#### [`package-lock.json`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/package-lock.json)
- **Purpose**: Locks exact dependency versions for reproducible npm builds.
- **Exports/Contents**: Dependency tree lockfile.
- **Interacts with**: npm CLI.

#### [`tsconfig.json`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/tsconfig.json)
- **Purpose**: TypeScript compiler configuration, path aliases (`@/*` mapping to `./src/*`), and module resolution rules.
- **Exports/Contents**: TypeScript compiler options.
- **Interacts with**: TypeScript compiler, Next.js build system.

#### [`next.config.mjs`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/next.config.mjs)
- **Purpose**: Next.js framework configuration file.
- **Exports/Contents**: Default export `nextConfig`.
- **Interacts with**: Next.js build runtime.

#### [`tailwind.config.ts`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/tailwind.config.ts)
- **Purpose**: Tailwind CSS design system configuration, defining content sources and theme extensions.
- **Exports/Contents**: Default export `config` (Tailwind Config).
- **Interacts with**: PostCSS, Tailwind CSS compiler, `src/app/globals.css`.

#### [`postcss.config.mjs`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/postcss.config.mjs)
- **Purpose**: Configures PostCSS plugins (`tailwindcss`, `autoprefixer`) for CSS processing.
- **Exports/Contents**: PostCSS configuration object.
- **Interacts with**: Tailwind CSS engine, Next.js asset pipeline.

#### [`.eslintrc.json`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/.eslintrc.json)
- **Purpose**: ESLint code quality and style linting configuration extending `next/core-web-vitals`.
- **Exports/Contents**: ESLint configuration object.
- **Interacts with**: ESLint CLI, IDE linter extension.

#### [`.gitignore`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/.gitignore)
- **Purpose**: Specifies files and directories excluded from Git version control (`node_modules`, `.next`, `.env*.local`).
- **Exports/Contents**: Git ignore rules.
- **Interacts with**: Git version control system.

#### [`.env.local`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/.env.local)
- **Purpose**: Stores local environment variable definitions (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- **Exports/Contents**: Public Supabase project URL and anonymous API key.
- **Interacts with**: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`.

#### [`README.md`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/README.md)
- **Purpose**: Project documentation file detailing features, installation, local usage, environment setup, and deployment info.
- **Exports/Contents**: Markdown documentation.
- **Interacts with**: GitHub repository landing view.

#### [`courses.txt`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/courses.txt)
- **Purpose**: Raw tabular text file containing curriculum details for first-year and mechanical engineering courses.
- **Exports/Contents**: Plain text course reference data.
- **Interacts with**: Curriculum data source file used during setup of `src/data/coursesData.ts`.

#### [`next-env.d.ts`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/next-env.d.ts)
- **Purpose**: TypeScript type declaration file generated automatically by Next.js.
- **Exports/Contents**: Global Next.js ambient TypeScript types.
- **Interacts with**: TypeScript compiler.

---

### Department Data Files (`DATA/`)

#### [`DATA/Civil/civil.docx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/DATA/Civil/civil.docx)
- **Purpose**: Official syllabus source document for the Civil Engineering department.
- **Exports/Contents**: Word document format syllabus.
- **Interacts with**: Reference source for Civil Engineering curriculum data.

#### [`DATA/CS/cs.docx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/DATA/CS/cs.docx)
- **Purpose**: Official syllabus source document for the Computer Science & Engineering department.
- **Exports/Contents**: Word document format syllabus.
- **Interacts with**: Reference source for CSE curriculum data.

#### [`DATA/ECE/ECE.docx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/DATA/ECE/ECE.docx)
- **Purpose**: Official syllabus source document for the Electronics & Communication Engineering department.
- **Exports/Contents**: Word document format syllabus.
- **Interacts with**: Reference source for ECE curriculum data.

#### [`DATA/EE/EE.docx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/DATA/EE/EE.docx)
- **Purpose**: Official syllabus source document for the Electrical Engineering department.
- **Exports/Contents**: Word document format syllabus.
- **Interacts with**: Reference source for EE curriculum data.

#### [`DATA/EP/EP.docx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/DATA/EP/EP.docx)
- **Purpose**: Official syllabus source document for the Engineering Physics department.
- **Exports/Contents**: Word document format syllabus.
- **Interacts with**: Reference source for EP curriculum data.

#### [`DATA/ME/ME.docx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/DATA/ME/ME.docx)
- **Purpose**: Official syllabus source document for the Mechanical Engineering department.
- **Exports/Contents**: Word document format syllabus.
- **Interacts with**: Reference source for Mechanical Engineering curriculum data.

#### [`DATA/MM/MM.docx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/DATA/MM/MM.docx)
- **Purpose**: Official syllabus source document for the Metallurgical & Materials Engineering department.
- **Exports/Contents**: Word document format syllabus.
- **Interacts with**: Reference source for MEMS curriculum data.

---

### Database Schema (`supabase/`)

#### [`supabase/schema.sql`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/supabase/schema.sql)
- **Purpose**: PostgreSQL SQL schema script for Supabase database creation with Row Level Security (RLS) policies and security definer functions.
- **Exports/Contents**: Tables (`semesters`, `courses`, `page_visits`), RLS insert policies, and `get_visit_stats()` RPC function.
- **Interacts with**: Supabase Database Engine, `/api/track-visit`, `/api/visit-stats`.

---

### Application Routes & Pages (`src/app/`)

#### [`src/app/layout.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/layout.tsx)
- **Purpose**: Root application layout component wrapping all routes with global font configurations (`GeistSans`, `GeistMono`, and Google Font `DotGothic16`), metadata, and mounted `<VisitTracker />`.
- **Exports/Contents**: `metadata`, default export `RootLayout`.
- **Interacts with**: `src/app/globals.css`, `src/components/VisitTracker.tsx`, `src/app/fonts/`, `next/font/google`.

#### [`src/app/api/track-visit/route.ts`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/api/track-visit/route.ts)
- **Purpose**: Next.js API route handling `POST` requests to record anonymous page visits in Supabase `page_visits` table.
- **Exports/Contents**: Export `POST()`.
- **Interacts with**: `src/lib/supabase/server.ts`, Supabase `page_visits` table.

#### [`src/app/api/visit-stats/route.ts`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/api/visit-stats/route.ts)
- **Purpose**: Next.js API route handling `GET` requests to return aggregate visit counts (Total, Today, 7-Day) via `get_visit_stats` RPC.
- **Exports/Contents**: Export `GET()`.
- **Interacts with**: `src/lib/supabase/server.ts`, Supabase RPC `get_visit_stats()`.

#### [`src/app/globals.css`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/globals.css)
- **Purpose**: Global CSS definitions, Tailwind directives, glassmorphic UI variables, theme tokens, retro font utilities (`.font-pixel`), entrance animations (`slideDown`, `heroReveal`), and prefers-reduced-motion overrides.
- **Exports/Contents**: Global CSS design system, animation keyframes, and theme classes.
- **Interacts with**: `src/app/layout.tsx`, all components and pages.

#### [`src/app/page.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/page.tsx)
- **Purpose**: Main landing page route (`/`) rendering the scrollable hero section.
- **Exports/Contents**: Default export `HomePage`.
- **Interacts with**: `src/components/LandingHero.tsx`.

#### [`src/app/select-branch/page.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/select-branch/page.tsx)
- **Purpose**: Department selection page route (`/select-branch`) displaying interactive cards for selecting a B.Tech branch.
- **Exports/Contents**: Default export `SelectBranchPage`.
- **Interacts with**: Next.js `useRouter`, `src/app/calculator/[branch]/page.tsx`.

#### [`src/app/calculator/page.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/calculator/page.tsx)
- **Purpose**: Entry route for `/calculator` that redirects users to the branch selection interface.
- **Exports/Contents**: Default export `CalculatorIndexPage`.
- **Interacts with**: `src/app/select-branch/page.tsx`.

#### [`src/app/calculator/[branch]/page.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/calculator/%5Bbranch%5D/page.tsx)
- **Purpose**: Dynamic route (`/calculator/[branch]`) loading the 8-semester curriculum calculator for the requested branch parameter.
- **Exports/Contents**: Default export `CalculatorPage`, `SLUG_TO_BRANCH_ID` map.
- **Interacts with**: `src/lib/storage.ts`, `src/components/CurriculumDashboard.tsx`, `src/app/dashboard/layout.tsx`.

#### [`src/app/dashboard/layout.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/dashboard/layout.tsx)
- **Purpose**: Dashboard layout component providing the spatial header bar, theme provider wrapper, and glowing orb background elements.
- **Exports/Contents**: Default export `DashboardLayout`.
- **Interacts with**: `src/components/ThemeProvider.tsx`, `src/components/ThemeToggle.tsx`.

#### [`src/app/dashboard/page.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/dashboard/page.tsx)
- **Purpose**: Main dashboard page (`/dashboard`) loading local tracker data or rendering onboarding setup.
- **Exports/Contents**: Default export `DashboardPage`.
- **Interacts with**: `src/lib/storage.ts`, `src/components/Onboarding.tsx`, `src/components/CurriculumDashboard.tsx`.

#### [`src/app/dashboard/semester/[id]/page.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/dashboard/semester/%5Bid%5D/page.tsx)
- **Purpose**: Individual semester detail page route (`/dashboard/semester/[id]`) allowing detailed course editing for a single semester.
- **Exports/Contents**: Default export `SemesterDetailPage`.
- **Interacts with**: `src/components/CourseManager.tsx`, `src/components/DeleteSemesterButton.tsx`.

#### Fonts (`src/app/fonts/`)
- [`src/app/fonts/GeistVF.woff`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/fonts/GeistVF.woff) — Primary variable font file for Geist sans-serif typography.
- [`src/app/fonts/GeistMonoVF.woff`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/app/fonts/GeistMonoVF.woff) — Variable monospace font file for course codes and metric labels.

---

### Components (`src/components/`)

#### [`src/components/LandingHero.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/LandingHero.tsx)
- **Purpose**: Redesigned single-viewport (`100vh`/`100dvh`) landing hero featuring automatic crossfading campus background slideshow, circular IIT BBS monogram logo, white pill navigation with 3-dot active indicators, 7-department trust ring row, 2-line retro pixel headline ("Track Your Academic Journey"), glowing white CTA button, responsive mobile drawer menu, and animated count-up stats footer.
- **Exports/Contents**: Export `LandingHero`.
- **Interacts with**: Next.js `useRouter`, `public/Images/`, Google Font `DotGothic16`.

#### [`src/components/CurriculumDashboard.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/CurriculumDashboard.tsx)
- **Purpose**: Main 8-semester curriculum grid component displaying cumulative CGPA, semester SGPAs, progress bars, grade selectors, course action modals, and page visit analytics.
- **Exports/Contents**: Default export `CurriculumDashboard`.
- **Interacts with**: `src/lib/grading.ts`, `src/lib/storage.ts`, `src/lib/visitStats.ts`, `src/components/GradeSelector.tsx`, `src/components/AddCourseModal.tsx`.

#### [`src/components/VisitTracker.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/VisitTracker.tsx)
- **Purpose**: Client-side tracking component mounted in root layout that sends silent POST requests to `/api/track-visit` on route changes.
- **Exports/Contents**: Default export `VisitTracker`.
- **Interacts with**: Next.js `usePathname`, `/api/track-visit`.

#### [`src/components/AddCourseModal.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/AddCourseModal.tsx)
- **Purpose**: Modal component allowing users to add official courses from department catalogs or construct custom user-defined courses.
- **Exports/Contents**: Default export `AddCourseModal`.
- **Interacts with**: `src/data/coursesData.ts`, `src/lib/storage.ts`, `src/lib/grading.ts`.

#### [`src/components/GradeSelector.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/GradeSelector.tsx)
- **Purpose**: Button row component for selecting grades (`N/A`, `EX`, `A`, `B`, `C`, `D`, `P`, `F`) for a given course with instant feedback.
- **Exports/Contents**: Default export `GradeSelector`.
- **Interacts with**: `src/lib/grading.ts`.

#### [`src/components/CourseCombobox.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/CourseCombobox.tsx)
- **Purpose**: Autocomplete combobox for searching official courses across branches with keyboard navigation support.
- **Exports/Contents**: Default export `CourseCombobox`.
- **Interacts with**: `src/data/coursesData.ts`.

#### [`src/components/CourseManager.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/CourseManager.tsx)
- **Purpose**: Detailed table-based course manager for single semester view with row inline editing, credit calculations, and grade updates.
- **Exports/Contents**: Default export `CourseManager`, `CourseItem`, `SemesterItem`.
- **Interacts with**: `src/lib/grading.ts`, `src/components/CourseCombobox.tsx`.

#### [`src/components/Onboarding.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/Onboarding.tsx)
- **Purpose**: First-time branch setup interface allowing students to choose a department and initialize local curriculum data.
- **Exports/Contents**: Default export `Onboarding`.
- **Interacts with**: `src/data/coursesData.ts`, `src/lib/storage.ts`.

#### [`src/components/ThemeProvider.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/ThemeProvider.tsx)
- **Purpose**: Context provider managing dark/light theme state with localStorage persistence and system color scheme detection.
- **Exports/Contents**: Export `ThemeProvider`, `useTheme`.
- **Interacts with**: `document.documentElement` class list (`dark`/`light`).

#### [`src/components/ThemeToggle.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/ThemeToggle.tsx)
- **Purpose**: UI toggle button triggering theme switches between light and dark modes with animated Sun/Moon icons.
- **Exports/Contents**: Default export `ThemeToggle`.
- **Interacts with**: `src/components/ThemeProvider.tsx`, `lucide-react`.

#### [`src/components/AddSemesterButton.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/AddSemesterButton.tsx)
- **Purpose**: UI button component to append a new semester to the academic tracker.
- **Exports/Contents**: Default export `AddSemesterButton`.
- **Interacts with**: Dashboard pages.

#### [`src/components/DeleteSemesterButton.tsx`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/components/DeleteSemesterButton.tsx)
- **Purpose**: Action button with confirmation prompt to delete a semester and its courses.
- **Exports/Contents**: Default export `DeleteSemesterButton`.
- **Interacts with**: `src/app/dashboard/semester/[id]/page.tsx`.

---

### Data Models (`src/data/`)

#### [`src/data/coursesData.ts`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/data/coursesData.ts)
- **Purpose**: Primary official curriculum repository containing 8-semester course definitions, credits, categories, and department information for all B.Tech branches.
- **Exports/Contents**: `BRANCHES`, `BRANCH_CURRICULA`, `getCurriculumForBranch()`, interfaces `CourseDefinition`, `BranchInfo`.
- **Interacts with**: `src/lib/storage.ts`, `src/components/AddCourseModal.tsx`, `src/components/CourseCombobox.tsx`, `src/components/Onboarding.tsx`.

---

### Utility Libraries (`src/lib/`)

#### [`src/lib/grading.ts`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/lib/grading.ts)
- **Purpose**: Core mathematical grading engine implementing IIT Bhubaneswar 10-point scale calculations for SGPA and CGPA.
- **Exports/Contents**: `GRADE_POINTS` map, `calculateSGPA()`, `calculateCGPA()`, type `Grade`, interface `Course`.
- **Interacts with**: `src/components/CurriculumDashboard.tsx`, `src/components/CourseManager.tsx`, `src/components/GradeSelector.tsx`.

#### [`src/lib/storage.ts`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/lib/storage.ts)
- **Purpose**: Browser `localStorage` persistence layer handling read, write, reset, and initial curriculum population for academic tracker data (`iitbbs_academic_tracker_v1`).
- **Exports/Contents**: `getLocalTrackerData()`, `saveLocalTrackerData()`, `clearLocalTrackerData()`, `initializeLocalCurriculum()`, interfaces `LocalCourse`, `LocalSemester`, `TrackerData`.
- **Interacts with**: `src/data/coursesData.ts`, `src/components/CurriculumDashboard.tsx`, `src/app/calculator/[branch]/page.tsx`.

#### [`src/lib/curricula.ts`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/lib/curricula.ts)
- **Purpose**: Secondary fallback curriculum schema dictionary containing course structures for B.Tech departments.
- **Exports/Contents**: `branchCurricula` dictionary, interfaces `CurriculumCourse`, `CurriculumSemester`, `BranchCurriculum`.
- **Interacts with**: Reference curriculum definitions.

#### [`src/lib/supabase/client.ts`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/lib/supabase/client.ts)
- **Purpose**: Instantiates Supabase browser client for client-side authentication and database access using `@supabase/ssr`.
- **Exports/Contents**: Export `createClient()`.
- **Interacts with**: Environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

#### [`src/lib/visitStats.ts`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/lib/visitStats.ts)
- **Purpose**: Utility module fetching aggregate page visit metrics from `/api/visit-stats`.
- **Exports/Contents**: `getVisitStats()`, interface `VisitStats`.
- **Interacts with**: `/api/visit-stats`, `src/components/CurriculumDashboard.tsx`.

#### [`src/lib/supabase/server.ts`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/src/lib/supabase/server.ts)
- **Purpose**: Instantiates Supabase server client handling cookie management for server components and actions.
- **Exports/Contents**: Export `createClient()`.
- **Interacts with**: `next/headers` cookie store, Supabase environment variables.

---

### Public Static Assets (`public/`)

#### Imagery (`public/Images/`)
- [`public/Images/hero-admin.jpg`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/public/Images/hero-admin.jpg) — High-res hero image of the IIT Bhubaneswar Administrative Building.
- [`public/Images/hero-sms.jpg`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/public/Images/hero-sms.jpg) — High-res hero image of the School of Mechanical Sciences (SMS).
- [`public/Images/hero-secs.jpg`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/public/Images/hero-secs.jpg) — High-res hero image of the School of Electrical & Computer Sciences (SECS).
- [`public/Images/hero-sif.jpg`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/public/Images/hero-sif.jpg) — High-res hero image of the School of Infrastructure (SIF).
- [`public/Images/hero-smmme.jpg`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/public/Images/hero-smmme.jpg) — High-res hero image of the School of Minerals, Metallurgical & Materials Engineering (SMMME).
- [`public/Images/iitbbs.jpg`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/public/Images/iitbbs.jpg) — Overview photo of the IIT Bhubaneswar main campus.
- [`public/Images/SECS.jpg`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/public/Images/SECS.jpg) — Secondary building asset for SECS.
- [`public/Images/SIF.jpg`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/public/Images/SIF.jpg) — Secondary building asset for SIF.
- [`public/Images/SMMME.jpg`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/public/Images/SMMME.jpg) — Secondary building asset for SMMME.
- [`public/Images/SMS.jpg`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/public/Images/SMS.jpg) — Secondary building asset for SMS.

---

## 3. Setup & Usage

### Prerequisites
- **Node.js**: `v18.17.0` or higher (v20 recommended)
- **npm**: Package manager (v9+)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/bhuvan-0412/iitbbs-cgpa-calculator.git
   cd iitbbs-cgpa-calculator-1
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

### Available Scripts & Execution Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Launches Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles optimized Next.js production build |
| `npm run start` | Serves compiled production build locally |
| `npm run lint` | Runs ESLint checks across TypeScript and React code |

### Local Environment Variables
Create or verify `.env.local` in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## 4. Change Log

## Change Log
- **2026-08-27** — Redesigned landing page hero (`src/components/LandingHero.tsx`) and header into a fitted single-viewport (`100vh`/`100dvh`) layout: added automatic 5-second crossfading campus slideshow background (`public/Images/`), circular IIT BBS logo mark with hover scale, white pill nav (`Home`, `Calculator`, `Departments`, `About`) with 3-dot active indicator and 50%/75% opacity handling, 7-department trust ring row (`CSE`, `EE`, `ECE`, `ME`, `CE`, `MM`, `EP`), 2-line retro pixel headline ("Track Your Academic Journey") powered by Google Font `DotGothic16` via `next/font/google`, white pill CTA button with soft glow, responsive mobile drawer sheet menu (≤720px) with animated burger-to-X icon, animated 4-column count-up stats footer (`easeOutCubic` IntersectionObserver), shared reveal keyframes in `globals.css`, and `prefers-reduced-motion` accessibility support.
- **2026-08-25** — Diagnosed and fixed `page_visits` tracking issue: added client-side console logging in `VisitTracker.tsx` and server-side DB error logging in `/api/track-visit/route.ts`, updated `schema.sql` RLS policy to explicitly grant `TO anon, authenticated, public WITH CHECK (true)`, and identified invalid Supabase project domain URL (`ENOTFOUND`) as root cause for empty database tables.
- **2026-08-25** — Fixed Vercel production build failure (`npm run build` exit code 1) caused by an unused `TrendingUp` import in `CurriculumDashboard.tsx` (ESLint `@typescript-eslint/no-unused-vars` error). Added `export const dynamic = 'force-dynamic'` to `/api/track-visit` and `/api/visit-stats` routes, and safe fallback defaults for Supabase environment variables in `client.ts` and `server.ts`.
- **2026-08-25** — Configured dual Git push remotes (`origin`) for simultaneous multi-repo synchronization to both `https://github.com/bhuvan-0412/iitbbs-cgpa-calculator.git` and `https://github.com/SusheelSagar4/iitbbs-cgpa-calculator.git`.
- **2026-08-25** — Configured `https://github.com/bhuvan-0412/iitbbs-cgpa-calculator.git` as the default Git remote repository and pushed all project branches (`main`, `dev/bhuvan`, `dev/susheel`).
- **2026-08-25** — Implemented privacy-friendly page visit tracking system with Supabase `page_visits` table, RLS insert policy, `get_visit_stats()` RPC function, API routes (`/api/track-visit` & `/api/visit-stats`), `VisitTracker` client component, `visitStats` utility library, and `CurriculumDashboard` analytics card.
- **2026-08-25** — Created comprehensive project documentation in `PROJECT_DOCS.md` detailing architecture, full file-by-file breakdown, setup instructions, and change logging commitments.
