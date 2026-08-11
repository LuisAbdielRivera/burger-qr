import api, { AUTH_TOKEN_KEY } from './api'

export async function loginAdmin(email, password) {
  const { data } = await api.post('/auth/login', { email, password })

  if (!data?.token) {
    throw new Error('El servidor no devolvió un token de sesión')
  }

  localStorage.setItem(AUTH_TOKEN_KEY, data.token)

  return data
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}
