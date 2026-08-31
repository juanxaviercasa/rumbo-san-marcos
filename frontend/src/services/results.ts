import type { StudentAnswer, Question } from '../types'

/**
 * Calcula el resultado del examen usando el esquema UNMSM:
 * - Acierto: +1
 * - Error: -0.25
 * - Blanco: 0
 */
export function calculateExamScore(
  answers: StudentAnswer[],
  questions: Question[]
): { score: number; correctCount: number; errorCount: number; blankCount: number } {
  let score = 0
  let correctCount = 0
  let errorCount = 0
  let blankCount = 0

  // Crear mapa de respuestas correctas
  const correctAnswersMap = new Map(questions.map((q) => [q.id, q.correctOptionId]))

  // Procesar cada respuesta
  answers.forEach((answer) => {
    const correctOptionId = correctAnswersMap.get(answer.questionId)

    if (!answer.selectedOptionId) {
      // Pregunta sin responder (blanco)
      blankCount++
    } else if (answer.selectedOptionId === correctOptionId) {
      // Respuesta correcta
      correctCount++
      score += 1
    } else {
      // Respuesta incorrecta
      errorCount++
      score -= 0.25
    }
  })

  // Asegurar que no haya preguntas faltantes
  const totalQuestions = questions.length
  const answeredQuestions = answers.filter((a) => a.selectedOptionId !== undefined).length
  blankCount = totalQuestions - answeredQuestions

  return {
    score: Math.max(0, score),
    correctCount,
    errorCount,
    blankCount,
  }
}

/**
 * Calcula la brecha entre el puntaje obtenido y el referencial
 */
export function calculateGap(actualScore: number, referentialScore: number): number {
  return Math.max(0, referentialScore - actualScore)
}

/**
 * Clasifica el desempeño en categorías
 */
export function classifyPerformance(
  actualScore: number,
  referentialScore: number
): {
  category: 'excellent' | 'good' | 'acceptable' | 'needs-improvement'
  percentage: number
  message: string
} {
  const percentage = (actualScore / referentialScore) * 100

  if (percentage >= 90) {
    return {
      category: 'excellent',
      percentage,
      message: '¡Excelente desempeño! Estás listo para la prueba.',
    }
  }

  if (percentage >= 75) {
    return {
      category: 'good',
      percentage,
      message: 'Buen desempeño. Refuerza algunos temas específicos.',
    }
  }

  if (percentage >= 60) {
    return {
      category: 'acceptable',
      percentage,
      message: 'Desempeño aceptable. Necesitas estudiar más.',
    }
  }

  return {
    category: 'needs-improvement',
    percentage,
    message: 'Necesitas mejorar significativamente. Estudia el plan recomendado.',
  }
}

/**
 * Genera recomendaciones de estudio personalizadas
 */
export function generateStudyRoute(
  answers: StudentAnswer[],
  questions: Question[],
  actualScore: number,
  referentialScore: number
): {
  priority: Array<{
    topic: string
    course: string
    issues: number
    recommendation: string
  }>
  estimatedHours: number
  studyPlan: string[]
} {
  // Crear mapa de preguntas
  const questionsMap = new Map(questions.map((q) => [q.id, q]))
  const correctAnswersMap = new Map(questions.map((q) => [q.id, q.correctOptionId]))

  // Contar errores por tema
  const errorsByTopic: Record<string, { course: string; count: number }> = {}

  answers.forEach((answer) => {
    if (!answer.selectedOptionId) return // Ignorar blancos por ahora

    const question = questionsMap.get(answer.questionId)
    if (!question) return

    const isCorrect = answer.selectedOptionId === correctAnswersMap.get(answer.questionId)

    if (!isCorrect) {
      if (!errorsByTopic[question.topic]) {
        errorsByTopic[question.topic] = { course: question.course, count: 0 }
      }
      errorsByTopic[question.topic].count++
    }
  })

  // Ordenar por cantidad de errores
  const priority = Object.entries(errorsByTopic)
    .map(([topic, data]) => ({
      topic,
      course: data.course,
      issues: data.count,
      recommendation:
        data.count >= 3
          ? 'Prioridad alta - Requiere estudio intensivo'
          : 'Prioridad media - Refuerzo necesario',
    }))
    .sort((a, b) => b.issues - a.issues)

  // Calcular horas estimadas
  const gap = referentialScore - actualScore
  const estimatedHours = Math.ceil(gap * 2) // 2 horas por punto de brecha

  // Plan de estudio sugerido
  const studyPlan = [
    `Tiempo estimado de estudio: ${estimatedHours} horas`,
    `Enfócate primero en: ${priority.slice(0, 3).map((p) => p.topic).join(', ')}`,
    'Resuelve ejercicios prácticos de cada tema',
    'Haz simulacros de examen cada 3 días',
    'Revisa explicaciones de respuestas incorrectas',
  ]

  return {
    priority: priority.slice(0, 10), // Top 10 temas con dificultad
    estimatedHours,
    studyPlan,
  }
}

/**
 * Obtiene breakdown de desempeño por área (bloque A, B, C, etc)
 */
export function getPerformanceByArea(
  answers: StudentAnswer[],
  questions: Question[]
): Array<{
  area: string
  total: number
  correct: number
  incorrect: number
  blank: number
  percentage: number
}> {
  const questionsMap = new Map(questions.map((q) => [q.id, q]))
  const correctAnswersMap = new Map(questions.map((q) => [q.id, q.correctOptionId]))

  const performanceByArea: Record<
    string,
    { total: number; correct: number; incorrect: number; blank: number }
  > = {}

  questions.forEach((q) => {
    if (!performanceByArea[q.area]) {
      performanceByArea[q.area] = { total: 0, correct: 0, incorrect: 0, blank: 0 }
    }
    performanceByArea[q.area].total++

    const answer = answers.find((a) => a.questionId === q.id)

    if (!answer || !answer.selectedOptionId) {
      performanceByArea[q.area].blank++
    } else if (answer.selectedOptionId === correctAnswersMap.get(q.id)) {
      performanceByArea[q.area].correct++
    } else {
      performanceByArea[q.area].incorrect++
    }
  })

  return Object.entries(performanceByArea).map(([area, data]) => ({
    area,
    ...data,
    percentage: (data.correct / data.total) * 100,
  }))
}

export function buildStudentReportText({
  studentName,
  careerName,
  faculty,
  actualScore,
  referentialScore,
  gap,
  performance,
  studyRoute,
  performanceByArea,
}: {
  studentName: string
  careerName: string
  faculty: string
  actualScore: number
  referentialScore: number
  gap: number
  performance: ReturnType<typeof classifyPerformance>
  studyRoute: ReturnType<typeof generateStudyRoute>
  performanceByArea: ReturnType<typeof getPerformanceByArea>
}): string {
  const topPriorities = studyRoute.priority.slice(0, 5)
  const areaSummary = performanceByArea
    .map((area) => `- Área ${area.area}: ${area.correct}/${area.total} correctas (${area.percentage.toFixed(1)}%)`)
    .join('\n')

  const report = [
    'RUMBO SAN MARCOS',
    'Reporte de desempeño diagnóstico',
    '========================================',
    `Estudiante: ${studentName}`,
    `Carrera: ${careerName}`,
    `Facultad: ${faculty}`,
    '',
    `Puntaje obtenido: ${actualScore.toFixed(2)}`,
    `Puntaje referencial: ${referentialScore}`,
    `Brecha: ${gap.toFixed(2)}`,
    `Desempeño: ${performance.message}`,
    `Porcentaje: ${performance.percentage.toFixed(1)}%`,
    '',
    'Resumen por área:',
    areaSummary || '- Sin datos de área disponibles',
    '',
    'Temas de prioridad para reforzar:',
    ...topPriorities.map(
      (item, index) => ` ${index + 1}. ${item.topic} (${item.course}) - ${item.issues} errores`
    ),
    '',
    'Recomendación de estudio:',
    ...studyRoute.studyPlan.map((item) => `- ${item}`),
    '',
    `Horas estimadas: ${studyRoute.estimatedHours}`,
    '',
    'Este reporte debe utilizarse para reforzar los temas más débiles antes del ingreso a la carrera deseada.',
  ]

  return report.join('\n')
}

export function getWhatsAppShareUrl(text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
}
