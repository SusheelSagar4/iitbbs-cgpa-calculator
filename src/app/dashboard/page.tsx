import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { calculateSGPA, calculateCGPA, Course, Grade } from '@/lib/grading'
import AddSemesterButton from '@/components/AddSemesterButton'

interface RawCourse {
  id: string
  name: string
  credits: number
  grade: string
}

interface RawSemester {
  id: string
  semester_number: number
  courses: RawCourse[]
}

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch semesters for logged in user ordered by semester_number ascending with their courses
  const { data: semestersData, error } = await supabase
    .from('semesters')
    .select(`
      id,
      semester_number,
      courses (
        id,
        name,
        credits,
        grade
      )
    `)
    .eq('user_id', user.id)
    .order('semester_number', { ascending: true })

  if (error) {
    console.error('Error fetching semesters:', error.message)
  }

  const semesters = (semestersData as unknown as RawSemester[]) || []

  // Compute SGPA & total credits for each semester
  const processedSemesters = semesters.map((sem) => {
    const rawCourses = sem.courses || []
    const courses: Course[] = rawCourses.map((c) => ({
      name: c.name,
      credits: Number(c.credits),
      grade: c.grade as Grade,
    }))

    const sgpa = calculateSGPA(courses)
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)

    return {
      id: sem.id,
      semester_number: sem.semester_number,
      coursesCount: courses.length,
      sgpa,
      totalCredits,
    }
  })

  // Compute overall CGPA
  const cgpaData = processedSemesters.map((s) => ({
    sgpa: s.sgpa,
    totalCredits: s.totalCredits,
  }))
  const overallCGPA = calculateCGPA(cgpaData)
  const maxSemesterNumber = semesters.reduce(
    (max, s) => Math.max(max, s.semester_number),
    0
  )

  return (
    <div className="space-y-8">
      {/* Top Banner Card for Overall CGPA */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-teal-950/40 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Cumulative Grade Point Average
            </h2>
            <div className="mt-2 flex items-baseline gap-2">
              {processedSemesters.length > 0 ? (
                <>
                  <span className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    {overallCGPA.toFixed(2)}
                  </span>
                  <span className="text-base font-medium text-slate-400 sm:text-lg">
                    / 10.00
                  </span>
                </>
              ) : (
                <span className="text-2xl font-medium text-slate-400">
                  No semesters yet
                </span>
              )}
            </div>
          </div>
          {processedSemesters.length > 0 && (
            <div className="self-start sm:self-auto rounded-lg border border-slate-700/60 bg-slate-800/60 px-4 py-2 text-xs font-medium text-slate-300">
              Semesters Recorded: <span className="font-bold text-white">{processedSemesters.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Header above Grid */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Semesters Overview</h3>
          <p className="text-sm text-slate-400">View and manage your academic performance across semesters</p>
        </div>
        <AddSemesterButton
          currentMaxSemesterNumber={maxSemesterNumber}
          userId={user.id}
        />
      </div>

      {/* Semesters Grid */}
      {processedSemesters.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
          <p className="text-slate-400">You haven&apos;t added any semesters yet.</p>
          <p className="mt-1 text-xs text-slate-500">
            Click the &quot;+ Add Semester&quot; button above to create your first semester.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {processedSemesters.map((sem) => (
            <div
              key={sem.id}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm transition-all hover:border-slate-700 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-white">
                    Semester {sem.semester_number}
                  </h4>
                  <span className="rounded-md border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-400">
                    SGPA: {sem.sgpa.toFixed(2)}
                  </span>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Total Credits:</span>
                    <span className="font-medium text-slate-200">{sem.totalCredits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Courses Added:</span>
                    <span className="font-medium text-slate-200">{sem.coursesCount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-800/80 pt-4">
                <Link
                  href={`/dashboard/semester/${sem.id}`}
                  className="inline-flex items-center justify-center w-full rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
