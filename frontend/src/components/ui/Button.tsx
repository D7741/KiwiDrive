// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'text-white bg-kiwi-green shadow-[0_4px_0_var(--color-kiwi-green-dark)] hover:brightness-105 active:translate-y-[3px] active:shadow-[0_1px_0_var(--color-kiwi-green-dark)]',
  secondary:
    'text-kiwi-green bg-kiwi-green-light shadow-[0_4px_0_oklch(85%_0.06_152)] hover:brightness-95 active:translate-y-[3px] active:shadow-[0_1px_0_oklch(85%_0.06_152)]',
  outline:
    'text-ink-muted bg-transparent border-2 border-border-subtle hover:bg-cream',
}

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`font-heading font-bold text-base rounded-2xl px-7 py-3.5 cursor-pointer transition-transform ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}