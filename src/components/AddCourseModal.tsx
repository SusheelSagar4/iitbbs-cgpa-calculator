'use client'

import { useState, useMemo } from 'react'
import { BRANCHES, getCurriculumForBranch, CourseDefinition, BRANCH_CURRICULA } from '@/data/coursesData'
import { LocalCourse } from '@/lib/storage'
import { GRADE_POINTS, Grade } from '@/lib/grading'
import { Search, X, Check, BookOpen, Edit3 } from 'lucide-react'

interface AddCourseModalProps {
  semesterNumber: number
  branchId: string
  existingCourses: LocalCourse[]
  onAddCourse: (course: LocalCourse) => void
  onClose: () => void
}

const GRADE_OPTIONS = ['N/A', 'EX', 'A', 'B', 'C', 'D', 'P', 'F'] as const

export default function AddCourseModal({
  semesterNumber,
  branchId,
  existingCourses,
  onAddCourse,
  onClose,
}: AddCourseModalProps) {
  const [activeTab, setActiveTab] = useState<'official' | 'custom'>('official')

  // Official Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch, setSelectedBranch] = useState(branchId)
  const [showAllBranches, setShowAllBranches] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseDefinition | null>(null)
  const [officialGrade, setOfficialGrade] = useState<string>('N/A')

  // Custom Course State
  const [customCode, setCustomCode] = useState('')
  const [customName, setCustomName] = useState('')
  const [customCredits, setCustomCredits] = useState('3')
  const [customGrade, setCustomGrade] = useState<string>('N/A')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const existingCodesLower = useMemo(
    () => existingCourses.map((c) => c.code.toLowerCase().trim()),
    [existingCourses]
  )
  const existingNamesLower = useMemo(
    () => existingCourses.map((c) => c.name.toLowerCase().trim()),
    [existingCourses]
  )

  const filteredOfficialCourses = useMemo(() => {
    let list: CourseDefinition[] = []

    if (showAllBranches) {
      const allBranches = Object.keys(BRANCH_CURRICULA)
      const map = new Map<string, CourseDefinition>()
      allBranches.forEach((b) => {
        getCurriculumForBranch(b).forEach((c) => {
          map.set(`${c.code}-${c.name}`, c)
        })
      })
      list = Array.from(map.values())
    } else {
      list = getCurriculumForBranch(selectedBranch)
    }

    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q)
      )
    }

    return list
  }, [selectedBranch, showAllBranches, searchQuery])

  const handleAddOfficial = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!selectedCourse) {
      setErrorMessage('Please select a course from the curriculum list.')
      return
    }

    const newCourse: LocalCourse = {
      id: `custom-${Date.now()}-${selectedCourse.code}`,
      code: selectedCourse.code,
      name: `${selectedCourse.code}: ${selectedCourse.name}`,
      credits: selectedCourse.credits,
      grade: officialGrade,
      isCustom: false,
    }

    onAddCourse(newCourse)
    onClose()
  }

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const codeTrim = customCode.trim()
    const nameTrim = customName.trim()
    const parsedCredits = parseFloat(customCredits)

    if (!codeTrim || !nameTrim) {
      setErrorMessage('Please enter both course code and course name.')
      return
    }
    if (isNaN(parsedCredits) || parsedCredits <= 0) {
      setErrorMessage('Please enter valid positive credits.')
      return
    }

    const newCourse: LocalCourse = {
      id: `custom-${Date.now()}-${codeTrim}`,
      code: codeTrim.toUpperCase(),
      name: `${codeTrim.toUpperCase()}: ${nameTrim}`,
      credits: parsedCredits,
      grade: customGrade,
      isCustom: true,
    }

    onAddCourse(newCourse)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl animate-modal-scale">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl vision-glass-panel p-6 sm:p-8 space-y-6 shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-2.5 py-0.5 text-[10px] font-black text-[var(--color-gold)]">
                Semester {semesterNumber}
              </span>
              <h3 className="text-xl font-black text-[var(--text-main)]">Add Course</h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
              Select from official curriculum or create a custom course.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl border-t border-l border-white/30 bg-white/10 p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* VisionOS Tab Switcher */}
        <div className="flex rounded-2xl border-t border-l border-white/30 bg-slate-950/60 p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setActiveTab('official')
              setErrorMessage(null)
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition-all duration-200 ${
              activeTab === 'official'
                ? 'pill-sunset'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Search Official Curriculum
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('custom')
              setErrorMessage(null)
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition-all duration-200 ${
              activeTab === 'custom'
                ? 'pill-sunset'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Custom Course
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-bold text-red-400 backdrop-blur-md">
            {errorMessage}
          </div>
        )}

        {/* Tab 1: Official Curriculum Search */}
        {activeTab === 'official' ? (
          <form onSubmit={handleAddOfficial} className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <label htmlFor="dept-filter">Branch:</label>
                  <select
                    id="dept-filter"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="glass-input rounded-xl px-3 py-1.5 text-xs text-[var(--color-gold)] font-bold focus:outline-none"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="inline-flex items-center gap-1.5 cursor-pointer hover:text-[var(--text-main)] transition-colors font-medium">
                  <input
                    type="checkbox"
                    checked={showAllBranches}
                    onChange={(e) => setShowAllBranches(e.target.checked)}
                    className="rounded border-[var(--glass-border)] bg-transparent text-[var(--color-gold)] focus:ring-[var(--color-gold)]"
                  />
                  <span>All Branches</span>
                </label>
              </div>

              {/* Command Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search course code (e.g. CS201) or title..."
                  className="w-full glass-input rounded-2xl py-3.5 pl-11 pr-4 text-sm text-[var(--text-main)] placeholder-slate-400"
                />
                <Search className="absolute left-4 top-4 h-4 w-4 text-[var(--text-muted)]" />
              </div>

              {/* Raycast Results Container */}
              <div className="max-h-52 overflow-y-auto divide-y divide-white/5 rounded-2xl border-t border-l border-white/30 bg-slate-950/80 backdrop-blur-2xl">
                {filteredOfficialCourses.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                    No courses found matching &quot;{searchQuery}&quot;. Try enabling &quot;All Branches&quot;.
                  </div>
                ) : (
                  filteredOfficialCourses.map((c) => {
                    const isSelected = selectedCourse?.code === c.code
                    const isAlreadyAdded =
                      existingCodesLower.includes(c.code.toLowerCase()) ||
                      existingNamesLower.some((n) => n.includes(c.code.toLowerCase()))

                    return (
                      <div
                        key={`${c.code}-${c.name}`}
                        onClick={() => {
                          if (!isAlreadyAdded) setSelectedCourse(c)
                        }}
                        className={`flex items-center justify-between p-3.5 text-xs transition-all ${
                          isAlreadyAdded
                            ? 'opacity-40 cursor-not-allowed bg-slate-950/40'
                            : isSelected
                            ? 'bg-gradient-to-r from-[var(--color-gold)]/15 to-[var(--color-slate)]/10 border-l-4 border-[var(--color-gold)] text-[var(--color-gold)] font-bold'
                            : 'hover:bg-white/5 cursor-pointer text-[var(--text-main)]'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 max-w-[75%]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-[var(--color-gold)]">{c.code}</span>
                            <span className="truncate text-[var(--text-main)] font-semibold">{c.name}</span>
                          </div>
                          <span className="text-[10px] text-[var(--text-muted)] font-medium">
                            {c.credits} Credits • {c.category || 'Core'}
                          </span>
                        </div>
                        {isAlreadyAdded ? (
                          <span className="rounded-lg bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 px-2 py-0.5 text-[10px] font-black text-[var(--color-gold)]">
                            Already Added
                          </span>
                        ) : (
                          isSelected && (
                            <span className="h-6 w-6 rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[#e6be6e] text-[#0A1628] flex items-center justify-center font-black shadow-md">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </span>
                          )
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Selected Course Preview */}
            {selectedCourse && (
              <div className="rounded-2xl border border-[var(--color-gold)]/20 bg-gradient-to-br from-[var(--color-gold)]/15 via-[var(--color-slate)]/10 to-transparent p-4 space-y-3 backdrop-blur-md">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[var(--text-muted)] font-semibold block">Selected Course:</span>
                    <strong className="text-[var(--text-main)] text-sm font-extrabold">{selectedCourse.code}: {selectedCourse.name}</strong>
                  </div>
                  <span className="rounded-xl pill-sunset px-3 py-1 text-xs font-black">
                    {selectedCourse.credits} Credits
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <label htmlFor="official-grade-select" className="text-[var(--text-main)] font-bold">Select Initial Grade:</label>
                  <select
                    id="official-grade-select"
                    value={officialGrade}
                    onChange={(e) => setOfficialGrade(e.target.value)}
                    className="glass-input rounded-xl px-3 py-1.5 text-xs text-[var(--text-main)] font-bold focus:outline-none"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g} className="bg-slate-900 text-white">
                        {g} {g in GRADE_POINTS ? `(${GRADE_POINTS[g as Grade]} pts)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border-t border-l border-white/30 bg-white/10 px-5 py-2.5 text-xs font-bold text-[var(--text-muted)] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedCourse}
                className="pill-sunset rounded-2xl px-7 py-2.5 text-xs font-black disabled:opacity-50"
              >
                Add Official Course
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: Custom Course Form */
          <form onSubmit={handleAddCustom} className="space-y-4 text-xs">
            <div className="space-y-3.5">
              <div>
                <label htmlFor="custom-code" className="block text-[var(--text-main)] font-bold mb-1">
                  Course Code
                </label>
                <input
                  id="custom-code"
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="e.g. HS3L005 or OE201"
                  required
                  className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] placeholder-slate-400"
                />
              </div>

              <div>
                <label htmlFor="custom-name" className="block text-[var(--text-main)] font-bold mb-1">
                  Course Name
                </label>
                <input
                  id="custom-name"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Music Theory and Acoustic Physics"
                  required
                  className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="custom-credits" className="block text-[var(--text-main)] font-bold mb-1">
                    Credits
                  </label>
                  <input
                    id="custom-credits"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="20"
                    value={customCredits}
                    onChange={(e) => setCustomCredits(e.target.value)}
                    required
                    className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] font-bold"
                  />
                </div>

                <div>
                  <label htmlFor="custom-grade-select" className="block text-[var(--text-main)] font-bold mb-1">
                    Grade
                  </label>
                  <select
                    id="custom-grade-select"
                    value={customGrade}
                    onChange={(e) => setCustomGrade(e.target.value)}
                    className="w-full glass-input rounded-2xl px-4 py-3 text-sm text-[var(--text-main)] font-bold"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g} className="bg-slate-900 text-white">
                        {g} {g in GRADE_POINTS ? `(${GRADE_POINTS[g as Grade]} pts)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border-t border-l border-white/30 bg-white/10 px-5 py-2.5 text-xs font-bold text-[var(--text-muted)] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="pill-sunset rounded-2xl px-7 py-2.5 text-xs font-black"
              >
                Add Custom Course
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
