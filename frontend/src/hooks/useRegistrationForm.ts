import { useState, useCallback } from 'react'
import type { Career } from '../types'

export interface RegistrationFormData {
  studentName: string
  studentEmail: string
  studentPhone: string
  faculty: string
  careerId: string
  career?: Career
}

export interface RegistrationFormErrors {
  studentName?: string
  studentEmail?: string
  studentPhone?: string
  faculty?: string
  careerId?: string
}

export function useRegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    faculty: '',
    careerId: '',
  })

  const [errors, setErrors] = useState<RegistrationFormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const updateFormData = useCallback((updates: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    // Limpiar errores relevantes
    const newErrors = { ...errors }
    Object.keys(updates).forEach((key) => {
      delete newErrors[key as keyof RegistrationFormErrors]
    })
    setErrors(newErrors)
  }, [errors])

  const validateForm = (): boolean => {
    const newErrors: RegistrationFormErrors = {}

    // Validar nombre
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'El nombre es requerido'
    } else if (formData.studentName.length < 3) {
      newErrors.studentName = 'El nombre debe tener al menos 3 caracteres'
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = 'El correo es requerido'
    } else if (!emailRegex.test(formData.studentEmail)) {
      newErrors.studentEmail = 'Ingresa un correo válido'
    }

    // Validar teléfono
    const phoneRegex = /^[0-9]{7,}$/
    if (!formData.studentPhone.trim()) {
      newErrors.studentPhone = 'El teléfono es requerido'
    } else if (!phoneRegex.test(formData.studentPhone.replace(/\D/g, ''))) {
      newErrors.studentPhone = 'El teléfono debe tener al menos 7 dígitos'
    }

    // Validar facultad
    if (!formData.faculty) {
      newErrors.faculty = 'Selecciona una facultad'
    }

    // Validar carrera
    if (!formData.careerId) {
      newErrors.careerId = 'Selecciona una carrera'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const reset = useCallback(() => {
    setFormData({
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      faculty: '',
      careerId: '',
    })
    setErrors({})
  }, [])

  return {
    formData,
    errors,
    isLoading,
    setIsLoading,
    updateFormData,
    validateForm,
    reset,
  }
}
