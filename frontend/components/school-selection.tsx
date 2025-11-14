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
  total_credits: number
}

type SchoolSelectionProps = {
  onSchoolSelected: (school: string, major: string, total_credits: number) => void
  onBack: () => void
} 

export function SchoolSelection({ onSchoolSelected}: SchoolSelectionProps) {
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedMajor, setSelectedMajor] = useState("")
  const [schools, setSchools] = useState<School[]>([])
  const [majors, setMajors] = useState<Major[]>([])
  const [selectedCredits, setSelectedCredits] = useState(0)


  useEffect(() => {

    const fetch_schools = (async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schools`)
      setSchools(res.data)
    
    })
     fetch_schools()
  }, [])

  const handleContinue = () => {
    if (selectedSchool && selectedMajor) {
      onSchoolSelected(selectedSchool, selectedMajor, selectedCredits)
    }
  }

  const handleTargetSchool = async (value : string) => {
    console.log(selectedSchool)
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schools/${value}/majors`)
    setMajors(res.data)
  }

return (
  <div className="flex justify-center items-center min-h-screen">
    <div className="mx-auto max-w-2xl w-full">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Select Your Target School</h2>
        </div>

        <div className="space-y-6">
          {/* Target School */}
          <div className="space-y-2">
            <Label htmlFor="school" className="text-lg font-semibold">
              Target School
            </Label>
            <Select
              value={selectedSchool}
              onValueChange={(value) => {
                setSelectedSchool(value)
                handleTargetSchool(value)
              }}
            >
              <SelectTrigger
                id="school"
                className="cursor-pointer w-full"
              >
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {(schools ?? []).map(({ school_name, school_id }) => (
                  <SelectItem key={school_name} value={school_id.toString()}>
                    {school_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Intended Major */}
          <div className="space-y-2">
            <Label htmlFor="major" className="text-lg font-semibold">
              Intended Major
            </Label>
            <Select
              value={selectedMajor}
              onValueChange={(value) => {
                setSelectedMajor(value)

                // Find the selected major from the majors array
                const chosenMajor = majors.find(
                  (m) => m.program_id.toString() === value
                )

                // Store its total credits
                if (chosenMajor) {
                  setSelectedCredits(chosenMajor.total_credits)
                }
              }}
            >
              <SelectTrigger
                id="major"
                className="cursor-pointer w-full"
              >
                <SelectValue placeholder="Select a major" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {(majors ?? []).map(({ program_name, program_id }) => (
                  <SelectItem key={program_name} value={program_id.toString()}>
                    {program_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Continue Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleContinue}
              disabled={!selectedSchool || !selectedMajor}
              className="flex-1 cursor-pointer text-md"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
)

}
