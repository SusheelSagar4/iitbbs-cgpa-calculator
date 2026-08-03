'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Building {
  id: string
  name: string
  label: string
  image: string
  mobilePosition: string
}

const BUILDINGS: Building[] = [
  {
    id: 'admin',
    name: 'Admin Building',
    label: 'ADMIN BUILDING',
    image: '/Images/hero-admin.jpg',
    mobilePosition: '50% bottom',
  },
  {
    id: 'sms',
    name: 'School of Mechanical Sciences',
    label: 'SCHOOL OF MECHANICAL SCIENCES',
    image: '/Images/hero-sms.jpg',
    mobilePosition: '50% bottom',
  },
  {
    id: 'secs',
    name: 'School of Electrical & Computer Sciences',
    label: 'SCHOOL OF ELECTRICAL & COMPUTER SCIENCES',
    image: '/Images/hero-secs.jpg',
    mobilePosition: '50% bottom',
  },
  {
    id: 'sif',
    name: 'School of Infrastructure',
    label: 'SCHOOL OF INFRASTRUCTURE',
    image: '/Images/hero-sif.jpg',
    mobilePosition: '50% bottom',
  },
  {
    id: 'smmme',
    name: 'School of Minerals, Metallurgical & Materials Engineering',
    label: 'SCHOOL OF MINERALS, METALLURGICAL & MATERIALS ENG.',
    image: '/Images/hero-smmme.jpg',
    mobilePosition: '50% bottom',
  },
]

interface LandingHeroProps {
  isLoggedIn: boolean
}

export function LandingHero({ isLoggedIn }: LandingHeroProps) {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [secsExpanded, setSecsExpanded] = useState(false)
  const [loadingBranch, setLoadingBranch] = useState<string | null>(null)

  // 1. Preload images on mount to avoid loading flickers
  useEffect(() => {
    BUILDINGS.forEach((b) => {
      const img = new Image()
      img.src = b.image
    })
  }, [])

  // 2. Add scroll and resize listeners to calculate scroll progress
  useEffect(() => {
    let activeFrameId: number | null = null

    const handleScroll = () => {
      if (activeFrameId !== null) return

      activeFrameId = requestAnimationFrame(() => {
        const wrapper = wrapperRef.current
        if (wrapper) {
          const rect = wrapper.getBoundingClientRect()
          const totalScrollableHeight = rect.height - window.innerHeight
          
          // Clamp progress between 0 and 1
          const scrolled = -rect.top
          const currentProgress = Math.max(0, Math.min(1, scrolled / totalScrollableHeight))
          setProgress(currentProgress)
        }
        activeFrameId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    
    // Set initial progress
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (activeFrameId !== null) {
        cancelAnimationFrame(activeFrameId)
      }
    }
  }, [])

  // 3. Mathematical cross-fade opacity calculator
  const getOpacity = (index: number, p: number) => {
    const count = BUILDINGS.length
    if (count <= 1) return index === 0 ? 1 : 0

    const targetProgress = index / (count - 1)
    const segmentWidth = 1 / (count - 1)
    const distance = Math.abs(p - targetProgress)

    if (distance < segmentWidth) {
      return 1 - distance / segmentWidth
    }
    return 0
  }

  // 4. Smooth scrolling action for progress dots navigation
  const scrollToBuilding = (index: number) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const rect = wrapper.getBoundingClientRect()
    const totalHeight = rect.height
    const targetProgress = index / (BUILDINGS.length - 1)
    const totalScrollableHeight = totalHeight - window.innerHeight

    // Calculate absolute scroll position on the page
    const absoluteScrollY = window.scrollY + rect.top + targetProgress * totalScrollableHeight

    window.scrollTo({
      top: absoluteScrollY,
      behavior: 'smooth',
    })
  }

  // Determine active building index for navigation dots and tooltips
  const activeIndex = Math.min(
    BUILDINGS.length - 1,
    Math.round(progress * (BUILDINGS.length - 1))
  )

  // Collapse SECS sub-menu if active index changes
  useEffect(() => {
    if (activeIndex !== 2) {
      setSecsExpanded(false)
    }
  }, [activeIndex])

  const handleNavigate = (branch: string) => {
    setLoadingBranch(branch)
    setTimeout(() => {
      router.push(`/calculator/${branch}`)
    }, 450)
  }

  return (
    <div ref={wrapperRef} className="hero-wrapper-scroll">
      <div className="hero-sticky-container">
        {/* Background cross-fading layers */}
        <div className="absolute inset-0 z-0">
          {BUILDINGS.map((b, idx) => {
            const opacity = getOpacity(idx, progress)
            return (
              <div
                key={b.id}
                className="hero-bg-layer"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(10, 15, 30, 0.85) 0%, rgba(10, 15, 30, 0.4) 50%, rgba(10, 15, 30, 0.95) 100%), url('${b.image}')`,
                  opacity,
                  // Keep layers with 0 opacity unclickable and hidden from layout rendering
                  visibility: opacity > 0.01 ? 'visible' : 'hidden',
                  pointerEvents: opacity > 0.01 ? 'auto' : 'none',
                }}
              />
            )
          })}
        </div>

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

        {/* Monospace Building/School Name Label (Positioned top-left, cross-fades in sync) */}
        <div className="absolute top-[88px] left-6 md:left-12 z-20 w-[calc(100%-3rem)] md:w-auto">
          <div className="relative h-10 w-full md:w-[480px]">
            {BUILDINGS.map((b, idx) => {
              const opacity = getOpacity(idx, progress)
              return (
                <span
                  key={b.id}
                  className="absolute left-0 top-0 font-mono tracking-[0.2em] text-[11px] md:text-xs font-bold uppercase text-amber-400 transition-all duration-150 ease-out block leading-relaxed"
                  style={{
                    opacity,
                    transform: `translateX(${(1 - opacity) * -12}px)`,
                    pointerEvents: opacity > 0.05 ? 'auto' : 'none',
                    visibility: opacity > 0.05 ? 'visible' : 'hidden',
                  }}
                >
                  [ {b.label} ]
                </span>
              )
            })}
          </div>

          {/* Interactive School Branch Actions Container */}
          <div className="mt-3 md:mt-2 min-h-[50px] relative w-full md:w-[480px]">
            {/* SMS Selection */}
            <div 
              className="absolute left-0 top-0 transition-all duration-300"
              style={{
                opacity: getOpacity(1, progress),
                visibility: getOpacity(1, progress) > 0.05 ? 'visible' : 'hidden',
                pointerEvents: getOpacity(1, progress) > 0.05 ? 'auto' : 'none',
              }}
            >
              <button
                onClick={() => handleNavigate('mechanical')}
                disabled={!!loadingBranch}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-5 py-2.5 rounded-full shadow-lg shadow-amber-400/10 hover:shadow-amber-400/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
              >
                {loadingBranch === 'mechanical' ? (
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent animate-spin rounded-full"></span>Loading...</span>
                ) : (
                  'Select This Branch'
                )}
              </button>
            </div>

            {/* SECS Selection */}
            <div 
              className="absolute left-0 top-0 transition-all duration-300 flex items-center gap-3"
              style={{
                opacity: getOpacity(2, progress),
                visibility: getOpacity(2, progress) > 0.05 ? 'visible' : 'hidden',
                pointerEvents: getOpacity(2, progress) > 0.05 ? 'auto' : 'none',
              }}
            >
              {!secsExpanded ? (
                <button
                  onClick={() => setSecsExpanded(true)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-5 py-2.5 rounded-full shadow-lg shadow-amber-400/10 hover:shadow-amber-400/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                >
                  Select This School &rarr;
                </button>
              ) : (
                <div className="flex items-center gap-2 md:gap-3 bg-slate-950/80 p-2 md:p-2.5 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-2xl animate-fade-in-up">
                  {/* Close / Collapse button */}
                  <button
                    onClick={() => setSecsExpanded(false)}
                    className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    aria-label="Back"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Option 1: CSE */}
                  <button
                    onClick={() => handleNavigate('cse')}
                    disabled={!!loadingBranch}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-300 active:scale-95 flex items-center gap-1.5 ${
                      loadingBranch === 'cse'
                        ? 'bg-amber-300 text-slate-950 scale-105 shadow-md shadow-amber-400/20'
                        : 'bg-slate-900 border border-slate-700/60 text-amber-400 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400'
                    }`}
                    style={{ transitionDelay: '0ms' }}
                  >
                    {loadingBranch === 'cse' && <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent animate-spin rounded-full"></span>}
                    CSE
                  </button>

                  {/* Option 2: EE */}
                  <button
                    onClick={() => handleNavigate('ee')}
                    disabled={!!loadingBranch}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-300 active:scale-95 flex items-center gap-1.5 ${
                      loadingBranch === 'ee'
                        ? 'bg-amber-300 text-slate-950 scale-105 shadow-md shadow-amber-400/20'
                        : 'bg-slate-900 border border-slate-700/60 text-amber-400 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400'
                    }`}
                    style={{ transitionDelay: '80ms' }}
                  >
                    {loadingBranch === 'ee' && <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent animate-spin rounded-full"></span>}
                    EE
                  </button>

                  {/* Option 3: ECE */}
                  <button
                    onClick={() => handleNavigate('ece')}
                    disabled={!!loadingBranch}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-300 active:scale-95 flex items-center gap-1.5 ${
                      loadingBranch === 'ece'
                        ? 'bg-amber-300 text-slate-950 scale-105 shadow-md shadow-amber-400/20'
                        : 'bg-slate-900 border border-slate-700/60 text-amber-400 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400'
                    }`}
                    style={{ transitionDelay: '160ms' }}
                  >
                    {loadingBranch === 'ece' && <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent animate-spin rounded-full"></span>}
                    ECE
                  </button>
                </div>
              )}
            </div>

            {/* SIF Selection */}
            <div 
              className="absolute left-0 top-0 transition-all duration-300"
              style={{
                opacity: getOpacity(3, progress),
                visibility: getOpacity(3, progress) > 0.05 ? 'visible' : 'hidden',
                pointerEvents: getOpacity(3, progress) > 0.05 ? 'auto' : 'none',
              }}
            >
              <button
                onClick={() => handleNavigate('civil')}
                disabled={!!loadingBranch}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-5 py-2.5 rounded-full shadow-lg shadow-amber-400/10 hover:shadow-amber-400/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
              >
                {loadingBranch === 'civil' ? (
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent animate-spin rounded-full"></span>Loading...</span>
                ) : (
                  'Select This Branch'
                )}
              </button>
            </div>

            {/* SMMME Selection */}
            <div 
              className="absolute left-0 top-0 transition-all duration-300"
              style={{
                opacity: getOpacity(4, progress),
                visibility: getOpacity(4, progress) > 0.05 ? 'visible' : 'hidden',
                pointerEvents: getOpacity(4, progress) > 0.05 ? 'auto' : 'none',
              }}
            >
              <button
                onClick={() => handleNavigate('metallurgy')}
                disabled={!!loadingBranch}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-5 py-2.5 rounded-full shadow-lg shadow-amber-400/10 hover:shadow-amber-400/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
              >
                {loadingBranch === 'metallurgy' ? (
                  <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent animate-spin rounded-full"></span>Loading...</span>
                ) : (
                  'Select This Branch'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Persistent Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-start pt-[14vh] md:pt-[18vh] px-6 max-w-4xl mx-auto text-center z-10 relative">
          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-3xl drop-shadow-lg">
            Predict Your CGPA <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Before It&apos;s Final
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl font-normal mb-10 leading-relaxed px-2 drop-shadow-md">
            Enter your grades, get instant CGPA projections tailored to your curriculum.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-xs sm:max-w-none">
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

        {/* Right-aligned Vertical 5-Dot Navigation Indicator */}
        <div className="fixed right-6 md:right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-5 z-30">
          {BUILDINGS.map((b, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={b.id}
                onClick={() => scrollToBuilding(idx)}
                className="group relative flex items-center justify-end focus:outline-none"
                aria-label={`Scroll to ${b.name}`}
              >
                {/* Custom Glass Tooltip on Hover */}
                <span className="absolute right-8 bg-slate-950/90 text-white text-[10px] font-mono tracking-wider uppercase px-2.5 py-1.5 rounded-lg border border-slate-700/60 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-xl">
                  {b.name}
                </span>
                
                {/* Visual Dot */}
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-300 border ${
                    isActive 
                      ? 'bg-amber-400 border-amber-300 scale-125 shadow-[0_0_12px_rgba(251,191,36,0.6)]' 
                      : 'bg-slate-700/60 border-slate-600 hover:bg-slate-400 scale-100'
                  }`}
                />
              </button>
            )
          })}
        </div>

        {/* Scroll indicator (fades out as user scrolls) */}
        <div 
          className="w-full pb-8 flex flex-col items-center justify-end z-10 relative transition-opacity duration-300"
          style={{
            opacity: Math.max(0, 1 - progress * 5),
            pointerEvents: progress > 0.2 ? 'none' : 'auto',
          }}
        >
          <div 
            onClick={() => scrollToBuilding(1)}
            className="flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-300 group"
          >
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase group-hover:text-amber-400 transition-colors">
              Scroll to explore buildings
            </span>
            <svg className="w-5 h-5 text-amber-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
