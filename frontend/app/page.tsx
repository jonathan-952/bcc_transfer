"use client"

import { useState } from "react"
import { TranscriptUpload } from "@/components/transcript-upload"
import { SchoolSelection } from "@/components/school-selection"
import { CourseMatching } from "@/components/course-matching"
import { GraduationCap } from "lucide-react"


export type TransferData = {
  courses: string[]
  review: string[]
  total_credits: number
  targetSchool: string
  targetMajor: string
}

export default function Page() {
  const [step, setStep] = useState<"upload" | "select" | "results">("select")
  const [transferData, setTransferData] = useState<TransferData>({
    courses: [],
    review: [],
    targetSchool: "",
    targetMajor: "",
    total_credits: 0
  })

  const handleTranscriptParsed = (courses: string[], review: string[]) => {
    setTransferData((prev) => ({ ...prev, courses, review}))
    setStep("results")
  }

  const handleSchoolSelected = (school: string, major: string) => {
    setTransferData((prev) => ({ ...prev, targetSchool: school, targetMajor: major }))
    setStep("upload")
  }

  const handleReset = () => {
    setTransferData({ courses: [], review: [], targetSchool: "", targetMajor: "", total_credits: 0})
    setStep("select")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-foreground" />
              <div className="flex flex-col">
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                  BCC Transfer
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Evaluate Your Transfer Prospects
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`h-2 w-2 rounded-full transition-colors ${step === "select" ? "bg-foreground" : "bg-muted"}`} />
              <div className={`h-2 w-2 rounded-full transition-colors ${step === "upload" ? "bg-foreground" : "bg-muted"}`} />
              <div className={`h-2 w-2 rounded-full transition-colors ${step === "results" ? "bg-foreground" : "bg-muted"}`} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="transition-all duration-300 ease-in-out">
          {step === "upload" && <TranscriptUpload onTranscriptParsed={handleTranscriptParsed} program_id = {transferData.targetMajor} />}
          {step === "select" && (
            <SchoolSelection onSchoolSelected={handleSchoolSelected} onBack={() => setStep("upload")} />
          )}
          {step === "results" && (
            <CourseMatching transferData={transferData} onReset={handleReset} />
          )}
        </div>
      </main>
    </div>
  )
}
