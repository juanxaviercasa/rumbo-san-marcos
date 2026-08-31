import { pb } from './pocketbase'
import type { ExamAttempt, StudentAnswer } from '../types'

export async function createExamAttempt(data: Partial<ExamAttempt>): Promise<ExamAttempt> {
  return pb.collection('exam_attempts').create(data)
}

export async function getExamAttempt(id: string): Promise<ExamAttempt> {
  return pb.collection('exam_attempts').getOne(id)
}

export async function updateExamAttempt(id: string, data: Partial<ExamAttempt>): Promise<ExamAttempt> {
  return pb.collection('exam_attempts').update(id, data)
}

export async function submitExamAnswers(attemptId: string, answers: StudentAnswer[]): Promise<ExamAttempt> {
  return updateExamAttempt(attemptId, {
    answers,
    status: 'submitted',
    endTime: new Date().toISOString(),
  })
}

export async function getExamResultsById(id: string): Promise<ExamAttempt | null> {
  try {
    return await pb.collection('exam_attempts').getOne(id)
  } catch (error) {
    return null
  }
}
