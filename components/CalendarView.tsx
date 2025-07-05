"use client"

import { useState } from "react"
import { useData } from "@/contexts/DataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

export function CalendarView() {
  const { patients, incidents } = useData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toDateString()
    return incidents.filter((incident) => {
      const appointmentDate = new Date(incident.appointmentDate)
      return appointmentDate.toDateString() === dateString && incident.status === "Scheduled"
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const appointments = getAppointmentsForDate(clickedDate)

    if (appointments.length > 0) {
      setSelectedDate(clickedDate)
      setIsDialogOpen(true)
    }
  }

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    return patient?.name || "Unknown Patient"
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const appointments = getAppointmentsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
            isToday ? "bg-blue-50 border-blue-300" : ""
          }`}
          onClick={() => handleDateClick(day)}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : ""}`}>{day}</div>
          <div className="space-y-1">
            {appointments.slice(0, 2).map((appointment, index) => (
              <div key={appointment.id} className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate">
                {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                - {appointment.title}
              </div>
            ))}
            {appointments.length > 2 && <div className="text-xs text-gray-500">+{appointments.length - 2} more</div>}
          </div>
        </div>,
      )
    }

    return days
  }

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : []

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Calendar View
            </CardTitle>
            <CardDescription>Monthly view of scheduled appointments</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-gray-100 p-2 text-center text-sm font-medium border-b border-gray-200">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {renderCalendarDays()}
        </div>

        {/* Selected Date Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Appointments for {selectedDate?.toLocaleDateString()}</DialogTitle>
              <DialogDescription>Scheduled treatments for this day</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDateAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{appointment.title}</h3>
                    <Badge variant="outline">
                      {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Patient:</strong> {getPatientName(appointment.patientId)}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                  {appointment.comments && (
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {appointment.comments}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
