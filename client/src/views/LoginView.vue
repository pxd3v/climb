<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import { NButton, NInput } from 'naive-ui'

const userStore = useUserStore()
const email = ref('')
const password = ref('')
function onLogin () {
  userStore.signIn({ email: email.value, password: password.value })
}
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
