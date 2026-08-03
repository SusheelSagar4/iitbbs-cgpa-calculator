'use client'

import { useState } from 'react'
import { calculateSGPA, GRADE_POINTS, Grade } from '@/lib/grading'
import CourseCombobox from './CourseCombobox'
import { CourseDefinition } from '@/data/coursesData'

export interface CourseItem {
  id: string
  name: string
  credits: number
  grade: Grade
}

interface SemesterItem {
  id: string
  semester_number: number
  courses: CourseItem[]
}

interface CourseManagerProps {
  semesterId: string
  initialCourses: CourseItem[]
}

const gradeKeys = Object.keys(GRADE_POINTS) as Grade[]

export default function CourseManager({
  semesterId,
  initialCourses,
}: CourseManagerProps) {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses || [])

  // Add Form input state
  const [selectedCourse, setSelectedCourse] = useState<CourseDefinition | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<string>('CS')
  const [showAllCourses, setShowAllCourses] = useState<boolean>(false)
  const [name, setName] = useState('')
  const [credits, setCredits] = useState<string>('3')
  const [grade, setGrade] = useState<Grade>('A')

  const handleSelectCourse = (course: CourseDefinition | null) => {
    setSelectedCourse(course)
    if (course) {
      setName(`${course.code}: ${course.name}`)
      setCredits(course.credits.toString())
    } else {
      setName('')
      setCredits('3')
    }
  }

  // Edit Row state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCredits, setEditCredits] = useState<string>('3')
  const [editGrade, setEditGrade] = useState<Grade>('A')
  const [savingId, setSavingId] = useState<string | null>(null)

  // Loading & error state
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Calculate SGPA on every render from current local courses state
  const currentSGPA = calculateSGPA(
    courses.map((c) => ({
      name: c.name,
      credits: c.credits,
      grade: c.grade,
    }))
  )
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)

  // Helper to sync changes with localStorage
  const updateLocalStorage = (updatedCourses: CourseItem[]) => {
    const saved = localStorage.getItem('iitbbs_semesters')
    if (saved) {
      try {
        const semesters: SemesterItem[] = JSON.parse(saved)
        const updatedSemesters = semesters.map((sem) => {
          if (sem.id === semesterId) {
            return { ...sem, courses: updatedCourses }
          }
          return sem
        })
        localStorage.setItem('iitbbs_semesters', JSON.stringify(updatedSemesters))
      } catch (e) {
        console.error('Error saving updated courses to localStorage:', e)
      }
    }
  }

  // Start Editing a row
  const handleStartEdit = (course: CourseItem) => {
    setErrorMessage(null)
    setEditingId(course.id)
    setEditName(course.name)
    setEditCredits(course.credits.toString())
    setEditGrade(course.grade)
  }

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditCredits('3')
    setEditGrade('A')
  }

  // Save Edit
  const handleSaveEdit = async (id: string) => {
    setErrorMessage(null)
    const parsedCredits = parseFloat(editCredits)

    if (!editName.trim()) {
      setErrorMessage('Please enter a course name.')
      return
    }
    if (isNaN(parsedCredits) || parsedCredits <= 0) {
      setErrorMessage('Please enter valid credits (> 0).')
      return
    }

    setSavingId(id)

    try {
      const updated = courses.map((c) =>
        c.id === id
          ? {
              ...c,
              name: editName.trim(),
              credits: parsedCredits,
              grade: editGrade,
            }
          : c
      )
      setCourses(updated)
      updateLocalStorage(updated)
      setEditingId(null)
    } catch (err: unknown) {
      console.error('Update course error:', err)
      setErrorMessage('An unexpected error occurred while updating the course.')
    } finally {
      setSavingId(null)
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const parsedCredits = parseFloat(credits)
    if (!name.trim()) {
      setErrorMessage('Please enter a course name.')
      return
    }
    if (isNaN(parsedCredits) || parsedCredits <= 0) {
      setErrorMessage('Please enter valid credits (> 0).')
      return
    }

    setIsAdding(true)

    try {
      const newCourseItem: CourseItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        credits: parsedCredits,
        grade: grade,
      }
      const updated = [...courses, newCourseItem]
      setCourses(updated)
      updateLocalStorage(updated)
      setName('')
      setCredits('3')
      setGrade('A')
    } catch (err: unknown) {
      console.error('Add course error:', err)
      setErrorMessage('An unexpected error occurred while adding the course.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    setErrorMessage(null)
    setDeletingId(id)

    try {
      const updated = courses.filter((c) => c.id !== id)
      setCourses(updated)
      updateLocalStorage(updated)
      if (editingId === id) {
        setEditingId(null)
      }
    } catch (err: unknown) {
      console.error('Delete course error:', err)
      setErrorMessage('An unexpected error occurred while deleting the course.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Live SGPA & Credits Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-md">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
            Semester Performance
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white sm:text-4xl">
              Current SGPA: {currentSGPA.toFixed(2)}
            </span>
            <span className="text-sm text-slate-400">/ 10.00</span>
          </div>
        </div>
        <div className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-4 py-2 text-xs font-medium text-slate-300">
          Total Credits: <span className="font-bold text-white">{totalCredits}</span>
        </div>
      </div>

      {/* Error notification banner */}
      {errorMessage && (
        <div className="rounded-lg border border-red-800/60 bg-red-950/40 p-3 text-xs font-medium text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Course List & Form Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 shadow-md overflow-hidden">
        {/* Table / Empty State */}
        {courses.length === 0 ? (
          <div className="p-8 text-center border-b border-slate-800/80">
            <p className="text-sm font-medium text-slate-300">Add your first course below</p>
            <p className="mt-1 text-xs text-slate-500">Enter the course details in the form to compute your SGPA.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-xs uppercase font-semibold text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Course Name</th>
                  <th scope="col" className="px-6 py-3.5">Credits</th>
                  <th scope="col" className="px-6 py-3.5">Grade</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {courses.map((course) => {
                  const isEditingThisRow = editingId === course.id
                  const isSavingThisRow = savingId === course.id

                  return (
                    <tr key={course.id} className="hover:bg-slate-800/30 transition-colors">
                      {isEditingThisRow ? (
                        <>
                          <td className="px-6 py-3">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:border-teal-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-6 py-3">
                            <input
                              type="number"
                              step="0.5"
                              min="0.5"
                              max="20"
                              value={editCredits}
                              onChange={(e) => setEditCredits(e.target.value)}
                              className="w-24 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:border-teal-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-6 py-3">
                            <select
                              value={editGrade}
                              onChange={(e) => setEditGrade(e.target.value as Grade)}
                              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-white focus:border-teal-500 focus:outline-none"
                            >
                              {gradeKeys.map((g) => (
                                <option key={g} value={g}>
                                  {g} ({GRADE_POINTS[g]} pts)
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleSaveEdit(course.id)}
                                disabled={isSavingThisRow}
                                className="rounded-md bg-teal-600 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-500 transition-colors disabled:opacity-50"
                              >
                                {isSavingThisRow ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isSavingThisRow}
                                className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 font-medium text-white">{course.name}</td>
                          <td className="px-6 py-4 text-slate-300">{course.credits}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-md border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-xs font-semibold text-teal-400">
                              {course.grade} ({GRADE_POINTS[course.grade]} pts)
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleStartEdit(course)}
                                disabled={editingId !== null || deletingId === course.id}
                                className="rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                disabled={editingId !== null || deletingId === course.id}
                                className="inline-flex items-center gap-1 rounded-md border border-red-800/40 bg-red-950/30 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors disabled:opacity-50"
                              >
                                {deletingId === course.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Course Form Row */}
        <div className="border-t border-slate-800 bg-slate-900/90 p-4 sm:p-6 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            + Add New Course
          </h4>

          <form onSubmit={handleAddCourse} className="space-y-4">
            <CourseCombobox
              selectedCourse={selectedCourse}
              onSelectCourse={handleSelectCourse}
              existingCourseNames={courses.map((c) => c.name)}
              selectedBranch={selectedBranch}
              onBranchChange={setSelectedBranch}
              showAllCourses={showAllCourses}
              onShowAllCoursesToggle={setShowAllCourses}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-end">
              <div className="sm:col-span-6">
                <label htmlFor="course-name-override" className="block text-xs font-medium text-slate-400 mb-1">
                  Selected / Custom Course Title
                </label>
                <input
                  id="course-name-override"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Select from above or type custom course name"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="course-credits" className="block text-xs font-medium text-slate-400 mb-1">
                  Credits
                </label>
                <input
                  id="course-credits"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="20"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="course-grade" className="block text-xs font-medium text-slate-400 mb-1">
                  Grade
                </label>
                <select
                  id="course-grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as Grade)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {gradeKeys.map((g) => (
                    <option key={g} value={g}>
                      {g} ({GRADE_POINTS[g]} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isAdding || !name.trim()}
                  className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50"
                >
                  {isAdding ? 'Adding...' : 'Add Course'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
