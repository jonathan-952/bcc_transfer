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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              onClick={handleReset}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="bg-blue-600 rounded-lg p-2">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900">
                  BCC Transfer
                </h1>
              </div>
            </button>

            {/* Progress Steps - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {["select", "upload", "results"].map((s, idx) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`
                    flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors
                    ${step === s
                      ? "bg-blue-600 text-white"
                      : (idx < ["select", "upload", "results"].indexOf(step)
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-400")
                    }
                  `}>
                    {idx + 1}
                  </div>
                  {idx < 2 && <div className="h-px w-8 bg-gray-200" />}
                </div>
              ))}
            </div>

            {/* Progress Dots - Mobile */}
            <div className="flex md:hidden items-center gap-1.5">
              {["select", "upload", "results"].map((s, idx) => (
                <div key={s} className={`
                  h-1.5 rounded-full transition-all
                  ${step === s
                    ? "bg-blue-600 w-6"
                    : (idx < ["select", "upload", "results"].indexOf(step)
                      ? "bg-emerald-600 w-1.5"
                      : "bg-gray-300 w-1.5")
                  }
                `} />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="transition-opacity duration-300">
          {step === "upload" && <TranscriptUpload onTranscriptParsed={handleTranscriptParsed} program_id = {transferData.targetMajor} />}
          {step === "select" && (
            <SchoolSelection onSchoolSelected={handleSchoolSelected} onBack={() => setStep("upload")} />
          )}
          {step === "results" && (
            <CourseMatching transferData={transferData} onReset={handleReset} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 sm:mt-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 BCC Transfer Assistant</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
