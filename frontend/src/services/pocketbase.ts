import PocketBase from 'pocketbase'
import { createClient } from '@supabase/supabase-js'

const PB_URL = (import.meta as any).env?.VITE_POCKETBASE_URL || 'http://localhost:8090'
export const pb = new PocketBase(PB_URL)

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ''

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

export function ensureSupabaseClient() {
  if (!supabase) {
    throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el entorno.')
  }

  return supabase
}

export async function login(username: string, password: string) {
  return pb.collection('users').authWithPassword(username, password)
}

export async function logout() {
  pb.authStore.clear()
}

export function getAuthToken() {
  return pb.authStore.token
}

export function isAuthenticated() {
  return pb.authStore.isValid
}
