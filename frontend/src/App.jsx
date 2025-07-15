import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'

function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {/* TODO: Add login form */}
      <p className="text-gray-500">Login form goes here.</p>
    </div>
  )
}

function Register() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {/* TODO: Add register form */}
      <p className="text-gray-500">Registration form goes here.</p>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="text-gray-500">Welcome to your dashboard!</p>
    </div>
  )
}

function App() {
  // TODO: Add auth context and protected route logic
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
