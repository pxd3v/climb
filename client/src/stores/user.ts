import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router';

export type User = { email: string , password: string }
export type Credentials = { email: string , password: string }

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const user = ref<User | null>(null)

  function signIn (credentials: Credentials) {
    user.value = { ...credentials }
  }

  function signOut () {
    user.value = null
  }

  const isAuthenticated = computed(() => user.value !== null)

  watch(user, (newUser, oldValue) => {
    if(!!newUser && !!oldValue) { return }
    router.push({ name: newUser ? 'Dashboard' : 'Login' })
  })

  return { user, signIn, signOut, isAuthenticated }
})
