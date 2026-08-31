export function validateCareerInput(input = {}) {
  const errors = []

  if (!input.code || !String(input.code).trim()) {
    errors.push('El código es obligatorio')
  }

  if (!input.name || !String(input.name).trim()) {
    errors.push('El nombre de la carrera es obligatorio')
  }

  if (!input.faculty || !String(input.faculty).trim()) {
    errors.push('La facultad es obligatoria')
  }

  if (!['A', 'B', 'C', 'D', 'E'].includes(input.block)) {
    errors.push('El bloque debe estar entre A y E')
  }

  if (!Number.isFinite(Number(input.referentialScore)) || Number(input.referentialScore) <= 0) {
    errors.push('El puntaje referencial debe ser mayor a 0')
  }

  if (!Number.isFinite(Number(input.estimatedDuration)) || Number(input.estimatedDuration) <= 0) {
    errors.push('La duración estimada debe ser mayor a 0')
  }

  const weights = input.weights || {}
  const requiredWeights = ['mathematics', 'physics', 'chemistry', 'biology', 'spanish', 'history', 'geography', 'civics']
  const missingWeights = requiredWeights.filter((key) => !Number.isFinite(Number(weights[key])))

  if (missingWeights.length) {
    errors.push('Faltan pesos válidos para las materias clave')
  }

  return errors
}

export function validateQuestionInput(input = {}) {
  const errors = []

  if (!input.topic || !String(input.topic).trim()) {
    errors.push('El tema es obligatorio')
  }

  if (!input.course || !String(input.course).trim()) {
    errors.push('El curso es obligatorio')
  }

  if (!input.content || !String(input.content).trim()) {
    errors.push('El enunciado es obligatorio')
  }

  if (!['A', 'B', 'C', 'D', 'E'].includes(input.area)) {
    errors.push('El área debe estar entre A y E')
  }

  if (!['basic', 'intermediate', 'advanced'].includes(input.difficulty)) {
    errors.push('La dificultad debe ser basic, intermediate o advanced')
  }

  const options = Array.isArray(input.options) ? input.options : []
  if (options.length !== 4) {
    errors.push('Debe haber exactamente 4 opciones')
  }

  const validTexts = options.filter((option) => option && String(option.text || '').trim())
  if (validTexts.length < 4) {
    errors.push('Cada opción debe tener texto válido')
  }

  const correctOptions = options.filter((option) => option && option.isCorrect)
  if (correctOptions.length !== 1) {
    errors.push('Debe existir exactamente una opción correcta')
  }

  const correctOptionId = input.correctOptionId
  const existsInOptions = options.some((option) => option && option.id && String(option.id) === String(correctOptionId))
  if (correctOptionId && !existsInOptions) {
    errors.push('La opción correcta debe coincidir con una de las opciones')
  }

  if (!correctOptionId || !String(correctOptionId).trim()) {
    errors.push('Debe indicar la opción correcta')
  }

  return errors
}
