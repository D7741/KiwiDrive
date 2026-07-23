// src/pages/AdminPage.tsx
import { useEffect, useState } from 'react'
import { Button, Card, Input } from '../components/ui'
import * as questionsApi from '../api/questions'
import * as adminApi from '../api/admin'
import type { Question } from '../types'
import type { QuestionFormData } from '../api/admin'

const CATEGORIES = [
  { id: 1, name: 'Road Signs' },
  { id: 2, name: 'Speed Limits' },
  { id: 3, name: 'Give Way Rules' },
  { id: 4, name: 'Parking' },
  { id: 5, name: 'Alcohol & Drugs' },
  { id: 6, name: 'Night Driving' },
]

const emptyForm: QuestionFormData = {
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: 'A',
  explanation: '',
  categoryId: 1,
}

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<QuestionFormData>(emptyForm)
  const [formError, setFormError] = useState('')

  const loadQuestions = () => {
    setLoading(true)
    questionsApi
      .getQuestions()
      .then(setQuestions)
      .catch(() => setError('Could not load questions.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadQuestions, [])

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setFormOpen(true)
  }

  const openEdit = (q: Question) => {
    const category = CATEGORIES.find((c) => c.name === q.categoryName)
    setEditingId(q.id)
    setForm({
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: 'A', // 后端GET /api/questions不返回正确答案，编辑时需要重新选择
      explanation: '',
      categoryId: category?.id ?? 1,
    })
    setFormError('')
    setFormOpen(true)
  }

  const closeForm = () => setFormOpen(false)

  const handleSave = async () => {
    if (!form.text.trim() || !form.optionA.trim() || !form.optionB.trim()) {
      setFormError('Please fill in the question text and at least options A and B.')
      return
    }
    try {
      if (editingId != null) {
        await adminApi.updateQuestion(editingId, form)
      } else {
        await adminApi.createQuestion(form)
      }
      setFormOpen(false)
      loadQuestions()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save question.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this question? This cannot be undone.')) return
    try {
      await adminApi.deleteQuestion(id)
      loadQuestions()
    } catch {
      setError('Could not delete question.')
    }
  }

  if (loading) {
    return <div className="max-w-[1000px] mx-auto px-8 py-10 text-ink-muted">Loading questions...</div>
  }

  return (
    <div className="max-w-[1000px] mx-auto px-8 py-9 pb-24">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-heading font-extrabold text-2xl text-ink">Admin</h1>
        <span className="text-xs font-bold text-[oklch(50%_0.15_152)] bg-kiwi-green-light px-2.5 py-1 rounded-lg">
          Role: Admin
        </span>
      </div>
      <p className="text-[13.5px] text-ink-muted mb-7">Manage questions across all categories.</p>

      {error && <div className="text-alert-red text-sm mb-4">{error}</div>}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-base text-ink">Questions ({questions.length})</h2>
        <Button variant="primary" onClick={openNew}>+ Add question</Button>
      </div>

      <Card className="flex flex-col gap-2" padding="sm">
        {questions.map((q) => (
          <div key={q.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-cream">
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-kiwi-green uppercase tracking-wide">{q.categoryName}</div>
              <div className="text-[13.5px] font-semibold text-ink truncate">{q.text}</div>
            </div>
            <button
              onClick={() => openEdit(q)}
              className="text-xs font-semibold text-ink-muted border border-border-subtle rounded-lg px-2.5 py-1.5 bg-transparent cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(q.id)}
              className="text-xs font-semibold text-alert-red border border-[oklch(85%_0.06_25)] rounded-lg px-2.5 py-1.5 bg-transparent cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </Card>

      {formOpen && (
        <div className="fixed inset-0 bg-[oklch(20%_0.02_260/0.5)] flex items-center justify-center z-30 p-6">
          <Card className="max-w-[520px] w-full" padding="lg">
            <h2 className="font-heading font-bold text-lg text-ink mb-4">
              {editingId != null ? 'Edit question' : 'Add question'}
            </h2>

            {formError && (
              <div className="bg-alert-red-light text-alert-red text-xs font-semibold px-3 py-2.5 rounded-xl mb-3">
                {formError}
              </div>
            )}

            <label className="text-xs font-semibold text-ink-muted block mb-1.5">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
              className="w-full box-border px-3.5 py-3 rounded-xl border-[1.5px] border-border-subtle bg-card text-ink text-sm mb-3.5"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <Input label="Question text" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            <Input label="Option A" value={form.optionA} onChange={(e) => setForm({ ...form, optionA: e.target.value })} />
            <Input label="Option B" value={form.optionB} onChange={(e) => setForm({ ...form, optionB: e.target.value })} />
            <Input label="Option C" value={form.optionC} onChange={(e) => setForm({ ...form, optionC: e.target.value })} />
            <Input label="Option D" value={form.optionD} onChange={(e) => setForm({ ...form, optionD: e.target.value })} />

            <label className="text-xs font-semibold text-ink-muted block mb-1.5">Correct answer</label>
            <select
              value={form.correctAnswer}
              onChange={(e) => setForm({ ...form, correctAnswer: e.target.value as QuestionFormData['correctAnswer'] })}
              className="w-full box-border px-3.5 py-3 rounded-xl border-[1.5px] border-border-subtle bg-card text-ink text-sm mb-3.5"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>

            <Input label="Explanation" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />

            <div className="flex gap-2.5 justify-end mt-2">
              <Button variant="outline" onClick={closeForm}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>Save</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}