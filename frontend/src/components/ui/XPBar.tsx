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
    <div className="bg-white/15 rounded-2xl px-5.5 py-5 backdrop-blur-[2px]">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[11px] bg-white/90 text-kiwi-green flex items-center justify-center font-heading font-extrabold text-[15px]">
            {level}
          </div>
          <span className="font-heading font-bold text-[15px] text-white">Level {level}</span>
        </div>
        <span className="text-[13px] font-semibold text-white/90">
          {current} / {max} XP &middot; {remaining} to next level
        </span>
      </div>
      <div className="w-full h-3.5 rounded-full bg-white/25 overflow-hidden">
        <div
          className="h-full rounded-full bg-[oklch(94%_0.1_95)] transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}