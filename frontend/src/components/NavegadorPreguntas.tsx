import type { StudentAnswer } from '../types'

interface NavegadorPreguntasProps {
  totalQuestions: number
  currentQuestionIndex: number
  answers: StudentAnswer[]
  onGoToQuestion: (index: number) => void
}

export default function NavegadorPreguntas({
  totalQuestions,
  currentQuestionIndex,
  answers,
  onGoToQuestion,
}: NavegadorPreguntasProps) {
  // Crear grid de preguntas
  const questionGrid = Array.from({ length: totalQuestions }, (_, index) => {
    const answer = answers.find((a) => a.selectedOptionId !== undefined)
    const isAnswered = answer !== undefined
    const isCurrent = index === currentQuestionIndex

    return {
      index,
      isAnswered,
      isCurrent,
    }
  })

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Navegación</h3>

      {/* Grid de preguntas */}
      <div className="grid grid-cols-5 gap-2">
        {questionGrid.map(({ index, isAnswered, isCurrent }) => (
          <button
            key={index}
            onClick={() => onGoToQuestion(index)}
            className={`
              aspect-square rounded-lg font-medium text-sm transition-all
              flex items-center justify-center
              ${
                isCurrent
                  ? 'bg-rumbo-burgundy text-white border-2 border-rumbo-dark ring-2 ring-rumbo-burgundy/50'
                  : isAnswered
                    ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
              }
            `}
            title={`Pregunta ${index + 1}${isAnswered ? ' (respondida)' : ' (sin responder)'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Leyenda */}
      <div className="text-xs text-gray-600 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rumbo-burgundy" />
          <span>Pregunta actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
          <span>Respondida</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300" />
          <span>Sin responder</span>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-1">
        <p className="text-sm font-medium text-gray-900">
          Respondidas: <span className="text-green-600">{answers.length}</span> / {totalQuestions}
        </p>
        <p className="text-sm font-medium text-gray-900">
          Sin responder: <span className="text-orange-600">{totalQuestions - answers.length}</span>
        </p>
      </div>
    </div>
  )
}
