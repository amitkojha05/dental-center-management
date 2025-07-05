"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Patient {
  id: string
  name: string
  dob: string
  contact: string
  healthInfo: string
  email?: string
}

export interface Incident {
  id: string
  patientId: string
  title: string
  description: string
  comments: string
  appointmentDate: string
  cost?: number
  treatment?: string
  status: "Scheduled" | "Completed" | "Cancelled"
  nextDate?: string
  files: { name: string; url: string; type: string }[]
}

interface DataContextType {
  patients: Patient[]
  incidents: Incident[]
  addPatient: (patient: Omit<Patient, "id">) => void
  updatePatient: (id: string, patient: Partial<Patient>) => void
  deletePatient: (id: string) => void
  addIncident: (incident: Omit<Incident, "id">) => void
  updateIncident: (id: string, incident: Partial<Incident>) => void
  deleteIncident: (id: string) => void
  getPatientIncidents: (patientId: string) => Incident[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const INITIAL_PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    dob: "1990-05-10",
    contact: "1234567890",
    healthInfo: "No allergies",
    email: "john@entnt.in",
  },
  {
    id: "p2",
    name: "Jane Smith",
    dob: "1985-08-22",
    contact: "0987654321",
    healthInfo: "Diabetic",
    email: "jane@entnt.in",
  },
]

const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "i1",
    patientId: "p1",
    title: "Routine Checkup",
    description: "Regular dental checkup and cleaning",
    comments: "Patient has good oral hygiene",
    appointmentDate: "2024-07-15T10:00:00",
    cost: 80,
    treatment: "Cleaning and fluoride treatment",
    status: "Completed",
    files: [],
  },
  {
    id: "i2",
    patientId: "p1",
    title: "Tooth Filling",
    description: "Cavity filling for upper molar",
    comments: "Small cavity detected",
    appointmentDate: "2024-07-20T14:00:00",
    status: "Scheduled",
    files: [],
  },
  {
    id: "i3",
    patientId: "p2",
    title: "Root Canal",
    description: "Root canal treatment for infected tooth",
    comments: "Severe pain reported",
    appointmentDate: "2024-07-18T09:00:00",
    cost: 350,
    treatment: "Root canal therapy",
    status: "Completed",
    files: [],
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    const savedPatients = localStorage.getItem("patients")
    const savedIncidents = localStorage.getItem("incidents")

    if (savedPatients) {
      setPatients(JSON.parse(savedPatients))
    } else {
      setPatients(INITIAL_PATIENTS)
      localStorage.setItem("patients", JSON.stringify(INITIAL_PATIENTS))
    }

    if (savedIncidents) {
      setIncidents(JSON.parse(savedIncidents))
    } else {
      setIncidents(INITIAL_INCIDENTS)
      localStorage.setItem("incidents", JSON.stringify(INITIAL_INCIDENTS))
    }
  }, [])

  const savePatients = (newPatients: Patient[]) => {
    setPatients(newPatients)
    localStorage.setItem("patients", JSON.stringify(newPatients))
  }

  const saveIncidents = (newIncidents: Incident[]) => {
    setIncidents(newIncidents)
    localStorage.setItem("incidents", JSON.stringify(newIncidents))
  }

  const addPatient = (patient: Omit<Patient, "id">) => {
    const newPatient = { ...patient, id: `p${Date.now()}` }
    const newPatients = [...patients, newPatient]
    savePatients(newPatients)
  }

  const updatePatient = (id: string, updatedPatient: Partial<Patient>) => {
    const newPatients = patients.map((p) => (p.id === id ? { ...p, ...updatedPatient } : p))
    savePatients(newPatients)
  }

  const deletePatient = (id: string) => {
    const newPatients = patients.filter((p) => p.id !== id)
    const newIncidents = incidents.filter((i) => i.patientId !== id)
    savePatients(newPatients)
    saveIncidents(newIncidents)
  }

  const addIncident = (incident: Omit<Incident, "id">) => {
    const newIncident = { ...incident, id: `i${Date.now()}` }
    const newIncidents = [...incidents, newIncident]
    saveIncidents(newIncidents)
  }

  const updateIncident = (id: string, updatedIncident: Partial<Incident>) => {
    const newIncidents = incidents.map((i) => (i.id === id ? { ...i, ...updatedIncident } : i))
    saveIncidents(newIncidents)
  }

  const deleteIncident = (id: string) => {
    const newIncidents = incidents.filter((i) => i.id !== id)
    saveIncidents(newIncidents)
  }

  const getPatientIncidents = (patientId: string) => {
    return incidents.filter((i) => i.patientId === patientId)
  }

  return (
    <DataContext.Provider
      value={{
        patients,
        incidents,
        addPatient,
        updatePatient,
        deletePatient,
        addIncident,
        updateIncident,
        deleteIncident,
        getPatientIncidents,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
