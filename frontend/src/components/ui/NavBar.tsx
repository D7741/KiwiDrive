// src/components/ui/NavBar.tsx
import { Link, useLocation } from 'react-router-dom'

interface NavBarProps {
  level: number
  streak: number
  isAdmin?: boolean
}

const navItems = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'quiz', label: 'Quiz', href: '/quiz' },
  { key: 'leaderboard', label: 'Leaderboard', href: '/leaderboard' },
  { key: 'achievements', label: 'Achievements', href: '/achievements' },
  { key: 'profile', label: 'Profile', href: '/profile' },
]

export default function NavBar({ level, streak, isAdmin = false }: NavBarProps) {
  const location = useLocation()
  const items = isAdmin ? [...navItems, { key: 'admin', label: 'Admin', href: '/admin' }] : navItems

  return (
    <div className="w-full box-border flex items-center justify-between px-8 py-4 bg-card border-b border-border-subtle">
      <div className="flex items-center gap-9">
        <Link to="/dashboard" className="font-heading font-extrabold text-lg text-kiwi-green no-underline">
          KiwiDrive
        </Link>
        <div className="flex items-center gap-1.5">
          {items.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.key}
                to={item.href}
                className={`font-semibold text-sm no-underline px-3 py-2 rounded-[10px] ${
                  isActive
                    ? 'font-bold text-kiwi-green bg-kiwi-green-light'
                    : 'text-ink-muted hover:bg-cream'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm font-bold text-ink-light">
          <div className="w-4 h-4 rounded-tr-full rounded-tl-full rounded-bl-full -rotate-45 bg-kiwifruit-orange" />
          {streak}
        </div>
        <Link
          to="/profile"
          className="w-8.5 h-8.5 rounded-[10px] bg-sky-blue text-white flex items-center justify-center font-heading font-extrabold text-[13px] no-underline"
        >
          {level}
        </Link>
      </div>
    </div>
  )
}