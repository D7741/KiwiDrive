// src/components/ui/XPBar.tsx
interface XPBarProps {
  current: number
  max: number
  level: number
}

export default function XPBar({ current, max, level }: XPBarProps) {
  const pct = Math.min(100, Math.round((current / max) * 100))
  const remaining = max - current

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[11px] bg-kiwi-green text-white flex items-center justify-center font-heading font-extrabold text-[15px] shrink-0">
            {level}
          </div>
          <span className="font-heading font-bold text-[15px] text-ink">Level {level}</span>
        </div>
        <span className="text-[13px] font-semibold text-ink-muted text-right">
          {current} / {max} XP &middot; {remaining} to next level
        </span>
      </div>
      <div className="w-full h-3.5 rounded-full bg-kiwi-green-light overflow-hidden">
        <div
          className="h-full rounded-full bg-kiwi-green transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}