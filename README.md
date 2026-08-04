# IIT Bhubaneswar CGPA Calculator & Academic Tracker

An interactive web application for IIT Bhubaneswar B.Tech students to track, calculate, and predict SGPA and CGPA across all 8 semesters with branch-specific official curriculum data.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage / Quick Start](#usage--quick-start)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Branch-Specific 8-Semester Curricula**: Pre-loaded course lists, codes, and credit weightages for 7 B.Tech departments:
  - Computer Science & Engineering (CS/CSE)
  - Electrical Engineering (EE)
  - Electronics & Communication Engineering (ECE)
  - Mechanical Engineering (ME)
  - Civil Engineering (CE)
  - Metallurgical & Materials Engineering (MM/MEMS)
  - Engineering Physics (EP)
- **Live SGPA & CGPA Calculation**: Calculates Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA) in real time using the official IIT Bhubaneswar 10-point grading scale (`EX`: 10, `A`: 9, `B`: 8, `C`: 7, `D`: 6, `P`: 5, `F`: 0).
- **Interactive Campus Scroll Hero**: High-resolution, scroll-driven visual overview of IIT Bhubaneswar campus schools (Admin Building, SMS, SECS, SIF, SMMME).
- **Course & Semester Customization**: Add, edit, or remove custom courses and semesters dynamically.
- **Local Persistence**: Saves user inputs and course data in browser `localStorage` (`iitbbs_academic_tracker_v1`).
- **Dark & Light Mode Support**: Built-in theme provider and toggle supporting glassmorphic dark/light themes.

## Prerequisites

- **Node.js**: `v18.17.0` or higher (Node.js `v20.x` recommended, as declared in `@types/node`).
- **Package Manager**: `npm` (v9+ recommended, included with Node.js).

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SusheelSagar4/iitbbs-cgpa-calculator.git
   cd iitbbs-cgpa-calculator-1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage / Quick Start

### Development Server

Run the development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

To compile and launch the production build:

```bash
npm run build
npm run start
```

### Code Formatting & Linting

Run ESLint to check for code syntax or linting issues:

```bash
npm run lint
```

## Configuration

### Environment Variables

Environment variables are defined in `.env.local` for local development.

| Variable | Description | Required |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (`https://<project-ref>.supabase.co`) | Optional* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anonymous API key | Optional* |

> **Note / Flagged Gap**: The application currently uses `localStorage` (`src/lib/storage.ts`) for persisting user semester states. Supabase client/server helper files (`src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`) and schema (`supabase/schema.sql`) exist in the repository, but user authentication and cloud database synchronization are not active in the current UI workflow.

### Database Setup (Supabase)

If setting up the Supabase database schema manually:
1. Run the SQL statements in [`supabase/schema.sql`](file:///c:/Bunty/IIT%20BBS/Project/iitbbs-cgpa-calculator-1/supabase/schema.sql) in your Supabase SQL Editor.
2. The schema creates `semesters` and `courses` tables with Row Level Security (RLS) policies.

## Project Structure

```
iitbbs-cgpa-calculator/
├── DATA/                   # Raw syllabus DOCX files per department
├── public/                 # Static assets and images
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── calculator/     # Branch-specific calculator route ([branch])
│   │   ├── dashboard/      # Semester dashboard pages
│   │   ├── select-branch/  # Department selection page
│   │   ├── globals.css     # Global styles and design system variables
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page with hero animation
│   ├── components/         # React UI components
│   │   ├── AddCourseModal.tsx
│   │   ├── CourseManager.tsx
│   │   ├── CurriculumDashboard.tsx
│   │   ├── LandingHero.tsx
│   │   └── ThemeToggle.tsx
│   ├── data/               # Official curriculum definitions (coursesData.ts)
│   └── lib/                # Utility modules
│       ├── curricula.ts    # Fallback/branch curriculum schemas
│       ├── grading.ts      # SGPA & CGPA calculation logic
│       ├── storage.ts      # LocalStorage persistence logic
│       └── supabase/       # Supabase client and server setup
├── supabase/               # Database SQL schema (schema.sql)
├── .env.local              # Local environment configuration
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Contributing

Contributions, bug reports, and curriculum data updates are welcome!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License

This project does not currently specify an open-source license file. All rights reserved by the author unless stated otherwise.
