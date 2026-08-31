import { useEffect, useState } from 'react'
import type { Career } from '../types'
import {
  createCareerAdmin,
  deleteCareerAdmin,
  getCareersAdmin,
  updateCareerAdmin,
} from '../services/admin'
import { validateCareerInput } from '../services/admin-validation'

const defaultWeights: Career['weights'] = {
  mathematics: 1,
  physics: 0.7,
  chemistry: 0.7,
  biology: 0.7,
  spanish: 0.5,
  history: 0.3,
  geography: 0.3,
  civics: 0.2,
}

const initialForm = {
  code: '',
  name: '',
  faculty: '',
  block: 'A' as Career['block'],
  referentialScore: 1500,
  estimatedDuration: 180,
  weights: defaultWeights,
}

export default function AdminCareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const data = await getCareersAdmin()
      setCareers(data)
    }

    load()
  }, [])

  const resetForm = () => {
    setForm(initialForm)
    setErrors([])
    setIsEditing(false)
    setEditingId(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const validationErrors = validateCareerInput(form)
    if (validationErrors.length) {
      setErrors(validationErrors)
      return
    }

    const payload = {
      ...form,
      weights: form.weights ?? defaultWeights,
    }

    if (isEditing && editingId) {
      const updated = await updateCareerAdmin(editingId, payload)
      setCareers((previous) => previous.map((career) => (career.id === editingId ? updated : career)))
    } else {
      const created = await createCareerAdmin(payload)
      setCareers((previous) => [created, ...previous])
    }

    resetForm()
  }

  const handleEdit = (career: Career) => {
    setForm({
      code: career.code,
      name: career.name,
      faculty: career.faculty,
      block: career.block,
      referentialScore: career.referentialScore,
      estimatedDuration: career.estimatedDuration,
      weights: career.weights ?? defaultWeights,
    })
    setEditingId(career.id)
    setIsEditing(true)
    setErrors([])
  }

  const handleDelete = async (careerId: string) => {
    const ok = window.confirm('¿Deseas eliminar esta carrera?')
    if (!ok) return

    const deleted = await deleteCareerAdmin(careerId)
    if (deleted) {
      setCareers((previous) => previous.filter((career) => career.id !== careerId))
      if (editingId === careerId) resetForm()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Contenido</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Carreras</h2>
        </div>
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="text-sm text-slate-700">
            Código
            <input
              value={form.code}
              onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="MED001"
            />
          </label>

          <label className="text-sm text-slate-700 md:col-span-2">
            Nombre
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Medicina Humana"
            />
          </label>

          <label className="text-sm text-slate-700">
            Facultad
            <input
              value={form.faculty}
              onChange={(event) => setForm((current) => ({ ...current, faculty: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Medicina"
            />
          </label>

          <label className="text-sm text-slate-700">
            Bloque
            <select
              value={form.block}
              onChange={(event) =>
                setForm((current) => ({ ...current, block: event.target.value as Career['block'] }))
              }
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
            Puntaje
            <input
              type="number"
              min={1}
              value={form.referentialScore}
              onChange={(event) =>
                setForm((current) => ({ ...current, referentialScore: Number(event.target.value) }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="text-sm text-slate-700">
            Duración (min)
            <input
              type="number"
              min={1}
              value={form.estimatedDuration}
              onChange={(event) =>
                setForm((current) => ({ ...current, estimatedDuration: Number(event.target.value) }))
              }
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
        </div>

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
            {isEditing ? 'Actualizar carrera' : 'Guardar carrera'}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Código</th>
              <th className="px-4 py-3 font-semibold">Carrera</th>
              <th className="px-4 py-3 font-semibold">Facultad</th>
              <th className="px-4 py-3 font-semibold">Bloque</th>
              <th className="px-4 py-3 font-semibold">Puntaje</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {careers.map((career) => (
              <tr key={career.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{career.code}</td>
                <td className="px-4 py-3">{career.name}</td>
                <td className="px-4 py-3">{career.faculty}</td>
                <td className="px-4 py-3">{career.block}</td>
                <td className="px-4 py-3">{career.referentialScore}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(career)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(career.id)}
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
