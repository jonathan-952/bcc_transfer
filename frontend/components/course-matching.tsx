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

  useEffect(() => {
    const get_courses = (async () => {
      const res = await axios.post('http://127.0.0.1:8000/courses',
        {
          courses: transferData.courses, 
          review_courses: transferData.review
        }
        
      )
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
          <div className="flex items-end gap-5 justify-end"> 
             <h2 className="flex justify-items-end text-xl">Credits: </h2>
              <h1 className="flex justify-self-end text-5xl">{transferData.total_credits} / 60</h1>
          </div>
         
  
          <div>
            <h3 className="text-lg font-medium text-foreground">Fulfilled Requirements</h3>
            <p className="text-sm text-muted-foreground">Courses that transfer and meet degree requirements</p>
          </div>
          <div className="space-y-2 flex flex-wrap gap-5">
            {transferData.courses.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-border bg-card p-4 transition-colors hover:bg-muted/30 w-sm"
              >
                <div className="flex gap-5 justify-between w-full items-center">
                  <p className="font-sm text-foreground">
                    {course}
                  </p>
                  <p className="font-medium text-foreground">
                      {courses.find(c => c.course_code == course)?.course_title || '-'}
                  </p>
                   <p className="font-sm text-foreground">
                      {courses.find(c => c.course_code == course)?.credits || '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {transferData.review.length > 0 && (
        <div className="space-y-4  flex flex-wrap gap-5">
          <div>
            <h3 className="text-lg font-medium text-foreground">Requires Counselor Review</h3>
            <p className="text-sm text-muted-foreground">
              Transfer classes without articulation agreements or may satisfy some elective requirement
            </p>
          </div>
          <div className="space-y-2 flex flex-wrap gap-5">
            {transferData.review.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40 w-sm"
              >
                <div className="flex gap-5 justify-between w-full items-center">
                  <p className="font-sm text-foreground">
                    {course}
                  </p>
                  <p className="font-medium text-foreground">
                    {review.find(c => c.course_code == course)?.course_title || '-'}
                  </p>
                  <p className="font-sm text-foreground">
                     {review.find(c => c.course_code == course)?.credits|| '-'}
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
