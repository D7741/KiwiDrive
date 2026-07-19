// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
// 之后接入你的auth store，先用假变量占位
const isAuthenticated = true // TODO: 换成 useAuthStore 里的真实状态

export default function ProtectedRoute() {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}