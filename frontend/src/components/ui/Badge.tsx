// src/components/ui/Badge.tsx
interface BadgeProps {
  label: string
  unlocked?: boolean
}

export default function Badge({ label, unlocked = true }: BadgeProps) {
  return (
    <div className="flex flex-col items-center gap-2.5 w-[132px]">
      {unlocked ? (
        <div className="w-19 h-19 rounded-[22px] flex items-center justify-center bg-gradient-to-br from-[oklch(80%_0.16_95)] to-[oklch(68%_0.19_45)] shadow-[0_4px_0_oklch(55%_0.15_45)]">
          <div className="w-8.5 h-8.5 rounded-[10px] bg-cream rotate-45" />
        </div>
      ) : (
        <div className="w-19 h-19 rounded-[22px] flex items-center justify-center bg-[oklch(93%_0.01_95)]">
          <div className="w-6.5 h-5 border-[3px] border-[oklch(75%_0.015_95)] rounded" />
        </div>
      )}
      <span className={`font-heading font-bold text-[13px] text-center leading-tight ${unlocked ? 'text-ink' : 'text-[oklch(65%_0.015_95)]'}`}>
        {label}
      </span>
    </div>
  )
}