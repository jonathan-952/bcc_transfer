"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import type { TransferData } from "@/app/page"
import { matchCourses, type MatchResult } from "@/lib/course-matcher"

type CourseMatchingProps = {
  transferData: []
  onReset: () => void
}

export function CourseMatching({ transferData, onReset }: CourseMatchingProps) {
  const matchedCourses: MatchResult[] = matchCourses(
    transferData.courses,
    transferData.targetSchool,
    transferData.targetMajor,
  )

  const fulfilledCourses = matchedCourses.filter((r) => r.transfers)
  const uncertainCourses = matchedCourses.filter((r) => !r.transfers && r.reason === "No articulation agreement found")
  const missingRequirements = matchedCourses.filter(
    (r) => !r.transfers && r.reason !== "No articulation agreement found",
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-2xl font-light tracking-tight text-foreground">Course Evaluation</h2>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-2 bg-transparent">
          <RotateCcw className="h-4 w-4" />
          Start Over
        </Button>
      </div>

      {fulfilledCourses.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-foreground">Fulfilled Requirements</h3>
            <p className="text-sm text-muted-foreground">Courses that transfer and meet degree requirements</p>
          </div>
          <div className="space-y-2">
            {fulfilledCourses.map((result) => (
              <div
                key={result.course.id}
                className="flex items-center justify-between border border-border bg-card p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {result.course.code} - {result.course.name}
                  </p>
                  {result.transfersAs && result.targetCourseName && (
                    <p className="text-sm text-muted-foreground">
                      Transfers as: {result.transfersAs} - {result.targetCourseName}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {result.course.grade && (
                    <span className="font-mono text-sm text-muted-foreground">{result.course.grade}</span>
                  )}
                  <span className="text-sm font-medium text-foreground">{result.course.credits} credits</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uncertainCourses.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-foreground">Requires Counselor Review</h3>
            <p className="text-sm text-muted-foreground">
              Courses without articulation agreements that may still transfer
            </p>
          </div>
          <div className="space-y-2">
            {uncertainCourses.map((result) => (
              <div
                key={result.course.id}
                className="flex items-center justify-between border border-border bg-muted/20 p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {result.course.code} - {result.course.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{result.reason}</p>
                </div>
                <div className="flex items-center gap-3">
                  {result.course.grade && (
                    <span className="font-mono text-sm text-muted-foreground">{result.course.grade}</span>
                  )}
                  <span className="text-sm font-medium text-foreground">{result.course.credits} credits</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {missingRequirements.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-foreground">Missing Requirements</h3>
            <p className="text-sm text-muted-foreground">Courses that do not meet transfer requirements</p>
          </div>
          <div className="space-y-2">
            {missingRequirements.map((result) => (
              <div
                key={result.course.id}
                className="flex items-center justify-between border border-border bg-card p-4 opacity-60 transition-colors hover:opacity-80"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {result.course.code} - {result.course.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{result.reason}</p>
                </div>
                <div className="flex items-center gap-3">
                  {result.course.grade && (
                    <span className="font-mono text-sm text-muted-foreground">{result.course.grade}</span>
                  )}
                  <span className="text-sm font-medium text-foreground">{result.course.credits} credits</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
