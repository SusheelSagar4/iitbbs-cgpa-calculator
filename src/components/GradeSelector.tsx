'use client'

import { useState } from 'react'
import { GRADE_POINTS } from '@/lib/grading'

interface GradeSelectorProps {
  courseId: string
  currentGrade: string
  onGradeChange: (newGrade: string) => void
}

const GRADE_OPTIONS = ['N/A', 'EX', 'A', 'B', 'C', 'D', 'P', 'F'] as const

export default function GradeSelector({
  currentGrade,
  onGradeChange,
}: GradeSelectorProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>(currentGrade || 'N/A')

  const handleSelectGrade = (grade: string) => {
    if (grade === selectedGrade) return
    setSelectedGrade(grade)
    onGradeChange(grade)
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 justify-end">
      {GRADE_OPTIONS.map((g) => {
        const isSelected = selectedGrade === g
        const points = g in GRADE_POINTS ? GRADE_POINTS[g as keyof typeof GRADE_POINTS] : null

        return (
          <button
            key={g}
            type="button"
            onClick={() => handleSelectGrade(g)}
            title={points !== null ? `${g} (${points} pts)` : 'Not Completed'}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all duration-200 ${
              isSelected
                ? g === 'N/A'
                  ? 'bg-slate-800/90 text-slate-300 border border-slate-700 shadow-md'
                  : g === 'F'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 scale-105 border border-red-400/40'
                  : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/30 scale-105 font-black border border-cyan-300/60'
                : 'border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-white'
            }`}
          >
            {g}
          </button>
        )
      })}
    </div>
  )
}
