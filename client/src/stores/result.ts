import { ref, computed, watch, inject, onMounted } from 'vue'
import { defineStore } from 'pinia'

export type ResultFilters = {
  age: [number, number]
  category: 'pro' | 'amateur' | 'all';
  gender: 'Male' | 'Female' | 'all';
};

export type ResultResponse = {
  "candidate": {
    "user": {
      "name": string,
      "birthDate": string,
      "gender": string,
      "state": string,
      "city": string
    },
    "category": string
  },
  "score": number
}[]

export const useResultStore = defineStore('result', () => {
  const axios: any = inject('axios')
  const result = ref<ResultResponse>([])
  const baseApi = 'http://localhost:3000/event'


  async function fetchResult (eventId: string, filters: ResultFilters) {
    const response = await axios.get(`${baseApi}/${eventId}/result`, {
      params: { category: filters.category, gender: filters.gender, minAge: filters.age[0], maxAge: filters.age[1] }
    }).catch((err: Error) => {
      console.error(err)
    })
    if(!response.data) return
    result.value = response.data
  }
  return { fetchResult, result }
})
