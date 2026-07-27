'use client'

import { useState } from 'react'
import { BRANCHES } from '@/data/coursesData'
import { initializeLocalCurriculum, TrackerData } from '@/lib/storage'

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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-xl shadow-lg shadow-cyan-500/10">
          ✨ Welcome to IIT Bhubaneswar
        </span>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Select Your <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">Academic Branch</span>
        </h2>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
          Choose your department to automatically generate your official 8-semester curriculum complete with pre-mapped courses, credit weightages, and real-time CGPA tracking.
        </p>
      </div>

      {/* Glass Branch Selection Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {BRANCHES.map((b) => {
          const isSelected = selectedBranchId === b.id

          return (
            <div
              key={b.id}
              onClick={() => setSelectedBranchId(b.id)}
              className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 cursor-pointer glass-card ${
                isSelected
                  ? 'border-cyan-400/60 bg-slate-900/80 shadow-2xl shadow-cyan-500/20 ring-1 ring-cyan-400/40 translate-y-[-4px]'
                  : 'hover:border-white/20 hover:bg-slate-900/60 hover:translate-y-[-2px]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono font-bold text-cyan-300 backdrop-blur-md">
                    {b.code}
                  </span>
                  {isSelected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-400/40">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-white">{b.name}</h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-3 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>8 Semesters</span>
                <span className="text-cyan-400">Core + Electives</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action CTA */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleGenerateCurriculum}
          disabled={isGenerating}
          className="glass-button-primary rounded-2xl px-10 py-4 text-base font-extrabold text-white shadow-2xl focus:outline-none disabled:opacity-50"
        >
          {isGenerating ? (
            <span className="flex items-center gap-3">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Generating 8-Semester Curriculum...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Initialize Complete Curriculum &rarr;
            </span>
          )}
        </button>
        <p className="text-xs text-slate-500 font-medium">
          Instant 0ms local setup • No signup required • Fully customizable
        </p>
      </div>
    </div>
  )
}
