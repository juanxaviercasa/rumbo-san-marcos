import { BarChart3, AlertCircle, CheckCircle } from 'lucide-react'

interface DesgloseItem {
  area: string
  total: number
  correct: number
  incorrect: number
  blank: number
  percentage: number
}

interface DesglosePorAreaProps {
  data: DesgloseItem[]
}

export default function DesglosePorArea({ data }: DesglosePorAreaProps) {
  // Ordenar por porcentaje descendente
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-rumbo-burgundy" />
        <h3 className="text-lg font-semibold text-gray-900">Desempeño por Área</h3>
      </div>

      {/* Grid de áreas */}
      <div className="grid grid-cols-1 gap-3">
        {sortedData.map((item) => {
          const statusColor =
            item.percentage >= 80
              ? 'text-green-600 bg-green-50'
              : item.percentage >= 60
                ? 'text-orange-600 bg-orange-50'
                : 'text-red-600 bg-red-50'

          const barColor =
            item.percentage >= 80 ? 'bg-green-500' : item.percentage >= 60 ? 'bg-orange-500' : 'bg-red-500'

          return (
            <div key={item.area} className="rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Encabezado del área */}
              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">Bloque {item.area}</p>
                  <p className="text-xs text-gray-600">
                    {item.correct} correctas • {item.incorrect} incorrectas • {item.blank} en blanco
                  </p>
                </div>
                <div className={`text-right ${statusColor} rounded-lg px-3 py-2 font-bold text-sm`}>
                  {item.percentage.toFixed(0)}%
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="px-4 py-3 space-y-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${barColor}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                {/* Detalles */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="text-sm font-bold text-gray-900">{item.total}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-green-600">✓ Correctas</p>
                    <p className="text-sm font-bold text-green-600">{item.correct}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-red-600">✗ Incorrectas</p>
                    <p className="text-sm font-bold text-red-600">{item.incorrect}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">— En blanco</p>
                    <p className="text-sm font-bold text-gray-600">{item.blank}</p>
                  </div>
                </div>
              </div>

              {/* Recomendación */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                {item.percentage >= 80 ? (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-green-700 font-medium">
                      Excelente desempeño en esta área
                    </p>
                  </div>
                ) : item.percentage >= 60 ? (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <p className="text-orange-700 font-medium">
                      Refuerza este tema con más práctica
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-red-700 font-medium">
                      Prioridad alta: Necesita estudio intensivo
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
