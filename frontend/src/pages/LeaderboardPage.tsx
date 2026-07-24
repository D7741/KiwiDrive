// src/pages/LeaderboardPage.tsx
import { useEffect, useState } from 'react'
import { Card } from '../components/ui'
import { useAuthStore } from '../store/authStore'
import * as leaderboardApi from '../api/leaderboard'
import type { LeaderboardEntry } from '../types'

const AVATAR_COLORS = ['bg-kiwi-green', 'bg-sky-blue', 'bg-kiwifruit-orange', 'bg-alert-red', 'bg-[oklch(70%_0.14_300)]']

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function LeaderboardPage() {
  const { user } = useAuthStore()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    leaderboardApi
      .getLeaderboard()
      .then(setEntries)
      .catch(() => setError('Could not load leaderboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="max-w-[720px] mx-auto px-4 sm:px-6 md:px-8 py-10 text-ink-muted">Loading leaderboard...</div>
  }

  if (error) {
    return <div className="max-w-[720px] mx-auto px-4 sm:px-6 md:px-8 py-10 text-alert-red">{error}</div>
  }

  const myEntry = entries.find((e) => e.id === user?.id)
  const podium = entries.slice(0, 3)
  const rest = entries.slice(3)
  const podiumHeights = [84, 64, 50]
  const podiumColors = ['bg-kiwi-green', 'bg-[oklch(75%_0.06_95)]', 'bg-[oklch(68%_0.1_60)]'] 
  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-10 pb-24">
      <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-ink mb-1">Leaderboard</h1>
      <p className="text-sm text-ink-muted mb-7">
        Global ranking by total XP.{myEntry ? ` You're #${myEntry.rank}.` : ''}
      </p>

      {podium.length > 0 && (
        <div className="flex justify-center items-end gap-1.5 sm:gap-3.5 mb-8">
          {podium.map((p, i) => (
            <div key={p.id} className="flex flex-col items-center gap-1.5 sm:gap-2 w-[92px] sm:w-[120px]">
              <div className={`w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl ${AVATAR_COLORS[i % AVATAR_COLORS.length]} text-white flex items-center justify-center font-heading font-extrabold text-sm sm:text-lg`}>
                {initials(p.username)}
              </div>
              <div className="font-heading font-bold text-xs sm:text-[13px] text-ink text-center truncate w-full px-0.5">{p.username}</div>
              <div className="text-[10.5px] sm:text-[11.5px] text-ink-light">{p.xp} XP</div>
              <div
                className={`w-full rounded-t-[10px] flex items-start justify-center pt-2 ${podiumColors[i]}`}
                style={{ height: `${podiumHeights[i]}px` }}
              >
                <span className="font-heading font-extrabold text-sm sm:text-base text-white">{p.rank}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <Card padding="sm" className="!p-2">
            <div className="flex flex-col gap-1">
            {rest.map((row) => {
                const isMe = row.id === user?.id
                return (
                <div
                    key={row.id}
                    className={`flex items-center gap-2 sm:gap-3.5 px-2.5 sm:px-4 py-3 rounded-2xl ${
                    isMe ? 'bg-kiwi-green-light border-[1.5px] border-kiwi-green' : 'hover:bg-cream'
                    }`}
                >
                    <div className={`w-5 sm:w-6.5 text-center font-heading font-extrabold text-sm shrink-0 ${isMe ? 'text-[oklch(45%_0.14_152)]' : 'text-ink-light'}`}>
                    {row.rank}
                    </div>
                    <div className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-[10px] text-white flex items-center justify-center font-heading font-bold text-xs sm:text-[13px] shrink-0 ${AVATAR_COLORS[row.rank % AVATAR_COLORS.length]}`}>
                    {initials(row.username)}
                    </div>
                    <div className={`flex-1 min-w-0 truncate text-sm ${isMe ? 'font-bold text-[oklch(30%_0.03_260)]' : 'font-semibold text-ink'}`}>
                    {row.username}
                    </div>
                    <div className={`hidden sm:block text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${isMe ? 'text-[oklch(45%_0.14_152)] bg-[oklch(96%_0.03_152)]' : 'text-ink-light bg-[oklch(95%_0.01_95)]'}`}>
                    Lvl {row.level}
                    </div>
                    <div className={`w-14 sm:w-17.5 text-right text-xs sm:text-sm font-bold shrink-0 ${isMe ? 'text-[oklch(35%_0.02_260)]' : 'text-[oklch(45%_0.02_260)]'}`}>
                    {row.xp} XP
                    </div>
                </div>
                )
            })}
            </div>
        </Card>
      )}
    </div>
  )
}