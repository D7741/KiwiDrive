export function getOptionClass(
  index: number,
  selectedIndex: number | null,
  correctIndex: number,
  revealed: boolean,
): string {
  const isCorrect = revealed && index === correctIndex
  const isWrong = revealed && index === selectedIndex && index !== correctIndex
  const isSelected = !revealed && index === selectedIndex

  if (isCorrect) {
    return 'border-2 border-kiwi-green bg-kiwi-green-light text-kiwi-green-dark cursor-default'
  }
  if (isWrong) {
    return 'border-2 border-alert-red bg-alert-red-light text-alert-red cursor-default'
  }
  if (isSelected) {
    return 'border-2 border-sky-blue bg-sky-blue-light text-sky-blue-dark cursor-pointer'
  }
  return 'border-2 border-border-subtle bg-card text-ink cursor-pointer hover:border-[oklch(70%_0.02_95)]'
}
