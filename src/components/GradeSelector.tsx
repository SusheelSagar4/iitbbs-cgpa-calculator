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
    <div className="flex flex-wrap items-center gap-1">
      {GRADE_OPTIONS.map((g) => {
        const isSelected = selectedGrade === g
        const points = g in GRADE_POINTS ? GRADE_POINTS[g as keyof typeof GRADE_POINTS] : null

        return (
          <button
            key={g}
            type="button"
            onClick={() => handleSelectGrade(g)}
            title={points !== null ? `${g} (${points} pts)` : 'Not Completed'}
            className={`rounded-md px-2 py-1 text-xs font-semibold transition-all ${
              isSelected
                ? g === 'N/A'
                  ? 'bg-slate-800 text-slate-400 border border-slate-700'
                  : g === 'F'
                  ? 'bg-red-900/80 text-red-200 border border-red-700 shadow-sm'
                  : 'bg-teal-500 text-slate-950 shadow-sm font-bold'
                : 'border border-slate-800/80 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            {g}
          </button>
        )
      })}
    </div>
  )
}
