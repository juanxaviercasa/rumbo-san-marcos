import { pb } from './pocketbase'
import type { Question } from '../types'

/**
 * Obtiene preguntas personalizadas según la carrera
 * Filtra por área (bloque) y genera una prueba balanceada
 */
export async function getPersonalizedQuestions(
  careerId: string,
  limit: number = 50
): Promise<Question[]> {
  try {
    // Primero obtener la carrera para conocer el bloque
    const career = await pb.collection('careers').getOne(careerId)

    // Obtener preguntas del área/bloque de la carrera
    const questions = (await pb.collection('questions').getFullList({
      filter: `area = "${career.block}"`,
      sort: '-created',
    })) as Question[]

    // Balancear por dificultad: 30% básico, 50% intermedio, 20% avanzado
    const basicQuestions = questions.filter((q) => q.difficulty === 'basic')
    const intermediateQuestions = questions.filter((q) => q.difficulty === 'intermediate')
    const advancedQuestions = questions.filter((q) => q.difficulty === 'advanced')

    const selectedQuestions: Question[] = []

    // Agregar básicas
    const basicCount = Math.ceil(limit * 0.3)
    selectedQuestions.push(...basicQuestions.slice(0, basicCount))

    // Agregar intermedias
    const intermediateCount = Math.ceil(limit * 0.5)
    selectedQuestions.push(...intermediateQuestions.slice(0, intermediateCount))

    // Agregar avanzadas
    const advancedCount = limit - basicCount - intermediateCount
    selectedQuestions.push(...advancedQuestions.slice(0, advancedCount))

    // Shuffle para mezclar orden
    return selectedQuestions.sort(() => Math.random() - 0.5).slice(0, limit)
  } catch (error) {
    console.error('Error al obtener preguntas personalizadas:', error)
    throw error
  }
}

/**
 * Obtiene una sola pregunta por ID
 */
export async function getQuestionById(id: string): Promise<Question> {
  return pb.collection('questions').getOne(id)
}

/**
 * Obtiene múltiples preguntas por IDs
 */
export async function getQuestionsByIds(ids: string[]): Promise<Question[]> {
  const filter = ids.map((id) => `id = "${id}"`).join(' || ')
  return pb.collection('questions').getFullList({
    filter,
  })
}

/**
 * Obtiene todas las preguntas (para admin)
 */
export async function getAllQuestions(limit: number = 1000): Promise<Question[]> {
  const questions = (await pb.collection('questions').getFullList({
    sort: '-created',
  })) as Question[]

  return questions.slice(0, limit)
}
