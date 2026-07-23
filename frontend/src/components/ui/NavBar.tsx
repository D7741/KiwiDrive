// src/components/ui/NavBar.tsx
import { useEffect, useState } from 'react'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const items = isAdmin ? [...navItems, { key: 'admin', label: 'Admin', href: '/admin' }] : navItems

  // Auto-close the drawer whenever the route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Close on Escape key + lock background scroll while the drawer is open
  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <div className="sticky top-0 z-20 w-full box-border bg-card/90 backdrop-blur-sm border-b border-border-subtle shadow-[0_1px_0_var(--color-border-subtle)]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3.5">

        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-kiwi-green to-[oklch(50%_0.15_165)] flex items-center justify-center shadow-[0_2px_0_var(--color-kiwi-green-dark)] group-hover:scale-105 transition-transform">
              <div className="w-3.5 h-3.5 rounded-[4px] bg-white/95 rotate-45" />
            </div>
            <span className="font-heading font-extrabold text-lg text-ink tracking-tight">
              Kiwi<span className="text-kiwi-green">Drive</span>
            </span>
          </Link>

          {/* Desktop horizontal nav */}
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

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:block scale-90 origin-right">
            <StreakFlame days={streak} active={streak > 0} />
          </div>

          <div className="w-px h-6 bg-border-subtle hidden sm:block" />

          <Link
            to="/profile"
            className="hidden md:flex items-center gap-2 no-underline group"
          >
            <div className="w-9 h-9 rounded-[11px] bg-sky-blue text-white flex items-center justify-center font-heading font-extrabold text-sm shadow-[0_2px_0_var(--color-sky-blue-dark)] group-hover:scale-105 transition-transform">
              {level}
            </div>
          </Link>

          {/* Mobile: level badge + hamburger button */}
          <div className="md:hidden flex items-center gap-1.5 w-9 h-9 rounded-[11px] bg-sky-blue text-white justify-center font-heading font-extrabold text-sm shadow-[0_2px_0_var(--color-sky-blue-dark)]">
            {level}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-[10px] text-ink-muted hover:bg-cream hover:text-ink transition-colors"
          >
            {isMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Backdrop overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-[57px] bg-black/40 z-10 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile right-side drawer */}
      <div
        id="mobile-nav-drawer"
        className={`fixed top-[57px] right-0 bottom-0 w-[78%] max-w-[300px] bg-card border-l border-border-subtle shadow-xl z-20 md:hidden transition-transform duration-200 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto p-4 gap-1">
          {items.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.key}
                to={item.href}
                className={`font-semibold text-[15px] no-underline px-4 py-3 rounded-[10px] transition-colors ${
                  isActive
                    ? 'text-kiwi-green bg-kiwi-green-light font-bold'
                    : 'text-ink-muted hover:bg-cream hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            )
          })}

          <div className="h-px bg-border-subtle my-3" />

          <div className="px-4 py-2">
            <StreakFlame days={streak} active={streak > 0} />
          </div>
        </div>
      </div>
    </div>
  )
}