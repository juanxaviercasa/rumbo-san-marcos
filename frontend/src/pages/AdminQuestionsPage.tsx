import { useEffect, useState } from 'react'
import type { Question } from '../types'
import {
  createQuestionAdmin,
  deleteQuestionAdmin,
  getQuestionsAdmin,
  updateQuestionAdmin,
} from '../services/admin'
import { validateQuestionInput } from '../services/admin-validation'

const templateQuestion = {
  topic: '',
  course: '',
  area: 'A' as Question['area'],
  difficulty: 'basic' as Question['difficulty'],
  content: '',
  explanation: '',
  correctOptionId: 'opt-1',
  options: [
    { id: 'opt-1', text: '', isCorrect: true },
    { id: 'opt-2', text: '', isCorrect: false },
    { id: 'opt-3', text: '', isCorrect: false },
    { id: 'opt-4', text: '', isCorrect: false },
  ],
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [form, setForm] = useState(templateQuestion)
  const [errors, setErrors] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const data = await getQuestionsAdmin()
      setQuestions(data)
    }

    load()
  }, [])

  const resetForm = () => {
    setForm(templateQuestion)
    setErrors([])
    setIsEditing(false)
    setEditingId(null)
  }

  const updateOptionText = (index: number, value: string) => {
    setForm((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, text: value } : option,
      ),
    }))
  }

  const handleCorrectOptionChange = (optionId: string) => {
    setForm((current) => ({
      ...current,
      correctOptionId: optionId,
      options: current.options.map((option) => ({
        ...option,
        isCorrect: option.id === optionId,
      })),
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const payload = {
      ...form,
      options: form.options.map((option) => ({
        ...option,
        isCorrect: option.id === form.correctOptionId,
      })),
    }

    const validationErrors = validateQuestionInput(payload)
    if (validationErrors.length) {
      setErrors(validationErrors)
      return
    }

    if (isEditing && editingId) {
      const updated = await updateQuestionAdmin(editingId, payload)
      setQuestions((previous) => previous.map((question) => (question.id === editingId ? updated : question)))
    } else {
      const created = await createQuestionAdmin(payload)
      setQuestions((previous) => [created, ...previous])
    }

    resetForm()
  }

  const handleEdit = (question: Question) => {
    setForm({
      topic: question.topic,
      course: question.course,
      area: question.area,
      difficulty: question.difficulty,
      content: question.content,
      explanation: question.explanation,
      correctOptionId: question.correctOptionId,
      options: (question.options ?? []).map((option) => ({
        ...option,
        isCorrect: option.id === question.correctOptionId,
      })),
    })
    setEditingId(question.id)
    setIsEditing(true)
    setErrors([])
  }

  const handleDelete = async (questionId: string) => {
    const ok = window.confirm('¿Deseas eliminar esta pregunta?')
    if (!ok) return

    const deleted = await deleteQuestionAdmin(questionId)
    if (deleted) {
      setQuestions((previous) => previous.filter((question) => question.id !== questionId))
      if (editingId === questionId) resetForm()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Contenido</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Preguntas</h2>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {errors.length > 0 && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <ul className="list-disc space-y-1 pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-700">
            Tema
            <input
              value={form.topic}
              onChange={(event) => setForm((current) => ({ ...current, topic: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="text-sm text-slate-700">
            Curso
            <input
              value={form.course}
              onChange={(event) => setForm((current) => ({ ...current, course: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="text-sm text-slate-700">
            Área
            <select
              value={form.area}
              onChange={(event) => setForm((current) => ({ ...current, area: event.target.value as Question['area'] }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </label>

          <label className="text-sm text-slate-700">
            Dificultad
            <select
              value={form.difficulty}
              onChange={(event) =>
                setForm((current) => ({ ...current, difficulty: event.target.value as Question['difficulty'] }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="basic">basic</option>
              <option value="intermediate">intermediate</option>
              <option value="advanced">advanced</option>
            </select>
          </label>
        </div>

        <label className="mt-4 block text-sm text-slate-700">
          Enunciado
          <textarea
            value={form.content}
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            className="mt-1 min-h-[100px] w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {form.options.map((option, index) => (
            <div key={option.id} className="rounded-xl border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Opción {index + 1}</span>
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="radio"
                    checked={form.correctOptionId === option.id}
                    onChange={() => handleCorrectOptionChange(option.id)}
                  />
                  Correcta
                </label>
              </div>
              <input
                value={option.text}
                onChange={(event) => updateOptionText(index, event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
          ))}
        </div>

        <label className="mt-4 block text-sm text-slate-700">
          Explicación
          <textarea
            value={form.explanation}
            onChange={(event) => setForm((current) => ({ ...current, explanation: event.target.value }))}
            className="mt-1 min-h-[80px] w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        <div className="mt-5 flex justify-end gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
          )}
          <button type="submit" className="rounded-lg bg-rose-700 px-4 py-2 font-semibold text-white hover:bg-rose-800">
            {isEditing ? 'Actualizar pregunta' : 'Guardar pregunta'}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Tema</th>
              <th className="px-4 py-3 font-semibold">Curso</th>
              <th className="px-4 py-3 font-semibold">Área</th>
              <th className="px-4 py-3 font-semibold">Dificultad</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id} className="border-t border-slate-200 align-top">
                <td className="px-4 py-3">{question.topic}</td>
                <td className="px-4 py-3">{question.course}</td>
                <td className="px-4 py-3">{question.area}</td>
                <td className="px-4 py-3">{question.difficulty}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(question)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(question.id)}
                      className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
