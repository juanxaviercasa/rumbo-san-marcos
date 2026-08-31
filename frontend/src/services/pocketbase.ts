import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ''

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

function toSnakeCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
}

function toCamelCase(value: string): string {
  return value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

function normalizeDbRecord(record: any, tableName: string): any {
  if (!record || typeof record !== 'object') return record

  const mapped: Record<string, any> = {}

  Object.entries(record).forEach(([key, value]) => {
    const normalizedKey = toCamelCase(key)

    if (tableName === 'careers' && key === 'referential_score') {
      mapped.referentialScore = value
      return
    }

    if (tableName === 'careers' && key === 'estimated_duration') {
      mapped.estimatedDuration = value
      return
    }

    if (tableName === 'careers' && key === 'created_at') {
      mapped.created = value
      return
    }

    if (tableName === 'careers' && key === 'updated_at') {
      mapped.updated = value
      return
    }

    if (tableName === 'questions' && key === 'correct_option_id') {
      mapped.correctOptionId = value
      return
    }

    if (tableName === 'questions' && key === 'created_at') {
      mapped.created = value
      return
    }

    if (tableName === 'questions' && key === 'updated_at') {
      mapped.updated = value
      return
    }

    if (tableName === 'exam_attempts' && key === 'student_name') {
      mapped.studentName = value
      return
    }

    if (tableName === 'exam_attempts' && key === 'student_email') {
      mapped.studentEmail = value
      return
    }

    if (tableName === 'exam_attempts' && key === 'student_phone') {
      mapped.studentPhone = value
      return
    }

    if (tableName === 'exam_attempts' && key === 'career_id') {
      mapped.careerId = value
      return
    }

    if (tableName === 'exam_attempts' && key === 'start_time') {
      mapped.startTime = value
      return
    }

    if (tableName === 'exam_attempts' && key === 'end_time') {
      mapped.endTime = value
      return
    }

    if (tableName === 'exam_attempts' && key === 'referential_score') {
      mapped.referentialScore = value
      return
    }

    if (tableName === 'exam_attempts' && key === 'created_at') {
      mapped.created = value
      return
    }

    if (tableName === 'exam_attempts' && key === 'updated_at') {
      mapped.updated = value
      return
    }

    if (tableName === 'audit_logs' && key === 'user_id') {
      mapped.userId = value
      return
    }

    if (tableName === 'audit_logs' && key === 'collection_name') {
      mapped.collection = value
      return
    }

    if (tableName === 'audit_logs' && key === 'record_id') {
      mapped.recordId = value
      return
    }

    if (tableName === 'audit_logs' && key === 'created_at') {
      mapped.createdAt = value
      return
    }

    if (Array.isArray(value)) {
      mapped[normalizedKey] = value.map((item) => {
        if (item && typeof item === 'object') {
          return normalizeDbRecord(item, tableName)
        }
        return item
      })
      return
    }

    if (value && typeof value === 'object') {
      mapped[normalizedKey] = normalizeDbRecord(value, tableName)
      return
    }

    mapped[normalizedKey] = value
  })

  return mapped
}

function toDbPayload(input: any, tableName: string): Record<string, any> {
  if (!input || typeof input !== 'object') return input

  const transformed: Record<string, any> = {}

  Object.entries(input).forEach(([key, value]) => {
    const mappedKey = toSnakeCase(key)
    const dbKey = mappedKey

    if (tableName === 'careers' && key === 'referentialScore') transformed.referential_score = value
    else if (tableName === 'careers' && key === 'estimatedDuration') transformed.estimated_duration = value
    else if (tableName === 'careers' && key === 'created') transformed.created_at = value
    else if (tableName === 'careers' && key === 'updated') transformed.updated_at = value
    else if (tableName === 'questions' && key === 'correctOptionId') transformed.correct_option_id = value
    else if (tableName === 'questions' && key === 'created') transformed.created_at = value
    else if (tableName === 'questions' && key === 'updated') transformed.updated_at = value
    else if (tableName === 'exam_attempts' && key === 'studentName') transformed.student_name = value
    else if (tableName === 'exam_attempts' && key === 'studentEmail') transformed.student_email = value
    else if (tableName === 'exam_attempts' && key === 'studentPhone') transformed.student_phone = value
    else if (tableName === 'exam_attempts' && key === 'careerId') transformed.career_id = value
    else if (tableName === 'exam_attempts' && key === 'startTime') transformed.start_time = value
    else if (tableName === 'exam_attempts' && key === 'endTime') transformed.end_time = value
    else if (tableName === 'exam_attempts' && key === 'referentialScore') transformed.referential_score = value
    else if (tableName === 'exam_attempts' && key === 'created') transformed.created_at = value
    else if (tableName === 'exam_attempts' && key === 'updated') transformed.updated_at = value
    else if (tableName === 'audit_logs' && key === 'userId') transformed.user_id = value
    else if (tableName === 'audit_logs' && key === 'collection') transformed.collection_name = value
    else if (tableName === 'audit_logs' && key === 'recordId') transformed.record_id = value
    else if (tableName === 'audit_logs' && key === 'createdAt') transformed.created_at = value
    else if (Array.isArray(value)) {
      transformed[dbKey] = value.map((item) => {
        if (item && typeof item === 'object') {
          return toDbPayload(item, tableName)
        }
        return item
      })
    } else if (value && typeof value === 'object') {
      transformed[dbKey] = toDbPayload(value, tableName)
    } else {
      transformed[dbKey] = value
    }
  })

  return transformed
}

function transformFilter(filter?: string): string | undefined {
  if (!filter) return undefined

  return filter
    .replace(/\s*=\s*"([^"]+)"/g, ' = "$1"')
    .replace(/\s*\|\|\s*/g, ' or ')
    .replace(/\s*&&\s*/g, ' and ')
}

function createSupabaseCollectionProxy(collectionName: string) {
  const table = collectionName

  if (table === 'users') {
    return {
      async authWithPassword(username: string, password: string) {
        if (!supabase) {
          throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno.')
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password,
        })

        if (error) throw error
        return data
      },
    }
  }

  return {
    async getFullList(options: any = {}) {
      if (!supabase) {
        throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno.')
      }

      let query = supabase.from(table).select('*')

      if (options.filter) {
        query = query.filter('id', 'in', '()')
      }

      if (options.sort) {
        const [field, direction] = options.sort.split(':')
        const ascending = direction !== 'desc'
        query = query.order(field, { ascending })
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []).map((row: any) => normalizeDbRecord(row, table))
    },

    async getOne(id: string) {
      if (!supabase) {
        throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno.')
      }

      const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
      if (error) throw error
      return normalizeDbRecord(data, table)
    },

    async create(data: any) {
      if (!supabase) {
        throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno.')
      }

      const payload = toDbPayload(data, table)
      const { data: created, error } = await supabase.from(table).insert([payload]).select().single()
      if (error) throw error
      return normalizeDbRecord(created, table)
    },

    async update(id: string, data: any) {
      if (!supabase) {
        throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno.')
      }

      const payload = toDbPayload(data, table)
      const { data: updated, error } = await supabase.from(table).update(payload).eq('id', id).select().single()
      if (error) throw error
      return normalizeDbRecord(updated, table)
    },

    async delete(id: string) {
      if (!supabase) {
        throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno.')
      }

      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      return true
    },
  }
}

export const pb: any = {
  collection: (collectionName: string) => createSupabaseCollectionProxy(collectionName),
  authStore: {
    token: '',
    isValid: false,
    clear() {
      if (supabase) {
        supabase.auth.signOut()
      }
      this.token = ''
      this.isValid = false
    },
  },
}

export function ensureSupabaseClient() {
  if (!supabase) {
    throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno.')
  }

  return supabase
}

export async function login(username: string, password: string) {
  if (!supabase) {
    throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno.')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username,
    password,
  })

  if (error) throw error
  return data
}

export async function logout() {
  if (supabase) {
    await supabase.auth.signOut()
  }
  pb.authStore.clear()
}

export async function getAuthToken() {
  const { data } = await supabase?.auth.getSession?.() ?? { data: { session: null } }
  return data.session?.access_token ?? ''
}

export async function isAuthenticated() {
  const { data } = await supabase?.auth.getSession?.() ?? { data: { session: null } }
  return Boolean(data.session)
}
