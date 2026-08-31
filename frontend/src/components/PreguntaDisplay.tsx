import type { Question } from '../types'

interface PreguntaDisplayProps {
  question: Question
  questionNumber: number
  totalQuestions: number
}

export default function PreguntaDisplay({
  question,
  questionNumber,
  totalQuestions,
}: PreguntaDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Pregunta {questionNumber} de {totalQuestions}
          </span>
          <span className="text-xs px-2 py-1 bg-rumbo-gold/20 text-rumbo-burgundy rounded-full font-medium">
            {question.difficulty === 'basic'
              ? 'Básico'
              : question.difficulty === 'intermediate'
                ? 'Intermedio'
                : 'Avanzado'}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          Tema: <strong>{question.topic}</strong> • Curso: <strong>{question.course}</strong>
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-gray-200"></div>

      {/* Contenido de la pregunta */}
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-lg font-medium text-gray-900 leading-relaxed">
          {question.content}
        </p>
      </div>
    </div>
  )
}
