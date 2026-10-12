import axios from 'axios'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
export const apiConfigured = Boolean(configuredBaseUrl || import.meta.env.DEV)
const baseURL = configuredBaseUrl || (import.meta.env.DEV ? 'http://localhost:8080/api' : undefined)

const api = axios.create({ baseURL })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('campus_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export function errorMessage(error) {
  return error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Something went wrong'
}
export default api
