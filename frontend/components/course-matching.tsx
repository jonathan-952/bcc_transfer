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
  const fulfilledCount = transferData.courses.length
  const reviewCount = transferData.review.length

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center px-4 mb-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-6">
          Transfer Evaluation
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Here's how your BCC credits transfer to your target university
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-1">
              {totalCredits}
            </p>
            <p className="text-sm text-gray-600">Transfer Credits</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-1">
              {creditsPercentage}%
            </p>
            <p className="text-sm text-gray-600">Complete</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-1">
              {fulfilledCount}
            </p>
            <p className="text-sm text-gray-600">Fulfilled</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-1">
              {reviewCount}
            </p>
            <p className="text-sm text-gray-600">Review</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Credit Progress
              </h3>
              <span className="text-sm font-medium text-gray-600">
                {totalCredits} / 60 credits
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-1000"
                style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fulfilled Requirements */}
      {transferData.courses.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Fulfilled Requirements
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  {fulfilledCount} {fulfilledCount === 1 ? 'course' : 'courses'} that meet degree requirements
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="default"
              onClick={onReset}
              className="gap-2 border-gray-300 hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Start Over</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {transferData.courses.map((course, index) => {
              const courseData = courses.find(c => c.course_code === course)
              return (
                <Card key={index} className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-sm font-semibold font-mono rounded">
                          {course}
                        </span>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded">
                          {courseData?.credits || '-'} cr
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 leading-relaxed min-h-[40px]">
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
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-amber-600" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Requires Counselor Review
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {reviewCount} {reviewCount === 1 ? 'course' : 'courses'} that may satisfy elective requirements
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {transferData.review.map((course, index) => {
              const courseData = review.find((c) => c.course_code === course)
              return (
                <Card key={index} className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 text-sm font-semibold font-mono rounded">
                          {course}
                        </span>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded">
                          {courseData?.credits || '-'} cr
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 leading-relaxed min-h-[40px]">
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

      {/* Next Steps */}
      <Card className="border border-gray-200 bg-gray-50 shadow-sm">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Next Steps
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Schedule a meeting with your academic advisor to discuss your evaluation results and plan your remaining coursework.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white h-11"
            >
              Contact Advisor
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onReset}
              className="border-gray-300 hover:bg-white h-11"
            >
              New Evaluation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
