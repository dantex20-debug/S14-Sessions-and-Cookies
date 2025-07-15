import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './auth'

function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(form.username, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form className="flex flex-col gap-4 w-80" onSubmit={handleSubmit}>
        <input className="border p-2 rounded" placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">Login</button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
      <p className="mt-4 text-sm">Don't have an account? <a href="/register" className="text-blue-600">Register</a></p>
    </div>
  )
}

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', email: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await register(form.username, form.password, form.email)
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form className="flex flex-col gap-4 w-80" onSubmit={handleSubmit}>
        <input className="border p-2 rounded" placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <input className="border p-2 rounded" placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">Register</button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </form>
      <p className="mt-4 text-sm">Already have an account? <a href="/login" className="text-blue-600">Login</a></p>
    </div>
  )
}

function Dashboard() {
  const { user, logout } = useAuth()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="text-gray-500 mb-4">Welcome, <span className="font-semibold">{user?.username}</span>!</p>
      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={logout}>Logout</button>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
