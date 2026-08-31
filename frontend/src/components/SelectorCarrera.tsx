import { FACULTIES, CAREERS_BY_FACULTY, BLOCK_DESCRIPTIONS, EXAM_DURATION_BY_BLOCK } from '../utils/constants'
import type { Career } from '../types'
import type { RegistrationFormErrors } from '../hooks/useRegistrationForm'

interface SelectorCarreraProps {
  selectedFaculty: string
  selectedCareer: string
  onFacultyChange: (faculty: string) => void
  onCareerChange: (careerId: string, career?: Career) => void
  errors: RegistrationFormErrors
  disabled?: boolean
}

export default function SelectorCarrera({
  selectedFaculty,
  selectedCareer,
  onFacultyChange,
  onCareerChange,
  errors,
  disabled = false,
}: SelectorCarreraProps) {
  const careers = selectedFaculty ? CAREERS_BY_FACULTY[selectedFaculty] || [] : []
  const selectedCareerData = careers.find((c) => c.id === selectedCareer)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-fraunces font-bold text-rumbo-burgundy mb-6">
          Selecciona tu Carrera
        </h3>
      </div>

      {/* Seleccionar Facultad */}
      <div>
        <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
          Facultad *
        </label>
        <select
          id="faculty"
          value={selectedFaculty}
          onChange={(e) => {
            onFacultyChange(e.target.value)
            onCareerChange('') // Reset carrera
          }}
          disabled={disabled}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            errors.faculty
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-rumbo-burgundy'
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
        >
          <option value="">Selecciona una facultad</option>
          {FACULTIES.map((faculty) => (
            <option key={faculty} value={faculty}>
              {faculty}
            </option>
          ))}
        </select>
        {errors.faculty && <p className="mt-1 text-sm text-red-600">{errors.faculty}</p>}
      </div>

      {/* Seleccionar Carrera */}
      {selectedFaculty && (
        <div>
          <label htmlFor="career" className="block text-sm font-medium text-gray-700 mb-2">
            Carrera Profesional *
          </label>
          <select
            id="career"
            value={selectedCareer}
            onChange={(e) => {
              const career = careers.find((c) => c.id === e.target.value)
              onCareerChange(e.target.value, career)
            }}
            disabled={disabled}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.careerId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-rumbo-burgundy'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          >
            <option value="">Selecciona una carrera</option>
            {careers.map((career) => (
              <option key={career.id} value={career.id}>
                {career.name}
              </option>
            ))}
          </select>
          {errors.careerId && <p className="mt-1 text-sm text-red-600">{errors.careerId}</p>}
        </div>
      )}

      {/* Resumen de la carrera seleccionada */}
      {selectedCareerData && (
        <div className="bg-rumbo-gray border-2 border-rumbo-burgundy rounded-lg p-6">
          <h4 className="text-lg font-fraunces font-bold text-rumbo-burgundy mb-4">
            Resumen de tu Evaluación
          </h4>

          <div className="space-y-3">
            {/* Carrera */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Carrera:</span>
              <span className="text-gray-900 font-bold">{selectedCareerData.name}</span>
            </div>

            {/* Bloque */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Bloque:</span>
              <div className="text-right">
                <div className="font-bold text-rumbo-burgundy text-lg">{selectedCareerData.block}</div>
                <div className="text-xs text-gray-600">
                  {BLOCK_DESCRIPTIONS[selectedCareerData.block]}
                </div>
              </div>
            </div>

            {/* Puntaje de corte referencial */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-300">
              <span className="text-gray-600 font-medium">Puntaje de Corte Referencial:</span>
              <span className="font-bold text-lg">
                <span className="text-rumbo-burgundy">{selectedCareerData.referentialScore}</span>
                <span className="text-xs text-gray-500 ml-1">/2000</span>
              </span>
            </div>

            {/* Duración estimada */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Duración Estimada:</span>
              <span className="font-bold">
                {EXAM_DURATION_BY_BLOCK[selectedCareerData.block]} minutos
              </span>
            </div>
          </div>

          {/* Nota */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-900">
              <strong>Nota:</strong> El puntaje de corte es referencial basado en procesos de admisión anteriores. Tu objetivo es alcanzar o superar este puntaje.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
