"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileInput = async (file: File) => {
    const formData = new FormData()
    setSelectedFile(file)
    formData.append('transcript', file)
    setIsProcessing(true)
    setUploadProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/degree/${program_id}/requirements`,
        formData,
        {
          headers: {"Content-Type": "multipart/form-data"},
        })

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Show success state briefly
      setTimeout(() => {
        onTranscriptParsed(res.data.courses, res.data.review)
      }, 800)
    } catch (error) {
      clearInterval(progressInterval)
      console.error("Error processing transcript:", error)
      setIsProcessing(false)
      setUploadProgress(0)
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
    if (!isProcessing) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16 sm:mb-20 px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-6">
          Upload Your Transcript
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto">
          Upload your PDF transcript to analyze your transfer credits
        </p>
      </div>

      {/* Main Card */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="border-b border-gray-100 pb-6 px-8 pt-8">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Document Upload
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Upload your unofficial BCC transcript in PDF format
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          {isProcessing ? (
            <div className="space-y-8 py-12">
              {/* Processing State */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  {uploadProgress < 100 ? (
                    <div className="bg-blue-600 rounded-full p-6">
                      <Loader2 className="h-12 w-12 sm:h-14 sm:w-14 animate-spin text-white" />
                    </div>
                  ) : (
                    <div className="bg-emerald-600 rounded-full p-6">
                      <CheckCircle2 className="h-12 w-12 sm:h-14 sm:w-14 text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-8">
                  <p className="text-xl font-semibold text-gray-900">
                    {uploadProgress < 100 ? "Processing transcript..." : "Success!"}
                  </p>
                  <p className="text-sm text-gray-600 max-w-md">
                    {uploadProgress < 100
                      ? "Analyzing your courses and matching with degree requirements"
                      : "Your transcript has been analyzed successfully"}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        uploadProgress < 100 ? "bg-blue-600" : "bg-emerald-600"
                      }`}
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>

                {selectedFile && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md w-full">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 p-2 bg-white rounded-lg border border-gray-200">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className="cursor-pointer"
              >
                <div className={`
                  flex flex-col items-center justify-center
                  py-16 sm:py-20 px-6
                  border-2 border-dashed rounded-lg transition-colors
                  ${isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                  }
                `}>
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="bg-blue-600 rounded-lg p-4">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-2 text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {isDragging ? "Drop your file here" : "Drag and drop your transcript"}
                    </p>
                    <p className="text-base text-gray-600">
                      or click to browse files
                    </p>
                    <p className="text-sm text-gray-500 pt-2">
                      PDF files only • Max 10MB
                    </p>
                  </div>

                  {/* Hidden Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Info Note */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Your transcript is processed securely and is not stored permanently.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
