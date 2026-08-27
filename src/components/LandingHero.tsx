'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// EDITABLE: Campus background images cross-fading automatically
const CAMPUS_IMAGES = [
  '/Images/hero-admin.jpg',
  '/Images/hero-secs.jpg',
  '/Images/hero-sif.jpg',
  '/Images/hero-smmme.jpg',
  '/Images/hero-sms.jpg',
  '/Images/iitbbs.jpg',
]

// EDITABLE: 7 IIT Bhubaneswar B.Tech Departments for the Trust Row
const DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science & Engineering', bg: 'bg-blue-600' },
  { code: 'EE', name: 'Electrical Engineering', bg: 'bg-amber-500' },
  { code: 'ECE', name: 'Electronics & Communication', bg: 'bg-purple-600' },
  { code: 'ME', name: 'Mechanical Engineering', bg: 'bg-emerald-600' },
  { code: 'CE', name: 'Civil Engineering', bg: 'bg-orange-600' },
  { code: 'MM', name: 'Metallurgical & Materials', bg: 'bg-cyan-600' },
  { code: 'EP', name: 'Engineering Physics', bg: 'bg-rose-600' },
]

// EDITABLE: Stats Footer metrics. Update values and labels here.
const STATS = [
  {
    id: 'depts',
    value: 7,
    suffix: '',
    label: 'Departments',
    icon: (
      <svg className="w-5 h-5 text-[#D4A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'scale',
    value: 10,
    suffix: ' pts',
    label: 'Grading Scale',
    icon: (
      <svg className="w-5 h-5 text-[#D4A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'semesters',
    value: 8,
    suffix: '',
    label: 'Semesters Tracked',
    icon: (
      <svg className="w-5 h-5 text-[#D4A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'students',
    value: 1200,
    suffix: '+',
    format: (val: number) => val.toLocaleString(),
    label: 'Students Helped',
    icon: (
      <svg className="w-5 h-5 text-[#D4A853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
]

// Animated count-up stat card using IntersectionObserver & easeOutCubic
function StatItem({ stat, index }: { stat: (typeof STATS)[0]; index: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          const duration = 1600
          const start = performance.now()
          const target = stat.value

          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const easeProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic
            setCount(Math.floor(easeProgress * target))

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(target)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [stat.value])

  const formattedValue = stat.format ? stat.format(count) : count

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#0A1628]/45 border border-white/10 backdrop-blur-md shadow-lg animate-hero-reveal"
      style={{ animationDelay: `${400 + index * 100}ms` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-white/10 flex items-center justify-center">
          {stat.icon}
        </div>
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {formattedValue}
          {stat.suffix}
        </span>
      </div>
      <span className="text-xs text-[#8B94A3] font-medium tracking-wide uppercase">
        {stat.label}
      </span>
    </div>
  )
}

export function LandingHero() {
  const router = useRouter()
  const [currentBg, setCurrentBg] = useState(0)
  const [activeNav, setActiveNav] = useState('Home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 1. Crossfade background slideshow every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % CAMPUS_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // 2. Preload campus imagery on mount
  useEffect(() => {
    CAMPUS_IMAGES.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  const navLinks = [
    { label: 'Home', href: '/', id: 'Home' },
    { label: 'Calculator', href: '/select-branch', id: 'Calculator' },
    { label: 'Departments', href: '/select-branch', id: 'Departments' },
    { label: 'About', href: '#about', id: 'About' },
  ]

  const handleNavClick = (id: string, href: string) => {
    setActiveNav(id)
    setMobileMenuOpen(false)
    if (href.startsWith('/')) {
      router.push(href)
    }
  }

  return (
    <div className="h-screen min-h-[660px] max-h-screen w-full relative overflow-hidden flex flex-col justify-between select-none">
      {/* FULL-BLEED BACKGROUND WITH CROSSFADE SLIDESHOW & DARK OVERLAY */}
      <div className="absolute inset-0 z-0">
        {CAMPUS_IMAGES.map((img, idx) => (
          <div
            key={img}
            className="hero-bg-layer"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(10, 22, 40, 0.78) 0%, rgba(10, 22, 40, 0.65) 45%, rgba(10, 22, 40, 0.92) 100%), url('${img}')`,
              opacity: idx === currentBg ? 1 : 0,
              transform: idx === currentBg ? 'scale(1.04)' : 'scale(1)',
              visibility: idx === currentBg ? 'visible' : 'hidden',
            }}
          />
        ))}
      </div>

      {/* REGION 1: HEADER (Entrance: Slide down + Fade) */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between z-20 relative animate-slide-down">
        {/* Circular Logo Mark */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-11 h-11 rounded-full bg-white text-[#0A1628] flex items-center justify-center font-black text-sm tracking-tighter shadow-xl shadow-black/20 group-hover:scale-[1.04] transition-transform duration-300 border-2 border-white/80">
            IITB
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-white tracking-tight leading-none group-hover:text-[#D4A853] transition-colors">
              IIT Bhubaneswar
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#D4A853] uppercase mt-0.5">
              CGPA Predictor
            </span>
          </div>
        </Link>

        {/* Desktop White Pill Nav (Active link has 3-dot indicator) */}
        <nav className="hidden md:flex items-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-6 py-2 shadow-lg shadow-black/10">
          <div className="flex items-center gap-8 text-sm font-medium text-white">
            {navLinks.map((link) => {
              const isActive = activeNav === link.id
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id, link.href)}
                  className="relative group py-1 focus:outline-none transition-all duration-200"
                >
                  <span
                    className={`block transition-opacity duration-200 ${
                      isActive ? 'opacity-100 font-semibold' : 'opacity-50 group-hover:opacity-75'
                    }`}
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <div className="flex gap-1 justify-center items-center mt-0.5">
                      <span className="w-1 h-1 rounded-full bg-[#D4A853]"></span>
                      <span className="w-1 h-1 rounded-full bg-[#D4A853]"></span>
                      <span className="w-1 h-1 rounded-full bg-[#D4A853]"></span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Right CTA / Auth Pill Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/select-branch"
            className="bg-[#0A1628]/90 hover:bg-[#0A1628] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full border border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-md"
          >
            Get Started &rarr;
          </Link>
        </div>

        {/* Mobile Burger Menu Button (3 bars -> X animation) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-11 h-11 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex flex-col items-center justify-center gap-1.5 focus:outline-none z-50 text-white shadow-lg active:scale-95 transition-transform"
          aria-label="Toggle navigation menu"
        >
          <span
            className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
              mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
              mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </header>

      {/* MOBILE SHEET MENU OVERLAY (≤720px) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-start pt-20 px-4 bg-black/75 backdrop-blur-xl animate-modal-scale">
          <div className="bg-[#0A1628]/95 border border-white/20 rounded-3xl p-6 text-white shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-bold text-lg text-white">Menu Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#8B94A3] hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {navLinks.map((link, idx) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id, link.href)}
                  className="flex items-center justify-between py-2 text-left text-lg font-medium border-b border-white/5 text-white/90 hover:text-[#D4A853] transition-colors"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <span>{link.label}</span>
                  {activeNav === link.id && (
                    <span className="text-xs font-mono text-[#D4A853]">Active</span>
                  )}
                </button>
              ))}
            </div>
            <Link
              href="/select-branch"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#D4A853] text-[#0A1628] font-bold py-3.5 rounded-full shadow-lg hover:bg-[#b8873f] transition-all mt-2"
            >
              Get Started &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* REGION 2: CENTERED HERO CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 z-10 relative text-center max-w-4xl mx-auto py-2">
        {/* Trust Row: 7 Department Icons in Overlapping Rings + Pill */}
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-3 sm:px-4 py-1.5 mb-6 shadow-xl animate-hero-reveal">
          <div className="flex items-center -space-x-2">
            {DEPARTMENTS.map((dept) => (
              <div
                key={dept.code}
                title={dept.name}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${dept.bg} text-white flex items-center justify-center text-[9px] sm:text-[10px] font-black border-2 border-[#0A1628] shadow-md hover:scale-125 hover:z-20 transition-all cursor-pointer`}
              >
                {dept.code}
              </div>
            ))}
          </div>
          <span className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide pr-1">
            Trusted by IIT Bhubaneswar Students
          </span>
        </div>

        {/* 2-Line Retro Dot-Matrix / Pixel Headline */}
        <h1 className="font-pixel text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight uppercase leading-tight mb-4 drop-shadow-2xl">
          <span className="block animate-hero-reveal animation-delay-100">
            Track Your
          </span>
          <span className="block animate-hero-reveal animation-delay-200">
            Academic Journey
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed mb-8 px-2 animate-hero-reveal animation-delay-300">
          Calculate your SGPA and CGPA instantly across all 8 semesters, built specifically for every IIT Bhubaneswar B.Tech branch.
        </p>

        {/* CTA Button: White Pill with Glow Effect */}
        <div className="animate-hero-reveal animation-delay-400">
          <Link
            href="/select-branch"
            className="inline-flex items-center gap-2 bg-white text-[#0A1628] font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.45)] hover:shadow-[0_0_45px_rgba(255,255,255,0.7)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
          >
            <span>Calculate Now</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </main>

      {/* REGION 3: STATS FOOTER (4-Column Grid, 2x2 on Mobile, Count-Up Animation) */}
      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-6 pt-2 z-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((stat, idx) => (
            <StatItem key={stat.id} stat={stat} index={idx} />
          ))}
        </div>
      </footer>
    </div>
  )
}
