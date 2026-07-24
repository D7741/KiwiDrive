// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, XPBar, StreakFlame } from '../components/ui'
import { useAuthStore } from '../store/authStore'
import * as authApi from '../api/auth'
import * as dashboardApi from '../api/dashboard'
import type { CategoryStat } from '../types'

// Order and colors are purely a frontend display concern — the backend only
// returns category name + numbers.
const CATEGORY_ORDER = ['Road Signs', 'Speed Limits', 'Give Way Rules', 'Parking', 'Alcohol & Drugs', 'Night Driving']

const CATEGORY_COLORS: Record<string, string> = {
  'Road Signs': 'bg-sky-blue',
  'Speed Limits': 'bg-alert-red',
  'Give Way Rules': 'bg-kiwifruit-orange',
  'Parking': 'bg-kiwi-green',
  'Alcohol & Drugs': 'bg-[oklch(70%_0.14_300)]',
  'Night Driving': 'bg-[oklch(38%_0.12_270)]',
}

export default function DashboardPage() {
  const { user, isGuest, token, login: _login } = useAuthStore()

  const [stats, setStats] = useState<CategoryStat[] | null>(null)
  const [statsLoading, setStatsLoading] = useState(!isGuest)
  const [statsError, setStatsError] = useState('')

  // Guest mode has no user object; for logged-in users whose store lost the
  // cached user (e.g. after a page refresh), fetch it once here
  useEffect(() => {
    if (!user && !isGuest && token) {
      authApi.getProfile().then((profile) => {
        useAuthStore.setState({ user: profile })
      }).catch(() => {
        // token expired etc. — let ProtectedRoute handle the redirect
      })
    }
  }, [user, isGuest, token])

  // Guest progress isn't persisted anywhere, so there's nothing to fetch
  useEffect(() => {
    if (isGuest) return
    dashboardApi.getCategoryStats()
      .then(setStats)
      .catch(() => setStatsError('Could not load your category progress.'))
      .finally(() => setStatsLoading(false))
  }, [isGuest])

  const displayName = isGuest ? 'Guest' : user?.username ?? '...'
  const level = user?.level ?? 1
  const xp = user?.xp ?? 0
  const streak = user?.streak ?? 0
  const xpForNextLevel = level * 500 // TODO: replace with real level-up formula once defined by backend

  const orderedStats = CATEGORY_ORDER
    .map((name) => stats?.find((s) => s.categoryName === name))
    .filter((s): s is CategoryStat => s != null)

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-9 pb-24">

      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4 md:gap-5 mb-6 md:mb-7">
        <div className="bg-gradient-to-br from-kiwi-green to-[oklch(52%_0.15_168)] rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 text-white">
          <div className="font-heading font-bold text-sm opacity-85 mb-1">Kia ora, {displayName} 👋</div>
          <div className="font-heading font-extrabold text-xl sm:text-2xl mb-4 md:mb-5">Ready for today's practice?</div>
          <XPBar current={xp} max={xpForNextLevel} level={level} variant="onDark" />
        </div>

        <Card className="flex flex-col justify-center gap-3.5">
          <StreakFlame days={streak} active={streak > 0} />
          <div className="text-sm text-ink-muted leading-relaxed">
            Practice today to keep it alive.
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 md:gap-4 mb-7 md:mb-8">
        <Link to="/quiz" className="no-underline">
          <Card className="flex flex-col gap-2.5 hover:shadow-[0_4px_0_var(--color-border-subtle)] transition-shadow">
            <div className="w-9.5 h-9.5 rounded-[11px] bg-kiwi-green-light flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded bg-kiwi-green" />
            </div>
            <div className="font-heading font-bold text-[15px] text-ink">Continue Quiz</div>
            <div className="text-xs text-ink-light">Pick up where you left off</div>
          </Card>
        </Link>
        <Link to="/leaderboard" className="no-underline">
          <Card className="flex flex-col gap-2.5 hover:shadow-[0_4px_0_var(--color-border-subtle)] transition-shadow">
            <div className="w-9.5 h-9.5 rounded-[11px] bg-sky-blue-light flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded bg-sky-blue" />
            </div>
            <div className="font-heading font-bold text-[15px] text-ink">View Leaderboard</div>
            <div className="text-xs text-ink-light">See how you rank globally</div>
          </Card>
        </Link>
        <Link to="/achievements" className="no-underline">
          <Card className="flex flex-col gap-2.5 hover:shadow-[0_4px_0_var(--color-border-subtle)] transition-shadow">
            <div className="w-9.5 h-9.5 rounded-[11px] bg-kiwifruit-orange-light flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-kiwifruit-orange" />
            </div>
            <div className="font-heading font-bold text-[15px] text-ink">My Achievements</div>
            <div className="text-xs text-ink-light">View unlocked badges</div>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <div>
          <h2 className="font-heading font-bold text-lg text-ink mb-3.5">Practice a category</h2>
          {isGuest ? (
            <Card className="text-sm text-ink-muted">
              Sign up to track your progress across categories.
            </Card>
          ) : statsLoading ? (
            <div className="text-sm text-ink-muted">Loading category progress...</div>
          ) : statsError ? (
            <div className="text-sm text-alert-red">{statsError}</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
              {orderedStats.map((cat) => (
                <Link key={cat.categoryId} to={`/quiz?category=${encodeURIComponent(cat.categoryName)}`} className="no-underline">
                  <Card padding="sm" className="flex flex-col gap-2 hover:shadow-[0_4px_0_var(--color-border-subtle)] transition-shadow">
                    <div className={`w-7 h-7 rounded-[9px] ${CATEGORY_COLORS[cat.categoryName] ?? 'bg-kiwi-green'}`} />
                    <div className="font-heading font-bold text-sm text-ink">{cat.categoryName}</div>
                    <div className="w-full h-1.5 rounded-full bg-[oklch(92%_0.015_95)] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${CATEGORY_COLORS[cat.categoryName] ?? 'bg-kiwi-green'}`}
                        style={{ width: `${cat.progress}%` }}
                      />
                    </div>
                    <div className="text-[11.5px] text-ink-light font-semibold">{cat.progress}% complete</div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-heading font-bold text-lg text-ink mb-3.5">Accuracy by category</h2>
          {isGuest ? (
            <Card className="text-sm text-ink-muted">
              Sign up to see your accuracy stats.
            </Card>
          ) : statsLoading ? (
            <Card className="text-sm text-ink-muted">Loading...</Card>
          ) : statsError ? (
            <Card className="text-sm text-alert-red">{statsError}</Card>
          ) : (
            <Card className="flex flex-col gap-3">
              {orderedStats.map((cat) => (
                <div key={cat.categoryId}>
                  <div className="flex justify-between text-xs font-semibold text-[oklch(35%_0.02_260)] mb-1">
                    <span>{cat.categoryName}</span>
                    <span>{cat.accuracy}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[oklch(92%_0.015_95)] overflow-hidden">
                    <div className="h-full rounded-full bg-sky-blue" style={{ width: `${cat.accuracy}%` }} />
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
