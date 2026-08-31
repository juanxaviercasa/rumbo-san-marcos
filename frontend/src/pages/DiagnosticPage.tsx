import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Loader } from 'lucide-react'
import Stepper from '../components/Stepper'
import FormularioRegistro from '../components/FormularioRegistro'
import SelectorCarrera from '../components/SelectorCarrera'
import { useRegistrationForm } from '../hooks/useRegistrationForm'
import { createExamAttempt } from '../services/exams'
import type { Career } from '../types'

const STEPS = ['Tus Datos', 'Tu Carrera', 'Confirmar']

export default function DiagnosticPage() {
  const navigate = useNavigate()
  const form = useRegistrationForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [submitError, setSubmitError] = useState('')

  const handleNextStep = () => {
    if (currentStep === 0) {
      // Validar datos personales
      if (!form.formData.studentName || !form.formData.studentEmail || !form.formData.studentPhone) {
        form.updateFormData({})
        // Validar y mostrar errores
        if (!form.validateForm()) return
        setCurrentStep(1)
      } else {
        setCurrentStep(1)
      }
    } else if (currentStep === 1) {
      // Validar selección de carrera
      if (!form.formData.faculty || !form.formData.careerId) {
        if (!form.validateForm()) return
        setCurrentStep(2)
      } else {
        setCurrentStep(2)
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!form.validateForm()) return

    form.setIsLoading(true)
    setSubmitError('')

    try {
      // Crear el intento de examen en PocketBase
      const examAttempt = await createExamAttempt({
        studentName: form.formData.studentName,
        studentEmail: form.formData.studentEmail,
        studentPhone: form.formData.studentPhone,
        careerId: form.formData.careerId,
        status: 'in_progress',
        startTime: new Date().toISOString(),
      })

      // Redirigir a la página del examen
      navigate(`/examen/${examAttempt.id}`)
    } catch (error) {
      console.error('Error al crear el intento de examen:', error)

      const message = error instanceof Error && error.message.includes('VITE_SUPABASE_URL')
        ? 'Falta configurar Supabase en Vercel: agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY antes de iniciar la evaluación.'
        : 'Hubo un error al guardar tu información. Por favor, intenta de nuevo.'

      setSubmitError(message)
      form.setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rumbo-burgundy to-rumbo-dark text-white py-8">
        <div className="container-custom">
          <h1 className="text-4xl font-fraunces font-bold mb-2">Diagnóstico Adaptativo</h1>
          <p className="text-rumbo-gold">Personalizado para tu carrera en UNMSM</p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container-custom py-12">
        {/* Stepper */}
        <Stepper steps={STEPS} currentStep={currentStep} className="mb-12" />

        {/* Contenedor del formulario */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          {/* Paso 1: Datos personales */}
          {currentStep === 0 && (
            <FormularioRegistro
              data={form.formData}
              errors={form.errors}
              onChange={(field, value) =>
                form.updateFormData({ [field]: value })
              }
              disabled={form.isLoading}
            />
          )}

          {/* Paso 2: Selección de carrera */}
          {currentStep === 1 && (
            <SelectorCarrera
              selectedFaculty={form.formData.faculty}
              selectedCareer={form.formData.careerId}
              onFacultyChange={(faculty) =>
                form.updateFormData({ faculty })
              }
              onCareerChange={(careerId, career) =>
                form.updateFormData({ careerId, career })
              }
              errors={form.errors}
              disabled={form.isLoading}
            />
          )}

          {/* Paso 3: Confirmación */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-fraunces font-bold text-rumbo-burgundy mb-6">
                  Confirma tu Información
                </h3>
              </div>

              <div className="space-y-4">
                {/* Datos personales */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Datos Personales</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Nombre:</span>{' '}
                      <span className="font-medium">{form.formData.studentName}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Email:</span>{' '}
                      <span className="font-medium">{form.formData.studentEmail}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Teléfono:</span>{' '}
                      <span className="font-medium">{form.formData.studentPhone}</span>
                    </p>
                  </div>
                </div>

                {/* Carrera seleccionada */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Carrera Seleccionada</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Carrera:</span>{' '}
                      <span className="font-medium">{form.formData.career?.name}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Bloque:</span>{' '}
                      <span className="font-medium">{form.formData.career?.block}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Puntaje Referencial:</span>{' '}
                      <span className="font-medium">{form.formData.career?.referentialScore}/2000</span>
                    </p>
                  </div>
                </div>

                {/* Instrucciones */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Antes de comenzar</h4>
                  <ul className="text-sm text-blue-900 space-y-1">
                    <li>✓ Asegúrate de tener al menos 3 horas disponibles</li>
                    <li>✓ Busca un lugar tranquilo y sin distracciones</li>
                    <li>✓ La evaluación tiene un cronómetro estricto</li>
                    <li>✓ No podrás volver atrás una vez que comiences</li>
                  </ul>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              )}
            </div>
          )}

          {/* Botones de navegación */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0 || form.isLoading}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNextStep}
                disabled={form.isLoading}
                className="flex items-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={form.isLoading}
                className="flex items-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {form.isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  <>
                    Comenzar Evaluación
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-rumbo-gray rounded-lg p-6">
            <h3 className="text-lg font-fraunces font-bold text-rumbo-burgundy mb-4">
              ¿Qué sucede en la evaluación?
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="text-rumbo-burgundy font-bold">1.</span>
                <span>Se generará una prueba personalizada según tu carrera y bloque</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rumbo-burgundy font-bold">2.</span>
                <span>Tendrás un cronómetro estricto. Al expirar, tu evaluación se envía automáticamente</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rumbo-burgundy font-bold">3.</span>
                <span>Tus respuestas se califican con el esquema oficial de UNMSM</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rumbo-burgundy font-bold">4.</span>
                <span>Recibirás resultados detallados y una ruta de estudio personalizada</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
