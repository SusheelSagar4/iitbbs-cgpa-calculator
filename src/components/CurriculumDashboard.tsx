'use client'

import { useState, useMemo } from 'react'
import { calculateSGPA, calculateCGPA, Course } from '@/lib/grading'
import { saveLocalTrackerData, clearLocalTrackerData, LocalSemester, LocalCourse } from '@/lib/storage'
import GradeSelector from './GradeSelector'
import AddCourseModal from './AddCourseModal'

interface CurriculumDashboardProps {
  branchId: string
  initialSemesters: LocalSemester[]
  onReset: () => void
}

export default function CurriculumDashboard({
  branchId,
  initialSemesters,
  onReset,
}: CurriculumDashboardProps) {
  const [semesters, setSemesters] = useState<LocalSemester[]>(initialSemesters)
  const [activeModalSemNumber, setActiveModalSemNumber] = useState<number | null>(null)

  // Handle grade change locally and persist to localStorage
  const handleGradeChange = (semesterId: string, courseId: string, newGrade: string) => {
    setSemesters((prevSemesters) => {
      const updated = prevSemesters.map((sem) => {
        if (sem.id !== semesterId) return sem
        return {
          ...sem,
          courses: sem.courses.map((c) =>
            c.id === courseId ? { ...c, grade: newGrade } : c
          ),
        }
      })

      saveLocalTrackerData({
        branchId,
        semesters: updated,
      })

      return updated
    })
  }

  // Handle adding a course (official or custom) to a semester
  const handleAddCourseToSemester = (semesterNumber: number, newCourse: LocalCourse) => {
    setSemesters((prevSemesters) => {
      const updated = prevSemesters.map((sem) => {
        if (sem.semester_number !== semesterNumber) return sem
        return {
          ...sem,
          courses: [...sem.courses, newCourse],
        }
      })

      saveLocalTrackerData({
        branchId,
        semesters: updated,
      })

      return updated
    })
  }

  // Handle deleting a course from a semester
  const handleDeleteCourse = (semesterNumber: number, courseId: string, courseName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${courseName}" from Semester ${semesterNumber}?`
    )
    if (!confirmed) return

    setSemesters((prevSemesters) => {
      const updated = prevSemesters.map((sem) => {
        if (sem.semester_number !== semesterNumber) return sem
        return {
          ...sem,
          courses: sem.courses.filter((c) => c.id !== courseId),
        }
      })

      saveLocalTrackerData({
        branchId,
        semesters: updated,
      })

      return updated
    })
  }

  // Calculate SGPA, completed credits, and total credits for each semester
  const processedSemesters = useMemo(() => {
    return semesters.map((sem) => {
      const courses: Course[] = sem.courses.map((c) => ({
        name: c.name,
        credits: c.credits,
        grade: c.grade,
      }))

      // Completed courses (grade is EX, A, B, C, D, P)
      const completedCourses = sem.courses.filter(
        (c) => ['EX', 'A', 'B', 'C', 'D', 'P'].includes(c.grade)
      )
      const earnedCredits = completedCourses.reduce((sum, c) => sum + c.credits, 0)
      const totalSemesterCredits = sem.courses.reduce((sum, c) => sum + c.credits, 0)

      // Calculate SGPA based on graded courses
      const sgpa = calculateSGPA(courses)

      return {
        ...sem,
        sgpa,
        earnedCredits,
        totalSemesterCredits,
        completedCount: completedCourses.length,
        totalCount: sem.courses.length,
      }
    })
  }, [semesters])

  // Calculate Overall CGPA and Total Academic Progress
  const overallMetrics = useMemo(() => {
    const semStats = processedSemesters.map((s) => ({
      sgpa: s.sgpa,
      totalCredits: s.earnedCredits,
    }))

    const overallCGPA = calculateCGPA(semStats)
    const totalEarnedCredits = processedSemesters.reduce((sum, s) => sum + s.earnedCredits, 0)
    const totalCurriculumCredits = processedSemesters.reduce((sum, s) => sum + s.totalSemesterCredits, 0)
    const totalCompletedCourses = processedSemesters.reduce((sum, s) => sum + s.completedCount, 0)
    const totalCoursesCount = processedSemesters.reduce((sum, s) => sum + s.totalCount, 0)

    const progressPercentage =
      totalCurriculumCredits > 0
        ? Math.min(100, Math.round((totalEarnedCredits / totalCurriculumCredits) * 100))
        : 0

    return {
      overallCGPA,
      totalEarnedCredits,
      totalCurriculumCredits,
      totalCompletedCourses,
      totalCoursesCount,
      progressPercentage,
    }
  }, [processedSemesters])

  // Reset curriculum action
  const handleResetCurriculum = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset your curriculum? This will clear your grade entries so you can select a new branch.'
    )
    if (!confirmed) return

    clearLocalTrackerData()
    onReset()
  }

  return (
    <div className="space-y-8">
      {/* Executive Overall CGPA & Academic Progress Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-teal-950/40 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Cumulative Grade Point Average
              </span>
              <span className="rounded bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-400 border border-teal-500/20">
                Branch: {branchId}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {overallMetrics.overallCGPA > 0 ? overallMetrics.overallCGPA.toFixed(2) : 'N/A'}
              </span>
              <span className="text-base font-medium text-slate-400 sm:text-lg">
                / 10.00
              </span>
            </div>
          </div>

          {/* Quick Metrics Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-slate-300">
            <div>
              <span className="text-xs text-slate-400">Earned Credits</span>
              <p className="text-lg font-bold text-white">
                {overallMetrics.totalEarnedCredits} <span className="text-xs text-slate-500">/ {overallMetrics.totalCurriculumCredits}</span>
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Courses Completed</span>
              <p className="text-lg font-bold text-white">
                {overallMetrics.totalCompletedCourses} <span className="text-xs text-slate-500">/ {overallMetrics.totalCoursesCount}</span>
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <button
                onClick={handleResetCurriculum}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors mt-2 sm:mt-0"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Change Branch
              </button>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Overall Curriculum Completion</span>
            <span className="font-semibold text-teal-400">{overallMetrics.progressPercentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${overallMetrics.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 8 Semesters Curriculum Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Curriculum Semesters</h3>

        <div className="grid grid-cols-1 gap-6">
          {processedSemesters.map((sem) => {
            const semProgress =
              sem.totalCount > 0 ? Math.round((sem.completedCount / sem.totalCount) * 100) : 0

            return (
              <div
                key={sem.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-sm space-y-4"
              >
                {/* Semester Header, SGPA Badge, & Add Course Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold text-white">
                        Semester {sem.semester_number}
                      </h4>
                      <span className="rounded-md border border-teal-500/20 bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-400">
                        SGPA: {sem.sgpa > 0 ? sem.sgpa.toFixed(2) : 'N/A'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {sem.completedCount} of {sem.totalCount} Courses Completed • {sem.earnedCredits} / {sem.totalSemesterCredits} Credits Earned
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Add Course Button */}
                    <button
                      onClick={() => setActiveModalSemNumber(sem.semester_number)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-400 hover:bg-teal-500/20 transition-all focus:outline-none"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      + Add Course
                    </button>

                    {/* Semester Progress Bar */}
                    <div className="hidden sm:block w-36 space-y-1">
                      <div className="flex justify-between text-[11px] font-medium text-slate-400">
                        <span>Progress</span>
                        <span>{semProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-teal-500 transition-all duration-300"
                          style={{ width: `${semProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course List Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-[11px] uppercase font-semibold text-slate-500">
                      <tr>
                        <th scope="col" className="py-2 px-3">Course Code & Name</th>
                        <th scope="col" className="py-2 px-3">Type</th>
                        <th scope="col" className="py-2 px-3">Credits</th>
                        <th scope="col" className="py-2 px-3">Status</th>
                        <th scope="col" className="py-2 px-3 text-right">Grade Selector</th>
                        <th scope="col" className="py-2 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {sem.courses.map((course) => {
                        const isCompleted = ['EX', 'A', 'B', 'C', 'D', 'P'].includes(course.grade)
                        const isFailed = course.grade === 'F'

                        return (
                          <tr key={course.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-3">
                              <span className="font-medium text-white block">{course.name}</span>
                            </td>

                            {/* Type Badge: Official vs Custom */}
                            <td className="py-3 px-3">
                              {course.isCustom ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                                  ✏ Custom
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/60 border border-slate-700/40 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                                  ✔ Curriculum
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-xs font-semibold text-slate-400">
                              {course.credits} Cr
                            </td>
                            <td className="py-3 px-3">
                              {isCompleted ? (
                                <span className="inline-flex items-center rounded-md bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 text-[10px] font-semibold text-teal-400">
                                  Completed
                                </span>
                              ) : isFailed ? (
                                <span className="inline-flex items-center rounded-md bg-red-950/60 border border-red-800/40 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                                  Failed
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-slate-800/60 border border-slate-700/40 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                                  Not Started
                                </span>
                              )}
                            </td>

                            {/* Grade Selector */}
                            <td className="py-3 px-3 text-right">
                              <GradeSelector
                                courseId={course.id}
                                currentGrade={course.grade}
                                onGradeChange={(newGrade) =>
                                  handleGradeChange(sem.id, course.id, newGrade)
                                }
                              />
                            </td>

                            {/* Delete Button */}
                            <td className="py-3 px-2 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCourse(sem.semester_number, course.id, course.name)
                                }
                                title="Delete course from this semester"
                                className="rounded p-1 text-slate-500 hover:bg-red-950/60 hover:text-red-400 transition-colors"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Add Course Modal Anchor */}
                {activeModalSemNumber === sem.semester_number && (
                  <AddCourseModal
                    semesterNumber={sem.semester_number}
                    branchId={branchId}
                    existingCourses={sem.courses}
                    onAddCourse={(newCourse) =>
                      handleAddCourseToSemester(sem.semester_number, newCourse)
                    }
                    onClose={() => setActiveModalSemNumber(null)}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
