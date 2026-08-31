import React from 'react'
import { CheckCircle, Circle } from 'lucide-react'

interface StepperProps {
  steps: string[]
  currentStep: number
  className?: string
}

export default function Stepper({ steps, currentStep, className = '' }: StepperProps) {
  return (
    <div className={`flex items-center justify-between mb-8 ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isNextStep = index === currentStep + 1

        return (
          <React.Fragment key={index}>
            {/* Paso */}
            <div className="flex flex-col items-center relative">
              {isCompleted ? (
                <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
              ) : isCurrent ? (
                <div className="w-12 h-12 rounded-full bg-rumbo-burgundy text-white flex items-center justify-center mb-2 font-bold text-lg">
                  {index + 1}
                </div>
              ) : (
                <Circle className={`w-12 h-12 mb-2 ${isNextStep ? 'text-rumbo-burgundy' : 'text-gray-300'}`} />
              )}
              <span
                className={`text-sm font-medium text-center max-w-[100px] ${
                  isCurrent
                    ? 'text-rumbo-burgundy font-bold'
                    : isCompleted
                      ? 'text-green-600'
                      : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>

            {/* Línea de conexión */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
