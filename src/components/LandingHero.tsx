'use client'

import Link from 'next/link'

interface LandingHeroProps {
  isLoggedIn: boolean
}

export function LandingHero({ isLoggedIn }: LandingHeroProps) {
  return (
    <section 
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-cover bg-no-repeat transition-all duration-500 hero-bg-adjust"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(10, 15, 30, 0.85) 0%, rgba(10, 15, 30, 0.4) 50%, rgba(10, 15, 30, 0.95) 100%), url('/Images/iitbbs.jpg')`,
      }}
    >
      {/* Navbar/Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <svg className="w-5 h-5 text-slate-950 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 11h.01M12 7h.01M15 11h.01M12 14h.01M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight block leading-none">IITBBS</span>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">CGPA Predictor</span>
          </div>
        </div>
        
        <div>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-white bg-slate-900/60 hover:bg-slate-800/80 px-5 py-2.5 rounded-full border border-slate-700/50 hover:border-slate-500/55 transition-all duration-300 backdrop-blur-md shadow-sm"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-white bg-slate-900/60 hover:bg-slate-800/80 px-5 py-2.5 rounded-full border border-slate-700/50 hover:border-slate-500/55 transition-all duration-300 backdrop-blur-md shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start pt-[10vh] md:pt-[15vh] px-6 max-w-4xl mx-auto text-center z-10 relative">
        {/* Eyebrow Label */}
        <span className="font-mono tracking-[0.25em] text-xs md:text-sm font-bold uppercase text-amber-400 mb-4 animate-fade-in-up">
          [ IIT BHUBANESWAR ]
        </span>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 animate-fade-in-up animation-delay-100 max-w-3xl">
          Predict Your CGPA <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
            Before It&apos;s Final
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl font-normal mb-10 leading-relaxed animate-fade-in-up animation-delay-200 px-2">
          Enter your grades, get instant CGPA projections tailored to your curriculum.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-xs sm:max-w-none animate-fade-in-up animation-delay-300">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold px-8 py-4 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-300 transform text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 text-center"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold px-8 py-4 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-300 transform text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 text-center"
            >
              Calculate Now
            </Link>
          )}

          <Link
            href="/login?signup=true"
            className="w-full sm:w-auto text-slate-300 hover:text-white font-medium px-8 py-4 rounded-full border border-slate-700 hover:border-slate-500 bg-slate-950/40 hover:bg-slate-950/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 text-center text-base"
          >
            How it works ↓
          </Link>
        </div>
      </div>

      {/* Scroll indicator & Bottom Section */}
      <div className="w-full pb-8 flex flex-col items-center justify-end z-10 relative">
        <a 
          href="#features"
          className="flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-300 group"
        >
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase group-hover:text-amber-400 transition-colors">
            Scroll to explore
          </span>
          <svg className="w-5 h-5 text-amber-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  )
}
