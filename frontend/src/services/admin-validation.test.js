import test from 'node:test'
import assert from 'node:assert/strict'

import { validateCareerInput, validateQuestionInput } from './admin-validation.js'

test('validateCareerInput rejects empty required fields', () => {
  const result = validateCareerInput({
    code: '',
    name: '',
    faculty: '',
    block: 'A',
    referentialScore: 0,
    estimatedDuration: 0,
  })

  assert.ok(result.includes('El código es obligatorio'))
  assert.ok(result.includes('El nombre de la carrera es obligatorio'))
  assert.ok(result.includes('La facultad es obligatoria'))
  assert.ok(result.includes('El puntaje referencial debe ser mayor a 0'))
})

test('validateCareerInput accepts valid data', () => {
  const result = validateCareerInput({
    code: 'MED001',
    name: 'Medicina Humana',
    faculty: 'Medicina',
    block: 'A',
    referentialScore: 1700,
    estimatedDuration: 180,
    weights: {
      mathematics: 1,
      physics: 0.7,
      chemistry: 0.8,
      biology: 0.9,
      spanish: 0.5,
      history: 0.3,
      geography: 0.3,
      civics: 0.2,
    },
  })

  assert.deepEqual(result, [])
})

test('validateQuestionInput enforces option structure and correct answer', () => {
  const result = validateQuestionInput({
    topic: 'Álgebra',
    course: 'Matemática',
    area: 'A',
    difficulty: 'basic',
    content: 'Pregunta de prueba',
    explanation: 'Explicación',
    options: [
      { id: 'opt-1', text: 'Opción 1', isCorrect: false },
      { id: 'opt-2', text: 'Opción 2', isCorrect: false },
      { id: 'opt-3', text: 'Opción 3', isCorrect: false },
      { id: 'opt-4', text: 'Opción 4', isCorrect: false },
    ],
    correctOptionId: 'opt-9',
  })

  assert.ok(result.includes('Debe existir exactamente una opción correcta'))
  assert.ok(result.includes('La opción correcta debe coincidir con una de las opciones'))
})
