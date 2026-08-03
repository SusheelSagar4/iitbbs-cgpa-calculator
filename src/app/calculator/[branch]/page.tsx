'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { branchCurricula } from '@/lib/curricula'
import { calculateSGPA, GRADE_POINTS, Grade } from '@/lib/grading'
import { SemesterItem, CourseItem } from '@/app/dashboard/page'

interface PageProps {
  params: {
    branch: string
  }
}

export default function CalculatorPage({ params }: PageProps) {
  const router = useRouter()
  const branchKey = params.branch.toLowerCase()
  const curriculum = branchCurricula[branchKey]

  const [selectedSemester, setSelectedSemester] = useState<number>(3) // Default to Semester 3 (first branch-specific sem)
  const [grades, setGrades] = useState<Record<string, Grade>>({})
  const [isMounted, setIsMounted] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Ensure client-side mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!curriculum) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6 text-white">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Curriculum Not Found</h2>
        <p className="text-slate-400 mb-6">The branch &quot;{params.branch}&quot; is not configured.</p>
        <Link href="/" className="px-6 py-2.5 bg-amber-500 text-slate-950 rounded-full font-bold hover:bg-amber-400 transition-colors">
          Go Back Home
        </Link>
      </div>
    )
  }

  const currentSemCurriculum = curriculum.semesters.find(
    (s) => s.semester_number === selectedSemester
  )

  const courses = currentSemCurriculum ? currentSemCurriculum.courses : []

  // Handle grade selection for a course code
  const handleGradeChange = (courseCode: string, gradeValue: Grade | '') => {
    setGrades((prev) => {
      const next = { ...prev }
      if (gradeValue === '') {
        delete next[courseCode]
      } else {
        next[courseCode] = gradeValue
      }
      return next
    })
  }

  // Calculate live SGPA
  const selectedCoursesForCalculation = courses
    .filter((c) => grades[c.code] !== undefined)
    .map((c) => ({
      name: c.name,
      credits: c.credits,
      grade: grades[c.code],
    }))

  const liveSGPA = calculateSGPA(selectedCoursesForCalculation)
  const totalCreditsSelected = selectedCoursesForCalculation.reduce((sum, c) => sum + c.credits, 0)
  const totalSemesterCredits = courses.reduce((sum, c) => sum + c.credits, 0)

  // Add to local storage semesters
  const handleSaveToDashboard = () => {
    // Check if grades have been input for all courses
    if (selectedCoursesForCalculation.length < courses.length) {
      alert('Please select grades for all courses in this semester before saving.')
      return
    }

    const saved = localStorage.getItem('iitbbs_semesters')
    let semestersList: SemesterItem[] = []
    if (saved) {
      try {
        semestersList = JSON.parse(saved)
      } catch (e) {
        console.error('Error parsing semesters from localStorage:', e)
      }
    }

    // Build courses list with IDs
    const newCourses: CourseItem[] = courses.map((c) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: c.name,
      credits: c.credits,
      grade: grades[c.code],
    }))

    // Check if semester already exists, if so overwrite, else append
    const existingIndex = semestersList.findIndex(
      (s) => s.semester_number === selectedSemester
    )

    const newSemesterRow = {
      id: existingIndex >= 0 ? semestersList[existingIndex].id : Math.random().toString(36).substring(2, 9),
      semester_number: selectedSemester,
      courses: newCourses,
    }

    if (existingIndex >= 0) {
      semestersList[existingIndex] = newSemesterRow
    } else {
      semestersList.push(newSemesterRow)
      // Sort semesters by semester_number ascending
      semestersList.sort((a, b) => a.semester_number - b.semester_number)
    }

    localStorage.setItem('iitbbs_semesters', JSON.stringify(semestersList))
    setSaveSuccess(true)
    
    // Redirect to dashboard after a brief delay for a success animation feel
    setTimeout(() => {
      router.push('/dashboard')
    }, 800)
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[var(--color-navy)] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-[var(--color-gold)] border-[var(--color-slate)]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-offwhite)] text-[var(--color-navy)] pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--color-slate)]/10 bg-[var(--color-navy)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/10 text-sm font-bold text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20 transition-colors">
              &larr;
            </Link>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[var(--color-gold)] uppercase leading-none block">IIT BHUBANESWAR</span>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                {curriculum.name}
              </h1>
            </div>
          </div>
          <div>
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-white bg-[var(--color-slate)] hover:bg-[var(--color-slate)]/80 px-5 py-2.5 rounded-full border border-[var(--color-slate)] hover:border-[var(--color-gold)] transition-all duration-300 backdrop-blur-sm shadow-sm"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in-up">
        {/* Semester selector tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-slate)]/10 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-[var(--color-navy)]">CGPA Predictor & Course Selector</h2>
            <p className="text-sm text-[var(--color-muted)]">Select a semester to populate its curriculum subjects and predict grades.</p>
          </div>
          <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-[var(--color-slate)]/10 self-start sm:self-auto shadow-sm">
            {[1, 2, 3, 4].map((semNum) => (
              <button
                key={semNum}
                onClick={() => {
                  setSelectedSemester(semNum)
                  setGrades({}) // Reset grades on semester change
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  selectedSemester === semNum
                    ? 'bg-[var(--color-gold)] text-[var(--color-navy)] shadow-sm'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-navy)]'
                }`}
              >
                Sem {semNum}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Subjects Table (Left Side) */}
          <div className="lg:col-span-8 rounded-3xl border border-[var(--color-slate)]/15 bg-white shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[var(--color-navy)]">
                <thead className="border-b border-[var(--color-slate)]/10 bg-[var(--color-slate)]/5 text-xs uppercase font-bold text-[var(--color-navy)]/80">
                  <tr>
                    <th scope="col" className="px-6 py-4">Code</th>
                    <th scope="col" className="px-6 py-4">Subject Name</th>
                    <th scope="col" className="px-6 py-4">Credits</th>
                    <th scope="col" className="px-6 py-4 w-48">Expected Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-slate)]/10">
                  {courses.map((course) => {
                    const currentGrade = grades[course.code] || ''
                    return (
                      <tr key={course.code} className="hover:bg-[var(--color-slate)]/[0.03] transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-[var(--color-gold)] font-black">{course.code}</td>
                        <td className="px-6 py-4 font-bold text-[var(--color-navy)]">{course.name}</td>
                        <td className="px-6 py-4 text-[var(--color-navy)]/80 font-semibold">{course.credits}</td>
                        <td className="px-6 py-4">
                          <select
                            value={currentGrade}
                            onChange={(e) => handleGradeChange(course.code, e.target.value as Grade | '')}
                            className={`w-full rounded-xl border px-3 py-2 text-sm bg-white text-[var(--color-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-[var(--color-gold)] ${
                              currentGrade 
                                ? 'border-[var(--color-gold)] ring-1 ring-[var(--color-gold)]/20' 
                                : 'border-[var(--color-slate)]/30'
                            }`}
                          >
                            <option value="">-- Select Grade --</option>
                            {Object.keys(GRADE_POINTS).map((g) => (
                              <option key={g} value={g}>
                                {g} ({GRADE_POINTS[g as Grade]} pts)
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Predictor Panel Card (Right Side) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-[var(--color-slate)]/15 bg-white p-6 shadow-xl space-y-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-navy)]/80 border-b border-[var(--color-slate)]/10 pb-3">
                Live Calculation
              </h3>

              {/* Large SGPA Display */}
              <div className="text-center py-6 bg-[var(--color-slate)]/5 rounded-2xl border border-[var(--color-slate)]/15 relative overflow-hidden">
                {/* Background ambient gold aura */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[var(--color-gold)]/5 blur-3xl" />
                <span className="text-xs font-bold text-[var(--color-navy)]/60 uppercase tracking-widest block mb-2">
                  Expected SGPA
                </span>
                <span className="text-5xl font-black tracking-tight text-[var(--color-navy)]">
                  {liveSGPA.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-[var(--color-navy)]/65 ml-1">/ 10.0</span>
              </div>

              {/* Selection Progress Details */}
              <div className="space-y-3.5 text-sm text-[var(--color-navy)]/80">
                <div className="flex justify-between">
                  <span className="text-[var(--color-navy)]/65">Total Semester Credits:</span>
                  <span className="font-bold text-[var(--color-navy)]">{totalSemesterCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-navy)]/65">Graded Credits:</span>
                  <span className={`font-bold ${totalCreditsSelected === totalSemesterCredits ? 'text-emerald-600' : 'text-[var(--color-gold)]'}`}>
                    {totalCreditsSelected} / {totalSemesterCredits}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-navy)]/65">Graded Subjects:</span>
                  <span className="font-bold text-[var(--color-navy)]">
                    {selectedCoursesForCalculation.length} / {courses.length}
                  </span>
                </div>
              </div>

              {/* Button Action */}
              <button
                onClick={handleSaveToDashboard}
                disabled={saveSuccess}
                className={`w-full pill-sunset font-bold px-6 py-4 rounded-full shadow-lg hover:-translate-y-0.5 transition-all duration-300 transform text-center block text-base disabled:opacity-50`}
              >
                {saveSuccess ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Saved to Dashboard!
                  </span>
                ) : (
                  'Add to Dashboard \u2192'
                )}
              </button>
            </div>

            {/* Hint Box */}
            <div className="rounded-2xl border border-[var(--color-slate)]/10 bg-[var(--color-slate)]/[0.04] p-5 text-xs text-[var(--color-navy)]/85 leading-relaxed">
              💡 **Curriculum Synced**: The course structures above are synchronized with the standard B.Tech syllabus at IIT Bhubaneswar for this branch. Adding this semester will update your cumulative CGPA directly in your Dashboard.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
