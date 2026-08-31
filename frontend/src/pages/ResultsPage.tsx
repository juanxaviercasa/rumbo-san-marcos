import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download, Home, AlertCircle, Share2, FileText } from 'lucide-react'
import MedidorBrecha from '../components/MedidorBrecha'
import DesglosePorArea from '../components/DesglosePorArea'
import RutaEstudio from '../components/RutaEstudio'
import { getExamAttempt } from '../services/exams'
import { getCareerById } from '../services/careers'
import { getQuestionsByIds } from '../services/questions-exam'
import {
  calculateExamScore,
  calculateGap,
  classifyPerformance,
  generateStudyRoute,
  getPerformanceByArea,
  buildStudentReportText,
  getWhatsAppShareUrl,
} from '../services/results'
import type { ExamAttempt, Career } from '../types'

export default function ResultsPage() {
  const { attemptId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [examAttempt, setExamAttempt] = useState<ExamAttempt | null>(null)
  const [career, setCareer] = useState<Career | null>(null)
  const [scoreData, setScoreData] = useState<any>(null)
  const [performanceData, setPerformanceData] = useState<any>(null)

  useEffect(() => {
    loadResultsData()
  }, [attemptId])

  const loadResultsData = async () => {
    try {
      if (!attemptId) {
        setError('ID de intento no válido')
        return
      }

      setLoading(true)

      // Obtener intento
      const attempt = await getExamAttempt(attemptId)
      if (attempt.status !== 'submitted') {
        setError('El examen aún no ha sido completado')
        return
      }
      setExamAttempt(attempt)

      // Obtener carrera
      const careerData = await getCareerById(attempt.careerId)
      setCareer(careerData)

      // Obtener preguntas usadas
      if (attempt.answers && attempt.answers.length > 0) {
        const questionIds = attempt.answers.map((a) => a.questionId)
        const questionsData = await getQuestionsByIds(questionIds)

        // Calcular resultados
        const score = calculateExamScore(attempt.answers, questionsData)
        const referentialScore = careerData.referentialScore || 100
        const gap = calculateGap(score.score, referentialScore)
        const performance = classifyPerformance(score.score, referentialScore)
        const studyRoute = generateStudyRoute(attempt.answers, questionsData, score.score, referentialScore)
        const performanceByArea = getPerformanceByArea(attempt.answers, questionsData)

        setScoreData({
          ...score,
          referentialScore,
          gap,
          performance,
          studyRoute,
        })
        setPerformanceData(performanceByArea)
      }

      setLoading(false)
    } catch (err) {
      console.error('Error cargando resultados:', err)
      setError('Error al cargar los resultados. Por favor, intenta más tarde.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rumbo-gray border-t-rumbo-burgundy rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Generando tu panel de resultados...</p>
        </div>
      </div>
    )
  }

  if (error || !examAttempt || !career || !scoreData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
                <p className="text-red-800 mb-4">
                  {error || 'No se pudieron cargar los resultados.'}
                </p>
                <Link to="/" className="btn-primary inline-block">
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { correct, incorrect, blank, gap, referentialScore, performance, studyRoute } = scoreData
  const actualScore = scoreData.score

  const reportText = buildStudentReportText({
    studentName: examAttempt.studentName,
    careerName: career.name,
    faculty: career.faculty,
    actualScore,
    referentialScore,
    gap,
    performance,
    studyRoute,
    performanceByArea: performanceData ?? [],
  })

  const handleDownloadReport = () => {
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `reporte-${career.name.toLowerCase().replace(/\s+/g, '-')}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleShareWhatsApp = () => {
    const url = getWhatsAppShareUrl(reportText)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rumbo-burgundy to-rumbo-dark text-white py-12">
        <div className="container-custom">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-fraunces font-bold mb-2">Tus Resultados</h1>
            <p className="text-rumbo-gold text-lg font-medium">{career.name}</p>
            <p className="text-white/80 text-sm mt-2">{examAttempt.studentName}</p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container-custom py-12 space-y-12">
        {/* Resumen de desempeño */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Clasificación */}
            <div className="text-center p-6 bg-gradient-to-br from-rumbo-light to-rumbo-light/50 rounded-lg">
              <p className="text-sm font-medium text-rumbo-dark mb-2">Desempeño</p>
              <p className="text-3xl font-bold text-rumbo-burgundy font-fraunces mb-1">
                {performance.category === 'excellent'
                  ? 'Excelente'
                  : performance.category === 'good'
                    ? 'Bueno'
                    : performance.category === 'acceptable'
                      ? 'Aceptable'
                      : 'Necesita Mejora'}
              </p>
              <p className="text-sm text-rumbo-dark/80">{performance.message}</p>
            </div>

            {/* Estadísticas */}
            <div className="text-center">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-green-600 font-fraunces">{correct}</p>
                  <p className="text-xs text-gray-600">Correctas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600 font-fraunces">{incorrect}</p>
                  <p className="text-xs text-gray-600">Incorrectas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-600 font-fraunces">{blank}</p>
                  <p className="text-xs text-gray-600">En blanco</p>
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Fecha de Evaluación</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(examAttempt.startTime).toLocaleDateString('es-PE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(examAttempt.startTime).toLocaleTimeString('es-PE')}
              </p>
            </div>
          </div>
        </div>

        {/* Medidor de Brecha */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <MedidorBrecha
            actualScore={actualScore}
            referentialScore={referentialScore}
            gap={gap}
            percentage={performance.percentage}
          />
        </div>

        {/* Desglose por Área */}
        {performanceData && performanceData.length > 0 && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <DesglosePorArea data={performanceData} />
          </div>
        )}

        {/* Ruta de Estudio */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <RutaEstudio
            priority={studyRoute.priority}
            estimatedHours={studyRoute.estimatedHours}
            studyPlan={studyRoute.studyPlan}
            percentage={performance.percentage}
          />
        </div>

        {/* Acciones finales */}
        <div className="bg-gradient-to-r from-rumbo-burgundy/10 to-rumbo-light/10 rounded-lg p-8 border border-rumbo-gold/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-rumbo-burgundy text-rumbo-burgundy font-semibold rounded-lg hover:bg-rumbo-burgundy hover:text-white transition-all"
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </Link>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all"
            >
              <Share2 className="w-5 h-5" />
              Enviar por WhatsApp
            </button>

            <button
              onClick={handleDownloadReport}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-rumbo-burgundy text-white font-semibold rounded-lg hover:bg-rumbo-dark transition-all"
            >
              <Download className="w-5 h-5" />
              Descargar reporte
            </button>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-rumbo-burgundy">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-rumbo-burgundy mt-0.5" />
              <p className="text-sm text-gray-700">
                <strong>Próximos pasos:</strong> Sigue la ruta de estudio personalizada para mejorar tu desempeño. Puedes repetir la evaluación en {career.name} cuando estés listo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="container-custom text-center text-gray-600 text-sm">
          <p>© 2026 Rumbo San Marcos • Evaluación Diagnóstica para {career.faculty}</p>
        </div>
      </div>
    </div>
  )
}
