"use client"

import { useState } from "react"
import { TranscriptUpload } from "@/components/transcript-upload"
import { SchoolSelection } from "@/components/school-selection"
import { CourseMatching } from "@/components/course-matching"
import { GraduationCap } from "lucide-react"


export type TransferData = {
  courses: string[]
  review: string[]
  unfulfilled_req: number[]
  unfulfilled_group: number[]
  total_credits: number
  targetSchool: string
  targetMajor: string
}

export default function Page() {
  const [step, setStep] = useState<"upload" | "select" | "results">("select")
  const [transferData, setTransferData] = useState<TransferData>({
    courses: [],
    review: [],
    unfulfilled_req: [],
    unfulfilled_group: [],
    targetSchool: "",
    targetMajor: "",
    total_credits: 0
  })

  const handleTranscriptParsed = (courses: string[], review: string[], unfulfilled_req: number[], unfulfilled_group: number[]) => {
    setTransferData((prev) => ({ ...prev, courses, review, unfulfilled_req, unfulfilled_group}))
    setStep("results")
  }

  const handleSchoolSelected = (school: string, major: string) => {
    setTransferData((prev) => ({ ...prev, targetSchool: school, targetMajor: major }))
    setStep("upload")
  }

  const handleReset = () => {
    setTransferData({ courses: [], review: [], unfulfilled_req: [], unfulfilled_group: [], targetSchool: "", targetMajor: "", total_credits: 0})
    setStep("select")
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-12">
        {step === "upload" && <TranscriptUpload onTranscriptParsed={handleTranscriptParsed} program_id = {transferData.targetMajor} />}
        {step === "select" && (
          <SchoolSelection onSchoolSelected={handleSchoolSelected} onBack={() => setStep("upload")} />
        )}
        {step === "results" && (
          <div className="space-y-12">
            <CourseMatching transferData={transferData} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  )
}
