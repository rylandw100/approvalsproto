import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useState } from "react"

interface ApprovalDetailProps {
  selectedItem: number | null
  selectedItems: Set<number>
  onClearSelection: () => void
  page?: "approvals" | "tasks"
}

export function ApprovalDetail({ selectedItem, selectedItems, onClearSelection, page = "approvals" }: ApprovalDetailProps) {
  const [activeTab, setActiveTab] = useState("Overview")
  
  // Helper function to get display category name
  const getDisplayCategory = (category: string) => {
    if (page === "approvals" && category.startsWith("Approvals - ")) {
      return category.replace("Approvals - ", "")
    }
    return category
  }
  
  // Sample approval data
  const approvalData: Record<number, any> = {
    1: {
      requestor: "Kristine Young",
      subject: "Request to update Stephanie Perkins' target annual bonus",
      category: "Approvals - HR Management",
      summary: "Kristine Young is requesting to update Stephanie Perkins' target annual bonus from $100,000 to $110,000. No reason was provided. If approved this change will be made immediately.",
      employee: {
        name: "Stephanie Perkins",
        role: "Account Executive",
        status: "Full Time",
        location: "United States"
      },
      fieldName: "Target annual bonus",
      changes: {
        current: "$100,000",
        new: "$110,000",
        amount: "+$10,000"
      },
      note: "Position: Account Executive · Full time employee in the United States. The requested annual bonus falls within the range for Sales, United States, Management-7.",
      warning: "Exceeds the approved band",
      comments: [
        { id: 1, author: "John Smith", text: "This seems reasonable given the performance metrics.", timestamp: "2 hours ago" },
        { id: 2, author: "Sarah Wilson", text: "Need to verify the budget allocation first.", timestamp: "1 hour ago" }
      ]
    },
    2: {
      requestor: "Thomas Bennett",
      subject: "Request to reimburse $72.41 for Uber",
      category: "Approvals - Reimbursements",
      summary: "Thomas Bennett submitted an expense request for $72.41 for Uber transportation. This expense appears to be related to business travel.",
      employee: {
        name: "Thomas Bennett",
        role: "Sales Manager",
        status: "Full Time",
        location: "New York, USA"
      },
      vendor: {
        name: "Uber"
      },
      entity: "Acme Corp",
      purchaseDate: "Oct 25, 2024",
      changes: {
        current: "$0",
        new: "$72.41",
        amount: "$72.41"
      },
      note: "Receipt has been attached. Expense is within policy limits.",
      warning: "Potential duplicate detected",
      comments: [
        { id: 1, author: "Mike Johnson", text: "I've seen similar Uber charges this month.", timestamp: "30 min ago" }
      ],
      trip: {
        name: "Conference in Phoenix",
        linked: true
      }
    },
    3: {
      requestor: "Madeline Hernandez",
      subject: "Request to reimburse $595.49 for Hilton Hotel",
      category: "Approvals - Reimbursements",
      summary: "Madeline Hernandez submitted a hotel reimbursement request for $595.49 for Hilton Hotel stay during a conference.",
      employee: {
        name: "Madeline Hernandez",
        role: "Marketing Director",
        status: "Full Time",
        location: "Los Angeles, USA"
      },
      vendor: {
        name: "Hilton Hotel"
      },
      entity: "Acme Corp",
      purchaseDate: "Oct 20, 2024",
      changes: {
        current: "$0",
        new: "$595.49",
        amount: "$595.49"
      },
      note: "Hotel receipt attached. Conference dates confirmed."
    },
    4: {
      requestor: "Sarah Johnson",
      subject: "Request to log 13h 57m from Oct 26 - 27",
      category: "Approvals - Time and Attendance",
      summary: "Sarah Johnson is requesting to log 13 hours and 57 minutes of work time from October 26-27. This exceeds the standard 12-hour limit.",
      employee: {
        name: "Sarah Johnson",
        role: "Software Engineer",
        status: "Full Time",
        location: "Seattle, USA"
      },
      startTime: "9:00 AM",
      endTime: "10:57 PM",
      officeLocation: "Seattle Office",
      numberOfBreaks: "2",
      changes: {
        current: "0h 0m",
        new: "13h 57m",
        amount: "13h 57m"
      },
      note: "Time tracking shows overtime work on project deadline. Manager approval required for hours exceeding 12.",
      warning: "Exceeds 12 hours",
      comments: []
    },
    5: {
      requestor: "Michael Chen",
      subject: "Request to update Jennifer Lee's salary",
      category: "Approvals - HR Management",
      summary: "Michael Chen is requesting to update Jennifer Lee's salary from $85,000 to $92,000 based on performance review.",
      employee: {
        name: "Jennifer Lee",
        role: "Product Manager",
        status: "Full Time",
        location: "San Francisco, USA"
      },
      fieldName: "Salary",
      changes: {
        current: "$85,000",
        new: "$92,000",
        amount: "+$7,000"
      },
      note: "Performance review completed. Salary increase within approved range for Product Manager role.",
      comments: []
    },
    6: {
      requestor: "Emily Rodriguez",
      subject: "Request to reimburse $45.20 for parking",
      category: "Approvals - Reimbursements",
      summary: "Emily Rodriguez submitted a parking expense request for $45.20 for client meeting parking.",
      employee: {
        name: "Emily Rodriguez",
        role: "Account Manager",
        status: "Full Time",
        location: "Chicago, USA"
      },
      vendor: {
        name: "Downtown Parking"
      },
      entity: "Acme Corp",
      purchaseDate: "Oct 28, 2024",
      changes: {
        current: "$0",
        new: "$45.20",
        amount: "$45.20"
      },
      note: "Parking receipt attached. Client meeting confirmed for downtown location.",
      comments: [
        { id: 1, author: "Lisa Chen", text: "Client meeting was productive, expense justified.", timestamp: "15 min ago" }
      ]
    },
    7: {
      requestor: "David Park",
      subject: "Request to log 8h 30m from Oct 25",
      category: "Approvals - Time and Attendance",
      summary: "David Park is requesting to log 8 hours and 30 minutes of work time from October 25.",
      employee: {
        name: "David Park",
        role: "Designer",
        status: "Full Time",
        location: "Austin, USA"
      },
      startTime: "9:00 AM",
      endTime: "5:30 PM",
      officeLocation: "Austin Office",
      numberOfBreaks: "1",
      changes: {
        current: "0h 0m",
        new: "8h 30m",
        amount: "8h 30m"
      },
      note: "Standard work hours logged. No overtime required.",
      comments: []
    },
    8: {
      requestor: "Lisa Thompson",
      subject: "Request to update Robert Wilson's benefits",
      category: "Approvals - HR Management",
      summary: "Lisa Thompson is requesting to update Robert Wilson's health insurance benefits to premium coverage.",
      employee: {
        name: "Robert Wilson",
        role: "Senior Developer",
        status: "Full Time",
        location: "Denver, USA"
      },
      fieldName: "Health insurance benefits",
      changes: {
        current: "Standard",
        new: "Premium",
        amount: "+$200/month"
      },
      note: "Employee requested premium coverage due to family health needs. Cost exceeds standard benefit allocation.",
      warning: "Exceeds the approved band",
      comments: []
    },
    // Task data (for Inbox/Tasks page)
    101: {
      requestor: "HR Team",
      subject: "Take required cybersecurity course for Q4 certification",
      category: "Training",
      summary: "You are required to complete the Cybersecurity Fundamentals course as part of Q4 certification requirements. This course covers essential security practices and must be completed before November 15, 2024.",
      courseName: "Cybersecurity Fundamentals",
      dueDate: "Nov 15, 2024",
      estimatedDuration: "3 hours",
      note: "This is a mandatory training course for all employees. The course can be accessed through the learning portal and must be completed during business hours.",
      employee: {
        name: "You",
        role: "Employee",
        status: "Full Time",
        location: "Current Location"
      }
    },
    102: {
      requestor: "Legal Department",
      subject: "Sign updated company policy document",
      category: "Documents",
      summary: "The Legal Department requires you to review and sign the updated Employee Handbook 2024. This document contains important policy updates and must be signed by October 30, 2024.",
      documentName: "Employee Handbook 2024",
      dueDate: "Oct 30, 2024",
      note: "Please review all sections carefully, particularly the updates to the code of conduct and remote work policies. Electronic signature is acceptable.",
      employee: {
        name: "You",
        role: "Employee",
        status: "Full Time",
        location: "Current Location"
      }
    },
    103: {
      requestor: "Onboarding Team",
      subject: "Take new hire Alex Martinez out to lunch",
      category: "Team Building",
      summary: "Alex Martinez joined the team as a Software Engineer this week. Please take them out to lunch to help them feel welcome and integrated into the team. This is an important part of our onboarding process.",
      newHireName: "Alex Martinez",
      newHireRole: "Software Engineer",
      suggestedDate: "This week",
      note: "Expenses up to $50 per person will be reimbursed. Please submit receipt for reimbursement. Suggested locations include nearby restaurants within walking distance of the office.",
      employee: {
        name: "Alex Martinez",
        role: "Software Engineer",
        status: "Full Time",
        location: "Office Location"
      }
    },
    104: {
      requestor: "HR Team",
      subject: "Complete leadership development course",
      category: "Training",
      summary: "You have been selected to participate in the Leadership Essentials development program. This course is designed to enhance leadership skills and prepare you for management opportunities.",
      courseName: "Leadership Essentials",
      dueDate: "Dec 1, 2024",
      estimatedDuration: "8 hours",
      note: "This course includes both online modules and an in-person workshop. The course is self-paced but must be completed by the due date. Materials will be provided through the learning portal.",
      employee: {
        name: "You",
        role: "Employee",
        status: "Full Time",
        location: "Current Location"
      }
    },
    105: {
      requestor: "Legal Department",
      subject: "Sign non-disclosure agreement for new project",
      category: "Documents",
      summary: "You are being assigned to work on Project Phoenix, which requires signing a non-disclosure agreement due to the confidential nature of the project. This NDA must be signed before you can access project materials.",
      documentName: "NDA - Project Phoenix",
      dueDate: "Nov 5, 2024",
      note: "This is a standard NDA covering confidential project information. Review the document carefully and direct any questions to the Legal Department. Signature is required to proceed with project access.",
      employee: {
        name: "You",
        role: "Employee",
        status: "Full Time",
        location: "Current Location"
      }
    },
    106: {
      requestor: "Onboarding Team",
      subject: "Take new hire Sarah Kim out to lunch",
      category: "Team Building",
      summary: "Sarah Kim recently joined the team as a Product Designer. Please take them out to lunch to help welcome them to the company and build team connections.",
      newHireName: "Sarah Kim",
      newHireRole: "Product Designer",
      suggestedDate: "This week",
      note: "This is a great opportunity to share company culture and answer any questions they may have. Expenses up to $50 per person will be reimbursed. Submit receipt for reimbursement.",
      employee: {
        name: "Sarah Kim",
        role: "Product Designer",
        status: "Full Time",
        location: "Office Location"
      }
    }
  }

  const approval = selectedItem ? approvalData[selectedItem] : null

  const hasSelectedItems = selectedItems?.size > 0 || false

  if (!selectedItem || !approval) {
    return (
      <div className="h-full flex flex-col bg-[#FAF9F7]">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Select an approval request to view details</p>
        </div>
      </div>
    )
  }
  const initials = approval.employee.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()

  return (
    <div className="h-full flex flex-col bg-[#FAF9F7]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{approval.subject}</h1>
                <p className="text-base leading-6 text-gray-600 mt-0.5">
                  By {approval.requestor} - {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                {approval.category === "Training" || approval.category === "Documents" || approval.category === "Team Building" 
                  ? "Pending" 
                  : "Pending Approval"}
              </Badge>
              <Button variant="ghost" size="icon">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant={activeTab === "Overview" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setActiveTab("Overview")}
            >
              Overview
            </Button>
            {!(approval.category === "Training" || approval.category === "Documents" || approval.category === "Team Building") && (
              <>
                <Button 
                  variant={activeTab === "Approval Process" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setActiveTab("Approval Process")}
                >
                  Approval Process
                </Button>
                <Button 
                  variant={activeTab === "Policy" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setActiveTab("Policy")}
                >
                  Policy
                </Button>
              </>
            )}
            <Button 
              variant={activeTab === "Activity log" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setActiveTab("Activity log")}
            >
              Activity log
            </Button>
            {!(approval.category === "Training" || approval.category === "Documents" || approval.category === "Team Building") && (
              <Button 
                variant={activeTab === "Comments" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveTab("Comments")}
              >
                Comments
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === "Overview" && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 pb-20">
                <div className="max-w-3xl space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Request Summary</h2>
                    <p className="text-gray-700">{approval.summary}</p>
                       {approval.trip && approval.trip.linked && (
                         <div className="mt-3">
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                             ✈️ Linked to trip: {approval.trip.name}
                           </span>
                         </div>
                       )}
                       {approval.warning && (
                         <div className="mt-3">
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                             ⚠️ {approval.warning}
                           </span>
                         </div>
                       )}
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">
                        {(approval.category === "Reimbursements" || approval.category === "Approvals - Reimbursements") ? "Expense Details" : 
                         approval.category === "Training" ? "Course Information" :
                         approval.category === "Documents" ? "Document Information" :
                         approval.category === "Team Building" ? "New Hire Information" :
                         "Impacted Employee"}
                      </h3>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                             {(approval.category === "Reimbursements" || approval.category === "Approvals - Reimbursements")
                               ? approval.vendor?.name?.charAt(0) || "V"
                               : approval.category === "Training"
                               ? approval.courseName?.charAt(0) || "C"
                               : approval.category === "Documents"
                               ? approval.documentName?.charAt(0) || "D"
                               : approval.category === "Team Building"
                               ? approval.newHireName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || "N"
                               : initials
                             }
                           </div>
                           <div className="flex-1">
                             <h4 className="font-medium text-gray-900">
                               {(approval.category === "Reimbursements" || approval.category === "Approvals - Reimbursements")
                                 ? approval.changes.new
                                 : approval.category === "Training"
                                 ? approval.courseName || "Course"
                                 : approval.category === "Documents"
                                 ? approval.documentName || "Document"
                                 : approval.category === "Team Building"
                                 ? approval.newHireName || "New Hire"
                                 : approval.employee.name
                               }
                             </h4>
                             <p className="text-sm text-gray-600">
                               {(approval.category === "Reimbursements" || approval.category === "Approvals - Reimbursements")
                                 ? approval.vendor?.name || "Vendor"
                                 : approval.category === "Training"
                                 ? `Estimated duration: ${approval.estimatedDuration || "N/A"}`
                                 : approval.category === "Documents"
                                 ? `Due date: ${approval.dueDate || "N/A"}`
                                 : approval.category === "Team Building"
                                 ? `${approval.newHireRole || "Employee"} - ${approval.suggestedDate || "TBD"}`
                                 : `${approval.employee.role} - ${approval.employee.status}`
                               }
                             </p>
                             {(approval.category !== "Reimbursements" && approval.category !== "Approvals - Reimbursements" && approval.category !== "Training" && approval.category !== "Documents" && approval.category !== "Team Building") && (
                               <p className="text-sm text-gray-600">{approval.employee.location}</p>
                             )}
                           </div>
                         </div>
                       </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">Details</h3>
                    </div>
                    <div className="p-4 space-y-3 bg-white">
                      {(approval.category === "Reimbursements" || approval.category === "Approvals - Reimbursements") ? (
                           <>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Amount</span>
                               <span className="font-medium text-gray-900">{approval.changes.new}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Entity</span>
                               <span className="font-medium text-gray-900">{approval.entity || "Acme Corp"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Purchase date</span>
                               <span className="font-medium text-gray-900">{approval.purchaseDate || "Oct 25, 2024"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Purchaser</span>
                               <span className="font-medium text-gray-900">{approval.requestor}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Vendor</span>
                               <span className="font-medium text-gray-900">{approval.vendor?.name || "Uber"}</span>
                             </div>
                           </>
                         ) : (approval.category === "HR Management" || approval.category === "Approvals - HR Management") ? (
                           <>
                             <div className="flex justify-between">
                               <span className="text-gray-600">{approval.fieldName || "Target annual bonus"}</span>
                               <span className="font-medium text-gray-900">{approval.changes.current} → {approval.changes.new}</span>
                             </div>
                           </>
                         ) : (approval.category === "Time and Attendance" || approval.category === "Approvals - Time and Attendance") ? (
                           <>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Start time</span>
                               <span className="font-medium text-gray-900">{approval.startTime || "9:00 AM"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">End time</span>
                               <span className="font-medium text-gray-900">{approval.endTime || "10:57 PM"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Duration</span>
                               <span className="font-medium text-gray-900">{approval.changes.new}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Requested by</span>
                               <span className="font-medium text-gray-900">{approval.requestor}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Office location</span>
                               <span className="font-medium text-gray-900">{approval.officeLocation || "Remote"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Number of breaks</span>
                               <span className="font-medium text-gray-900">{approval.numberOfBreaks || "2"}</span>
                             </div>
                           </>
                         ) : approval.category === "Training" ? (
                           <>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Course name</span>
                               <span className="font-medium text-gray-900">{approval.courseName || "N/A"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Due date</span>
                               <span className="font-medium text-gray-900">{approval.dueDate || "N/A"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Estimated duration</span>
                               <span className="font-medium text-gray-900">{approval.estimatedDuration || "N/A"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Requested by</span>
                               <span className="font-medium text-gray-900">{approval.requestor}</span>
                             </div>
                           </>
                         ) : approval.category === "Documents" ? (
                           <>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Document name</span>
                               <span className="font-medium text-gray-900">{approval.documentName || "N/A"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Due date</span>
                               <span className="font-medium text-gray-900">{approval.dueDate || "N/A"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Requested by</span>
                               <span className="font-medium text-gray-900">{approval.requestor}</span>
                             </div>
                           </>
                         ) : approval.category === "Team Building" ? (
                           <>
                             <div className="flex justify-between">
                               <span className="text-gray-600">New hire name</span>
                               <span className="font-medium text-gray-900">{approval.newHireName || "N/A"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Role</span>
                               <span className="font-medium text-gray-900">{approval.newHireRole || "N/A"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Suggested date</span>
                               <span className="font-medium text-gray-900">{approval.suggestedDate || "TBD"}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Requested by</span>
                               <span className="font-medium text-gray-900">{approval.requestor}</span>
                             </div>
                           </>
                         ) : (
                           <>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Current Value</span>
                               <span className="font-medium text-gray-900">{approval.changes.current}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">New Value</span>
                               <span className="font-medium text-green-600">{approval.changes.new}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-gray-600">Change Amount</span>
                               <span className="font-medium">{approval.changes.amount}</span>
                             </div>
                           </>
                         )}
                       </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">{approval.note}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "Approval Process" && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 pb-20">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Approval Process</h2>
                  <p className="text-sm text-gray-600">Step 1: All approvers must accept</p>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                     <table className="w-full">
                       <thead className="bg-gray-50">
                         <tr>
                           <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Approver</th>
                           <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Sent on</th>
                           <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Responded on</th>
                           <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Decision</th>
                           <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Notes</th>
                         </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-200">
                         <tr>
                           <td className="px-4 py-3">
                             <div className="flex items-center gap-3">
                               <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                                 JS
                               </div>
                               <span className="text-sm font-medium text-gray-900">John Smith</span>
                             </div>
                           </td>
                           <td className="px-4 py-3 text-sm text-gray-600">
                             {new Date().toLocaleDateString('en-US', { 
                               year: 'numeric', 
                               month: 'long', 
                               day: 'numeric' 
                             })}
                           </td>
                           <td className="px-4 py-3 text-sm text-gray-400">-</td>
                           <td className="px-4 py-3">
                             <Badge variant="outline">Pending</Badge>
                           </td>
                           <td className="px-4 py-3 text-sm text-gray-400">-</td>
                         </tr>
                         <tr>
                           <td className="px-4 py-3">
                             <div className="flex items-center gap-3">
                               <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                 SW
                               </div>
                               <span className="text-sm font-medium text-gray-900">Sarah Wilson</span>
                             </div>
                           </td>
                           <td className="px-4 py-3 text-sm text-gray-600">
                             {new Date().toLocaleDateString('en-US', { 
                               year: 'numeric', 
                               month: 'long', 
                               day: 'numeric' 
                             })}
                           </td>
                           <td className="px-4 py-3 text-sm text-gray-400">-</td>
                           <td className="px-4 py-3">
                             <Badge variant="outline">Pending</Badge>
                           </td>
                           <td className="px-4 py-3 text-sm text-gray-400">-</td>
                         </tr>
                       </tbody>
                     </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "Policy" && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 pb-20">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Approval Policies</h2>
                  <p className="text-sm text-gray-600">Policies triggered for this request</p>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                     <table className="w-full">
                       <thead className="bg-gray-50">
                         <tr>
                           <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                           <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Published by</th>
                         </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-200">
                         <tr>
                           <td className="px-4 py-3 text-sm font-medium text-gray-900">HR Management Policy</td>
                           <td className="px-4 py-3 text-sm text-gray-600">Jennifer Martinez</td>
                         </tr>
                         <tr>
                           <td className="px-4 py-3 text-sm font-medium text-gray-900">Expense Reimbursement Policy</td>
                           <td className="px-4 py-3 text-sm text-gray-600">Michael Chen</td>
                         </tr>
                         <tr>
                           <td className="px-4 py-3 text-sm font-medium text-gray-900">Time Tracking Policy</td>
                           <td className="px-4 py-3 text-sm text-gray-600">Lisa Thompson</td>
                         </tr>
                       </tbody>
                     </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "Activity log" && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 pb-20">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Activity Log</h2>
                  <p className="text-sm text-gray-600">History of actions performed on this request</p>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                     <table className="w-full">
                       <thead className="bg-gray-50">
                         <tr>
                           <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date and time</th>
                           <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Performed by</th>
                           <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Action</th>
                         </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-200">
                         <tr>
                           <td className="px-4 py-3 text-sm text-gray-600">
                             {new Date().toLocaleDateString('en-US', { 
                               year: 'numeric', 
                               month: 'long', 
                               day: 'numeric',
                               hour: '2-digit',
                               minute: '2-digit'
                             })}
                           </td>
                           <td className="px-4 py-3 text-sm font-medium text-gray-900">{approval.requestor}</td>
                           <td className="px-4 py-3 text-sm text-gray-600">Request submitted</td>
                         </tr>
                       </tbody>
                     </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "Comments" && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 pb-20">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Comments</h2>
                  <p className="text-sm text-gray-600">Discussion and feedback on this request</p>
                </div>
                <div className="space-y-4">
                     {approval.comments && approval.comments.length > 0 ? (
                       approval.comments.map((comment: any) => (
                         <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                           <div className="flex items-start gap-3">
                             <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                               {comment.author.split(' ').map((n: string) => n[0]).join('')}
                             </div>
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                                 <span className="text-xs text-gray-500">{comment.timestamp}</span>
                               </div>
                               <p className="text-sm text-gray-700">{comment.text}</p>
                             </div>
                           </div>
                         </div>
                       ))
                     ) : (
                       <div className="text-center py-8">
                         <p className="text-gray-500">No comments yet</p>
                       </div>
                     )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-4 flex justify-between items-center bg-white flex-shrink-0">
          {(approval.category === "Training" || approval.category === "Documents" || approval.category === "Team Building") ? (
            <>
              <Button variant="outline" disabled={hasSelectedItems}>Mark as done</Button>
              <div className="flex gap-3">
                {approval.category === "Documents" && (
                  <Button disabled={hasSelectedItems}>Sign document</Button>
                )}
                {approval.category === "Training" && (
                  <Button disabled={hasSelectedItems}>Take course</Button>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" disabled={hasSelectedItems}>Mark as done</Button>
              <div className="flex gap-3">
                <Button variant="outline" disabled={hasSelectedItems}>Decline</Button>
                <Button disabled={hasSelectedItems}>Approve</Button>
              </div>
            </>
          )}
        </div>
        
        {hasSelectedItems && (
          <div className="fixed bottom-[75px] left-1/2 transform -translate-x-1/2 min-w-[350px] max-w-[600px] bg-[#512f3e] text-white p-4 rounded-lg shadow-lg flex items-center justify-between z-50">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearSelection}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{selectedItems?.size || 0}</span>
                <span className="text-sm">selected</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(() => {
                if (!selectedItems || selectedItems.size === 0) return null;
                
                // Get all selected items data - need to check both approvalData Record and taskData
                const selectedApprovals = Array.from(selectedItems).map(id => 
                  approvalData[id as unknown as keyof typeof approvalData]
                ).filter(Boolean);
                
                // Determine categories of selected items
                const hasApprovals = selectedApprovals.some(item => 
                  item.category.startsWith('Approvals -')
                );
                const hasDocuments = selectedApprovals.some(item => item.category === 'Documents');
                const hasTraining = selectedApprovals.some(item => item.category === 'Training');
                const hasTeamBuilding = selectedApprovals.some(item => item.category === 'Team Building');
                
                // Show actions based on what's selected
                const actions = [];
                
                // If only approvals are selected, show Approve, Reject, Mark as done
                if (hasApprovals && !hasDocuments && !hasTraining && !hasTeamBuilding) {
                  actions.push(
                    <Button key="approve" variant="ghost" className="text-white hover:bg-white/20 h-8 px-3">
                      Approve
                    </Button>,
                    <Button key="reject" variant="ghost" className="text-white hover:bg-white/20 h-8 px-3">
                      Reject
                    </Button>,
                    <Button key="mark-done" variant="ghost" className="text-white hover:bg-white/20 h-8 px-3">
                      Mark as done
                    </Button>
                  );
                }
                // If only documents are selected, show Sign document, Mark as done
                else if (hasDocuments && !hasApprovals && !hasTraining && !hasTeamBuilding) {
                  actions.push(
                    <Button key="sign" variant="ghost" className="text-white hover:bg-white/20 h-8 px-3">
                      Sign document
                    </Button>,
                    <Button key="mark-done" variant="ghost" className="text-white hover:bg-white/20 h-8 px-3">
                      Mark as done
                    </Button>
                  );
                }
                // If only training are selected, show Take course, Mark as done
                else if (hasTraining && !hasApprovals && !hasDocuments && !hasTeamBuilding) {
                  actions.push(
                    <Button key="take-course" variant="ghost" className="text-white hover:bg-white/20 h-8 px-3">
                      Take course
                    </Button>,
                    <Button key="mark-done" variant="ghost" className="text-white hover:bg-white/20 h-8 px-3">
                      Mark as done
                    </Button>
                  );
                }
                // If only team building are selected, show Mark as done
                else if (hasTeamBuilding && !hasApprovals && !hasDocuments && !hasTraining) {
                  actions.push(
                    <Button key="mark-done" variant="ghost" className="text-white hover:bg-white/20 h-8 px-3">
                      Mark as done
                    </Button>
                  );
                }
                // If mixed selections, only show Mark as done
                else {
                  actions.push(
                    <Button key="mark-done" variant="ghost" className="text-white hover:bg-white/20 h-8 px-3">
                      Mark as done
                    </Button>
                  );
                }
                
                return actions;
              })()}
            </div>
          </div>
        )}
      </div>
  )
}

