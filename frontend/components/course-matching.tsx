"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import type { TransferData } from "@/app/page"
import { useState, useEffect} from "react"
import axios from "axios"

type CourseMatchingProps = {
  transferData: TransferData
  onReset: () => void
}

type Course = {
  credits: number
  course_code : string
  course_title : string
}

export function CourseMatching({ transferData, onReset }: CourseMatchingProps) {
  const [courses, setCourses] = useState <Course[]>([])
  const [review, setReview] = useState <Course[]>([])
  const [totalCredits, setTotalCredits] = useState(0)

  useEffect(() => {
    const get_courses = (async () => {
      const res = await axios.post<[Course[], Course[]]>('http://127.0.0.1:8000/courses',
        {
          courses: transferData.courses, 
          review_courses: transferData.review
        }
        
      )

      const uniqueCourses = Array.from(
  new Map(res.data[0].map(c => [c.course_code, c])).values()
);
      const credits = uniqueCourses.reduce(
        (sum, course) => sum + course.credits, 0)

      setTotalCredits(credits)
      setCourses(res.data[0])
      setReview(res.data[1])
    })
    get_courses()
  }, [])

return (
  <div className="space-y-8">
    <div className="flex items-center justify-between border-b border-border pb-4">
      <h2 className="text-2xl font-light tracking-tight text-foreground">Course Evaluation</h2>
      <Button variant="outline" size="sm" onClick={onReset} className="gap-2 bg-transparent">
        <RotateCcw className="h-4 w-4" />
        Start Over
      </Button>
    </div>

    {transferData.courses.length > 0 && (
      <div className="space-y-4">
        <div className="flex items-center gap-5 justify-end"> 
          <h2 className="text-xl text-foreground">Credits:</h2>
          <h1 className="text-5xl font-semibold text-foreground">
            {totalCredits} / 60
          </h1>
        </div>

        <div>
          <h3 className="text-lg font-medium text-foreground">Fulfilled Requirements</h3>
          <p className="text-sm text-muted-foreground">Courses that transfer and meet degree requirements</p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {transferData.courses.map((course, index) => (
            <div
              key={index}
              className="flex items-center justify-between border border-border bg-card p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex gap-5 justify-between w-full items-center">
                <p className="text-sm text-foreground">{course}</p>
                <p className="font-medium text-foreground">
                  {courses.find(c => c.course_code === course)?.course_title || '-'}
                </p>
                <p className="text-sm text-foreground">
                  {courses.find(c => c.course_code === course)?.credits || '-'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {transferData.review.length > 0 && (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">Requires Counselor Review</h3>
          <p className="text-sm text-muted-foreground">
            Transfer classes without articulation agreements or may satisfy some elective requirement
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-2">
          {transferData.review.map((course, index) => (
            <div
              key={index}
              className="flex justify-between border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40 h-full rounded-lg items-center"
            >
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-foreground">{course}</p>
                <p className="font-medium text-foreground text-center flex-1 mx-4">
                  {review.find((c) => c.course_code === course)?.course_title || '-'}
                </p>
                <p className="text-sm text-foreground">
                  {review.find((c) => c.course_code === course)?.credits || '-'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)
}
