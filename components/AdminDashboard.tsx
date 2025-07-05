"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PatientManagement } from "@/components/PatientManagement"
import { IncidentManagement } from "@/components/IncidentManagement"
import { CalendarView } from "@/components/CalendarView"
import { Users, DollarSign, LogOut, SmileIcon as Tooth, Clock, CheckCircle } from "lucide-react"

export function AdminDashboard() {
  const { logout } = useAuth()
  const { patients, incidents } = useData()
  const [activeTab, setActiveTab] = useState("dashboard")

  // Calculate KPIs
  const upcomingAppointments = incidents
    .filter((i) => i.status === "Scheduled" && new Date(i.appointmentDate) >= new Date())
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    .slice(0, 10)

  const completedTreatments = incidents.filter((i) => i.status === "Completed").length
  const pendingTreatments = incidents.filter((i) => i.status === "Scheduled").length
  const totalRevenue = incidents
    .filter((i) => i.status === "Completed" && i.cost)
    .reduce((sum, i) => sum + (i.cost || 0), 0)

  const topPatients = patients
    .map((p) => ({
      ...p,
      appointmentCount: incidents.filter((i) => i.patientId === p.id).length,
    }))
    .sort((a, b) => b.appointmentCount - a.appointmentCount)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Tooth className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Dental Center Management</h1>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patients.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Treatments</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingTreatments}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Treatments</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedTreatments}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Next 10 Appointments</CardTitle>
                  <CardDescription>Upcoming scheduled appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.length === 0 ? (
                      <p className="text-muted-foreground">No upcoming appointments</p>
                    ) : (
                      upcomingAppointments.map((appointment) => {
                        const patient = patients.find((p) => p.id === appointment.patientId)
                        return (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{patient?.name}</p>
                              <p className="text-sm text-muted-foreground">{appointment.title}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {new Date(appointment.appointmentDate).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Patients */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Patients</CardTitle>
                  <CardDescription>Patients with most appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPatients.map((patient, index) => (
                      <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.contact}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{patient.appointmentCount} appointments</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients">
            <PatientManagement />
          </TabsContent>

          <TabsContent value="appointments">
            <IncidentManagement />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
