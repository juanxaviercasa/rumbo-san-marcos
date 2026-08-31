import { useState, useCallback } from 'react'
import type { StudentAnswer } from '../types'

interface UseExamAnswersProps {
  totalQuestions: number
}

export function useExamAnswers({ totalQuestions }: UseExamAnswersProps) {
  const [answers, setAnswers] = useState<StudentAnswer[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // Obtener respuesta actual (o undefined si no ha respondido)
  const getCurrentAnswer = useCallback(() => {
    return answers.find((a) => a.timeSpent !== undefined) || null
  }, [answers])

  // Registrar respuesta para la pregunta actual
  const answerQuestion = useCallback(
    (questionId: string, selectedOptionId: string, timeSpent?: number) => {
      setAnswers((prev) => {
        // Si ya existe una respuesta para esta pregunta, actualizar
        const existingIndex = prev.findIndex((a) => a.questionId === questionId)

        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = {
            questionId,
            selectedOptionId,
            timeSpent: timeSpent || updated[existingIndex].timeSpent,
          }
          return updated
        }

        // Si no existe, crear nueva
        return [
          ...prev,
          {
            questionId,
            selectedOptionId,
            timeSpent,
          },
        ]
      })
    },
    []
  )

  // Verificar si la pregunta actual fue respondida
  const isCurrentQuestionAnswered = useCallback(() => {
    return answers.some((a) => a.selectedOptionId !== undefined)
  }, [answers])

  // Obtener estado de todas las preguntas
  const getQuestionStates = useCallback((): ('answered' | 'skipped' | 'not-visited')[] => {
    return Array.from({ length: totalQuestions }, (_, index) => {
      const hasAnswer = answers.some((a) => a.selectedOptionId !== undefined)
      return hasAnswer ? 'answered' : 'skipped'
    })
  }, [answers, totalQuestions])

  // Ir a pregunta específica
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index)
    }
  }, [totalQuestions])

  // Siguiente pregunta
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }, [currentQuestionIndex, totalQuestions])

  // Pregunta anterior
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }, [currentQuestionIndex])

  // Puede ir al siguiente (para navegación)
  const canGoToNext = currentQuestionIndex < totalQuestions - 1
  const canGoToPrevious = currentQuestionIndex > 0

  return {
    answers,
    currentQuestionIndex,
    totalQuestions,
    getCurrentAnswer,
    answerQuestion,
    isCurrentQuestionAnswered,
    getQuestionStates,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    canGoToNext,
    canGoToPrevious,
    answeredCount: answers.length,
    skippedCount: totalQuestions - answers.length,
  }
}
