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
        <span className="inline-flex items-center gap-1.5 rounded-full border-t border-l border-white/40 bg-gradient-to-r from-[var(--color-gold)]/20 via-[var(--color-tan)]/15 to-[var(--color-brown)]/20 px-4 py-1 text-xs font-bold text-[var(--color-gold)] backdrop-blur-xl shadow-lg shadow-[var(--color-gold)]/10">
          <Sparkles className="h-3.5 w-3.5 text-[var(--color-gold)]" />
          VisionOS Spatial Curriculum Tracker
        </span>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-main)]">
          Select Your <span className="bg-gradient-to-r from-[var(--color-gold)] via-[var(--color-tan)] to-[var(--color-brown)] bg-clip-text text-transparent">Academic Department</span>
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
                  ? 'border-t-2 border-l-2 border-[var(--color-gold)]/80 bg-slate-900/30 shadow-[0_20px_50px_rgba(217,176,97,0.15)] translate-y-[-4px]'
                  : 'vision-glass-card-hover'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/10 px-3.5 py-1 text-xs font-mono font-extrabold text-[var(--color-gold)] backdrop-blur-md">
                    {b.code}
                  </span>
                  {isSelected && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-tan)] text-[#3F0D0C] font-black shadow-lg shadow-[var(--color-gold)]/30">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30">
                    <GraduationCap className="h-5 w-5 text-[var(--color-gold)]" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[var(--text-main)]">{b.name}</h3>
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-3.5 flex items-center justify-between text-[11px] font-bold text-[var(--text-muted)]">
                <span>8 Semesters</span>
                <span className="text-[var(--color-gold)]">Core + Electives</span>
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
