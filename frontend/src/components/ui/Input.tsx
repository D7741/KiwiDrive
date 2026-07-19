// src/components/ui/Input.tsx
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="text-sm font-semibold text-[oklch(30%_0.03_260)] block mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full box-border px-3.5 py-3 rounded-xl border-[1.5px] border-border-subtle text-sm font-body focus:outline-2 focus:outline-sky-blue focus:outline-offset-1 ${className}`}
        {...props}
      />
      {error && (
        <div className="text-alert-red text-xs mt-1.5 font-semibold">{error}</div>
      )}
    </div>
  )
}