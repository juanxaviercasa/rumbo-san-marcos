import { useEffect, useMemo, useState } from 'react'
import { getAdminStats, getCareersAdmin, getQuestionsAdmin } from '../services/admin'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCareers: 0,
    totalQuestions: 0,
    activeCareers: 0,
    activeQuestions: 0,
    totalAreas: 0,
  })

  const [careersCount, setCareersCount] = useState(0)
  const [questionsCount, setQuestionsCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      const dashboardStats = await getAdminStats()
      const careers = await getCareersAdmin()
      const questions = await getQuestionsAdmin()

      setStats(dashboardStats)
      setCareersCount(careers.length)
      setQuestionsCount(questions.length)
    }

    load()
  }, [])

  const cards = useMemo(
    () => [
      { label: 'Carreras', value: careersCount, color: 'bg-rose-600' },
      { label: 'Preguntas', value: questionsCount, color: 'bg-amber-500' },
      { label: 'Carreras activas', value: stats.activeCareers, color: 'bg-emerald-600' },
      { label: 'Áreas', value: stats.totalAreas, color: 'bg-sky-600' },
    ],
    [careersCount, questionsCount, stats.activeCareers, stats.totalAreas],
  )

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Administración</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={`mb-4 h-2 w-12 rounded-full ${card.color}`} />
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Métricas principales</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span>Total de carreras</span>
              <strong>{stats.totalCareers}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span>Total de preguntas</span>
              <strong>{stats.totalQuestions}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span>Preguntas activas</span>
              <strong>{stats.activeQuestions}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Estado del sistema</span>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                listos
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Checklist de la fase 6</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-700">
            <li>• Base de datos inicial configurada</li>
            <li>• CRUD de carreras</li>
            <li>• CRUD de preguntas</li>
            <li>• Importación masiva desde JSON</li>
            <li>• Validación de datos mínima</li>
            <li>• Auditoría de cambios</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
