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

  // Normalize existing course codes & names for duplicate check
  const existingCodesLower = useMemo(
    () => existingCourses.map((c) => c.code.toLowerCase().trim()),
    [existingCourses]
  )
  const existingNamesLower = useMemo(
    () => existingCourses.map((c) => c.name.toLowerCase().trim()),
    [existingCourses]
  )

  // Available official courses filtered by search query & branch
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

  // Handle submit official course
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

  // Handle submit custom course
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              + Add Course to Semester {semesterNumber}
            </h3>
            <p className="text-xs text-slate-400">
              Select from official curriculum or create a custom course.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('official')
              setErrorMessage(null)
            }}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'official'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✔ Search Curriculum
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('custom')
              setErrorMessage(null)
            }}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'custom'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✏ Custom Course
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-lg border border-red-800/60 bg-red-950/40 p-3 text-xs font-medium text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Tab 1: Official Curriculum Search */}
        {activeTab === 'official' ? (
          <form onSubmit={handleAddOfficial} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <label htmlFor="dept-filter">Branch:</label>
                  <select
                    id="dept-filter"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-teal-400 focus:outline-none"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAllBranches}
                    onChange={(e) => setShowAllBranches(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-teal-500"
                  />
                  <span>All Branches</span>
                </label>
              </div>

              {/* Search input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type course code (e.g. CS201) or name..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
              />

              {/* Results List */}
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-950">
                {filteredOfficialCourses.length === 0 ? (
                  <p className="p-3 text-center text-xs text-slate-500">
                    No courses found. Try toggling &quot;All Branches&quot;.
                  </p>
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
                        className={`flex items-center justify-between p-2.5 text-xs transition-colors ${
                          isAlreadyAdded
                            ? 'opacity-40 cursor-not-allowed bg-slate-900/40'
                            : isSelected
                            ? 'bg-teal-950/60 border-l-2 border-teal-500 text-teal-300'
                            : 'hover:bg-slate-800/60 cursor-pointer text-slate-200'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono font-bold text-teal-400">
                            {c.code} • {c.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {c.credits} Credits • {c.category || 'Core'}
                          </span>
                        </div>
                        {isAlreadyAdded ? (
                          <span className="rounded bg-amber-950/60 border border-amber-800/40 px-1.5 py-0.5 text-[10px] text-amber-400 font-semibold">
                            Already Added
                          </span>
                        ) : (
                          isSelected && (
                            <span className="text-teal-400 font-bold text-sm">✓</span>
                          )
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Selected Course Auto-Fill Preview */}
            {selectedCourse && (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Selected: <strong className="text-white">{selectedCourse.code}: {selectedCourse.name}</strong></span>
                  <span className="text-teal-400 font-bold">{selectedCourse.credits} Credits</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <label htmlFor="official-grade-select" className="text-slate-400 font-medium">Select Initial Grade:</label>
                  <select
                    id="official-grade-select"
                    value={officialGrade}
                    onChange={(e) => setOfficialGrade(e.target.value)}
                    className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white focus:border-teal-500 focus:outline-none"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g} {g in GRADE_POINTS ? `(${GRADE_POINTS[g as Grade]} pts)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedCourse}
                className="rounded-lg bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-500 transition-all disabled:opacity-50"
              >
                Add Official Course
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: Custom Course Form */
          <form onSubmit={handleAddCustom} className="space-y-4 text-xs">
            <div className="space-y-3">
              <div>
                <label htmlFor="custom-code" className="block text-slate-400 font-medium mb-1">
                  Course Code
                </label>
                <input
                  id="custom-code"
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="e.g. HS3L005 or OE201"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="custom-name" className="block text-slate-400 font-medium mb-1">
                  Course Name
                </label>
                <input
                  id="custom-name"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Music Theory and Acoustic Physics"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="custom-credits" className="block text-slate-400 font-medium mb-1">
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="custom-grade-select" className="block text-slate-400 font-medium mb-1">
                    Grade
                  </label>
                  <select
                    id="custom-grade-select"
                    value={customGrade}
                    onChange={(e) => setCustomGrade(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                  >
                    {GRADE_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g} {g in GRADE_POINTS ? `(${GRADE_POINTS[g as Grade]} pts)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-500 transition-all"
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
