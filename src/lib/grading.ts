export const GRADE_POINTS = {
  EX: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  P: 5,
  F: 0,
} as const;

export type Grade = keyof typeof GRADE_POINTS;

export interface Course {
  name: string;
  credits: number;
  grade: Grade | 'N/A' | string;
}

export function calculateSGPA(courses: Course[]): number {
  let totalCredits = 0;
  let totalWeightedPoints = 0;

  for (const course of courses) {
    if (course.grade in GRADE_POINTS) {
      const validGrade = course.grade as Grade;
      totalCredits += course.credits;
      totalWeightedPoints += course.credits * GRADE_POINTS[validGrade];
    }
  }

  if (totalCredits === 0) return 0;

  return Math.round((totalWeightedPoints / totalCredits) * 100) / 100;
}

export function calculateCGPA(semesters: { sgpa: number; totalCredits: number }[]): number {
  let totalCredits = 0;
  let totalWeightedSGPA = 0;

  for (const semester of semesters) {
    if (semester.sgpa > 0 && semester.totalCredits > 0) {
      totalCredits += semester.totalCredits;
      totalWeightedSGPA += semester.sgpa * semester.totalCredits;
    }
  }

  if (totalCredits === 0) return 0;

  return Math.round((totalWeightedSGPA / totalCredits) * 100) / 100;
}
