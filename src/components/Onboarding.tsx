'use client'

import { useState } from 'react'
import { BRANCHES } from '@/data/coursesData'
import { initializeLocalCurriculum, TrackerData } from '@/lib/storage'
import { GraduationCap, Check, Sparkles, ArrowRight } from 'lucide-react'

interface OnboardingProps {
  onCurriculumInitialized: (data: TrackerData) => void
}

export default function Onboarding({ onCurriculumInitialized }: OnboardingProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('CS')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateCurriculum = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const data = initializeLocalCurriculum(selectedBranchId)
      setIsGenerating(false)
      onCurriculumInitialized(data)
    }, 200)
  }

  return (
    <div className="mx-auto max-w-5xl py-8 px-4 animate-modal-scale">
      {/* Onboarding Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border-t border-l border-white/40 bg-gradient-to-r from-rose-500/20 via-pink-500/15 to-amber-500/20 px-4 py-1 text-xs font-bold text-rose-300 backdrop-blur-xl shadow-lg shadow-rose-500/15">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          VisionOS Spatial Curriculum Tracker
        </span>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-main)]">
          Select Your <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-cyan-400 bg-clip-text text-transparent">Academic Department</span>
        </h2>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          Choose your branch to generate your complete 8-semester curriculum automatically, pre-loaded with official course credits, weightages, and instant live SGPA/CGPA calculations.
        </p>
      </div>

      {/* VisionOS Spatial Glass Branch Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {BRANCHES.map((b) => {
          const isSelected = selectedBranchId === b.id

          return (
            <div
              key={b.id}
              onClick={() => setSelectedBranchId(b.id)}
              className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 cursor-pointer vision-glass-card ${
                isSelected
                  ? 'border-t-2 border-l-2 border-amber-400/80 bg-slate-900/80 shadow-[0_20px_50px_rgba(245,158,11,0.25)] translate-y-[-4px]'
                  : 'vision-glass-card-hover'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-xl border-t border-l border-white/40 bg-rose-500/15 px-3.5 py-1 text-xs font-mono font-extrabold text-rose-300 backdrop-blur-md">
                    {b.code}
                  </span>
                  {isSelected && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-black shadow-lg shadow-amber-500/30">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30">
                    <GraduationCap className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[var(--text-main)]">{b.name}</h3>
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-3.5 flex items-center justify-between text-[11px] font-bold text-[var(--text-muted)]">
                <span>8 Semesters</span>
                <span className="text-amber-400">Core + Electives</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action CTA Sunset Pill */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleGenerateCurriculum}
          disabled={isGenerating}
          className="pill-sunset rounded-full px-12 py-4 text-base font-black tracking-wide focus:outline-none disabled:opacity-50"
        >
          {isGenerating ? (
            <span className="flex items-center gap-3">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Generating Spatial Curriculum...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Initialize 8-Semester Curriculum <ArrowRight className="h-5 w-5" />
            </span>
          )}
        </button>
        <p className="text-xs text-[var(--text-muted)] font-semibold">
          Instant 0ms local setup • No signup required • Fully customizable
        </p>
      </div>
    </div>
  )
}
