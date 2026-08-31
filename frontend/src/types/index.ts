// Tipos principales del proyecto

export interface Career {
  id: string
  code: string
  name: string
  faculty: string
  block: 'A' | 'B' | 'C' | 'D' | 'E'
  referentialScore: number // Puntaje de corte referencial
  weights: CourseWeights
  estimatedDuration: number // minutos
  created: string
  updated: string
}

export interface CourseWeights {
  mathematics: number
  physics: number
  chemistry: number
  biology: number
  spanish: number
  history: number
  geography: number
  civics: number
  [key: string]: number
}

export interface Question {
  id: string
  topic: string
  course: string
  area: 'A' | 'B' | 'C' | 'D' | 'E'
  difficulty: 'basic' | 'intermediate' | 'advanced'
  content: string
  options: QuestionOption[]
  correctOptionId: string
  explanation: string
  created: string
  updated: string
}

export interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface ExamAttempt {
  id: string
  studentName: string
  studentEmail: string
  studentPhone: string
  careerId: string
  career?: Career
  startTime: string
  endTime?: string
  status: 'in_progress' | 'submitted' | 'graded'
  answers: StudentAnswer[]
  score?: number // Sobre 2000
  referentialScore?: number
  gap?: number // brecha
  created: string
  updated: string
}

export interface StudentAnswer {
  questionId: string
  selectedOptionId: string
  isCorrect?: boolean // Calculado al calificar
  timeSpent?: number // segundos
}

export interface ExamResult {
  score: number // Sobre 2000
  referentialScore: number
  gap: number // diferencia
  performanceByArea: AreaPerformance[]
  performanceByCourse: CoursePerformance[]
  strengths: string[]
  weaknesses: string[]
}

export interface AreaPerformance {
  area: 'A' | 'B' | 'C' | 'D' | 'E'
  correct: number
  total: number
  percentage: number
}

export interface CoursePerformance {
  course: string
  correct: number
  total: number
  percentage: number
  weight: number // Peso en la carrera
}

export interface StudyRoute {
  prioritizedCourses: CourseStudyRoute[]
  totalHoursRecommended: number
  estimatedWeeks: number
}

export interface CourseStudyRoute {
  course: string
  priority: number // 1-5
  weight: number
  currentPerformance: number // %
  targetPerformance: number // %
  topicsToCover: string[]
  estimatedHours: number
}
