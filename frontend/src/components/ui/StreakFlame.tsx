// src/components/ui/StreakFlame.tsx
interface StreakFlameProps {
  days: number
  active?: boolean
}

export default function StreakFlame({ days, active = true }: StreakFlameProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-9.5 h-9.5">
        <div
          className={`absolute inset-0 rounded-tr-full rounded-tl-full rounded-bl-full -rotate-45 ${
            active
              ? 'bg-gradient-to-br from-[oklch(80%_0.17_85)] to-kiwifruit-orange'
              : 'bg-[oklch(88%_0.01_95)]'
          }`}
        />
        <div
          className={`absolute w-4 h-4 top-3 left-2.5 rounded-tr-full rounded-tl-full rounded-bl-full -rotate-45 ${
            active ? 'bg-[oklch(90%_0.1_95)]' : 'bg-[oklch(94%_0.005_95)]'
          }`}
        />
      </div>
      <div>
        <div className="font-heading font-extrabold text-[22px] text-ink leading-none">{days}</div>
        <div className="text-[12.5px] text-ink-light font-semibold">day streak</div>
      </div>
    </div>
  )
}