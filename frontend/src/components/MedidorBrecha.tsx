import { TrendingUp } from 'lucide-react'

interface MedidorBrechaProps {
  actualScore: number
  referentialScore: number
  gap: number
  percentage: number
}

export default function MedidorBrecha({
  actualScore,
  referentialScore,
  gap,
  percentage,
}: MedidorBrechaProps) {
  // Determinar color según porcentaje
  const getColor = () => {
    if (percentage >= 90) return '#10b981' // Verde
    if (percentage >= 75) return '#3b82f6' // Azul
    if (percentage >= 60) return '#f59e0b' // Naranja
    return '#ef4444' // Rojo
  }

  const color = getColor()
  const circumference = 2 * Math.PI * 45 // Radio 45
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="space-y-6">
      {/* Medidor circular */}
      <div className="flex justify-center">
        <div className="relative w-64 h-64">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 120 120">
            {/* Círculo de fondo */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />

            {/* Círculo de progreso */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000"
              transform="rotate(-90 60 60)"
            />

            {/* Texto central */}
            <text
              x="60"
              y="55"
              textAnchor="middle"
              fontSize="24"
              fontWeight="bold"
              fill="rgb(31, 41, 55)"
              className="font-fraunces"
            >
              {percentage.toFixed(0)}%
            </text>
            <text
              x="60"
              y="72"
              textAnchor="middle"
              fontSize="12"
              fill="rgb(107, 114, 128)"
            >
              del objetivo
            </text>
          </svg>
        </div>
      </div>

      {/* Información detallada */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
          <p className="text-sm font-medium text-gray-600">Tu Puntaje</p>
          <p className="text-3xl font-bold text-green-600 font-fraunces">
            {actualScore.toFixed(1)}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
          <p className="text-sm font-medium text-gray-600">Objetivo</p>
          <p className="text-3xl font-bold text-blue-600 font-fraunces">
            {referentialScore.toFixed(1)}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
          <p className="text-sm font-medium text-gray-600">Brecha</p>
          <p className="text-3xl font-bold text-orange-600 font-fraunces">
            {gap.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Barra de progreso detallada */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-900">Progreso</span>
          <span className="text-gray-600">{percentage.toFixed(1)}% completado</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-1000"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {/* Interpretación */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex gap-3">
          <TrendingUp className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {percentage >= 90
                ? '¡Excelente! Estás listo'
                : percentage >= 75
                  ? 'Buen desempeño, casi listo'
                  : percentage >= 60
                    ? 'Necesitas más práctica'
                    : 'Requiere trabajo intensivo'}
            </p>
            <p className="text-xs text-gray-600">
              {gap > 0
                ? `Necesitas ${gap.toFixed(1)} puntos más para alcanzar el objetivo`
                : '¡Has alcanzado o superado el objetivo!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
