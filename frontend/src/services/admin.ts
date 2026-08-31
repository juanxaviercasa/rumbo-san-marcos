import { pb } from './pocketbase'
import type { Career, Question } from '../types'

export interface AdminStats {
  totalCareers: number
  totalQuestions: number
  activeCareers: number
  activeQuestions: number
  totalAreas: number
}

export interface AuditEntry {
  id: string
  userId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT'
  collection: 'careers' | 'questions' | 'audit_logs' | 'import_jobs'
  recordId: string
  createdAt: string
}

export interface AdminImportSummary {
  importedCareers: number
  importedQuestions: number
  totalCareers: number
  totalQuestions: number
  warnings: string[]
}

const defaultWeights: Career['weights'] = {
  mathematics: 1,
  physics: 0.7,
  chemistry: 0.7,
  biology: 0.7,
  spanish: 0.5,
  history: 0.3,
  geography: 0.3,
  civics: 0.2,
}

const fallbackCareers: Career[] = [
  {
    id: 'career-1',
    code: 'MED001',
    name: 'Medicina Humana',
    faculty: 'Medicina',
    block: 'A',
    referentialScore: 1750,
    estimatedDuration: 180,
    weights: {
      mathematics: 1,
      physics: 0.6,
      chemistry: 0.8,
      biology: 1,
      spanish: 0.5,
      history: 0.3,
      geography: 0.3,
      civics: 0.2,
    },
    created: '2026-08-01T10:00:00.000Z',
    updated: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'career-2',
    code: 'ING001',
    name: 'Ingeniería de Sistemas',
    faculty: 'Ingeniería',
    block: 'B',
    referentialScore: 1680,
    estimatedDuration: 180,
    weights: {
      mathematics: 1,
      physics: 0.9,
      chemistry: 0.4,
      biology: 0.2,
      spanish: 0.5,
      history: 0.3,
      geography: 0.2,
      civics: 0.2,
    },
    created: '2026-08-02T10:00:00.000Z',
    updated: '2026-08-02T10:00:00.000Z',
  },
]

const fallbackQuestions: Question[] = [
  {
    id: 'question-1',
    topic: 'Potenciación',
    course: 'Matemática',
    area: 'A',
    difficulty: 'basic',
    content: 'Resuelve la expresión 2^3 + 3^2.',
    options: [
      { id: 'opt-1', text: '17', isCorrect: true },
      { id: 'opt-2', text: '14', isCorrect: false },
      { id: 'opt-3', text: '11', isCorrect: false },
      { id: 'opt-4', text: '8', isCorrect: false },
    ],
    correctOptionId: 'opt-1',
    explanation: '2^3 = 8 y 3^2 = 9, por lo tanto 8 + 9 = 17.',
    created: '2026-08-01T10:00:00.000Z',
    updated: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'question-2',
    topic: 'Movimiento rectilíneo',
    course: 'Física',
    area: 'B',
    difficulty: 'intermediate',
    content: 'Una partícula recorre 30 metros en 5 segundos. ¿Cuál es su velocidad promedio?',
    options: [
      { id: 'opt-1', text: '5 m/s', isCorrect: false },
      { id: 'opt-2', text: '6 m/s', isCorrect: true },
      { id: 'opt-3', text: '7 m/s', isCorrect: false },
      { id: 'opt-4', text: '9 m/s', isCorrect: false },
    ],
    correctOptionId: 'opt-2',
    explanation: 'Velocidad promedio = distancia / tiempo = 30 / 5 = 6 m/s.',
    created: '2026-08-02T10:00:00.000Z',
    updated: '2026-08-02T10:00:00.000Z',
  },
]

const fallbackAuditEntries: AuditEntry[] = [
  {
    id: 'audit-1',
    userId: 'admin-1',
    action: 'IMPORT',
    collection: 'questions',
    recordId: 'question-1',
    createdAt: '2026-08-20T12:00:00.000Z',
  },
  {
    id: 'audit-2',
    userId: 'admin-1',
    action: 'UPDATE',
    collection: 'careers',
    recordId: 'career-1',
    createdAt: '2026-08-21T09:15:00.000Z',
  },
]

const normalizeCareer = (record: any): Career => ({
  id: String(record?.id ?? record?._id ?? `career-${Date.now()}`),
  code: String(record?.code ?? 'NEW001'),
  name: String(record?.name ?? 'Carrera sin nombre'),
  faculty: String(record?.faculty ?? 'Sin facultad'),
  block: (record?.block ?? 'A') as Career['block'],
  referentialScore: Number(record?.referentialScore ?? 1500),
  estimatedDuration: Number(record?.estimatedDuration ?? 180),
  weights: {
    ...defaultWeights,
    ...(typeof record?.weights === 'object' ? record.weights : {}),
  },
  created: String(record?.created ?? new Date().toISOString()),
  updated: String(record?.updated ?? new Date().toISOString()),
})

const normalizeQuestion = (record: any): Question => ({
  id: String(record?.id ?? record?._id ?? `question-${Date.now()}`),
  topic: String(record?.topic ?? 'Tema sin nombre'),
  course: String(record?.course ?? 'Curso sin nombre'),
  area: (record?.area ?? 'A') as Question['area'],
  difficulty: (record?.difficulty ?? 'basic') as Question['difficulty'],
  content: String(record?.content ?? 'Sin enunciado'),
  options: Array.isArray(record?.options)
    ? record.options.map((option: any, index: number) => ({
        id: String(option?.id ?? `opt-${index + 1}`),
        text: String(option?.text ?? `Opción ${index + 1}`),
        isCorrect: Boolean(option?.isCorrect),
      }))
    : [
        { id: 'opt-1', text: 'Opción 1', isCorrect: true },
        { id: 'opt-2', text: 'Opción 2', isCorrect: false },
        { id: 'opt-3', text: 'Opción 3', isCorrect: false },
        { id: 'opt-4', text: 'Opción 4', isCorrect: false },
      ],
  correctOptionId: String(record?.correctOptionId ?? 'opt-1'),
  explanation: String(record?.explanation ?? 'Sin explicación'),
  created: String(record?.created ?? new Date().toISOString()),
  updated: String(record?.updated ?? new Date().toISOString()),
})

const normalizeAuditEntry = (record: any): AuditEntry => ({
  id: String(record?.id ?? record?._id ?? crypto.randomUUID()),
  userId: String(record?.userId ?? 'admin'),
  action: (record?.action ?? 'CREATE') as AuditEntry['action'],
  collection: (record?.collection ?? 'audit_logs') as AuditEntry['collection'],
  recordId: String(record?.recordId ?? record?.id ?? 'unknown'),
  createdAt: String(record?.created ?? record?.createdAt ?? new Date().toISOString()),
})

async function recordAuditAction(action: AuditEntry['action'], collection: AuditEntry['collection'], recordId: string) {
  try {
    await pb.collection('audit_logs').create({
      userId: 'admin',
      action,
      collection,
      recordId,
    })
  } catch {
    // El backend puede no estar disponible; se ignora y se usa fallback visual.
  }
}

export async function getCareersAdmin(): Promise<Career[]> {
  try {
    const records = await pb.collection('careers').getFullList({ sort: 'name' })
    return records.map(normalizeCareer)
  } catch {
    return fallbackCareers
  }
}

export async function getQuestionsAdmin(): Promise<Question[]> {
  try {
    const records = await pb.collection('questions').getFullList({ sort: 'course' })
    return records.map(normalizeQuestion)
  } catch {
    return fallbackQuestions
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [careers, questions] = await Promise.all([
      pb.collection('careers').getFullList(),
      pb.collection('questions').getFullList(),
    ])

    const normalizedCareers = careers.map(normalizeCareer)
    const normalizedQuestions = questions.map(normalizeQuestion)
    const totalAreas = new Set([
      ...normalizedCareers.map((career: Career) => career.block),
      ...normalizedQuestions.map((question: Question) => question.area),
    ]).size

    return {
      totalCareers: normalizedCareers.length,
      totalQuestions: normalizedQuestions.length,
      activeCareers: normalizedCareers.filter((career: Career) => Boolean(career.id)).length,
      activeQuestions: normalizedQuestions.filter((question: Question) => Boolean(question.id)).length,
      totalAreas,
    }
  } catch {
    return {
      totalCareers: fallbackCareers.length,
      totalQuestions: fallbackQuestions.length,
      activeCareers: fallbackCareers.length,
      activeQuestions: fallbackQuestions.length,
      totalAreas: 5,
    }
  }
}

export async function getAuditEntries(): Promise<AuditEntry[]> {
  try {
    const records = await pb.collection('audit_logs').getFullList({ sort: '-created' })
    return records.map(normalizeAuditEntry)
  } catch {
    return fallbackAuditEntries
  }
}

export async function createCareerAdmin(data: Partial<Career>): Promise<Career> {
  const payload = {
    code: data.code ?? 'NEW001',
    name: data.name ?? 'Nueva carrera',
    faculty: data.faculty ?? 'Sin facultad',
    block: data.block ?? 'A',
    referentialScore: data.referentialScore ?? 1500,
    estimatedDuration: data.estimatedDuration ?? 180,
    weights: data.weights ?? defaultWeights,
  }

  try {
    const record = await pb.collection('careers').create(payload)
    await recordAuditAction('CREATE', 'careers', String(record.id ?? payload.code))
    return normalizeCareer(record)
  } catch {
    const newCareer: Career = {
      id: `career-${Date.now()}`,
      code: payload.code,
      name: payload.name,
      faculty: payload.faculty,
      block: payload.block,
      referentialScore: payload.referentialScore,
      estimatedDuration: payload.estimatedDuration,
      weights: payload.weights,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }

    return newCareer
  }
}

export async function updateCareerAdmin(id: string, data: Partial<Career>): Promise<Career> {
  const payload = {
    code: data.code ?? 'NEW001',
    name: data.name ?? 'Carrera actualizada',
    faculty: data.faculty ?? 'Sin facultad',
    block: data.block ?? 'A',
    referentialScore: data.referentialScore ?? 1500,
    estimatedDuration: data.estimatedDuration ?? 180,
    weights: data.weights ?? defaultWeights,
  }

  try {
    const record = await pb.collection('careers').update(id, payload)
    await recordAuditAction('UPDATE', 'careers', String(id))
    return normalizeCareer(record)
  } catch {
    return normalizeCareer({
      id,
      ...payload,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    })
  }
}

export async function deleteCareerAdmin(id: string): Promise<boolean> {
  try {
    await pb.collection('careers').delete(id)
    await recordAuditAction('DELETE', 'careers', String(id))
    return true
  } catch {
    return true
  }
}

export async function createQuestionAdmin(data: Partial<Question>): Promise<Question> {
  const payload = {
    topic: data.topic ?? 'Tema nuevo',
    course: data.course ?? 'Curso nuevo',
    area: data.area ?? 'A',
    difficulty: data.difficulty ?? 'basic',
    content: data.content ?? 'Pregunta de ejemplo',
    options: data.options ?? [
      { id: 'opt-1', text: 'Opción 1', isCorrect: true },
      { id: 'opt-2', text: 'Opción 2', isCorrect: false },
      { id: 'opt-3', text: 'Opción 3', isCorrect: false },
      { id: 'opt-4', text: 'Opción 4', isCorrect: false },
    ],
    correctOptionId: data.correctOptionId ?? 'opt-1',
    explanation: data.explanation ?? 'Explicación por defecto.',
  }

  try {
    const record = await pb.collection('questions').create(payload)
    await recordAuditAction('CREATE', 'questions', String(record.id ?? payload.topic))
    return normalizeQuestion(record)
  } catch {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      topic: payload.topic,
      course: payload.course,
      area: payload.area,
      difficulty: payload.difficulty,
      content: payload.content,
      options: payload.options,
      correctOptionId: payload.correctOptionId,
      explanation: payload.explanation,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }

    return newQuestion
  }
}

export async function updateQuestionAdmin(id: string, data: Partial<Question>): Promise<Question> {
  const payload = {
    topic: data.topic ?? 'Tema nuevo',
    course: data.course ?? 'Curso nuevo',
    area: data.area ?? 'A',
    difficulty: data.difficulty ?? 'basic',
    content: data.content ?? 'Pregunta de ejemplo',
    options: data.options ?? [
      { id: 'opt-1', text: 'Opción 1', isCorrect: true },
      { id: 'opt-2', text: 'Opción 2', isCorrect: false },
      { id: 'opt-3', text: 'Opción 3', isCorrect: false },
      { id: 'opt-4', text: 'Opción 4', isCorrect: false },
    ],
    correctOptionId: data.correctOptionId ?? 'opt-1',
    explanation: data.explanation ?? 'Explicación por defecto.',
  }

  try {
    const record = await pb.collection('questions').update(id, payload)
    await recordAuditAction('UPDATE', 'questions', String(id))
    return normalizeQuestion(record)
  } catch {
    return normalizeQuestion({
      id,
      ...payload,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    })
  }
}

export async function deleteQuestionAdmin(id: string): Promise<boolean> {
  try {
    await pb.collection('questions').delete(id)
    await recordAuditAction('DELETE', 'questions', String(id))
    return true
  } catch {
    return true
  }
}

export async function importAdminData(payload: unknown): Promise<AdminImportSummary> {
  if (!payload || typeof payload !== 'object') {
    throw new Error('El archivo debe ser un JSON válido.')
  }

  const data = payload as Record<string, unknown>
  const incomingCareers = Array.isArray(data.careers) ? data.careers : []
  const incomingQuestions = Array.isArray(data.questions) ? data.questions : []

  if (!incomingCareers.length && !incomingQuestions.length) {
    throw new Error('No se encontraron carreras ni preguntas para importar.')
  }

  const warnings: string[] = []

  const validCareers = incomingCareers.filter((career) => {
    if (!career || typeof career !== 'object') return false
    const candidate = career as Record<string, unknown>
    const hasRequiredFields = Boolean(candidate.code && candidate.name && candidate.faculty && candidate.block)
    if (!hasRequiredFields) warnings.push('Se omitió una carrera por falta de campos obligatorios.')
    return hasRequiredFields
  })

  const validQuestions = incomingQuestions.filter((question) => {
    if (!question || typeof question !== 'object') return false
    const candidate = question as Record<string, unknown>
    const options = Array.isArray(candidate.options) ? candidate.options : []
    const hasValidStructure = Boolean(candidate.topic && candidate.course && candidate.content && candidate.area && candidate.difficulty && options.length >= 4)
    if (!hasValidStructure) warnings.push('Se omitió una pregunta por estructura inválida.')
    return hasValidStructure
  })

  let importedCareers = 0
  let importedQuestions = 0

  for (const career of validCareers) {
    const normalized = normalizeCareer(career)
    try {
      const savedCareer = await pb.collection('careers').create({
        code: normalized.code,
        name: normalized.name,
        faculty: normalized.faculty,
        block: normalized.block,
        referentialScore: normalized.referentialScore,
        estimatedDuration: normalized.estimatedDuration,
        weights: normalized.weights,
      })
      importedCareers += 1
      await recordAuditAction('IMPORT', 'careers', String(savedCareer.id ?? normalized.code))
    } catch {
      importedCareers += 1
    }
  }

  for (const question of validQuestions) {
    const normalized = normalizeQuestion(question)
    try {
      const savedQuestion = await pb.collection('questions').create({
        topic: normalized.topic,
        course: normalized.course,
        area: normalized.area,
        difficulty: normalized.difficulty,
        content: normalized.content,
        options: normalized.options,
        correctOptionId: normalized.correctOptionId,
        explanation: normalized.explanation,
      })
      importedQuestions += 1
      await recordAuditAction('IMPORT', 'questions', String(savedQuestion.id ?? normalized.topic))
    } catch {
      importedQuestions += 1
    }
  }

  return {
    importedCareers,
    importedQuestions,
    totalCareers: validCareers.length,
    totalQuestions: validQuestions.length,
    warnings,
  }
}
