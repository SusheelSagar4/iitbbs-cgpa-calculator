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
    }, 150)
  }

  return (
    <div className="mx-auto max-w-4xl py-8 px-4">
      {/* Onboarding Header */}
      <div className="text-center space-y-3 mb-10">
        <span className="inline-block rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
          Welcome to IIT BBS Academic Tracker
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Select Your Academic Branch
        </h2>
        <p className="mx-auto max-w-xl text-sm text-slate-400">
          Choose your department to automatically generate your official 8-semester curriculum with all required courses, credits, and grade trackers.
        </p>
      </div>

      {/* Branch Selection Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {BRANCHES.map((b) => {
          const isSelected = selectedBranchId === b.id

          return (
            <div
              key={b.id}
              onClick={() => setSelectedBranchId(b.id)}
              className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-teal-500 bg-slate-900 shadow-lg shadow-teal-950/40 ring-2 ring-teal-500/20'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-mono font-bold text-teal-400">
                    {b.code}
                  </span>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-slate-950">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-base font-bold text-white">{b.name}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {b.description}
                </p>
              </div>

              <div className="mt-4 border-t border-slate-800/80 pt-3 text-[11px] font-medium text-slate-500">
                8 Semesters • Core & Electives Pre-mapped
              </div>
            </div>
          )
        })}
      </div>

      {/* Confirmation CTA */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleGenerateCurriculum}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-teal-950/50 transition-all hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Generating 8-Semester Curriculum...
            </>
          ) : (
            <>
              Initialize Curriculum &rarr;
            </>
          )}
        </button>
        <p className="text-xs text-slate-500">
          This will set up all 8 semesters with official IIT BBS courses for your branch.
        </p>
      </div>
    </div>
  )
}
