<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref, onMounted } from 'vue';
import { NButton, NInput } from 'naive-ui'
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUserStore()
const email = ref('')
const password = ref('')
function onLogin () {
  userStore.signIn({ email: email.value, password: password.value })
}
onMounted(() => {
  if(!userStore.user?.email) return
  router.push({ name: 'Dashboard'})
})
</script>

<template>
  <main>
    <label>
      Email
      <NInput v-model:value="email"/>
    </label>
    <label>
      Password
      <NInput v-model:value="password"/>
    </label>
    <NButton @click="onLogin" class="mt-2">
      Login
    </NButton>
  </main>
</template>
