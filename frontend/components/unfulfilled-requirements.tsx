"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import axios from "axios"
import { TransferData } from "@/app/page"

type CourseMatchingProps = {
  transferData: TransferData
  onReset: () => void
}

type SingleRequirement = {
  courses: string
  credits: number
  requirement_id: number
}

type GroupRequirement = {
  group_id: number
  groups: {
    courses: string
    credits: number
    group_count: number
  } 
}


export function UnfulfilledRequirements({ transferData, onReset }: CourseMatchingProps) {
  const [selectedRequirement, setSelectedRequirement] = useState<{
    type: "single" | "group"
    data: SingleRequirement | GroupRequirement
  } | null>(null)
  const [singleRequirements, setSingleRequirements] = useState<SingleRequirement[]>([])
  const [groupRequirements, setGroupRequirements] = useState<GroupRequirement[]>([])
  
  useEffect(() => {
    const get_requirements = async () => {

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/unfulfilled`, 
        {params: {
          single: transferData.unfulfilled_req,
          group: transferData.unfulfilled_group
        },
        paramsSerializer: {
          indexes: null
        },
      })
      console.log(res.data)
      setGroupRequirements(res.data[0])
      setSingleRequirements(res.data[1])

    }

    get_requirements()

  },[])



  return (
    <div className="space-y-8">

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">Unfulfilled Requirements</h3>
          <p className="text-sm text-muted-foreground">Degree requirements that still need to be completed</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {singleRequirements && singleRequirements.map((requirement, index) => (
            <div
              key={index}
              onClick={() => setSelectedRequirement({ type: "single", data: requirement })}
              className="flex items-center justify-between bg-white border-2 border-black p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
            >
              {requirement.courses.split(',').length == 1 ? 
              <div className="flex gap-3 justify-between w-full items-center">
                <p className="text-sm font-semibold text-foreground">{requirement.courses}</p>
                <p className="text-sm font-semibold text-foreground">{requirement.credits}</p>
              </div>
               :
              <div className="flex gap-3 justify-between w-full items-center">
                <p className="text-sm font-semibold text-foreground">Choose 1 of the next {requirement.courses.split(',').length} courses</p>
                <p className="text-sm font-semibold text-foreground">{requirement.credits}</p>
              </div>
              }
            </div>
             
          ))}
        </div>
      </div>

      {/* <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">Group Requirements</h3>
          <p className="text-sm text-muted-foreground">Choose from multiple course options to fulfill requirements</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {groupRequirements.map((groupReq, index) => (
            <div
              key={index}
              onClick={() => setSelectedRequirement({ type: "group", data: groupReq })}
              className="bg-white border-2 border-black p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
            >
              <p className="text-sm text-muted-foreground">Choose {groupReq.description} out of the next </p>
            </div>
          ))}
        </div>
      </div>

      {selectedRequirement && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={() => setSelectedRequirement(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-[90%] max-w-2xl max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border p-6 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {selectedRequirement.type === "single"
                    ? (selectedRequirement.data as UnfulfilledRequirement).title
                    : (selectedRequirement.data as GroupRequirement).title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedRequirement.type === "single"
                    ? "Choose one of the following courses to fulfill this requirement"
                    : (selectedRequirement.data as GroupRequirement).description}
                </p>
              </div>
              <button
                onClick={() => setSelectedRequirement(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {selectedRequirement.type === "single" ? (
                <div className="space-y-3">
                  {(selectedRequirement.data as UnfulfilledRequirement).options.map((option, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white border-2 border-black p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
                    >
                      <div className="flex gap-3 justify-between w-full items-center">
                        <p className="text-sm font-semibold text-foreground">{option.code}</p>
                        <p className="font-medium text-foreground text-center flex-1">{option.title}</p>
                        <p className="text-sm font-semibold text-foreground">{option.credits}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {(selectedRequirement.data as GroupRequirement).groups.map((group, idx) => (
                    <div key={idx} className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                        {group.name}
                      </h3>
                      <div className="space-y-3">
                        {group.options.map((option, optIdx) => (
                          <div
                            key={optIdx}
                            className="flex items-center justify-between bg-white border-2 border-black p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105"
                          >
                            <div className="flex gap-3 justify-between w-full items-center">
                              <p className="text-sm font-semibold text-foreground">{option.code}</p>
                              <p className="font-medium text-foreground text-center flex-1">{option.title}</p>
                              <p className="text-sm font-semibold text-foreground">{option.credits}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  )
}
