/**
 * Hook para PocketBase: Calificación automática de exámenes
 * 
 * Este script se ejecuta cuando se actualiza un exam_attempt
 * Calcula el score automáticamente usando el esquema UNMSM
 * 
 * Instalación:
 * 1. En PocketBase Admin Panel
 * 2. Ir a: Collections → exam_attempts → Hooks
 * 3. Crear nuevo Hook "After Update"
 * 4. Copiar este código en el editor de JavaScript
 */

// Hook afterUpdate para exam_attempts
routerAdd('after', '/api/collections/exam_attempts/records/:id', (c) => {
  const data = c.get('httpContext').response.data
  const examAttempt = c.get('examAttempt')

  // Solo procesar si el estado es 'submitted'
  if (examAttempt?.status !== 'submitted') {
    return c.json(200, data)
  }

  // Si ya tiene score calculado, no recalcular
  if (examAttempt.score !== null && examAttempt.score !== undefined) {
    return c.json(200, data)
  }

  try {
    // Obtener las preguntas usadas en el examen
    const answers = examAttempt.answers || []
    if (answers.length === 0) {
      return c.json(200, data)
    }

    // Extraer IDs de preguntas
    const questionIds = answers.map((a) => a.questionId)

    // Buscar las preguntas en la base de datos
    const questions = $app
      .dao()
      .db()
      .select('*')
      .from('questions')
      .where($dbx.in('id', questionIds))
      .all()

    if (!questions || questions.length === 0) {
      console.log('No se encontraron preguntas para calificar')
      return c.json(200, data)
    }

    // Crear mapa de preguntas correctas
    const correctAnswersMap = {}
    questions.forEach((q) => {
      correctAnswersMap[q.id] = q.correct_option_id
    })

    // Calcular score: aciertos(+1) + errores(-0.25) + blancos(0)
    let score = 0
    let correctCount = 0
    let errorCount = 0
    let blankCount = 0

    answers.forEach((answer) => {
      if (!answer.selected_option_id) {
        // Pregunta sin responder
        blankCount++
      } else if (answer.selected_option_id === correctAnswersMap[answer.question_id]) {
        // Respuesta correcta
        correctCount++
        score += 1
      } else {
        // Respuesta incorrecta
        errorCount++
        score -= 0.25
      }
    })

    // Asegurar que no sea negativo
    score = Math.max(0, score)

    // Obtener puntaje referencial de la carrera
    const career = $app.dao().findRecordById('careers', examAttempt.career_id)
    const referentialScore = career ? career.get('referential_score') || 100 : 100

    // Calcular brecha
    const gap = Math.max(0, referentialScore - score)

    // Actualizar el examen con los resultados
    examAttempt.set('score', parseFloat(score.toFixed(2)))
    examAttempt.set('referential_score', referentialScore)
    examAttempt.set('gap', parseFloat(gap.toFixed(2)))

    // Guardar cambios
    $app.dao().saveRecord(examAttempt)

    console.log(`Examen ${examAttempt.id} calificado: ${score}/${referentialScore} (Brecha: ${gap})`)

    return c.json(200, data)
  } catch (err) {
    console.log('Error calificando examen:', err)
    return c.json(200, data)
  }
}, 'exam_attempts')

// Hook afterUpdate alternativo usando TypeScript (si PocketBase soporta)
onAfterRecordUpdate((e) => {
  if (e.record.collection().name !== 'exam_attempts') {
    return
  }

  if (e.record.get('status') !== 'submitted') {
    return
  }

  try {
    const answers = e.record.get('answers') || []
    if (answers.length === 0) {
      return
    }

    const questionIds = answers.map((a) => a.questionId)
    const questions = $app
      .dao()
      .db()
      .select('*')
      .from('questions')
      .where($dbx.in('id', questionIds))
      .all()

    if (!questions) {
      return
    }

    const correctAnswersMap = {}
    questions.forEach((q) => {
      correctAnswersMap[q.id] = q.correctOptionId
    })

    let score = 0
    answers.forEach((answer) => {
      if (!answer.selectedOptionId) {
        // Blanco
        score += 0
      } else if (answer.selectedOptionId === correctAnswersMap[answer.questionId]) {
        // Correcto
        score += 1
      } else {
        // Error
        score -= 0.25
      }
    })

    score = Math.max(0, score)

    const career = $app.dao().findRecordById('careers', e.record.get('careerId'))
    const referentialScore = career ? career.get('referentialScore') || 100 : 100
    const gap = Math.max(0, referentialScore - score)

    e.record.set('score', parseFloat(score.toFixed(2)))
    e.record.set('referentialScore', referentialScore)
    e.record.set('gap', parseFloat(gap.toFixed(2)))
  } catch (err) {
    console.log('Error in grading hook:', err)
  }
}, 'exam_attempts')
