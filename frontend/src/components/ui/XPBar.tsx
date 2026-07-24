// src/components/ui/XPBar.tsx
interface XPBarProps {
  current: number
  max: number
  level: number
  variant?: 'onLight' | 'onDark'
}

export default function XPBar({ current, max, level, variant = 'onLight' }: XPBarProps) {
  const pct = Math.min(100, Math.round((current / max) * 100))
  const remaining = max - current
  const isDark = variant === 'onDark'

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-[11px] flex items-center justify-center font-heading font-extrabold text-[15px] shrink-0 ${
              isDark ? 'bg-white/90 text-kiwi-green' : 'bg-kiwi-green text-white'
            }`}
          >
            {level}
          </div>
          <span className={`font-heading font-bold text-[15px] ${isDark ? 'text-white' : 'text-ink'}`}>
            Level {level}
          </span>
        </div>
        <span className={`text-[13px] font-semibold text-right ${isDark ? 'text-white/90' : 'text-ink-muted'}`}>
          {current} / {max} XP &middot; {remaining} to next level
        </span>
      </div>
      <div className={`w-full h-3.5 rounded-full overflow-hidden ${isDark ? 'bg-white/25' : 'bg-kiwi-green-light'}`}>
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            isDark ? 'bg-[oklch(94%_0.1_95)]' : 'bg-kiwi-green'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}