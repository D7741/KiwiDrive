// src/pages/DashboardPage.tsx
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, XPBar, StreakFlame } from '../components/ui'
import { useAuthStore } from '../store/authStore'
import * as authApi from '../api/auth'

// TODO: 等后端有分类进度接口后，把这里的静态数据换成真实API请求
const CATEGORIES = [
  { name: 'Road Signs', progress: 45, color: 'bg-sky-blue' },
  { name: 'Speed Limits', progress: 90, color: 'bg-alert-red' },
  { name: 'Give Way Rules', progress: 30, color: 'bg-kiwifruit-orange' },
  { name: 'Parking', progress: 70, color: 'bg-kiwi-green' },
  { name: 'Alcohol & Drugs', progress: 15, color: 'bg-[oklch(70%_0.14_300)]' },
  { name: 'Night Driving', progress: 55, color: 'bg-[oklch(38%_0.12_270)]' },
]

// TODO: 等后端有 accuracy 接口后替换成真实数据
const ACCURACY = [
  { name: 'Road Rules', value: 88 },
  { name: 'Road Signs', value: 72 },
  { name: 'Speed Limits', value: 95 },
  { name: 'Alcohol & Drugs', value: 60 },
]

export default function DashboardPage() {
  const { user, isGuest, token, login: _login } = useAuthStore()

  // Guest 模式没有 user 对象，登录用户如果 store 里没缓存 user（比如刷新页面后），去拉一次
  useEffect(() => {
    if (!user && !isGuest && token) {
      authApi.getProfile().then((profile) => {
        useAuthStore.setState({ user: profile })
      }).catch(() => {
        // token失效等情况，交给 ProtectedRoute 处理跳转
      })
    }
  }, [user, isGuest, token])

  const displayName = isGuest ? 'Guest' : user?.username ?? '...'
  const level = user?.level ?? 1
  const xp = user?.xp ?? 0
  const streak = user?.streak ?? 0
  const xpForNextLevel = level * 500 // TODO: 如果后端有明确的升级公式，换成真实计算

  return (
    <div className="max-w-[1100px] mx-auto px-8 py-9 pb-24">

      <div className="grid grid-cols-[1.4fr_1fr] gap-5 mb-7">
        <div className="bg-gradient-to-br from-kiwi-green to-[oklch(52%_0.15_168)] rounded-3xl p-8 text-white">
          <div className="font-heading font-bold text-sm opacity-85 mb-1">Kia ora, {displayName} 👋</div>
          <div className="font-heading font-extrabold text-2xl mb-5">Ready for today's practice?</div>
          <XPBar current={xp} max={xpForNextLevel} level={level} />
        </div>

        <Card className="flex flex-col justify-center gap-3.5">
          <StreakFlame days={streak} active={streak > 0} />
          <div className="text-sm text-ink-muted leading-relaxed">
            Practice today to keep it alive.
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
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

      <div className="grid grid-cols-[2fr_1fr] gap-5">
        <div>
          <h2 className="font-heading font-bold text-lg text-ink mb-3.5">Practice a category</h2>
          <div className="grid grid-cols-2 gap-3.5">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to={`/quiz?category=${encodeURIComponent(cat.name)}`} className="no-underline">
                <Card padding="sm" className="flex flex-col gap-2 hover:shadow-[0_4px_0_var(--color-border-subtle)] transition-shadow">
                  <div className={`w-7 h-7 rounded-[9px] ${cat.color}`} />
                  <div className="font-heading font-bold text-sm text-ink">{cat.name}</div>
                  <div className="w-full h-1.5 rounded-full bg-[oklch(92%_0.015_95)] overflow-hidden">
                    <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.progress}%` }} />
                  </div>
                  <div className="text-[11.5px] text-ink-light font-semibold">{cat.progress}% complete</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-heading font-bold text-lg text-ink mb-3.5">Accuracy by category</h2>
          <Card className="flex flex-col gap-3">
            {ACCURACY.map((a) => (
              <div key={a.name}>
                <div className="flex justify-between text-xs font-semibold text-[oklch(35%_0.02_260)] mb-1">
                  <span>{a.name}</span>
                  <span>{a.value}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[oklch(92%_0.015_95)] overflow-hidden">
                  <div className="h-full rounded-full bg-sky-blue" style={{ width: `${a.value}%` }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}