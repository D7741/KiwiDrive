// src/components/ui/QuestionCard.tsx
import { getOptionClass } from '../../utils/getOptionClass'

interface Option {
  text: string
}

interface QuestionCardProps {
  question: string
  options: Option[]
  selectedIndex: number | null
  correctIndex: number
  revealed: boolean
  explanation?: string
  onSelect: (index: number) => void
}

export default function QuestionCard({
  question,
  options,
  selectedIndex,
  correctIndex,
  revealed,
  explanation,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-[560px] bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_2px_0_var(--color-border-subtle),0_12px_28px_oklch(30%_0.03_260/0.08)] box-border">
      <div className="font-heading font-bold text-lg sm:text-xl text-ink mb-4 sm:mb-5 leading-snug">
        {question}
      </div>
      <div className="flex flex-col gap-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !revealed && onSelect(i)}
            className={`text-left font-semibold text-sm sm:text-[15px] px-4 sm:px-4.5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl w-full box-border transition-colors min-h-[48px] ${getOptionClass(i, selectedIndex, correctIndex, revealed)}`}
          >
            {opt.text}
          </button>
        ))}
      </div>
      {revealed && explanation && (
        <div className="mt-4 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl bg-cream text-sm text-ink-muted leading-relaxed">
          <strong className="text-ink">Why: </strong>
          {explanation}
        </div>
      )}
    </div>
  )
}