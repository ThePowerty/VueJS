import axios from "axios";
import MockAdapter from 'axios-mock-adapter'
import { mockCharacters } from "./mocks/charactersMock";
import type { Character } from "@/models/characterModel";
import { useAuthStore } from "@/stores/useAuthStore";

const apiClient = axios.create({
  baseURL: 'http://localhost:4000',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const mock = new MockAdapter(apiClient)

mock.onPost(`/register`).reply((config) => {
  const {email, password} = JSON.parse(config.data)
  if( email && password ) {
    const authStore = useAuthStore()
    const token = `mocked_token`
    authStore.setToken(token)
    return [200, {token}]
  } else {
    return [400, { message: `Invalid email or password` }]
  }
})

mock.onPost(`/login`).reply((config) => {
  const {email, password} = JSON.parse(config.data)
  if( email === `test@test.com` && password === `testtest` ) {
    const authStore = useAuthStore()
    const token = `mocked_token`
    authStore.setToken(token)
    return [200, {token}]
  } else {
    return [401, { message: `Invalid email or password` }]
  }
})

mock.onGet(`/characters`).reply(200, mockCharacters)

mock.onPost(`/characters`).reply( config => {
  const charactersData: Character = JSON.parse(config.data)
  const formattedCharacters = {...charactersData, id: mockCharacters.length+1}

  mockCharacters.push(formattedCharacters)

  return[200, formattedCharacters]
})

mock.onPut(/\/characters\/\d+/).reply(config => {
  const id = parseInt(config.url!.split('/').pop()!)
  const charactersData: Character = JSON.parse(config.data)
  const index = mockCharacters.findIndex(character => character.id === id)

  if(index === -1) {
    return[404, {message: 'Character not found'}]
  }

  mockCharacters[id] = charactersData

  return [200, charactersData]
})

mock.onDelete(/\/characters\/\d+/).reply(config => {
  const id = parseInt(config.url!.split('/').pop()!)
  const index = mockCharacters.findIndex(character => character.id === id)
  const foundCharacter = mockCharacters[index]

  if(!foundCharacter) {
    return[404, {message: 'Character not found'}]
  }

  mockCharacters.splice(index, 1)

  return [200, {data: id}]

})

export default apiClient;
