// src/pages/QuizPage.tsx
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Button, Card, QuestionCard } from '../components/ui'
import * as questionsApi from '../api/questions'
import type { Question, AnswerResult } from '../types'

const CATEGORIES = [
  { name: 'Road Signs', color: 'bg-sky-blue' },
  { name: 'Speed Limits', color: 'bg-alert-red' },
  { name: 'Give Way Rules', color: 'bg-kiwifruit-orange' },
  { name: 'Parking', color: 'bg-kiwi-green' },
  { name: 'Alcohol & Drugs', color: 'bg-[oklch(70%_0.14_300)]' },
  { name: 'Night Driving', color: 'bg-[oklch(38%_0.12_270)]' },
]

const QUIZ_LENGTH = 5
const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const

type Phase = 'select' | 'quiz' | 'summary'

export default function QuizPage() {
  const [searchParams] = useSearchParams()
  const [phase, setPhase] = useState<Phase>('select')
  const [category, setCategory] = useState<string | null>(null)
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [selectedKey, setSelectedKey] = useState<typeof OPTION_KEYS[number] | null>(null)
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    questionsApi.getQuestions().then(setAllQuestions).catch(() => setError('Could not load questions.'))
  }, [])

  useEffect(() => {
    const catParam = searchParams.get('category')
    if (catParam && allQuestions.length > 0) {
      startQuiz(catParam)
    }
  }, [allQuestions]) // eslint-disable-line react-hooks/exhaustive-deps

  const startQuiz = (categoryName: string) => {
    const filtered = allQuestions.filter((q) => q.categoryName === categoryName)
    if (filtered.length === 0) {
      setError(`No questions available for "${categoryName}" yet.`)
      return
    }
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, QUIZ_LENGTH)
    setError('')
    setCategory(categoryName)
    setQuizQuestions(shuffled)
    setQIndex(0)
    setSelectedKey(null)
    setResult(null)
    setCorrectCount(0)
    setXpEarned(0)
    setPhase('quiz')
  }

  const currentQuestion = quizQuestions[qIndex]

  const handleSelect = async (index: number) => {
    if (result || !currentQuestion) return
    const key = OPTION_KEYS[index]
    setSelectedKey(key)
    setLoading(true)
    setError('')
    try {
      const res = await questionsApi.submitAnswer(currentQuestion.id, key)
      setResult(res)
      if (res.isCorrect) setCorrectCount((c) => c + 1)
      setXpEarned((x) => x + res.xpEarned)
    } catch {
      setError('Could not submit answer. Please try again.')
      setSelectedKey(null)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (qIndex < quizQuestions.length - 1) {
      setQIndex((i) => i + 1)
      setSelectedKey(null)
      setResult(null)
    } else {
      setPhase('summary')
    }
  }

  const handleRestart = () => {
    setPhase('select')
    setCategory(null)
  }

  // ---- Select Phase ----
  if (phase === 'select') {
    return (
      <div className="max-w-[760px] mx-auto px-8 py-12">
        <h1 className="font-heading font-extrabold text-2xl text-ink mb-2">Pick a category</h1>
        <p className="text-sm text-ink-muted mb-7">Choose a topic to start a {QUIZ_LENGTH}-question practice quiz.</p>
        {error && <div className="text-alert-red text-sm mb-4">{error}</div>}
        <div className="grid grid-cols-2 gap-3.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => startQuiz(cat.name)}
              className="text-left cursor-pointer bg-card border-none rounded-2xl p-5 flex flex-col gap-2 shadow-[0_2px_0_var(--color-border-subtle)] hover:shadow-[0_4px_0_var(--color-border-subtle)]"
            >
              <div className={`w-7 h-7 rounded-[9px] ${cat.color}`} />
              <div className="font-heading font-bold text-[15px] text-ink">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ---- Quiz Phase ----
  if (phase === 'quiz' && currentQuestion) {
    const qPct = Math.round(((qIndex + (result ? 1 : 0)) / quizQuestions.length) * 100)
    const options = [
      { text: currentQuestion.optionA },
      { text: currentQuestion.optionB },
      { text: currentQuestion.optionC },
      { text: currentQuestion.optionD },
    ]
    const correctIndex = result ? OPTION_KEYS.indexOf(result.correctAnswer as typeof OPTION_KEYS[number]) : -1
    const selectedIndex = selectedKey ? OPTION_KEYS.indexOf(selectedKey) : null

    return (
      <div className="max-w-[760px] mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-5">
          <div className="font-heading font-bold text-sm text-ink-muted">{category}</div>
          <div className="text-[13px] font-bold text-[oklch(45%_0.02_260)]">
            Question {qIndex + 1} of {quizQuestions.length}
          </div>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[oklch(92%_0.015_95)] overflow-hidden mb-8">
          <div
            className="h-full rounded-full bg-kiwi-green transition-[width] duration-400"
            style={{ width: `${qPct}%` }}
          />
        </div>

        {error && <div className="text-alert-red text-sm mb-4 text-center">{error}</div>}

        <div className="flex justify-center">
          <QuestionCard
            question={currentQuestion.text}
            options={options}
            selectedIndex={selectedIndex}
            correctIndex={correctIndex}
            revealed={!!result}
            explanation={result?.explanation}
            onSelect={handleSelect}
          />
        </div>

        <div className="flex justify-center mt-6">
          {result ? (
            <Button variant="primary" onClick={handleNext}>
              {qIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          ) : (
            <button
              disabled
              className="font-heading font-bold text-base text-[oklch(70%_0.01_95)] bg-[oklch(90%_0.01_95)] border-none rounded-2xl px-10 py-3.5 cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ---- Summary Phase ----
  if (phase === 'summary') {
    const isPerfect = correctCount === quizQuestions.length
    return (
      <div className="fixed inset-0 bg-[oklch(20%_0.02_260/0.55)] flex items-center justify-center z-10">
        <Card padding="lg" className="max-w-[420px] w-[90%] text-center">
          <div className="font-heading font-extrabold text-2xl text-ink mb-1.5">Quiz complete!</div>
          <div className="text-sm text-ink-muted mb-6">{category}</div>
          <div className="flex justify-center gap-7 mb-6">
            <div>
              <div className="font-heading font-extrabold text-[28px] text-kiwi-green">
                {correctCount}/{quizQuestions.length}
              </div>
              <div className="text-xs text-ink-light font-semibold">Correct</div>
            </div>
            <div>
              <div className="font-heading font-extrabold text-[28px] text-sky-blue">+{xpEarned}</div>
              <div className="text-xs text-ink-light font-semibold">XP earned</div>
            </div>
          </div>
          {isPerfect && (
            <div className="mb-6 text-sm font-heading font-bold text-kiwi-green">🎉 Perfect score!</div>
          )}
          <div className="flex flex-col gap-2.5">
            <Link to="/dashboard" className="no-underline">
              <Button variant="primary" className="w-full">Back to Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={handleRestart} className="w-full">
              Try Another Category
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return null
}