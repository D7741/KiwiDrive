// src/components/RequireRealAuth.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function RequireRealAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isGuest = useAuthStore((s) => s.isGuest)

  if (!isAuthenticated || isGuest) {
    return <Navigate to="/" replace state={{ message: 'Please log in to start a quiz.' }} />
  }
  return <Outlet />
}
