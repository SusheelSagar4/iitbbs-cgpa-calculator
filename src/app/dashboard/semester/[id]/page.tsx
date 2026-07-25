import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CourseManager, { CourseItem } from '@/components/CourseManager'
import DeleteSemesterButton from '@/components/DeleteSemesterButton'
import { Grade } from '@/lib/grading'

interface PageProps {
  params: {
    id: string
  }
}

export default async function SemesterDetailPage({ params }: PageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const semesterId = params.id

  // Fetch semester row by id and verify ownership
  const { data: semester, error: semesterError } = await supabase
    .from('semesters')
    .select('id, user_id, semester_number')
    .eq('id', semesterId)
    .single()

  if (semesterError || !semester || semester.user_id !== user.id) {
    redirect('/dashboard')
  }

  // Fetch courses for this semester
  const { data: coursesData, error: coursesError } = await supabase
    .from('courses')
    .select('id, name, credits, grade')
    .eq('semester_id', semesterId)

  if (coursesError) {
    console.error('Error fetching courses for semester:', coursesError.message)
  }

  const initialCourses: CourseItem[] = (coursesData || []).map((c) => ({
    id: c.id,
    name: c.name,
    credits: Number(c.credits),
    grade: c.grade as Grade,
  }))

  return (
    <div className="space-y-6">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors mb-2"
          >
            &larr; Back to Dashboard
          </Link>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Semester {semester.semester_number}
          </h2>
        </div>
        <DeleteSemesterButton semesterId={semester.id} />
      </div>

      {/* Course Manager Client Component */}
      <CourseManager
        semesterId={semester.id}
        initialCourses={initialCourses}
      />
    </div>
  )
}
