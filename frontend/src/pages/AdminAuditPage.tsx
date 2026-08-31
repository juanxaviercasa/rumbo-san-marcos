import { useEffect, useState } from 'react'
import { getAuditEntries, type AuditEntry } from '../services/admin'

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await getAuditEntries()
      setEntries(data)
    }

    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Sistema</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Auditoría</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Última acción</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{entries[0]?.action ?? 'Sin registros'}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Colección</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{entries[0]?.collection ?? '—'}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Registros</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{entries.length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Usuario</th>
              <th className="px-4 py-3 font-semibold">Acción</th>
              <th className="px-4 py-3 font-semibold">Colección</th>
              <th className="px-4 py-3 font-semibold">Registro</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-t border-slate-200">
                <td className="px-4 py-3">{entry.userId}</td>
                <td className="px-4 py-3">{entry.action}</td>
                <td className="px-4 py-3">{entry.collection}</td>
                <td className="px-4 py-3">{entry.recordId}</td>
                <td className="px-4 py-3">{new Date(entry.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
