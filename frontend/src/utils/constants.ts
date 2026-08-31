// Constantes de carreras y bloques
// Nota: Esta es una estructura base. Los datos completos se cargarán de PocketBase en la fase final.

export const BLOCKS = ['A', 'B', 'C', 'D', 'E'] as const
export const FACULTIES = ['Ingeniería', 'Ciencias', 'Humanidades', 'Derecho', 'Medicina'] as const

export const BLOCK_DESCRIPTIONS: Record<string, string> = {
  A: 'Ingeniería y Tecnología',
  B: 'Ciencias Naturales',
  C: 'Humanidades y Sociales',
  D: 'Derecho y Gestión',
  E: 'Medicina y Salud',
}

// Carreras de ejemplo por facultad (estructura simplificada)
// En producción esto vendrá de PocketBase
export const CAREERS_BY_FACULTY: Record<string, any[]> = {
  'Ingeniería': [
    { id: 'ing-1', code: 'ING001', name: 'Ingeniería Civil', block: 'A', referentialScore: 1450 },
    { id: 'ing-2', code: 'ING002', name: 'Ingeniería Informática', block: 'A', referentialScore: 1520 },
    { id: 'ing-3', code: 'ING003', name: 'Ingeniería de Minas', block: 'A', referentialScore: 1400 },
  ],
  'Ciencias': [
    { id: 'sci-1', code: 'SCI001', name: 'Biología', block: 'B', referentialScore: 1350 },
    { id: 'sci-2', code: 'SCI002', name: 'Física', block: 'B', referentialScore: 1480 },
    { id: 'sci-3', code: 'SCI003', name: 'Química', block: 'B', referentialScore: 1420 },
  ],
  'Humanidades': [
    { id: 'hum-1', code: 'HUM001', name: 'Literatura', block: 'C', referentialScore: 1200 },
    { id: 'hum-2', code: 'HUM002', name: 'Historia', block: 'C', referentialScore: 1180 },
    { id: 'hum-3', code: 'HUM003', name: 'Filosofía', block: 'C', referentialScore: 1220 },
  ],
  'Derecho': [
    { id: 'law-1', code: 'LAW001', name: 'Derecho', block: 'D', referentialScore: 1380 },
  ],
  'Medicina': [
    { id: 'med-1', code: 'MED001', name: 'Medicina Humana', block: 'E', referentialScore: 1650 },
    { id: 'med-2', code: 'MED002', name: 'Enfermería', block: 'E', referentialScore: 1300 },
  ],
}

// Duraciones estimadas por carrera (en minutos)
export const EXAM_DURATION_BY_BLOCK: Record<string, number> = {
  A: 180, // 3 horas para Ingeniería (más matemática)
  B: 180, // 3 horas para Ciencias
  C: 150, // 2.5 horas para Humanidades
  D: 150, // 2.5 horas para Derecho
  E: 180, // 3 horas para Medicina
}
