"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, SmileIcon as Tooth, Calendar, FileText, DollarSign, Clock, CheckCircle, Download } from "lucide-react"

export function PatientDashboard() {
  const { user, logout } = useAuth()
  const { patients, incidents } = useData()

  const patient = patients.find((p) => p.id === user?.patientId)
  const patientIncidents = incidents.filter((i) => i.patientId === user?.patientId)

  const upcomingAppointments = patientIncidents
    .filter((i) => i.status === "Scheduled" && new Date(i.appointmentDate) >= new Date())
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())

  const completedTreatments = patientIncidents.filter((i) => i.status === "Completed")
  const totalCost = completedTreatments.reduce((sum, i) => sum + (i.cost || 0), 0)

  const handleFileDownload = (file: { name: string; url: string }) => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p>Patient data not found. Please contact support.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Tooth className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Patient Portal</h1>
                <p className="text-sm text-gray-500">Welcome, {patient.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p className="text-lg">{new Date(patient.dob).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contact</p>
                <p className="text-lg">{patient.contact}</p>
              </div>
              <div className="md:col-span-3">
                <p className="text-sm font-medium text-gray-500">Health Information</p>
                <p className="text-lg">{patient.healthInfo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Treatments</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTreatments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCost}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <p className="text-muted-foreground">No upcoming appointments</p>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{appointment.title}</h3>
                        <Badge variant="outline">Scheduled</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{appointment.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(appointment.appointmentDate).toLocaleString()}
                      </div>
                      {appointment.comments && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Notes:</strong> {appointment.comments}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Treatment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Treatment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTreatments.length === 0 ? (
                  <p className="text-muted-foreground">No completed treatments</p>
                ) : (
                  completedTreatments.map((treatment) => (
                    <div key={treatment.id} className="p-4 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{treatment.title}</h3>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{treatment.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(treatment.appointmentDate).toLocaleDateString()}
                        </span>
                        {treatment.cost && (
                          <span className="flex items-center font-medium">
                            <DollarSign className="h-4 w-4 mr-1" />${treatment.cost}
                          </span>
                        )}
                      </div>
                      {treatment.treatment && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Treatment:</strong> {treatment.treatment}
                        </p>
                      )}
                      {treatment.files && treatment.files.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Attachments:</p>
                          <div className="space-y-1">
                            {treatment.files.map((file, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleFileDownload(file)}
                                className="mr-2"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                {file.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
