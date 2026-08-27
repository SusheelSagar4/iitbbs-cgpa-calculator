'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, Award, BookOpen, Users, ArrowRight } from 'lucide-react'

// Campus background images cross-fading automatically
const CAMPUS_IMAGES = [
  '/Images/hero-admin.jpg',
  '/Images/hero-sms.jpg',
  '/Images/hero-secs.jpg',
  '/Images/hero-sif.jpg',
  '/Images/hero-smmme.jpg',
]

// 7 IIT Bhubaneswar B.Tech Departments for the Trust Row
const DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science & Engineering', color: '#2563eb' },
  { code: 'EE', name: 'Electrical Engineering', color: '#d97706' },
  { code: 'ECE', name: 'Electronics & Communication', color: '#9333ea' },
  { code: 'ME', name: 'Mechanical Engineering', color: '#059669' },
  { code: 'CE', name: 'Civil Engineering', color: '#ea580c' },
  { code: 'MM', name: 'Metallurgical & Materials', color: '#0891b2' },
  { code: 'EP', name: 'Engineering Physics', color: '#e11d48' },
]

// 4 Stats Footer metrics
const STATS = [
  {
    id: 'depts',
    value: 7,
    suffix: '',
    label: 'Departments',
    delay: '0.5s',
    icon: GraduationCap,
  },
  {
    id: 'scale',
    value: 10,
    suffix: ' Pts',
    label: 'Grading Scale',
    delay: '0.58s',
    icon: Award,
  },
  {
    id: 'semesters',
    value: 8,
    suffix: '',
    label: 'Semesters Tracked',
    delay: '0.66s',
    icon: BookOpen,
  },
  {
    id: 'students',
    value: 1250,
    suffix: '+',
    format: (val: number) => val.toLocaleString(),
    label: 'Students Using It',
    delay: '0.74s',
    icon: Users,
  },
]

// Animated count-up stat card using IntersectionObserver & easeOutCubic
function StatItem({ stat }: { stat: (typeof STATS)[0] }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animatedRef = useRef(false)
  const IconComponent = stat.icon

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true
          const duration = 1500
          const start = performance.now()
          const target = stat.value

          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // easeOutCubic
            const easeProgress = 1 - Math.pow(1 - progress, 3)
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
      { threshold: 0.25 }
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
      className="anim flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#141416]/70 border border-white/10 backdrop-blur-md"
      style={{ '--d': stat.delay } as React.CSSProperties}
    >
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
      </div>
      <div className="flex flex-col text-left">
        <span className="font-pixel text-xl sm:text-2xl font-bold text-white tracking-tight leading-none">
          {formattedValue}
          {stat.suffix}
        </span>
        <span className="text-[11px] sm:text-xs font-medium text-[#8e8e8e] mt-1 tracking-wide">
          {stat.label}
        </span>
      </div>
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
    <div
      className="relative w-full overflow-hidden flex flex-col select-none bg-[#0A1628]"
      style={{
        height: '100vh',
        minHeight: '100dvh',
        padding: 'clamp(16px, 2.4vh, 28px) clamp(14px, 3vw, 32px)',
      }}
    >
      {/* BACKGROUND: Full-viewport crossfade slideshow + dark overlay gradient */}
      <div className="absolute inset-0 z-0">
        {CAMPUS_IMAGES.map((img, idx) => (
          <div
            key={img}
            className="hero-bg-layer"
            style={{
              backgroundImage: `url('${img}')`,
              opacity: idx === currentBg ? 1 : 0,
              transform: idx === currentBg ? 'scale(1.04)' : 'scale(1)',
              visibility: idx === currentBg ? 'visible' : 'hidden',
            }}
          />
        ))}
        {/* Dark overlay gradient so text stays fully legible */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(10, 22, 40, 0.45) 0%, rgba(10, 22, 40, 0.85) 100%), linear-gradient(to bottom, rgba(10, 16, 28, 0.75) 0%, rgba(10, 16, 28, 0.55) 50%, rgba(10, 16, 28, 0.95) 100%)',
          }}
        />
      </div>

      {/* REGION 1: HEADER (Shrink 0, SlideDown 0.7s cubic-bezier(0.22, 1, 0.36, 1)) */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 shrink-0 animate-slide-down">
        {/* Circular Logo Button */}
        <button
          onClick={() => router.push('/')}
          className="group focus:outline-none flex items-center justify-center rounded-full bg-white transition-transform duration-200 hover:scale-[1.04] shadow-[0_4px_14px_rgba(0,0,0,0.16)] shrink-0"
          style={{
            width: 'clamp(40px, 4.4vw, 46px)',
            height: 'clamp(40px, 4.4vw, 46px)',
          }}
          aria-label="IIT Bhubaneswar Home"
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-[#0A1628] text-xs sm:text-sm tracking-tighter">
            IITB
          </div>
        </button>

        {/* Desktop White Pill Nav */}
        <nav
          className="hidden md:flex items-center justify-center bg-white rounded-full px-6 shadow-[0_4px_20px_rgba(0,0,0,0.12)] shrink-0"
          style={{
            height: 'clamp(44px, 5.2vw, 48px)',
            maxWidth: '430px',
            width: '100%',
          }}
        >
          <div className="flex items-center justify-around w-full">
            {navLinks.map((link) => {
              const isActive = activeNav === link.id
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id, link.href)}
                  className={`relative font-medium transition-opacity duration-200 focus:outline-none ${
                    isActive ? 'nav-link-active' : 'hover:opacity-75'
                  }`}
                  style={{
                    fontSize: 'clamp(13px, 1.4vw, 15px)',
                    letterSpacing: '-0.01em',
                    color: '#2e2e2e',
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  {link.label}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Right Dark Pill Sign-In / CTA */}
        <div className="hidden md:flex items-center shrink-0">
          <Link
            href="/select-branch"
            className="flex items-center justify-center font-medium rounded-full transition-all duration-200 text-[#c8c8c8] hover:text-white hover:-translate-y-[1px]"
            style={{
              height: 'clamp(44px, 5.2vw, 48px)',
              paddingLeft: 'clamp(16px, 2vw, 24px)',
              paddingRight: 'clamp(16px, 2vw, 24px)',
              backgroundColor: '#28282a',
              fontSize: 'clamp(13px, 1.4vw, 15px)',
            }}
          >
            Get Started &rarr;
          </Link>
        </div>

        {/* Mobile Burger (48x48, #28282a, 3 white bars -> X animation) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-12 h-12 rounded-full flex flex-col items-center justify-center gap-1.5 focus:outline-none z-50 transition-transform active:scale-95 shrink-0"
          style={{ backgroundColor: '#28282a' }}
          aria-label="Toggle navigation menu"
        >
          <span
            className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
              mobileMenuOpen ? 'bg-black rotate-45 translate-y-[6.5px]' : ''
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
              mobileMenuOpen ? 'bg-black -rotate-45 -translate-y-[6.5px]' : ''
            }`}
          />
        </button>
      </header>

      {/* MOBILE FULL-SCREEN SHEET MENU OVERLAY (≤720px) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end p-4 bg-black/62 backdrop-blur-md animate-modal-scale">
          <div className="bg-white rounded-[28px] p-6 text-[#2e2e2e] shadow-2xl flex flex-col gap-5 border border-white/40">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="font-bold text-base text-[#2e2e2e]">Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = activeNav === link.id
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id, link.href)}
                    className="flex items-center justify-between py-2 text-left text-base font-medium border-b border-gray-50 text-[#2e2e2e]"
                  >
                    <span className={isActive ? 'font-semibold text-black' : 'text-gray-600'}>
                      {link.label}
                    </span>
                    {isActive && (
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A1628]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A1628]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A1628]" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            <Link
              href="/select-branch"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#28282a] text-white font-medium py-3.5 rounded-full shadow-md hover:bg-[#323234] transition-all mt-1"
            >
              Get Started &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* REGION 2: HERO (Flex 1, Centered Content) */}
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto z-10 py-2 w-full">
        {/* Trust Row: 7 Department Avatars in Overlapping Rings + Ending Copy */}
        <div
          className="anim inline-flex items-center gap-3 bg-[#1e1e20]/80 border border-white/10 backdrop-blur-md rounded-full px-3.5 py-1.5 mb-4 shadow-xl"
          style={{ '--d': '0s' } as React.CSSProperties}
        >
          <div className="flex items-center">
            {DEPARTMENTS.map((dept, idx) => (
              <div
                key={dept.code}
                title={dept.name}
                className="group relative flex items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-1 hover:z-30 cursor-pointer shrink-0"
                style={{
                  width: 'var(--trust-size)',
                  height: 'var(--trust-size)',
                  backgroundColor: '#28282a',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  padding: '5px',
                  marginLeft: idx > 0 ? 'calc(var(--trust-size) * -0.42)' : '0',
                  zIndex: 10 + idx,
                }}
              >
                <div
                  className="w-full h-full rounded-full text-white flex items-center justify-center text-[10px] sm:text-[11px] font-black"
                  style={{ backgroundColor: dept.color }}
                >
                  {dept.code}
                </div>
              </div>
            ))}
          </div>
          <span className="text-xs sm:text-sm font-medium text-[#d0d0d0] tracking-wide pr-1">
            Trusted by IIT Bhubaneswar Students
          </span>
        </div>

        {/* Headline: 2 lines, dot-matrix font, solid white, no gradient */}
        <h1 className="font-pixel font-bold text-white uppercase hero-headline drop-shadow-2xl my-2">
          <span
            className="block hero-line-reveal"
            style={{ animationDelay: '0.12s' }}
          >
            Track Your
          </span>
          <span
            className="block hero-line-reveal"
            style={{ animationDelay: '0.3s' }}
          >
            Academic Journey
          </span>
        </h1>

        {/* Subhead */}
        <p
          className="anim text-sm sm:text-base text-[#d0d0d0] opacity-80 leading-relaxed max-w-[500px] w-[92%] my-3"
          style={{ '--d': '0.35s' } as React.CSSProperties}
        >
          Calculate your SGPA and CGPA instantly across all 8 semesters — built for every IIT Bhubaneswar B.Tech branch.
        </p>

        {/* CTA Button: White Pill, Black Text, Inter 600, Soft Glow */}
        <div
          className="anim mt-3"
          style={{ '--d': '0.4s' } as React.CSSProperties}
        >
          <Link
            href="/select-branch"
            className="inline-flex items-center gap-2.5 bg-white text-black font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95"
            style={{
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.15), 0 0 22px rgba(255,255,255,0.32), 0 0 44px rgba(255,255,255,0.12)',
            }}
          >
            <span>Calculate Now</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>
        </div>
      </main>

      {/* REGION 3: STATS FOOTER (Shrink 0, 4 Cols, 2x2 ≤720px) */}
      <footer className="w-full max-w-5xl mx-auto z-10 shrink-0 pt-2 pb-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((stat) => (
            <StatItem key={stat.id} stat={stat} />
          ))}
        </div>
      </footer>
    </div>
  )
}
