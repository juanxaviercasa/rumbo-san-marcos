import { useState, useEffect, useCallback } from 'react'

interface UseTimerProps {
  initialMinutes: number
  onTimeExpired?: () => void
}

export function useTimer({ initialMinutes, onTimeExpired }: UseTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * 60) // segundos
  const [isRunning, setIsRunning] = useState(true)

  const totalSeconds = initialMinutes * 60
  const percentage = (timeRemaining / totalSeconds) * 100

  // Formatear tiempo como MM:SS
  const formatTime = useCallback(() => {
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [timeRemaining])

  // Efecto para el countdown
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1

        // Cuando se agota el tiempo
        if (newTime <= 0) {
          setIsRunning(false)
          onTimeExpired?.()
          return 0
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeRemaining, onTimeExpired])

  const pause = useCallback(() => setIsRunning(false), [])
  const resume = useCallback(() => setIsRunning(true), [])
  const stop = useCallback(() => {
    setIsRunning(false)
    setTimeRemaining(0)
  }, [])

  // Determinar estado de alerta
  const isWarning = timeRemaining <= 300 // menos de 5 minutos
  const isAlarm = timeRemaining <= 60 // menos de 1 minuto

  return {
    timeRemaining,
    formatTime: formatTime(),
    percentage,
    isRunning,
    isWarning,
    isAlarm,
    pause,
    resume,
    stop,
    hasExpired: timeRemaining <= 0,
  }
}
