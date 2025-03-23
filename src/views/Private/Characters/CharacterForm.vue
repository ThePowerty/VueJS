<template>
  <form @submit.prevent="handleSubmit">
    <InputElement
      v-model="formData.name.value"
      type="text"
      place-holder="Name"
      :error="formData.name.error"
      required
    />
    <InputElement
      v-model="formData.lastName.value"
      type="text"
      place-holder="Last Name"
      :error="formData.lastName.error"
      required
    />

    <button type="submit">{{ isEdit ? 'Edit' : 'Save' }} Character</button>
  </form>
</template>
<script setup lang="ts">
import type { Character } from '@/models/characterModel';
import { useCharacterStore } from '@/stores/useCharacterStore';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { z } from 'zod';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
const characterStore = useCharacterStore();

const characterSchema = z.object({
  name: z.string().min(1, {message: 'Name is required'}),
  lastName: z.string().min(1, {message: 'Last name is required'}),
})

const formData = ref({
  name: {value: '', error: ''},
  lastName: {value: '', error: ''},
})

if(isEdit.value) {
  const id = Number(route.params.id)
  const character = characterStore.getCharacter(id)

  if(character) {
    formData.value = {
      name: {value: character.name, error: ''},
      lastName: {value: character.lastName, error: ''},
    }
  }
}

const handleSubmit = async () => {
  try {
    Object.keys(formData.value).forEach(key => {
      formData.value[key as keyof typeof formData.value].error = ''
    })

    const result = characterSchema.safeParse({
      name: formData.value.name.value,
      lastName: formData.value.lastName.value,
    })

    if (!result.success) {
      result.error.errors.forEach(e => {
        const field = e.path[0] as keyof typeof formData.value
        if (formData.value[field]) {
          formData.value[field].error = e.message
        }
      })
      return;
    }
    const formDataPayload = Object.fromEntries(
      Object.entries(formData.value).map(([key, {value}]) => [key, value])
    ) as unknown as Omit<Character, 'id'>

    if (isEdit.value) {
      const formatDataPayloadWithId = {...formDataPayload, id: Number(route.params.id)}
      characterStore.editCharacter(formatDataPayloadWithId)
    } else {
      characterStore.addCharacter(formDataPayload)
    }

    router.push('/characters')
  } catch (err: unknown) {
    console.error('Error al guardar personaje', err)
  }

}
</script>
<style lang="css"></style>
