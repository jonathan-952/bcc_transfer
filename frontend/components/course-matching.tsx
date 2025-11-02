"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import type { TransferData } from "@/app/page"

type CourseMatchingProps = {
  transferData: TransferData
  onReset: () => void
}

export function CourseMatching({ transferData, onReset }: CourseMatchingProps) {
  console.log(transferData)

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
          <div>
            <h3 className="text-lg font-medium text-foreground">Fulfilled Requirements</h3>
            <p className="text-sm text-muted-foreground">Courses that transfer and meet degree requirements</p>
          </div>
          <div className="space-y-2">
            {transferData.courses.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-border bg-card p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {result}
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
          <div className="space-y-2">
            {transferData.review.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {result}
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
