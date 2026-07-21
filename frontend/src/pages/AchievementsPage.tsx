// src/pages/AchievementsPage.tsx
import { useEffect, useState } from 'react'
import { Badge } from '../components/ui'
import * as achievementsApi from '../api/achievements'
import type { Achievement } from '../types'

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    achievementsApi
      .getUserAchievements()
      .then(setAchievements)
      .catch(() => setError('Could not load achievements.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="max-w-[900px] mx-auto px-8 py-10 text-ink-muted">Loading achievements...</div>
  }

  if (error) {
    return <div className="max-w-[900px] mx-auto px-8 py-10 text-alert-red">{error}</div>
  }

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length

  return (
    <div className="max-w-[900px] mx-auto px-8 py-10 pb-24">
      <h1 className="font-heading font-extrabold text-2xl text-ink mb-1">Achievements</h1>
      <p className="text-sm text-ink-muted mb-7">
        {unlockedCount} of {achievements.length} badges unlocked
      </p>

      <div className="grid grid-cols-3 gap-4">
        {achievements.map((a) => (
          <div
            key={a.id}
            className="bg-card rounded-[20px] p-5.5 flex flex-col items-center text-center gap-2.5 shadow-[0_2px_0_var(--color-border-subtle)]"
          >
            <Badge label={a.name} unlocked={a.isUnlocked} />
            <div className="text-xs text-ink-light leading-relaxed">{a.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}