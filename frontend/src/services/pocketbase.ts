import PocketBase from 'pocketbase'

// Inicializar cliente de PocketBase
// El URL se configurará según el entorno
const PB_URL = (import.meta as any).env?.VITE_POCKETBASE_URL || 'http://localhost:8090'

export const pb = new PocketBase(PB_URL)

// Funciones de autenticación (si es necesaria)
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
