"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Building2, BookOpen, Loader2 } from "lucide-react"
import axios from 'axios'

interface School {
  school_id: number
  school_name: string
}

interface Major {
  program_id: number
  program_name: string
}

type SchoolSelectionProps = {
  onSchoolSelected: (school: string, major: string) => void
  onBack: () => void
}

export function SchoolSelection({ onSchoolSelected}: SchoolSelectionProps) {
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedMajor, setSelectedMajor] = useState("")
  const [schools, setSchools] = useState<School[]>([])
  const [majors, setMajors] = useState<Major[]>([])
  const [loadingSchools, setLoadingSchools] = useState(true)
  const [loadingMajors, setLoadingMajors] = useState(false)

  useEffect(() => {
    const fetch_schools = (async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schools`)
        setSchools(res.data)
      } catch (error) {
        console.error("Error fetching schools:", error)
      } finally {
        setLoadingSchools(false)
      }
    })
    fetch_schools()
  }, [])

  const handleTargetSchool = async (value : string) => {
    setLoadingMajors(true)
    setSelectedMajor("")
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schools/${value}/majors`)
      setMajors(res.data)
    } catch (error) {
      console.error("Error fetching majors:", error)
    } finally {
      setLoadingMajors(false)
    }
  }

  const handleContinue = () => {
    if (selectedSchool && selectedMajor) {
      onSchoolSelected(selectedSchool, selectedMajor)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16 sm:mb-20 px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-6">
          Plan Your Transfer Path
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto">
          Select your target school and program to see how your credits transfer
        </p>
      </div>

      {/* Main Card */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="border-b border-gray-100 pb-6 px-8 pt-8">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Transfer Details
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Choose your target institution and intended major
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* School Selection */}
          <div className="space-y-3">
            <Label htmlFor="school" className="text-base font-medium text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              Target School
            </Label>

            {loadingSchools ? (
              <div className="flex items-center justify-center h-12 bg-gray-50 rounded-lg border border-gray-200">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Loading schools...</span>
              </div>
            ) : (
              <Select
                value={selectedSchool}
                onValueChange={(value) => {
                  setSelectedSchool(value)
                  handleTargetSchool(value)
                }}
              >
                <SelectTrigger
                  id="school"
                  className="h-12 text-base border border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                >
                  <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md z-50">
                  {schools.map(({school_name, school_id}) => (
                    <SelectItem
                      key={school_id}
                      value={school_id.toString()}
                      className="text-base py-3 px-3 cursor-pointer text-gray-900 bg-white hover:bg-gray-100 focus:bg-gray-100"
                    >
                      {school_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Major Selection */}
          <div className="space-y-3">
            <Label htmlFor="major" className="text-base font-medium text-gray-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-500" />
              Intended Major
            </Label>

            {loadingMajors ? (
              <div className="flex items-center justify-center h-12 bg-gray-50 rounded-lg border border-gray-200">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Loading programs...</span>
              </div>
            ) : (
              <Select
                value={selectedMajor}
                onValueChange={setSelectedMajor}
                disabled={!selectedSchool || majors.length === 0}
              >
                <SelectTrigger
                  id="major"
                  className="h-12 text-base border border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300"
                >
                  <SelectValue placeholder={!selectedSchool ? "Select a school first" : "Select a major"} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md z-50">
                  {majors.map(({program_name, program_id}) => (
                    <SelectItem
                      key={program_id}
                      value={program_id.toString()}
                      className="text-base py-3 px-3 cursor-pointer text-gray-900 bg-white hover:bg-gray-100 focus:bg-gray-100"
                    >
                      {program_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Continue Button */}
          <div className="pt-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedSchool || !selectedMajor}
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              size="lg"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Info Note */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Make sure you have your unofficial transcript ready in PDF format before proceeding.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
