import type { RegistrationFormData, RegistrationFormErrors } from '../hooks/useRegistrationForm'

interface FormularioRegistroProps {
  data: RegistrationFormData
  errors: RegistrationFormErrors
  onChange: (field: keyof RegistrationFormData, value: string) => void
  disabled?: boolean
}

export default function FormularioRegistro({
  data,
  errors,
  onChange,
  disabled = false,
}: FormularioRegistroProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-fraunces font-bold text-rumbo-burgundy mb-6">
          Tus Datos
        </h3>
      </div>

      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre Completo *
        </label>
        <input
          id="name"
          type="text"
          value={data.studentName}
          onChange={(e) => onChange('studentName', e.target.value)}
          disabled={disabled}
          placeholder="Ej: Juan Pérez López"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            errors.studentName
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-rumbo-burgundy'
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
        {errors.studentName && (
          <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico *
        </label>
        <input
          id="email"
          type="email"
          value={data.studentEmail}
          onChange={(e) => onChange('studentEmail', e.target.value)}
          disabled={disabled}
          placeholder="ej@correo.com"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            errors.studentEmail
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-rumbo-burgundy'
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
        {errors.studentEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.studentEmail}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono *
        </label>
        <input
          id="phone"
          type="tel"
          value={data.studentPhone}
          onChange={(e) => onChange('studentPhone', e.target.value)}
          disabled={disabled}
          placeholder="+51 999 999 999 o 999999999"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            errors.studentPhone
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-rumbo-burgundy'
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
        {errors.studentPhone && (
          <p className="mt-1 text-sm text-red-600">{errors.studentPhone}</p>
        )}
      </div>

      {/* Nota de privacidad */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Nota:</strong> Tus datos serán usados únicamente para registrar tu evaluación y contactarte con los resultados.
        </p>
      </div>
    </div>
  )
}
