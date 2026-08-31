import { useRef, useState } from 'react'
import { importAdminData } from '../services/admin'

export default function AdminImportPage() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [summary, setSummary] = useState<null | {
    importedCareers: number
    importedQuestions: number
    totalCareers: number
    totalQuestions: number
    warnings: string[]
  }>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = async (file: File) => {
    if (!file) return

    try {
      setLoading(true)
      setError('')
      const text = await file.text()
      const parsed = JSON.parse(text)
      const result = await importAdminData(parsed)
      setSummary(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar el archivo JSON.')
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Contenido</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Importación masiva</h2>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-700">Arrastra tu archivo JSON aquí</p>
        <p className="mt-2 text-sm text-slate-500">Se validará la estructura antes de guardar</p>

        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) handleFile(file)
          }}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-5 rounded-lg bg-rose-700 px-4 py-2 font-semibold text-white hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Seleccionar archivo'}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {summary && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Resultado de la importación</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Carreras importadas</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{summary.importedCareers}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Preguntas importadas</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{summary.importedQuestions}</p>
            </div>
          </div>

          {summary.warnings.length > 0 && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="mb-2 font-semibold text-amber-800">Advertencias</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900">
                {summary.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900">Validaciones recomendadas</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Archivo debe ser un JSON válido</li>
          <li>cada carrera requiere código, nombre, facultad y bloque</li>
          <li>cada pregunta debe tener 4 opciones y una opción correcta válida</li>
          <li>duplicados se detectan por código o contenido</li>
          <li>errores se reportan antes de importarse</li>
        </ul>
      </div>
    </div>
  )
}
