import type { Course } from "@/app/page"

export type ArticulationRule = {
  sourceCode: string
  sourceName: string
  targetCode: string
  targetName: string
  minGrade?: string
  school: string
  major?: string
}

export type MatchResult = {
  course: Course
  transfers: boolean
  transfersAs?: string
  targetCourseName?: string
  reason?: string
}

// Mock articulation agreements database
// In a real app, this would come from an API or database
const ARTICULATION_RULES: ArticulationRule[] = [
  // Math courses
  {
    sourceCode: "MATH 101",
    sourceName: "Calculus I",
    targetCode: "MATH 1A",
    targetName: "Calculus",
    minGrade: "C",
    school: "University of California, Berkeley",
  },
  {
    sourceCode: "MATH 101",
    sourceName: "Calculus I",
    targetCode: "MATH 19",
    targetName: "Calculus",
    minGrade: "C",
    school: "Stanford University",
  },
  {
    sourceCode: "MATH 101",
    sourceName: "Calculus I",
    targetCode: "18.01",
    targetName: "Single Variable Calculus",
    minGrade: "C",
    school: "MIT",
  },

  // English courses
  {
    sourceCode: "ENG 102",
    sourceName: "English Composition",
    targetCode: "ENGL 1A",
    targetName: "Reading and Composition",
    minGrade: "C",
    school: "University of California, Berkeley",
  },
  {
    sourceCode: "ENG 102",
    sourceName: "English Composition",
    targetCode: "PWR 1",
    targetName: "Writing & Rhetoric",
    minGrade: "C",
    school: "Stanford University",
  },

  // Chemistry courses
  {
    sourceCode: "CHEM 110",
    sourceName: "General Chemistry",
    targetCode: "CHEM 1A",
    targetName: "General Chemistry",
    minGrade: "C",
    school: "University of California, Berkeley",
  },
  {
    sourceCode: "CHEM 110",
    sourceName: "General Chemistry",
    targetCode: "CHEM 31A",
    targetName: "Chemical Principles",
    minGrade: "C",
    school: "Stanford University",
  },

  // Computer Science courses
  {
    sourceCode: "CS 150",
    sourceName: "Introduction to Programming",
    targetCode: "CS 61A",
    targetName: "Structure and Interpretation of Computer Programs",
    minGrade: "C",
    school: "University of California, Berkeley",
    major: "Computer Science",
  },
  {
    sourceCode: "CS 150",
    sourceName: "Introduction to Programming",
    targetCode: "CS 106A",
    targetName: "Programming Methodology",
    minGrade: "C",
    school: "Stanford University",
    major: "Computer Science",
  },

  // Physics courses
  {
    sourceCode: "PHYS 201",
    sourceName: "Physics I",
    targetCode: "PHYS 7A",
    targetName: "Physics for Scientists and Engineers",
    minGrade: "C",
    school: "University of California, Berkeley",
  },
  {
    sourceCode: "PHYS 201",
    sourceName: "Physics I",
    targetCode: "PHYS 41",
    targetName: "Mechanics",
    minGrade: "C",
    school: "Stanford University",
  },

  // Psychology courses
  {
    sourceCode: "PSYCH 101",
    sourceName: "Introduction to Psychology",
    targetCode: "PSYCH 1",
    targetName: "General Psychology",
    minGrade: "C",
    school: "University of California, Berkeley",
  },
  {
    sourceCode: "PSYCH 101",
    sourceName: "Introduction to Psychology",
    targetCode: "PSYCH 1",
    targetName: "Introduction to Psychology",
    minGrade: "C",
    school: "Stanford University",
  },

  // Biology courses
  {
    sourceCode: "BIO 120",
    sourceName: "General Biology",
    targetCode: "BIO 1A",
    targetName: "General Biology Lecture",
    minGrade: "C",
    school: "University of California, Berkeley",
  },
  {
    sourceCode: "BIO 120",
    sourceName: "General Biology",
    targetCode: "BIO 41",
    targetName: "Genetics, Biochemistry, and Molecular Biology",
    minGrade: "C",
    school: "Stanford University",
  },
]

// Grade point mapping
const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
}

function meetsGradeRequirement(earnedGrade: string | undefined, minGrade: string | undefined): boolean {
  if (!minGrade || !earnedGrade) return true

  const earnedPoints = GRADE_POINTS[earnedGrade] ?? 0
  const minPoints = GRADE_POINTS[minGrade] ?? 0

  return earnedPoints >= minPoints
}

export function matchCourses(courses: Course[], targetSchool: string, targetMajor: string): MatchResult[] {
  return courses.map((course) => {
    // Find matching articulation rule
    const rule = ARTICULATION_RULES.find(
      (r) => r.sourceCode === course.code && r.school === targetSchool && (!r.major || r.major === targetMajor),
    )

    if (!rule) {
      return {
        course,
        transfers: false,
        reason: "No articulation agreement found",
      }
    }

    // Check grade requirement
    if (!meetsGradeRequirement(course.grade, rule.minGrade)) {
      return {
        course,
        transfers: false,
        transfersAs: rule.targetCode,
        targetCourseName: rule.targetName,
        reason: `Minimum grade of ${rule.minGrade} required`,
      }
    }

    return {
      course,
      transfers: true,
      transfersAs: rule.targetCode,
      targetCourseName: rule.targetName,
    }
  })
}

export function calculateTransferCredits(matchResults: MatchResult[]): {
  transferable: number
  nonTransferable: number
  total: number
} {
  const transferable = matchResults.filter((r) => r.transfers).reduce((sum, r) => sum + r.course.credits, 0)

  const total = matchResults.reduce((sum, r) => sum + r.course.credits, 0)

  return {
    transferable,
    nonTransferable: total - transferable,
    total,
  }
}
