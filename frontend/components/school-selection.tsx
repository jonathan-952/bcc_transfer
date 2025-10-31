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

export async function SchoolSelection({ onSchoolSelected}: SchoolSelectionProps) {
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedMajor, setSelectedMajor] = useState("")
  const [schools, setSchools] = useState<School[]>([])
  const [majors, setMajors] = useState<Major[]>([])
  const API_ROUTE = process.env.API_ROUTE

  useEffect(() => {

    const fetch_schools = (async () => {
      const res = await axios.get(`${API_ROUTE}/schools`)
      setSchools(res.data)
    
    })
    

  }, [])

  const handleContinue = () => {
    if (selectedSchool && selectedMajor) {
      onSchoolSelected(selectedSchool, selectedMajor)
    }
  }

  const handleTargetSchool = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/schools/${selectedSchool}/majors`)
    setMajors(res.data)
  }


  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Select Your Target School</CardTitle>
          
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="school">Target School</Label>
            <Select value={selectedSchool} onValueChange={(value) => {
              setSelectedSchool(value)
              handleTargetSchool
            }}>
              <SelectTrigger id="school">
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                {schools.map(({school_name, school_id}) => (
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
                {majors.map(({program_name, program_id}) => (
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
  )
}
