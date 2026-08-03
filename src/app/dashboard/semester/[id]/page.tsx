'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CourseManager from '@/components/CourseManager'
import DeleteSemesterButton from '@/components/DeleteSemesterButton'
import { SemesterItem } from '../../page'

interface PageProps {
  params: {
    id: string
  }
}

export default function SemesterDetailPage({ params }: PageProps) {
  const router = useRouter()
  const semesterId = params.id

  const [semester, setSemester] = useState<SemesterItem | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('iitbbs_semesters')
    if (saved) {
      try {
        const semestersList: SemesterItem[] = JSON.parse(saved)
        const found = semestersList.find((s) => s.id === semesterId)
        if (found) {
          setSemester(found)
        } else {
          router.push('/dashboard')
        }
      } catch (e) {
        console.error('Error loading semester details:', e)
        router.push('/dashboard')
      }
    } else {
      router.push('/dashboard')
    }
    setIsMounted(true)
  }, [semesterId, router])

  const handleDeleteSemester = () => {
    const saved = localStorage.getItem('iitbbs_semesters')
    if (saved) {
      try {
        const semestersList: SemesterItem[] = JSON.parse(saved)
        const updated = semestersList.filter((s) => s.id !== semesterId)
        localStorage.setItem('iitbbs_semesters', JSON.stringify(updated))
      } catch (e) {
        console.error('Error deleting semester:', e)
      }
    }
    router.push('/dashboard')
  }

  if (!isMounted || !semester) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-teal-500 border-slate-700"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
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
        <DeleteSemesterButton onDeleteSemester={handleDeleteSemester} />
      </div>

      {/* Course Manager Client Component */}
      <CourseManager
        semesterId={semester.id}
        initialCourses={semester.courses}
      />
    </div>
  )
}
