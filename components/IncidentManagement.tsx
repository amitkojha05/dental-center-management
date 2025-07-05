"use client"

import type React from "react"

import { useState } from "react"
import { useData, type Incident } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Edit, Trash2, Calendar, X } from "lucide-react"

export function IncidentManagement() {
  const { patients, incidents, addIncident, updateIncident, deleteIncident } = useData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null)
  const [formData, setFormData] = useState({
    patientId: "",
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
    cost: "",
    treatment: "",
    status: "Scheduled" as "Scheduled" | "Completed" | "Cancelled",
    nextDate: "",
  })
  const [files, setFiles] = useState<{ name: string; url: string; type: string }[]>([])

  const resetForm = () => {
    setFormData({
      patientId: "",
      title: "",
      description: "",
      comments: "",
      appointmentDate: "",
      cost: "",
      treatment: "",
      status: "Scheduled",
      nextDate: "",
    })
    setFiles([])
    setEditingIncident(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || [])

    uploadedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newFile = {
          name: file.name,
          url: event.target?.result as string,
          type: file.type,
        }
        setFiles((prev) => [...prev, newFile])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const incidentData = {
      ...formData,
      cost: formData.cost ? Number.parseFloat(formData.cost) : undefined,
      files,
    }

    if (editingIncident) {
      updateIncident(editingIncident.id, incidentData)
    } else {
      addIncident(incidentData)
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (incident: Incident) => {
    setEditingIncident(incident)
    setFormData({
      patientId: incident.patientId,
      title: incident.title,
      description: incident.description,
      comments: incident.comments,
      appointmentDate: incident.appointmentDate.slice(0, 16),
      cost: incident.cost?.toString() || "",
      treatment: incident.treatment || "",
      status: incident.status,
      nextDate: incident.nextDate?.slice(0, 16) || "",
    })
    setFiles(incident.files || [])
    setIsDialogOpen(true)
  }

  const handleDelete = (incidentId: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteIncident(incidentId)
    }
  }

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    return patient?.name || "Unknown Patient"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Appointment Management
            </CardTitle>
            <CardDescription>Manage patient appointments and treatments</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingIncident ? "Edit Appointment" : "Add New Appointment"}</DialogTitle>
                <DialogDescription>
                  {editingIncident ? "Update appointment details" : "Schedule a new appointment for a patient"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="patientId">Patient</Label>
                    <Select
                      value={formData.patientId}
                      onValueChange={(value) => setFormData({ ...formData, patientId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="appointmentDate">Appointment Date & Time</Label>
                    <Input
                      id="appointmentDate"
                      type="datetime-local"
                      value={formData.appointmentDate}
                      onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "Scheduled" | "Completed" | "Cancelled") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    />
                  </div>

                  {formData.status === "Completed" && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="cost">Cost ($)</Label>
                        <Input
                          id="cost"
                          type="number"
                          step="0.01"
                          value={formData.cost}
                          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="treatment">Treatment Details</Label>
                        <Textarea
                          id="treatment"
                          value={formData.treatment}
                          onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="nextDate">Next Appointment (Optional)</Label>
                        <Input
                          id="nextDate"
                          type="datetime-local"
                          value={formData.nextDate}
                          onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="files">Upload Files</Label>
                    <Input
                      id="files"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    {files.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingIncident ? "Update Appointment" : "Add Appointment"}</Button>
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
                <TableHead>Patient</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No appointments found. Schedule your first appointment to get started.
                  </TableCell>
                </TableRow>
              ) : (
                incidents
                  .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                  .map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">{getPatientName(incident.patientId)}</TableCell>
                      <TableCell>{incident.title}</TableCell>
                      <TableCell>{new Date(incident.appointmentDate).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                      </TableCell>
                      <TableCell>{incident.cost ? `$${incident.cost}` : "N/A"}</TableCell>
                      <TableCell>
                        {incident.files && incident.files.length > 0 ? (
                          <Badge variant="secondary">{incident.files.length} files</Badge>
                        ) : (
                          "No files"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(incident)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(incident.id)}>
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
