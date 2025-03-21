<template>
  <form @submit.prevent="handleLogin">
    <InputElement
      v-model="formData.email.value"
      type="email"
      placeHolder="Email"
      :error="formData.email.error"
      required
    />
    <InputElement
      v-model="formData.password.value"
      type="password"
      placeHolder="Password"
      :error="formData.password.error"
      required
    />

    <button type="submit">Login</button>
  </form>
</template>

<script lang="ts" setup>
import InputElement from '@/components/InputElement.vue'
import { login } from '@/services/authenticateUser'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'


const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email adres' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
})

const formData = ref({
  email: {
    value: '',
    error: '',
  },
  password: {
    value: '',
    error: '',
  },
})

const router = useRouter()

const handleLogin = async () => {
  try {
    Object.keys(formData.value).forEach((key) => {
      formData.value[key as keyof typeof formData.value].error = ''
    })

    const result = loginSchema.safeParse({
      email: formData.value.email.value,
      password: formData.value.password.value,
    })

    if (!result.success) {
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof typeof formData.value

        if (formData.value[field]) {
          formData.value[field].error = e.message
        }
      })
    }

    await login(formData.value["email"].value, formData.value["password"].value)

    router.push('/characters')
  } catch (err) {
    console.error('Error logging in', err)
  }
}
</script>
<style></style>
