<template>
  <form @submit.prevent="handleRegister">
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
    <InputElement
      v-model="formData.confirmPassword.value"
      type="password"
      placeHolder="Confirm Password"
      :error="formData.confirmPassword.error"
      required
    />
    <button type="submit">Register</button>
  </form>
</template>

<script lang="ts" setup>
import InputElement from '@/components/InputElement.vue'
import { register } from '@/services/authenticateUser'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'

const registerSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email adres' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm Password must be at least 6 characters long' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
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
  confirmPassword: {
    value: '',
    error: '',
  },
})

const router = useRouter()

const handleRegister = async () => {
  try {
    Object.keys(formData.value).forEach((key) => {
      formData.value[key as keyof typeof formData.value].error = ''
    })

    const result = registerSchema.safeParse({
      email: formData.value.email.value,
      password: formData.value.password.value,
      confirmPassword: formData.value.confirmPassword.value,
    })

    if (!result.success) {
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof typeof formData.value

        if (formData.value[field]) {
          formData.value[field].error = e.message
        }
      })
    }

    await register(formData.value["email"].value, formData.value["password"].value)

    router.push('/login')
  } catch (err) {
    console.error('Error during registration', err)
  }
}
</script>
<style></style>
