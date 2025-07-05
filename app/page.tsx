"use client"

import { useAuth } from "@/contexts/AuthContext"
import { LoginForm } from "@/components/LoginForm"
import { AdminDashboard } from "@/components/AdminDashboard"
import { PatientDashboard } from "@/components/PatientDashboard"

export default function Home() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gray-50">{user?.role === "Admin" ? <AdminDashboard /> : <PatientDashboard />}</div>
  )
}
