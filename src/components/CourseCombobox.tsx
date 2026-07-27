'use client'

import { useState, useRef, useEffect, useMemo, KeyboardEvent } from 'react'
import { BRANCHES, CourseDefinition, getCurriculumForBranch, BRANCH_CURRICULA } from '@/data/coursesData'

interface CourseComboboxProps {
  selectedCourse: CourseDefinition | null
  onSelectCourse: (course: CourseDefinition | null) => void
  existingCourseNames: string[]
  selectedBranch: string
  onBranchChange: (branch: string) => void
  showAllCourses: boolean
  onShowAllCoursesToggle: (show: boolean) => void
}

export default function CourseCombobox({
  selectedCourse,
  onSelectCourse,
  existingCourseNames,
  selectedBranch,
  onBranchChange,
  showAllCourses,
  onShowAllCoursesToggle,
}: CourseComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const comboboxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const existingNamesLower = useMemo(
    () => existingCourseNames.map((name) => name.toLowerCase().trim()),
    [existingCourseNames]
  )

  // Filter courses based on branch, toggle, and search query
  const filteredCourses = useMemo(() => {
    let list: CourseDefinition[] = []

    if (showAllCourses) {
      // Aggregate courses from all branches
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

    // Search query filter
    const query = searchQuery.trim().toLowerCase()
    if (query) {
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(query) ||
          c.name.toLowerCase().includes(query)
      )
    }

    return list
  }, [selectedBranch, showAllCourses, searchQuery])

  useEffect(() => {
    setActiveIndex(0)
  }, [filteredCourses])

  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIndex, isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        setIsOpen(true)
        return
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) =>
        prev < filteredCourses.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCourses.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCourses.length > 0 && activeIndex < filteredCourses.length) {
        const item = filteredCourses[activeIndex]
        const isDuplicate = existingNamesLower.some(
          (name) =>
            name.includes(item.code.toLowerCase()) ||
            name === item.name.toLowerCase()
        )
        if (!isDuplicate) {
          handleSelect(item)
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleSelect = (course: CourseDefinition) => {
    onSelectCourse(course)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClear = () => {
    onSelectCourse(null)
    setSearchQuery('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div ref={comboboxRef} className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <label htmlFor="branch-select" className="font-medium text-slate-400">
            Branch:
          </label>
          <select
            id="branch-select"
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-teal-400 focus:border-teal-500 focus:outline-none"
          >
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>

        <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors">
          <input
            type="checkbox"
            checked={showAllCourses}
            onChange={(e) => onShowAllCoursesToggle(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-400"
          />
          <span>Show all branches</span>
        </label>
      </div>

      <div className="relative">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="course-combobox-list"
            placeholder={
              selectedCourse
                ? `${selectedCourse.code} • ${selectedCourse.name}`
                : 'Type course code or name to search...'
            }
            value={selectedCourse ? `${selectedCourse.code} • ${selectedCourse.name}` : searchQuery}
            onChange={(e) => {
              if (selectedCourse) {
                onSelectCourse(null)
              }
              setSearchQuery(e.target.value)
              if (!isOpen) setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-3 pr-10 text-sm text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />

          <div className="absolute right-2.5 flex items-center gap-1">
            {selectedCourse || searchQuery ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear course selection"
                className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="rounded p-1 text-slate-400 hover:text-white transition-colors"
              >
                <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl backdrop-blur-md">
            <ul
              id="course-combobox-list"
              ref={listRef}
              role="listbox"
              className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 text-sm"
            >
              {filteredCourses.length === 0 ? (
                <li className="px-4 py-3 text-center text-xs text-slate-500">
                  No courses found matching &quot;{searchQuery}&quot;. Try enabling &quot;Show all branches&quot;.
                </li>
              ) : (
                filteredCourses.map((item, index) => {
                  const isDuplicate = existingNamesLower.some(
                    (name) =>
                      name.includes(item.code.toLowerCase()) ||
                      name === item.name.toLowerCase()
                  )
                  const isActive = index === activeIndex

                  return (
                    <li
                      key={`${item.code}-${item.name}`}
                      role="option"
                      aria-selected={isActive}
                      aria-disabled={isDuplicate}
                      onClick={() => {
                        if (!isDuplicate) handleSelect(item)
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer ${
                        isDuplicate
                          ? 'opacity-40 cursor-not-allowed bg-slate-950/40'
                          : isActive
                          ? 'bg-teal-950/40 text-teal-300'
                          : 'hover:bg-slate-800/80 text-slate-200'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 max-w-[80%]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-400">
                            {item.code}
                          </span>
                          <span className="font-medium text-slate-100 truncate">
                            {item.name}
                          </span>
                        </div>
                        {item.category && (
                          <span className="text-[10px] text-slate-400">
                            Category: {item.category} • Branch: {item.branch} • Sem {item.semester}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300 border border-slate-700">
                          {item.credits} Cr
                        </span>
                        {isDuplicate && (
                          <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                            Added
                          </span>
                        )}
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
