"use client"

import type React from "react"

import { useState } from "react"
import { useData, type Patient } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users } from "lucide-react"

export function PatientManagement() {
  const { patients, incidents, addPatient, updatePatient, deletePatient } = useData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    contact: "",
    healthInfo: "",
    email: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      dob: "",
      contact: "",
      healthInfo: "",
      email: "",
    })
    setEditingPatient(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPatient) {
      updatePatient(editingPatient.id, formData)
    } else {
      addPatient(formData)
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setFormData({
      name: patient.name,
      dob: patient.dob,
      contact: patient.contact,
      healthInfo: patient.healthInfo,
      email: patient.email || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (patientId: string) => {
    if (confirm("Are you sure you want to delete this patient? This will also delete all their appointments.")) {
      deletePatient(patientId)
    }
  }

  const getPatientAppointmentCount = (patientId: string) => {
    return incidents.filter((i) => i.patientId === patientId).length
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Patient Management
            </CardTitle>
            <CardDescription>Manage patient information and records</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingPatient ? "Edit Patient" : "Add New Patient"}</DialogTitle>
                <DialogDescription>
                  {editingPatient ? "Update patient information" : "Enter patient details to create a new record"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="healthInfo">Health Information</Label>
                    <Textarea
                      id="healthInfo"
                      value={formData.healthInfo}
                      onChange={(e) => setFormData({ ...formData, healthInfo: e.target.value })}
                      placeholder="Allergies, medical conditions, etc."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingPatient ? "Update Patient" : "Add Patient"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Appointments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No patients found. Add your first patient to get started.
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{new Date(patient.dob).toLocaleDateString()}</TableCell>
                    <TableCell>{patient.contact}</TableCell>
                    <TableCell>{patient.email || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getPatientAppointmentCount(patient.id)} appointments</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(patient)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(patient.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
