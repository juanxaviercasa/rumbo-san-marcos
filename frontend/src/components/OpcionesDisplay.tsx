import { Check } from 'lucide-react'
import type { QuestionOption } from '../types'

interface OpcionesDisplayProps {
  options: QuestionOption[]
  selectedOptionId?: string
  onSelectOption: (optionId: string) => void
  disabled?: boolean
}

export default function OpcionesDisplay({
  options,
  selectedOptionId,
  onSelectOption,
  disabled = false,
}: OpcionesDisplayProps) {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = selectedOptionId === option.id
        const buttonClass = isSelected
          ? 'bg-rumbo-burgundy text-white border-rumbo-burgundy shadow-md'
          : 'bg-white text-gray-900 border-gray-300 hover:border-rumbo-burgundy hover:bg-rumbo-gray'

        return (
          <button
            key={option.id}
            onClick={() => !disabled && onSelectOption(option.id)}
            disabled={disabled}
            className={`
              w-full text-left px-6 py-4 rounded-lg border-2 transition-all
              font-medium flex items-center gap-4
              ${buttonClass}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Indicador de selección */}
            <div
              className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                transition-all
                ${
                  isSelected
                    ? 'bg-white border-white'
                    : 'border-gray-400 group-hover:border-rumbo-burgundy'
                }
              `}
            >
              {isSelected && <Check className="w-4 h-4 text-rumbo-burgundy" />}
            </div>

            {/* Texto de opción */}
            <span className="flex-1 text-base leading-relaxed">{option.text}</span>
          </button>
        )
      })}
    </div>
  )
}
