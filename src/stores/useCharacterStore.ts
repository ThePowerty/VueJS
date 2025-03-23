import { EmptyCharacter, type Character } from "@/models/characterModel";
import { addCharacter, deleteCharacter, getCharacters, updateCharacter } from "@/services/charactersData";
import { defineStore } from "pinia";

export const useCharacterStore = defineStore("character", {
  state: () => ({
    initialized: false,
    characters: new Map<number, Character>()
  }),
  getters: {
    formattedCharacters(state): Character[] {
      return Array.from(state.characters.values())
    }
  },
  actions: {
    async init() {
      if (!this.initialized) {
        await this.fetchCharacters()
      }
    },
    async fetchCharacters() {
      try {
        const response = await getCharacters()
        const result = response.data

        const newMap = new Map<number, Character>()

        result.forEach(character => {
          newMap.set(character.id, character)
        })

        this.characters = newMap
        this.initialized = true
      } catch (error) {
        console.error('Error fetching Characters: ', error);

        const defaultCharacter: Character = EmptyCharacter

        this.characters = new Map<number, Character>([[defaultCharacter.id, defaultCharacter]])
      }
    },
    async addCharacter(character: Character) {
      try {
        const response = await addCharacter(character)
        const newCharacter = response.data

        this.characters.set(newCharacter.id, newCharacter)
      } catch (error) {
        console.error('Error adding a new Character: ', error)
      }
    },
    async editCharacter(character: Character) {
      try {
        const response = await updateCharacter(character)
        const updatedCharacter = response.data

        this.characters.set(updatedCharacter.id, updatedCharacter)
      } catch (error) {
        console.error('Error updating the character: ', error)
      }
    },
    async deleteCharacter(id: number) {
      try {
        await deleteCharacter(id)

        this.characters.delete(id)
      } catch(error) {
        console.error('Error deleting a Character: ', error)
      }
    }
  }
})
