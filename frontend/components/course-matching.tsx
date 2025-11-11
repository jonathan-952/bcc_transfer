"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw, CheckCircle2, AlertCircle } from "lucide-react"
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const get_courses = (async () => {
      setIsLoading(true)
      try {
        const res = await axios.post<[Course[], Course[]]>(`${process.env.NEXT_PUBLIC_API_URL}/courses`,
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
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setIsLoading(false)
      }
    })
    get_courses()
  }, [])

  const creditsPercentage = Math.round((totalCredits / 60) * 100)

return (
  <div className="space-y-6 sm:space-y-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/50">
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Transfer Evaluation
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review your course matches and transfer credits
        </p>
      </div>
      <Button
        variant="outline"
        size="default"
        onClick={onReset}
        className="gap-2 h-10 sm:h-11 w-full sm:w-auto"
      >
        <RotateCcw className="h-4 w-4" />
        Start Over
      </Button>
    </div>

    {/* Credits Summary Card */}
    <Card className="border-border/50 shadow-sm bg-gradient-to-br from-card to-muted/20">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="space-y-2">
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Transfer Credits
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tabular-nums">
                {totalCredits}
              </span>
              <span className="text-2xl sm:text-3xl text-muted-foreground">
                / 60
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {creditsPercentage}% of required credits
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md">
            <div className="h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-500 ease-out"
                style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Fulfilled Requirements Section */}
    {transferData.courses.length > 0 && (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-foreground mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
              Fulfilled Requirements
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {transferData.courses.length} {transferData.courses.length === 1 ? 'course' : 'courses'} that transfer and meet degree requirements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {transferData.courses.map((course, index) => {
            const courseData = courses.find(c => c.course_code === course)
            return (
              <Card
                key={index}
                className="border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-mono font-semibold text-foreground">
                        {course}
                      </span>
                      <span className="text-sm font-semibold text-foreground bg-muted px-2 py-1 rounded flex-shrink-0">
                        {courseData?.credits || '-'} cr
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                      {courseData?.course_title || 'Loading...'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )}

    {/* Review Section */}
    {transferData.review.length > 0 && (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
              Requires Counselor Review
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {transferData.review.length} {transferData.review.length === 1 ? 'course' : 'courses'} that may satisfy elective requirements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {transferData.review.map((course, index) => {
            const courseData = review.find((c) => c.course_code === course)
            return (
              <Card
                key={index}
                className="border-border/50 hover:border-border transition-all duration-200 hover:shadow-md group bg-muted/30"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-mono font-semibold text-foreground">
                        {course}
                      </span>
                      <span className="text-sm font-semibold text-foreground bg-background px-2 py-1 rounded flex-shrink-0">
                        {courseData?.credits || '-'} cr
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                      {courseData?.course_title || 'Loading...'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )}
  </div>
)
}
