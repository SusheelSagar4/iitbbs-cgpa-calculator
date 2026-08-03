'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Cpu, Code, Zap, Radio, Building2, Layers, ChevronRight, Home } from 'lucide-react'

interface BranchOption {
  id: string
  code: string
  schoolCode: string
  schoolName: string
  name: string
  slug: string
  description: string
  icon: React.ElementType
}

const BRANCHES: BranchOption[] = [
  {
    id: 'mechanical',
    code: 'ME',
    schoolCode: 'SMS',
    schoolName: 'School of Mechanical Sciences',
    name: 'Mechanical Engineering',
    slug: 'mechanical',
    description: 'Thermodynamics, Fluid Mechanics, CAD/CAM, Robotics, & Advanced Manufacturing.',
    icon: Cpu,
  },
  {
    id: 'cse',
    code: 'CS',
    schoolCode: 'SECS',
    schoolName: 'School of Electrical & Computer Sciences',
    name: 'Computer Science & Engineering',
    slug: 'cse',
    description: 'Data Structures, Operating Systems, Machine Learning, Algorithms & Networks.',
    icon: Code,
  },
  {
    id: 'ee',
    code: 'EE',
    schoolCode: 'SECS',
    schoolName: 'School of Electrical & Computer Sciences',
    name: 'Electrical Engineering',
    slug: 'ee',
    description: 'Power Systems, Control Engineering, Signal Processing & Renewable Energy.',
    icon: Zap,
  },
  {
    id: 'ece',
    code: 'ECE',
    schoolCode: 'SECS',
    schoolName: 'School of Electrical & Computer Sciences',
    name: 'Electronics & Communication Engg.',
    slug: 'ece',
    description: 'VLSI Design, Embedded Systems, Wireless Communication & Microelectronics.',
    icon: Radio,
  },
  {
    id: 'civil',
    code: 'CE',
    schoolCode: 'SIF',
    schoolName: 'School of Infrastructure',
    name: 'Civil Engineering',
    slug: 'civil',
    description: 'Structural Analysis, Geotechnical Engg, Environmental Systems & Hydraulics.',
    icon: Building2,
  },
  {
    id: 'metallurgy',
    code: 'MM',
    schoolCode: 'SMMME',
    schoolName: 'School of Minerals, Metallurgical & Materials Engg.',
    name: 'Metallurgical & Materials Engg.',
    slug: 'metallurgy',
    description: 'Physical Metallurgy, Nanomaterials, Extractive Metallurgy & Biomaterials.',
    icon: Layers,
  },
]

export default function SelectBranchPage() {
  const router = useRouter()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const handleSelectBranch = (slug: string) => {
    setSelectedSlug(slug)
    setTimeout(() => {
      router.push(`/calculator/${slug}`)
    }, 250)
  }

  return (
    <div className="relative min-h-screen bg-[var(--color-navy)] text-[var(--color-offwhite)] selection:bg-[#D4A853]/30 selection:text-[#0A1628]">
      {/* Glowing 3D Orbs Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[650px] w-[650px] rounded-full bg-gradient-to-br from-[#D4A853]/20 via-[#1E3A5F]/15 to-[#0A1628]/25 blur-[130px] animate-orb-1 opacity-80" />
        <div className="absolute top-1/4 -right-40 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-[#1E3A5F]/20 via-[#8B94A3]/15 to-[#0A1628]/20 blur-[150px] animate-orb-2 opacity-75" />
        <div className="absolute -bottom-40 left-1/4 h-[750px] w-[750px] rounded-full bg-gradient-to-br from-[#D4A853]/15 via-[#0A1628]/15 to-[#1E3A5F]/25 blur-[170px] animate-orb-pulse opacity-70" />
        
        <div className="absolute top-12 left-1/2 -translate-x-1/2 h-[800px] w-[800px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full border border-white/[0.03] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Floating Navigation Header */}
      <div className="sticky top-4 z-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-[#0A1628]/60 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300">
          <div className="flex items-center justify-between px-5 py-3.5">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border-t border-l border-white/50 bg-gradient-to-br from-[#D4A853] via-[#8B94A3] to-[#1E3A5F] text-sm font-black text-[#0A1628] shadow-lg shadow-[#D4A853]/30 group-hover:scale-105 transition-transform">
                <span className="relative z-10">CG</span>
                <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#D4A853] uppercase leading-none block">IIT BHUBANESWAR</span>
                <h1 className="text-base font-extrabold tracking-tight text-[#F5F1E8] sm:text-lg">
                  Academic Tracker
                </h1>
              </div>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#F5F1E8] hover:text-white bg-[#1E3A5F]/60 hover:bg-[#1E3A5F]/90 px-4 py-2 rounded-full border border-[#8B94A3]/40 hover:border-[#D4A853] transition-all duration-300 backdrop-blur-md shadow-sm"
            >
              <Home className="h-3.5 w-3.5 text-[#D4A853]" />
              <span>Back to Home</span>
            </Link>
          </div>
        </header>
      </div>

      {/* Main Selection Area */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-12 animate-fade-in-up">
        {/* Section Heading */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border-t border-l border-white/40 bg-gradient-to-r from-[#D4A853]/20 via-[#1E3A5F]/15 to-[#0A1628]/20 px-4 py-1 text-xs font-bold text-[#D4A853] backdrop-blur-xl shadow-lg shadow-[#D4A853]/10">
            <Sparkles className="h-3.5 w-3.5 text-[#D4A853]" />
            Official B.Tech Curriculum Selector
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F1E8]">
            Select Your <span className="bg-gradient-to-r from-[#D4A853] via-[#F5F1E8] to-[#8B94A3] bg-clip-text text-transparent">Academic Department</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-[#8B94A3] leading-relaxed font-medium">
            Choose your school and department to access your dedicated 8-semester curriculum, official course credit weightages, and live CGPA predictor.
          </p>
        </div>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BRANCHES.map((b) => {
            const IconComp = b.icon
            const isSelected = selectedSlug === b.slug

            return (
              <div
                key={b.id}
                onClick={() => handleSelectBranch(b.slug)}
                className={`group relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 cursor-pointer vision-glass-card ${
                  isSelected
                    ? 'border-t-2 border-l-2 border-[#D4A853] bg-[#1E3A5F]/60 shadow-[0_20px_50px_rgba(212,168,83,0.25)] translate-y-[-4px]'
                    : 'hover:border-[#D4A853]/60 hover:bg-[#1E3A5F]/40 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-xl border border-[#D4A853]/30 bg-[#D4A853]/10 px-3.5 py-1 text-xs font-mono font-extrabold text-[#D4A853] backdrop-blur-md">
                      {b.code}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B94A3] bg-[#0A1628]/50 px-2.5 py-1 rounded-lg border border-white/5">
                      {b.schoolCode}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-[#D4A853]/10 border border-[#D4A853]/30 group-hover:bg-[#D4A853] group-hover:text-[#0A1628] transition-all">
                      <IconComp className="h-5 w-5 text-[#D4A853] group-hover:text-[#0A1628] transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#F5F1E8] group-hover:text-[#D4A853] transition-colors leading-tight">
                        {b.name}
                      </h3>
                      <span className="text-[11px] text-[#8B94A3] block mt-0.5">{b.schoolName}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[#8B94A3] leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8B94A3]">8 Semesters Pre-loaded</span>
                  <button className="pill-sunset rounded-full px-4 py-1.5 text-xs font-black flex items-center gap-1.5 group-hover:shadow-[#D4A853]/40">
                    <span>Calculate</span>
                    <ChevronRight className="h-3.5 w-3.5 stroke-[3] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Info */}
        <div className="text-center pt-6 text-xs text-[#8B94A3] font-medium">
          Official IIT Bhubaneswar curriculum • Fast local updates • Direct SGPA & CGPA Projections
        </div>
      </main>
    </div>
  )
}
