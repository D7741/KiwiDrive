// src/components/Layout.tsx
import { Outlet } from 'react-router-dom'
import { NavBar } from './ui'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
  const { user, isGuest, isAdmin } = useAuthStore()

  return (
    <div>
      <NavBar
        level={user?.level ?? 1}
        streak={user?.streak ?? 0}
        isAdmin={isAdmin}
      />
      <main>
        <Outlet />
      </main>
    </div>
  )
}