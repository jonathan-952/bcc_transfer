"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Loader2 } from "lucide-react"
import type { Course } from "@/app/page"
import axios from 'axios';

type TranscriptUploadProps = {
  onTranscriptParsed: (courses: Course[]) => void
  program_id : string
}

export function TranscriptUpload({ onTranscriptParsed, program_id }: TranscriptUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [courses, setCourses] = useState([])

  const API_ROUTE = process.env.API_ROUTE


  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsProcessing(true)
      const res = await axios.put(`${API_ROUTE}/degree/${program_id}/requirements`,
        {
        transcript: file
        })
      setIsProcessing(false)
      setCourses(res.data)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardContent className="space-y-6">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div>
                  <p className="font-medium text-foreground">Processing transcript...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Drag and drop your transcript here</p>
                    <p className="text-sm text-muted-foreground">or click to browse files</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <label className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Choose File
                      <input type="file" className="hidden" accept=".pdf" onChange={handleFileInput} />
                    </label>
                  </Button>
                </div>
              </>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
