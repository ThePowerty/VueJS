<template>
  <ul>
    <li v-for="character in characters" :key="character.id">
      <CharactersDetail :character="character" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { type Character } from '@/models/characterModel'
import CharactersDetail from './CharacterDetail/CharacterDetail.vue'

defineProps<{
  characters: Character[]
}>()
</script>
