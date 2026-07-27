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
            className={`rounded-xl px-2.5 py-1 text-xs font-black transition-all duration-200 ${
              isSelected
                ? g === 'N/A'
                  ? 'bg-slate-700/80 text-slate-200 border border-slate-600 shadow-md'
                  : g === 'F'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/40 scale-105 border-t border-l border-white/40'
                  : g === 'EX' || g === 'A'
                  ? 'pill-sunset scale-105 font-black border-t border-l border-white/50'
                  : 'pill-cyan scale-105 font-black border-t border-l border-white/50'
                : 'border-t border-l border-white/20 border-r border-b border-white/5 bg-white/5 text-[var(--text-muted)] hover:border-amber-400/50 hover:bg-white/10 hover:text-[var(--text-main)]'
            }`}
          >
            {g}
          </button>
        )
      })}
    </div>
  )
}
