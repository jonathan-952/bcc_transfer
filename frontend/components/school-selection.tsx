"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  useEffect(() => {

    const fetch_schools = (async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schools`)
      setSchools(res.data)
    
    })
     fetch_schools()
  }, [])

  const handleContinue = () => {
    if (selectedSchool && selectedMajor) {
      onSchoolSelected(selectedSchool, selectedMajor)
    }
  }

  const handleTargetSchool = async (value : string) => {
    console.log(selectedSchool)
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schools/${value}/majors`)
    setMajors(res.data)
  }


  return (
    <div className="flex justify-center items-start sm:items-center min-h-[calc(100vh-8rem)] py-4 sm:py-0">
      <div className="w-full max-w-2xl animate-fade-in">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-semibold text-center tracking-tight">
              Select Your Target School
            </CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Choose the university and program you want to transfer to
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="space-y-3">
              <Label htmlFor="school" className="text-base font-medium">
                Target School
              </Label>
              <Select
                value={selectedSchool}
                onValueChange={(value) => {
                  setSelectedSchool(value)
                  handleTargetSchool(value)
                  setSelectedMajor("") // Reset major when school changes
                }}
              >
                <SelectTrigger
                  id="school"
                  className="h-12 text-base border-border/60 hover:border-border transition-colors"
                >
                  <SelectValue placeholder="Choose a school..." />
                </SelectTrigger>
                <SelectContent>
                  {(schools ?? []).map(({school_name, school_id}) => (
                    <SelectItem
                      key={school_id}
                      value={school_id.toString()}
                      className="text-base py-3"
                    >
                      {school_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="major" className="text-base font-medium">
                Intended Major
              </Label>
              <Select
                value={selectedMajor}
                onValueChange={setSelectedMajor}
                disabled={!selectedSchool || majors.length === 0}
              >
                <SelectTrigger
                  id="major"
                  className="h-12 text-base border-border/60 hover:border-border transition-colors disabled:opacity-50"
                >
                  <SelectValue placeholder={!selectedSchool ? "Select a school first" : "Choose a major..."} />
                </SelectTrigger>
                <SelectContent>
                  {(majors ?? []).map(({program_name, program_id}) => (
                    <SelectItem
                      key={program_id}
                      value={program_id.toString()}
                      className="text-base py-3"
                    >
                      {program_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleContinue}
                disabled={!selectedSchool || !selectedMajor}
                className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                size="lg"
              >
                Continue to Upload Transcript
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
