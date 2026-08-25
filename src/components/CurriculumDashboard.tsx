'use client'

import { useState, useMemo, useEffect } from 'react'
import { calculateSGPA, calculateCGPA, Course } from '@/lib/grading'
import { saveLocalTrackerData, clearLocalTrackerData, LocalSemester, LocalCourse } from '@/lib/storage'
import { getVisitStats, VisitStats } from '@/lib/visitStats'
import GradeSelector from './GradeSelector'
import AddCourseModal from './AddCourseModal'
import { Award, BookOpen, Plus, RotateCcw, Trash2, CheckCircle2, Edit3, Eye, TrendingUp } from 'lucide-react'

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
  const [visitStats, setVisitStats] = useState<VisitStats | null>(null)

  useEffect(() => {
    getVisitStats().then((stats) => setVisitStats(stats))
  }, [])

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

      const completedCourses = sem.courses.filter(
        (c) => ['EX', 'A', 'B', 'C', 'D', 'P'].includes(c.grade)
      )
      const earnedCredits = completedCourses.reduce((sum, c) => sum + c.credits, 0)
      const totalSemesterCredits = sem.courses.reduce((sum, c) => sum + c.credits, 0)

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
    <div className="space-y-10">
      {/* Executive Overall CGPA VisionOS Glass Card */}
      <div className="relative overflow-hidden rounded-3xl vision-glass-panel p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[var(--color-gold)]" />
              <span className="text-xs font-black uppercase tracking-wider text-[var(--color-gold)]">
                Cumulative Grade Point Average
              </span>
              <span className="rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-3.5 py-0.5 text-[10px] font-black text-[var(--color-gold)] backdrop-blur-md shadow-sm">
                Branch: {branchId}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-gold)] via-[var(--color-muted)] to-[var(--color-slate)]">
                {overallMetrics.overallCGPA > 0 ? overallMetrics.overallCGPA.toFixed(2) : 'N/A'}
              </span>
              <span className="text-base sm:text-xl font-bold text-[var(--text-muted)]">
                / 10.00
              </span>
            </div>
          </div>

          {/* Quick Metrics Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 text-[var(--text-main)]">
            <div>
              <span className="text-xs font-bold text-[var(--text-muted)] block mb-1">Earned Credits</span>
              <p className="text-xl font-black text-[var(--text-main)]">
                {overallMetrics.totalEarnedCredits} <span className="text-xs font-normal text-[var(--text-muted)]">/ {overallMetrics.totalCurriculumCredits}</span>
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--text-muted)] block mb-1">Courses Completed</span>
              <p className="text-xl font-black text-[var(--text-main)]">
                {overallMetrics.totalCompletedCourses} <span className="text-xs font-normal text-[var(--text-muted)]">/ {overallMetrics.totalCoursesCount}</span>
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <button
                onClick={handleResetCurriculum}
                className="inline-flex items-center gap-1.5 rounded-2xl border-t border-l border-white/30 bg-white/10 px-3.5 py-2 text-xs font-extrabold text-[var(--text-muted)] hover:text-[var(--color-gold)] transition-colors mt-2 sm:mt-0"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                Change Branch
              </button>
            </div>
          </div>
        </div>

        {/* Global Multi-stop Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-[var(--text-muted)]">
            <span>Overall Curriculum Completion</span>
            <span className="text-[var(--color-gold)] font-black">{overallMetrics.progressPercentage}%</span>
          </div>
          <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-950/70 p-0.5 border-t border-l border-white/20 border-r border-b border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] via-[var(--color-muted)] to-[var(--color-slate)] shadow-lg shadow-[var(--color-gold)]/20 transition-all duration-500"
              style={{ width: `${overallMetrics.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Privacy-Friendly Page Visit Analytics */}
        {visitStats && (
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[var(--color-gold)]" />
              <span className="font-bold text-[var(--text-main)]">Page Visit Analytics:</span>
              <span className="text-[var(--text-muted)] font-medium hidden sm:inline">(Anonymous & Privacy-Friendly)</span>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-[var(--text-muted)]">Today:</span>{' '}
                <strong className="text-[var(--color-gold)] font-black">{visitStats.todayVisits}</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Last 7 Days:</span>{' '}
                <strong className="text-[var(--color-gold)] font-black">{visitStats.weekVisits}</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">All-Time:</span>{' '}
                <strong className="text-[var(--color-gold)] font-black">{visitStats.totalVisits}</strong>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* 8 Semesters Curriculum Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20">
              <BookOpen className="h-5 w-5 text-[var(--color-gold)]" />
            </div>
            <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Curriculum Semesters</h3>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-extrabold">8 Semesters Pre-loaded</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {processedSemesters.map((sem) => {
            const semProgress =
              sem.totalCount > 0 ? Math.round((sem.completedCount / sem.totalCount) * 100) : 0

            return (
              <div
                key={sem.id}
                className="rounded-3xl vision-glass-card vision-glass-card-hover p-6 sm:p-8 space-y-6"
              >
                {/* Semester Header, SGPA Badge, & Add Course Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-black text-[var(--text-main)]">
                        Semester {sem.semester_number}
                      </h4>
                      <span className="rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/10 px-3 py-1 text-xs font-black text-[var(--color-gold)] backdrop-blur-md shadow-sm">
                        SGPA: {sem.sgpa > 0 ? sem.sgpa.toFixed(2) : 'N/A'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-muted)] font-medium">
                      {sem.completedCount} of {sem.totalCount} Courses Completed • {sem.earnedCredits} / {sem.totalSemesterCredits} Credits Earned
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Add Course Sunset Pill Button */}
                    <button
                      onClick={() => setActiveModalSemNumber(sem.semester_number)}
                      className="pill-sunset rounded-2xl px-4 py-2 text-xs font-black flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4 stroke-[3]" />
                      Add Course
                    </button>

                    {/* Semester Progress Bar */}
                    <div className="hidden sm:block w-40 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-black text-[var(--text-muted)]">
                        <span>Progress</span>
                        <span className="text-[var(--color-gold)]">{semProgress}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-950/70 border-t border-l border-white/20">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-slate)] transition-all duration-300"
                          style={{ width: `${semProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course List Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-[var(--text-main)]">
                    <thead className="text-[11px] uppercase font-black text-[var(--text-muted)] border-b border-white/10">
                      <tr>
                        <th scope="col" className="py-3 px-4">Course Code & Name</th>
                        <th scope="col" className="py-3 px-3">Type</th>
                        <th scope="col" className="py-3 px-3">Credits</th>
                        <th scope="col" className="py-3 px-3">Status</th>
                        <th scope="col" className="py-3 px-4 text-right">Grade Selector</th>
                        <th scope="col" className="py-3 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sem.courses.map((course) => {
                        const isCompleted = ['EX', 'A', 'B', 'C', 'D', 'P'].includes(course.grade)
                        const isFailed = course.grade === 'F'

                        return (
                          <tr key={course.id} className="hover:bg-white/[0.04] transition-colors rounded-2xl">
                            <td className="py-4 px-4 font-bold text-[var(--text-main)]">
                              {course.name}
                            </td>

                            {/* Type Badge: Official vs Custom */}
                            <td className="py-4 px-3">
                              {course.isCustom ? (
                                <span className="inline-flex items-center gap-1 rounded-xl bg-purple-500/20 border-t border-l border-white/30 px-2.5 py-0.5 text-[10px] font-black text-purple-300 shadow-sm">
                                  <Edit3 className="h-3 w-3 text-purple-300" /> Custom
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-gold)]">
                                  <CheckCircle2 className="h-3 w-3 text-[var(--color-gold)]" /> Curriculum
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-3 text-xs font-black text-[var(--text-muted)]">
                              {course.credits} Cr
                            </td>

                            <td className="py-4 px-3">
                              {isCompleted ? (
                                <span className="inline-flex items-center rounded-xl bg-emerald-500/20 border-t border-l border-white/40 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 shadow-sm">
                                  Completed
                                </span>
                              ) : isFailed ? (
                                <span className="inline-flex items-center rounded-xl bg-rose-500/20 border-t border-l border-white/40 px-2.5 py-0.5 text-[10px] font-black text-rose-300 shadow-sm">
                                  Failed
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-xl bg-slate-500/10 border border-white/10 px-2.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                                  Not Started
                                </span>
                              )}
                            </td>

                            {/* Grade Selector */}
                            <td className="py-4 px-4 text-right">
                              <GradeSelector
                                courseId={course.id}
                                currentGrade={course.grade}
                                onGradeChange={(newGrade) =>
                                  handleGradeChange(sem.id, course.id, newGrade)
                                }
                              />
                            </td>

                            {/* Delete Button */}
                            <td className="py-4 px-2 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCourse(sem.semester_number, course.id, course.name)
                                }
                                title="Delete course from this semester"
                                className="rounded-xl p-2 text-[var(--text-muted)] hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
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
