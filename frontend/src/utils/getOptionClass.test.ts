import { describe, it, expect } from 'vitest'
import { getOptionClass } from './getOptionClass'

describe('getOptionClass', () => {
  // 1. Default state: not revealed, not selected.
  it('returns the default neutral style when not revealed and not selected', () => {
    const result = getOptionClass(0, null, 2, false)

    expect(result).toContain('border-border-subtle')
    expect(result).toContain('cursor-pointer')
    expect(result).not.toContain('green')
    expect(result).not.toContain('red')
    expect(result).not.toContain('blue')
  })

  // 2. Not revealed, this option is the selected one.
  it('returns the selected (blue) style when not revealed and this index is selected', () => {
    const result = getOptionClass(1, 1, 2, false)

    expect(result).toContain('border-sky-blue')
    expect(result).toContain('cursor-pointer')
    expect(result).not.toContain('green')
    expect(result).not.toContain('red')
  })

  // 3a. Revealed, this option is correct, and it's also the one the user picked.
  // Also doubles as the priority check: isCorrect must win even when
  // selectedIndex === correctIndex === index (isWrong's own condition requires
  // index !== correctIndex, so this isn't really ambiguous, but it's worth
  // pinning down as a regression guard).
  it('returns the correct (green) style when revealed, correct, and selected', () => {
    const result = getOptionClass(2, 2, 2, true)

    expect(result).toContain('border-kiwi-green')
    expect(result).toContain('cursor-default')
    expect(result).not.toContain('red')
    expect(result).not.toContain('blue')
  })

  // 3b. Revealed, this option is correct, but the user picked a different one (or nothing).
  it('returns the correct (green) style when revealed and correct, regardless of what was selected', () => {
    const pickedOther = getOptionClass(2, 0, 2, true)
    const pickedNothing = getOptionClass(2, null, 2, true)

    for (const result of [pickedOther, pickedNothing]) {
      expect(result).toContain('border-kiwi-green')
      expect(result).toContain('cursor-default')
      expect(result).not.toContain('red')
      expect(result).not.toContain('blue')
    }
  })

  // 4. Revealed, this option was selected, and it's wrong.
  it('returns the wrong (red) style when revealed and this index was selected but is not correct', () => {
    const result = getOptionClass(1, 1, 2, true)

    expect(result).toContain('border-alert-red')
    expect(result).toContain('cursor-default')
    expect(result).not.toContain('green')
    expect(result).not.toContain('blue')
  })

  // 5. Revealed, but this option is neither the selection nor the correct answer.
  it('returns the default neutral style when revealed but this option is neither selected nor correct', () => {
    const result = getOptionClass(0, 1, 2, true)

    expect(result).toContain('border-border-subtle')
    expect(result).not.toContain('green')
    expect(result).not.toContain('red')
    expect(result).not.toContain('blue')
  })

  // 6. Revealed with no selection at all (user gave up / time ran out).
  it('returns the default neutral style when revealed with no selection and this option is not correct', () => {
    const result = getOptionClass(0, null, 2, true)

    expect(result).toContain('border-border-subtle')
    expect(result).not.toContain('green')
    expect(result).not.toContain('red')
    expect(result).not.toContain('blue')
  })

  it('still highlights the correct answer green when revealed with no selection at all', () => {
    const result = getOptionClass(2, null, 2, true)

    expect(result).toContain('border-kiwi-green')
    expect(result).not.toContain('red')
    expect(result).not.toContain('blue')
  })
})
