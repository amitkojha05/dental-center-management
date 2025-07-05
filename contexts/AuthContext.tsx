"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  role: "Admin" | "Patient"
  email: string
  patientId?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MOCK_USERS = [
  { id: "1", role: "Admin" as const, email: "admin@entnt.in", password: "admin123" },
  { id: "2", role: "Patient" as const, email: "john@entnt.in", password: "patient123", patientId: "p1" },
  { id: "3", role: "Patient" as const, email: "jane@entnt.in", password: "patient123", patientId: "p2" },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      const userData = { ...foundUser }
      delete (userData as any).password
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("currentUser", JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("currentUser")
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
