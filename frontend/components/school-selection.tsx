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
  const API_ROUTE = process.env.API_ROUTE

  useEffect(() => {

    const fetch_schools = (async () => {
      const res = await axios.get(`http://127.0.0.1:8000/schools`)
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
     <div className="flex justify-center items-center min-h-screen">
    <div className="mx-auto max-w-2xl w-full">
          <Card className="p-5">
            <CardHeader>
              <CardTitle className="flex justify-center text-2xl">Select Your Target School</CardTitle>
              
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="school">Target School</Label>
                <Select value={selectedSchool} onValueChange={(value) => {
                  setSelectedSchool(value)
                  handleTargetSchool(value)
                }}>
                  <SelectTrigger id="school">
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                  <SelectContent>
                    {(schools ?? []).map(({school_name, school_id}) => (
                      <SelectItem key={school_name} value={school_id.toString()}>
                        {school_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Intended Major</Label>
                <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                  <SelectTrigger id="major">
                    <SelectValue placeholder="Select a major" />
                  </SelectTrigger>
                  <SelectContent>
                    {(majors ?? []).map(({program_name, program_id}) => (
                      <SelectItem key={program_name} value={program_id.toString()}>
                        {program_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleContinue} disabled={!selectedSchool || !selectedMajor} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
     </div>
    
  )
}
