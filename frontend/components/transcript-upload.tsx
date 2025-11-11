"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react"
import axios from 'axios';

type TranscriptUploadProps = {
  onTranscriptParsed: (courses: string[], review: string[]) => void
  program_id : string
}

export function TranscriptUpload({ onTranscriptParsed, program_id }: TranscriptUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInput = async (file: File) => {
    const formData = new FormData()
    setSelectedFile(file)
    formData.append('transcript', file)
    setIsProcessing(true)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/degree/${program_id}/requirements`,
        formData,
        {
          headers: {"Content-Type": "multipart/form-data"},
        })

      onTranscriptParsed(res.data.courses, res.data.review)
    } catch (error) {
      console.error("Error processing transcript:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileInput(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type === "application/pdf") {
      handleFileInput(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex justify-center items-start sm:items-center min-h-[calc(100vh-8rem)] py-4 sm:py-0">
      <div className="w-full max-w-2xl animate-fade-in">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-semibold text-center tracking-tight">
              Upload Your Transcript
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Upload your unofficial BCC transcript in PDF format
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 sm:py-16 text-center">
                <Loader2 className="h-14 w-14 sm:h-16 sm:w-16 animate-spin text-foreground" />
                <div className="space-y-2">
                  <p className="text-base sm:text-lg font-medium text-foreground">
                    Processing your transcript...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This may take a few moments
                  </p>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`
                  relative flex flex-col items-center justify-center gap-4
                  py-12 sm:py-16 px-6 sm:px-8
                  border-2 border-dashed rounded-lg
                  cursor-pointer transition-all duration-200
                  ${isDragging
                    ? "border-foreground bg-muted/50 scale-[0.98]"
                    : "border-border/60 hover:border-border hover:bg-muted/30"
                  }
                `}
              >
                <div className={`
                  flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center
                  rounded-full transition-all duration-200
                  ${isDragging ? "bg-foreground/20 scale-110" : "bg-muted"}
                `}>
                  <Upload className={`h-8 w-8 sm:h-10 sm:w-10 transition-colors ${isDragging ? "text-foreground" : "text-muted-foreground"}`} />
                </div>

                <div className="space-y-2 text-center">
                  <p className="text-base sm:text-lg font-medium text-foreground">
                    {isDragging ? "Drop your file here" : "Drag and drop your transcript"}
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    or tap to browse files
                  </p>
                  <p className="text-xs text-muted-foreground pt-2">
                    PDF files only • Max 10MB
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 sm:h-12 px-6 sm:px-8 text-base font-medium mt-2 pointer-events-none"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Choose File
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
