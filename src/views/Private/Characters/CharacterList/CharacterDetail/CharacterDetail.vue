<template>
  <div>
    <h2>{{ character.name }} {{ character.lastName }}</h2>
    <button>Editar</button>
    <button @click="removeCharacter(character.id)">Borrar</button>
  </div>
</template>
<script lang="ts" setup>
import type { Character } from '@/models/characterModel'
import { useCharacterStore } from '@/stores/useCharacterStore'
// import { useRouter } from 'vue-router'

defineProps<{
  character: Character
}>()

const characterStore = useCharacterStore()
// const router = useRouter()

// const editCharacter = (character: Character) => {
// TODO: falta la navegación hacia la edición
// router.push()
// }

const removeCharacter = async (id: number) => {
  await characterStore.deleteCharacter(id)
}
</script>
