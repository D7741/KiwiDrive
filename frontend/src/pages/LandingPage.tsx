// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom'
import { StreakFlame, XPBar, Badge } from '../components/ui'

const FEATURES = [
  { title: 'XP & Levels', desc: 'Earn XP for every correct answer and level up as you go.', color: 'bg-kiwi-green-light', dot: 'bg-kiwi-green' },
  { title: 'Daily Streaks', desc: 'Practice daily to keep your flame burning and build a habit.', color: 'bg-kiwifruit-orange-light', dot: 'bg-kiwifruit-orange' },
  { title: 'Achievements', desc: 'Unlock badges for milestones like streaks and perfect scores.', color: 'bg-[oklch(93%_0.05_95)]', dot: 'bg-[oklch(75%_0.15_95)]' },
  { title: 'Leaderboard', desc: 'Compete against learners across New Zealand.', color: 'bg-sky-blue-light', dot: 'bg-sky-blue' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-[1180px] mx-auto flex items-center justify-between px-10 py-5">
        <div className="font-heading font-extrabold text-xl text-kiwi-green">KiwiDrive</div>
        <div className="flex items-center gap-5">
          <Link to="/auth" className="text-sm font-semibold text-ink-muted no-underline">Log In</Link>
          <Link
            to="/auth"
            className="font-heading font-bold text-sm text-white bg-kiwi-green px-5 py-2.5 rounded-xl shadow-[0_3px_0_var(--color-kiwi-green-dark)] no-underline"
          >
            Sign Up Free
          </Link>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-10 py-14 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-block font-heading font-bold text-xs tracking-wide text-[oklch(45%_0.14_152)] bg-kiwi-green-light px-3.5 py-1.5 rounded-full mb-4.5">
            FOR NEW ZEALAND LEARNER DRIVERS
          </div>
          <h1 className="font-heading font-extrabold text-[2.75rem] leading-[1.12] text-ink mb-4.5">
            Pass your learner licence test, one quiz at a time.
          </h1>
          <p className="text-base leading-relaxed text-ink-muted mb-7 max-w-[460px]">
            Earn XP, build a daily streak, and unlock badges while you master road rules, signs, and give-way scenarios — built for the NZ theory test.
          </p>
          <div className="flex gap-3.5 mb-8">
            <Link
              to="/auth"
              className="font-heading font-bold text-base text-white bg-kiwi-green px-7 py-3.5 rounded-2xl shadow-[0_4px_0_var(--color-kiwi-green-dark)] no-underline"
            >
              Start Learning Free
            </Link>
            <Link
              to="/auth"
              className="font-heading font-bold text-base text-ink-muted bg-transparent border-2 border-border-subtle px-6.5 py-3 rounded-2xl no-underline"
            >
              Try a Quiz
            </Link>
          </div>
          <div className="flex gap-6 text-[13px] text-ink-muted">
            <span>★ 6 practice categories</span>
            <span>★ Free to start</span>
            <span>★ No credit card</span>
          </div>
        </div>

        <div className="bg-card rounded-[28px] p-7 shadow-[0_2px_0_var(--color-border-subtle),0_24px_60px_oklch(30%_0.03_260/0.1)]">
          <div className="flex items-center justify-between mb-4.5">
            <div className="font-heading font-bold text-sm text-ink">Today's progress</div>
            <StreakFlame days={12} active />
          </div>
          <div className="mb-5">
            <XPBar current={320} max={500} level={4} />
          </div>
          <div className="font-heading font-bold text-[13px] text-ink mb-2.5">Recent badges</div>
          <div className="flex gap-3.5">
            <Badge label="7-Day Streak" unlocked />
            <Badge label="Perfect Score" unlocked />
            <Badge label="Top 10" unlocked={false} />
          </div>
        </div>
      </div>

      <div className="bg-card py-16 px-10 border-t border-border-subtle">
        <div className="max-w-[1180px] mx-auto">
          <h2 className="font-heading font-extrabold text-2xl text-ink text-center mb-10">
            Built to keep you coming back
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center px-2.5">
                <div className={`w-13 h-13 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-3.5`}>
                  <div className={`w-4.5 h-4.5 rounded-md ${f.dot}`} />
                </div>
                <div className="font-heading font-bold text-[15px] text-ink mb-1.5">{f.title}</div>
                <div className="text-[13px] text-ink-muted leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-14 px-10 text-center">
        <h2 className="font-heading font-extrabold text-2xl text-ink mb-4">Ready to get your restricted?</h2>
        <Link
          to="/auth"
          className="inline-block font-heading font-bold text-base text-white bg-kiwi-green px-8 py-3.5 rounded-2xl shadow-[0_4px_0_var(--color-kiwi-green-dark)] no-underline"
        >
          Create Your Free Account
        </Link>
      </div>

      <div className="border-t border-border-subtle py-6 px-10 text-center text-xs text-ink-light">
        KiwiDrive · An independent learner licence practice tool, not affiliated with Waka Kotahi NZTA.
      </div>
    </div>
  )
}