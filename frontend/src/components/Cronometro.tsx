import { Clock, AlertCircle } from 'lucide-react'

interface CronometroProps {
  timeFormatted: string
  percentage: number
  isWarning: boolean
  isAlarm: boolean
  hasExpired: boolean
}

export default function Cronometro({
  timeFormatted,
  percentage,
  isWarning,
  isAlarm,
  hasExpired,
}: CronometroProps) {
  // Determinar colores según estado
  const getTimerColor = () => {
    if (hasExpired) return 'text-red-600'
    if (isAlarm) return 'text-red-600'
    if (isWarning) return 'text-orange-600'
    return 'text-rumbo-burgundy'
  }

  const getProgressColor = () => {
    if (hasExpired) return 'bg-red-600'
    if (isAlarm) return 'bg-red-600'
    if (isWarning) return 'bg-orange-500'
    return 'bg-rumbo-burgundy'
  }

  return (
    <div className="space-y-3">
      {/* Display del tiempo */}
      <div className="flex items-center justify-center gap-3">
        <Clock className={`w-6 h-6 ${getTimerColor()} transition-colors`} />
        <div className={`text-5xl font-fraunces font-bold ${getTimerColor()} transition-colors`}>
          {timeFormatted}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Alertas */}
      {isWarning && !isAlarm && (
        <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
          <p className="text-sm text-orange-800 font-medium">
            Te quedan menos de 5 minutos
          </p>
        </div>
      )}

      {isAlarm && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-pulse">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800 font-bold">
            ¡URGENTE! Menos de 1 minuto. Tu evaluación se enviará automáticamente.
          </p>
        </div>
      )}

      {hasExpired && (
        <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-400 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800 font-bold">
            ¡Se acabó el tiempo! Tu evaluación está siendo enviada...
          </p>
        </div>
      )}
    </div>
  )
}
