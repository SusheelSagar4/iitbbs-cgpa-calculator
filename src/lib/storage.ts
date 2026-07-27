import { getCurriculumForBranch, CourseDefinition } from '@/data/coursesData'

export interface LocalCourse {
  id: string
  code: string
  name: string
  credits: number
  grade: string
}

export interface LocalSemester {
  id: string
  semester_number: number
  courses: LocalCourse[]
}

export interface TrackerData {
  branchId: string
  semesters: LocalSemester[]
}

const STORAGE_KEY = 'iitbbs_academic_tracker_v1'

/**
 * Retrieves tracker data from localStorage.
 */
export function getLocalTrackerData(): TrackerData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as TrackerData
  } catch (err) {
    console.error('Error reading from localStorage:', err)
    return null
  }
}

/**
 * Saves tracker data to localStorage.
 */
export function saveLocalTrackerData(data: TrackerData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Error saving to localStorage:', err)
  }
}

/**
 * Clears tracker data from localStorage.
 */
export function clearLocalTrackerData(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('Error clearing localStorage:', err)
  }
}

/**
 * Generates initial 8-semester curriculum for a branch and saves it locally.
 */
export function initializeLocalCurriculum(branchId: string): TrackerData {
  const officialCourses: CourseDefinition[] = getCurriculumForBranch(branchId)

  // Group courses by semester (1 to 8)
  const semMap = new Map<number, LocalCourse[]>()
  for (let i = 1; i <= 8; i++) {
    semMap.set(i, [])
  }

  officialCourses.forEach((c) => {
    const semList = semMap.get(c.semester) || []
    semList.push({
      id: `${branchId}-sem${c.semester}-${c.code}`,
      code: c.code,
      name: `${c.code}: ${c.name}`,
      credits: c.credits,
      grade: 'N/A',
    })
    semMap.set(c.semester, semList)
  })

  const semesters: LocalSemester[] = []
  for (let i = 1; i <= 8; i++) {
    semesters.push({
      id: `sem-${i}`,
      semester_number: i,
      courses: semMap.get(i) || [],
    })
  }

  const trackerData: TrackerData = {
    branchId,
    semesters,
  }

  saveLocalTrackerData(trackerData)
  return trackerData
}
