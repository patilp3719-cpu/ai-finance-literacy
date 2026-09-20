import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing            from './pages/Landing'
import Login              from './pages/Login'
import Dashboard          from './pages/Dashboard'
import ExpenseAnalyzer    from './pages/ExpenseAnalyzer'
import AffordabilityChat  from './pages/AffordabilityChat'
import ScholarshipAdvisor from './pages/ScholarshipAdvisor'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex-center" style={{ minHeight: '100vh' }}>
      <div className="spinner" style={{ width: 36, height: 36 }} />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<Landing />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/expenses"  element={<PrivateRoute><ExpenseAnalyzer /></PrivateRoute>} />
          <Route path="/afford"    element={<PrivateRoute><AffordabilityChat /></PrivateRoute>} />
          <Route path="/scholar"   element={<PrivateRoute><ScholarshipAdvisor /></PrivateRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
