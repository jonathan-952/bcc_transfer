"use client"

import { useState } from "react"
import { TranscriptUpload } from "@/components/transcript-upload"
import { SchoolSelection } from "@/components/school-selection"
import { CourseMatching } from "@/components/course-matching"
import { CreditCounter } from "@/components/credit-counter"
import { GraduationCap } from "lucide-react"

export type Course = {
  id: string
  code: string
  name: string
  credits: number
  grade?: string
}

export type TransferData = {
  courses: Course[]
  targetSchool: string
  targetMajor: string
}

export default function Page() {
  const [step, setStep] = useState<"upload" | "select" | "results">("select")
  const [transferData, setTransferData] = useState<TransferData>({
    courses: [],
    targetSchool: "",
    targetMajor: "",
  })

  const handleTranscriptParsed = (courses: Course[]) => {
    setTransferData((prev) => ({ ...prev, courses }))
    setStep("select")
  }

  const handleSchoolSelected = (school: string, major: string) => {
    setTransferData((prev) => ({ ...prev, targetSchool: school, targetMajor: major }))
    setStep("results")
  }

  const handleReset = () => {
    setTransferData({ courses: [], targetSchool: "", targetMajor: "" })
    setStep("upload")
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
            <CreditCounter transferData={transferData} />
            <CourseMatching transferData={transferData} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  )
}
