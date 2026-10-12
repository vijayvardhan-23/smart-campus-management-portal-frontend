import axios from 'axios'
import { demoApiRequest } from './demoApi'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
export const apiConfigured = Boolean(configuredBaseUrl || import.meta.env.DEV)
export const isDemoMode = Boolean(!configuredBaseUrl && import.meta.env.PROD)
const baseURL = configuredBaseUrl || (import.meta.env.DEV ? 'http://localhost:8080/api' : undefined)

const http = axios.create({ baseURL })
http.interceptors.request.use(config => {
  const token = localStorage.getItem('campus_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const api = {
  get(url, config) {
    return isDemoMode ? Promise.resolve().then(() => ({ data: demoApiRequest('get', url) })) : http.get(url, config)
  },
  post(url, body, config) {
    return isDemoMode ? Promise.resolve().then(() => ({ data: demoApiRequest('post', url, body) })) : http.post(url, body, config)
  },
  put(url, body, config) {
    return isDemoMode ? Promise.resolve().then(() => ({ data: demoApiRequest('put', url, body) })) : http.put(url, body, config)
  },
  delete(url, config) {
    return isDemoMode ? Promise.resolve().then(() => ({ data: demoApiRequest('delete', url) })) : http.delete(url, config)
  }
}

export function errorMessage(error) {
  return error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Something went wrong'
}
export default api
