'use client'

import { useState, useMemo } from 'react'
import { BRANCHES, getCurriculumForBranch, CourseDefinition, BRANCH_CURRICULA } from '@/data/coursesData'
import { LocalCourse } from '@/lib/storage'
import { GRADE_POINTS, Grade } from '@/lib/grading'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-modal-scale">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                Semester {semesterNumber}
              </span>
              <h3 className="text-xl font-black text-white">Add Course</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select from official curriculum or create a custom course.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl border border-white/10 bg-slate-950/60 p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setActiveTab('official')
              setErrorMessage(null)
            }}
            className={`flex-1 rounded-xl py-2 text-xs font-extrabold transition-all duration-200 ${
              activeTab === 'official'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✔ Search Official Curriculum
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('custom')
              setErrorMessage(null)
            }}
            className={`flex-1 rounded-xl py-2 text-xs font-extrabold transition-all duration-200 ${
              activeTab === 'custom'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✏ Custom Course
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs font-semibold text-red-300 backdrop-blur-md">
            {errorMessage}
          </div>
        )}

        {/* Tab 1: Official Curriculum Search */}
        {activeTab === 'official' ? (
          <form onSubmit={handleAddOfficial} className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <label htmlFor="dept-filter">Branch:</label>
                  <select
                    id="dept-filter"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="glass-input rounded-lg px-2.5 py-1 text-xs text-cyan-300 focus:outline-none"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="inline-flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={showAllBranches}
                    onChange={(e) => setShowAllBranches(e.target.checked)}
                    className="rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-400"
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
                  className="w-full glass-input rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500"
                />
                <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Raycast Results Container */}
              <div className="max-h-52 overflow-y-auto divide-y divide-white/5 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl">
                {filteredOfficialCourses.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
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
                        className={`flex items-center justify-between p-3 text-xs transition-all ${
                          isAlreadyAdded
                            ? 'opacity-40 cursor-not-allowed bg-slate-950/40'
                            : isSelected
                            ? 'bg-cyan-950/60 border-l-4 border-cyan-400 text-cyan-200 font-semibold'
                            : 'hover:bg-white/5 cursor-pointer text-slate-200'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 max-w-[75%]">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-cyan-400">{c.code}</span>
                            <span className="truncate text-slate-100 font-medium">{c.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {c.credits} Credits • {c.category || 'Core'}
                          </span>
                        </div>
                        {isAlreadyAdded ? (
                          <span className="rounded-md bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                            Already Added
                          </span>
                        ) : (
                          isSelected && (
                            <span className="h-5 w-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-black">✓</span>
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
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-3 backdrop-blur-md">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Selected Course:</span>
                    <strong className="text-white text-sm">{selectedCourse.code}: {selectedCourse.name}</strong>
                  </div>
                  <span className="rounded-lg bg-cyan-500/10 border border-cyan-400/30 px-2.5 py-1 text-xs font-bold text-cyan-300">
                    {selectedCourse.credits} Credits
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-xs">
                  <label htmlFor="official-grade-select" className="text-slate-300 font-medium">Select Initial Grade:</label>
                  <select
                    id="official-grade-select"
                    value={officialGrade}
                    onChange={(e) => setOfficialGrade(e.target.value)}
                    className="glass-input rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
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
                className="glass-button-secondary rounded-xl px-5 py-2.5 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedCourse}
                className="glass-button-primary rounded-xl px-6 py-2.5 text-xs font-extrabold text-white disabled:opacity-50"
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
                <label htmlFor="custom-code" className="block text-slate-300 font-semibold mb-1">
                  Course Code
                </label>
                <input
                  id="custom-code"
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="e.g. HS3L005 or OE201"
                  required
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label htmlFor="custom-name" className="block text-slate-300 font-semibold mb-1">
                  Course Name
                </label>
                <input
                  id="custom-name"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Music Theory and Acoustic Physics"
                  required
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="custom-credits" className="block text-slate-300 font-semibold mb-1">
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
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label htmlFor="custom-grade-select" className="block text-slate-300 font-semibold mb-1">
                    Grade
                  </label>
                  <select
                    id="custom-grade-select"
                    value={customGrade}
                    onChange={(e) => setCustomGrade(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm text-white"
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
                className="glass-button-secondary rounded-xl px-5 py-2.5 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-button-primary rounded-xl px-6 py-2.5 text-xs font-extrabold text-white"
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
