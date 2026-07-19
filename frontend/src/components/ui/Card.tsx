// src/components/ui/Card.tsx
import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-5.5',
  lg: 'p-7',
}

export default function Card({ children, padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-card rounded-3xl shadow-[0_2px_0_var(--color-border-subtle)] ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}