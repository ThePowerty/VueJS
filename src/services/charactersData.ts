import apiClient from '@/interceptor/axios'
import type { Character } from '@/models/characterModel'

const API_URL = '/characters'

export const getCharacters = async (): Promise<{ data: Character[] }> => {
  const response = await apiClient.get(API_URL)
  return { data: response.data }
}

export const addCharacter = async (characterData: Character): Promise<{ data: Character }> => {
  const response = await apiClient.post(API_URL, characterData)
  return { data: response.data }
}

export const updateCharacter = async (characterData: Character): Promise<{ data: Character }> => {
  const response = await apiClient.put(`${API_URL}/${characterData.id}`, characterData)
  return { data: response.data }
}

export const deleteCharacter = async (characterId: number): Promise<void> => {
  await apiClient.delete(`${API_URL}/${characterId}`)
}
