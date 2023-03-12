import { ref, computed, watch, inject } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router';
import VueJwtDecode from 'vue-jwt-decode';

export type User = { email: string , password: string }
export type Credentials = { email: string , password: string }

export const useUserStore = defineStore('user', () => {
  const axios: any = inject('axios')
  const router = useRouter()
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const baseApi = 'http://localhost:3000/auth'

  const decode = (token: string) => {
    try{
      return VueJwtDecode.decode(token)
    }
    catch(err){
        console.log('erro decoding token: ',err);
    }
}

  async function signIn (credentials: Credentials) {
    const response = await axios.post(`${baseApi}/login`, { 
      ...credentials
    }).catch((err: Error) => {
      console.error(err)
    })
    const accessToken = response?.data?.access_token
    if(!accessToken) return
    token.value = accessToken
    
    const user = decode(accessToken)
    user.value = { ...user }
  }

  function signOut () {
    token.value = null
    user.value = null
  }

  const isAuthenticated = computed(() => user.value !== null)

  watch(user, (newUser, oldValue) => {
    if(!!newUser && !!oldValue) { return }
    router.push({ name: newUser ? 'Dashboard' : 'Login' })
  })

  watch(token, async (newToken) => {
    if(!newToken) return
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    const response = await axios.get(`${baseApi}/profile`).catch((err: Error) => {
      console.error(err)
    })
    if(!response.data.id) return
    user.value = { ...response.data }
  })

  return { user, signIn, signOut, isAuthenticated }
})
