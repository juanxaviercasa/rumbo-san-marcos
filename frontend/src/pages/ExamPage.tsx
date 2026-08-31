import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Send, AlertCircle } from 'lucide-react'
import Cronometro from '../components/Cronometro'
import PreguntaDisplay from '../components/PreguntaDisplay'
import OpcionesDisplay from '../components/OpcionesDisplay'
import NavegadorPreguntas from '../components/NavegadorPreguntas'
import { useTimer } from '../hooks/useTimer'
import { useExamAnswers } from '../hooks/useExamAnswers'
import { getExamAttempt, updateExamAttempt } from '../services/exams'
import { getPersonalizedQuestions } from '../services/questions-exam'
import { getCareerById } from '../services/careers'
import type { Question, Career, ExamAttempt } from '../types'

export default function ExamPage() {
  const { attemptId } = useParams()
  const navigate = useNavigate()

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [examAttempt, setExamAttempt] = useState<ExamAttempt | null>(null)
  const [career, setCareer] = useState<Career | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hooks
  const exam = useExamAnswers({ totalQuestions: questions.length })
  const timer = useTimer({
    initialMinutes: career?.estimatedDuration ? career.estimatedDuration / 60 : 3,
    onTimeExpired: () => handleSubmitExam(true),
  })

  // Cargar datos iniciales
  useEffect(() => {
    loadExamData()
  }, [attemptId])

  // Autoenviar cuando expire el tiempo
  useEffect(() => {
    if (timer.hasExpired) {
      handleSubmitExam(true)
    }
  }, [timer.hasExpired])

  const loadExamData = async () => {
    try {
      if (!attemptId) {
        setError('ID de intento no válido')
        return
      }

      setLoading(true)

      // Obtener intento de examen
      const attempt = await getExamAttempt(attemptId)
      setExamAttempt(attempt)

      // Obtener carrera
      const careerData = await getCareerById(attempt.careerId)
      setCareer(careerData)

      // Obtener preguntas personalizadas
      const questionsData = await getPersonalizedQuestions(attempt.careerId, 50)
      setQuestions(questionsData)

      setLoading(false)
    } catch (err) {
      console.error('Error cargando examen:', err)
      setError('Error al cargar el examen. Por favor, recarga la página.')
      setLoading(false)
    }
  }

  const handleSelectOption = (optionId: string) => {
    if (timer.hasExpired || isSubmitting) return

    const currentQuestion = questions[exam.currentQuestionIndex]
    exam.answerQuestion(currentQuestion.id, optionId)
  }

  const handleSubmitExam = async (autoSubmit = false) => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      // Actualizar intento en PocketBase
      await updateExamAttempt(attemptId!, {
        answers: exam.answers,
        status: 'submitted',
        endTime: new Date().toISOString(),
      })

      // Redirigir a resultados
      setTimeout(() => {
        navigate(`/resultados/${attemptId}`)
      }, 500)
    } catch (err) {
      console.error('Error al enviar examen:', err)
      setError('Error al enviar tu examen. Por favor, intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rumbo-gray border-t-rumbo-burgundy rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando tu evaluación personalizada...</p>
        </div>
      </div>
    )
  }

  if (!questions.length || !career || !examAttempt) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
                <p className="text-red-800 mb-4">
                  {error || 'No se pudieron cargar las preguntas del examen.'}
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary"
                >
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[exam.currentQuestionIndex]

  return (
    <div className="min-h-screen bg-white">
      {/* Header con Cronómetro */}
      <div className="bg-gradient-to-r from-rumbo-burgundy to-rumbo-dark text-white py-6 sticky top-0 z-50">
        <div className="container-custom">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Información de carrera */}
            <div>
              <p className="text-sm opacity-90">{career.name}</p>
              <p className="text-xs opacity-75">{career.faculty}</p>
            </div>

            {/* Cronómetro central */}
            <div className="flex justify-center">
              <Cronometro
                timeFormatted={timer.formatTime}
                percentage={timer.percentage}
                isWarning={timer.isWarning}
                isAlarm={timer.isAlarm}
                hasExpired={timer.hasExpired}
              />
            </div>

            {/* Progreso */}
            <div className="text-right">
              <p className="text-sm opacity-90">
                Pregunta {exam.currentQuestionIndex + 1} de {exam.totalQuestions}
              </p>
              <p className="text-xs opacity-75">
                {exam.answeredCount} respondidas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Preguntas - 3 columnas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
              {/* Pregunta */}
              <PreguntaDisplay
                question={currentQuestion}
                questionNumber={exam.currentQuestionIndex + 1}
                totalQuestions={exam.totalQuestions}
              />

              {/* Opciones */}
              <OpcionesDisplay
                options={currentQuestion.options}
                selectedOptionId={
                  exam.answers.find((a) => a.questionId === currentQuestion.id)
                    ?.selectedOptionId
                }
                onSelectOption={handleSelectOption}
                disabled={timer.hasExpired || isSubmitting}
              />

              {/* Botones de navegación */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  onClick={exam.previousQuestion}
                  disabled={!exam.canGoToPrevious || timer.hasExpired || isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </button>

                <button
                  onClick={exam.nextQuestion}
                  disabled={!exam.canGoToNext || timer.hasExpired || isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 columna */}
          <div className="lg:col-span-1 space-y-6">
            {/* Navegador de preguntas */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-32">
              <NavegadorPreguntas
                totalQuestions={exam.totalQuestions}
                currentQuestionIndex={exam.currentQuestionIndex}
                answers={exam.answers}
                onGoToQuestion={exam.goToQuestion}
              />
            </div>

            {/* Botón de envío */}
            <div className="space-y-2">
              <button
                onClick={() => handleSubmitExam(false)}
                disabled={timer.hasExpired || isSubmitting}
                className="w-full flex items-center justify-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Enviando...' : 'Enviar Evaluación'}
              </button>

              {!timer.hasExpired && (
                <p className="text-xs text-gray-500 text-center">
                  Puedes responder preguntas sin responder antes de enviar
                </p>
              )}
            </div>

            {/* Alerta */}
            {timer.isAlarm && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-800 font-medium">
                  La evaluación se enviará automáticamente cuando expire el tiempo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="fixed bottom-4 right-4 max-w-md bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
