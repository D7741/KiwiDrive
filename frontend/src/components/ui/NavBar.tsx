// src/components/ui/NavBar.tsx
import { Link, useLocation } from 'react-router-dom'
import StreakFlame from './StreakFlame'

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
    <div className="sticky top-0 z-20 w-full box-border bg-card/90 backdrop-blur-sm border-b border-border-subtle shadow-[0_1px_0_var(--color-border-subtle)]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-3.5">

        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-kiwi-green to-[oklch(50%_0.15_165)] flex items-center justify-center shadow-[0_2px_0_var(--color-kiwi-green-dark)] group-hover:scale-105 transition-transform">
              <div className="w-3.5 h-3.5 rounded-[4px] bg-white/95 rotate-45" />
            </div>
            <span className="font-heading font-extrabold text-lg text-ink tracking-tight">
              Kiwi<span className="text-kiwi-green">Drive</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`relative font-semibold text-[13.5px] no-underline px-3.5 py-2 rounded-[10px] transition-colors ${
                    isActive
                      ? 'text-kiwi-green bg-kiwi-green-light font-bold'
                      : 'text-ink-muted hover:bg-cream hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block scale-90 origin-right">
            <StreakFlame days={streak} active={streak > 0} />
          </div>

          <div className="w-px h-6 bg-border-subtle hidden sm:block" />

          <Link
            to="/profile"
            className="flex items-center gap-2 no-underline group"
          >
            <div className="w-9 h-9 rounded-[11px] bg-sky-blue text-white flex items-center justify-center font-heading font-extrabold text-sm shadow-[0_2px_0_var(--color-sky-blue-dark)] group-hover:scale-105 transition-transform">
              {level}
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}