import { BookOpen, Clock, CheckCircle, AlertCircle, Zap } from 'lucide-react'

interface PriorityTopic {
  topic: string
  course: string
  issues: number
  recommendation: string
}

interface RutaEstudioProps {
  priority: PriorityTopic[]
  estimatedHours: number
  studyPlan: string[]
  percentage: number
}

export default function RutaEstudio({
  priority,
  estimatedHours,
  studyPlan,
  percentage,
}: RutaEstudioProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-rumbo-burgundy" />
        <h3 className="text-lg font-semibold text-gray-900">Ruta de Estudio Personalizada</h3>
      </div>

      {/* Resumen rápido */}
      <div className="bg-gradient-to-r from-rumbo-light to-rumbo-gold/20 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-rumbo-dark mb-1">Tiempo Estimado</p>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-rumbo-burgundy" />
              <p className="text-2xl font-bold text-rumbo-burgundy font-fraunces">
                {estimatedHours}h
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-rumbo-dark mb-1">Tu Progreso</p>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-rumbo-burgundy" />
              <p className="text-2xl font-bold text-rumbo-burgundy font-fraunces">
                {percentage.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {/* Barra de tiempo */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-rumbo-dark">Dedicación sugerida por día</p>
          <p className="text-sm text-rumbo-dark/80">
            {Math.ceil(estimatedHours / 7)} horas diarias durante 1 semana (o {Math.ceil(estimatedHours / 14)} horas diarias durante 2 semanas)
          </p>
        </div>
      </div>

      {/* Temas prioritarios */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-600" />
          Temas Prioritarios
        </h4>

        <div className="space-y-2">
          {priority.length > 0 ? (
            priority.slice(0, 8).map((item, index) => (
              <div
                key={`${item.topic}-${index}`}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-rumbo-burgundy transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{item.topic}</p>
                    <p className="text-xs text-gray-600">{item.course}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                    {item.issues} errores
                  </span>
                </div>
                <p className="text-sm text-gray-700">{item.recommendation}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p>¡Excelente! No hay temas prioritarios</p>
            </div>
          )}
        </div>
      </div>

      {/* Plan de estudio */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-rumbo-burgundy" />
          Plan de Estudio Recomendado
        </h4>

        <ol className="space-y-2">
          {studyPlan.map((step, index) => (
            <li
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 flex gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-rumbo-burgundy text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              <p className="text-gray-900 font-medium pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Consejos finales */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-2">
        <h4 className="font-semibold text-blue-900 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Consejos para mejorar
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Estudia en bloques de 45-50 minutos con descansos</li>
          <li>✓ Resuelve ejercicios prácticos de cada tema</li>
          <li>✓ Haz un simulacro cada 3 días para medir progreso</li>
          <li>✓ Revisa explicaciones de tus errores frecuentes</li>
          <li>✓ Duerme bien antes del examen final</li>
        </ul>
      </div>
    </div>
  )
}
