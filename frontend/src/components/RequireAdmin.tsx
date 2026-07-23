// src/components/RequireAdmin.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function RequireAdmin() {
  const { isAuthenticated, isAdmin } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}