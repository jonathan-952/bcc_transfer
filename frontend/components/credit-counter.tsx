"use client"

import type { TransferData } from "@/app/page"
import { matchCourses, calculateTransferCredits } from "@/lib/course-matcher"

type CreditCounterProps = {
  transferData: TransferData
}

export function CreditCounter({ transferData }: CreditCounterProps) {
  const matchResults = matchCourses(transferData.courses, transferData.targetSchool, transferData.targetMajor)
  const { transferable: transferableCredits } = calculateTransferCredits(matchResults)

  const typicalRequirement = 60

  return (
    <div className="space-y-2 border-b border-border pb-8">
      <div className="flex items-baseline gap-3">
        <span className="text-7xl font-light tracking-tight text-foreground">{transferableCredits}</span>
        <span className="text-3xl font-light text-muted-foreground">/ {typicalRequirement}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Credits transferring to {transferData.targetMajor} at {transferData.targetSchool}
      </p>
    </div>
  )
}
