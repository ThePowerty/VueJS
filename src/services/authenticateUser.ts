import apiClient from "../interceptor/axios"

export const login = (email: string, password: string) => {
  return apiClient.post(`/login`, {
    email,
    password,
  })
}

export const register = (email: string, password: string) => {
  return apiClient.post(`/register`, {
    email,
    password,
  })
}
