import { pb } from './pocketbase'
import type { Question } from '../types'

export async function getQuestionsByCareer(careerId: string): Promise<Question[]> {
  return pb.collection('questions').getFullList({
    filter: `career = "${careerId}"`,
  })
}

export async function getQuestionsByCourse(course: string): Promise<Question[]> {
  return pb.collection('questions').getFullList({
    filter: `course = "${course}"`,
  })
}

export async function getQuestionsByArea(area: string): Promise<Question[]> {
  return pb.collection('questions').getFullList({
    filter: `area = "${area}"`,
  })
}

export async function getQuestionsByDifficulty(difficulty: string): Promise<Question[]> {
  return pb.collection('questions').getFullList({
    filter: `difficulty = "${difficulty}"`,
  })
}

export async function createQuestion(data: Partial<Question>): Promise<Question> {
  return pb.collection('questions').create(data)
}

export async function updateQuestion(id: string, data: Partial<Question>): Promise<Question> {
  return pb.collection('questions').update(id, data)
}

export async function deleteQuestion(id: string): Promise<void> {
  await pb.collection('questions').delete(id)
}
