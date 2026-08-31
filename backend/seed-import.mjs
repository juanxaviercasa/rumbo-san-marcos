import fs from 'node:fs/promises'
import PocketBase from 'pocketbase'

const pbUrl = process.env.POCKETBASE_URL || 'http://localhost:8090'
const adminEmail = process.env.PB_ADMIN_EMAIL || 'admin@rumbosanmarcos.com'
const adminPassword = process.env.PB_ADMIN_PASSWORD || 'admin123456'

const careerFile = new URL('../carreras.json', import.meta.url)
const questionFile = new URL('../preguntas.json', import.meta.url)

async function main() {
  const pb = new PocketBase(pbUrl)

  try {
    await pb.admins.authWithPassword(adminEmail, adminPassword)
  } catch (error) {
    console.error('No se pudo autenticar como administrador de PocketBase.')
    console.error('Asegúrate de crear el admin antes de ejecutar el importador.')
    console.error('Variables esperadas: PB_ADMIN_EMAIL y PB_ADMIN_PASSWORD')
    throw error
  }

  const careers = JSON.parse(await fs.readFile(careerFile, 'utf8'))
  const questions = JSON.parse(await fs.readFile(questionFile, 'utf8'))

  const existingCareers = await pb.collection('careers').getFullList({ sort: 'code' })
  const careerCodes = new Set(existingCareers.map((career) => String(career.code)))

  for (const career of careers) {
    if (careerCodes.has(String(career.code))) continue

    await pb.collection('careers').create({
      code: career.code,
      name: career.name,
      faculty: career.faculty,
      block: career.block,
      referentialScore: Number(career.referentialScore),
      estimatedDuration: Number(career.estimatedDuration),
      weights: career.weights,
    })
  }

  const existingQuestions = await pb.collection('questions').getFullList({ sort: 'course' })
  const questionKeys = new Set(
    existingQuestions.map((question) => `${question.course}::${question.topic}::${question.content}`),
  )

  for (const question of questions) {
    const key = `${question.course}::${question.topic}::${question.content}`
    if (questionKeys.has(key)) continue

    await pb.collection('questions').create({
      topic: question.topic,
      course: question.course,
      area: question.area,
      difficulty: question.difficulty,
      content: question.content,
      options: question.options,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation,
    })
  }

  console.log(`Importación finalizada: ${careers.length} carreras y ${questions.length} preguntas procesadas.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
