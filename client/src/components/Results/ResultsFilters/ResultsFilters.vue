<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useResultStore, type ResultFilters } from '@/stores/result';
import ResultsCategoryFilter from './ResultsCategoryFilter.vue'
import ResultsGenderFilter from './ResultsGenderFilter.vue'
import ResultsAgeFilter from './ResultsAgeFilter.vue'
import { debounce } from 'lodash'

const route = useRoute()
const resultStore = useResultStore();
const filters = ref<ResultFilters>({
  category: 'all',
  gender: 'all',
  age: [0, 100]
})

const fetchFilteredResult = debounce((filters: ResultFilters) => {
  const { eventId } = route.params
  if(!eventId || typeof eventId !== 'string') return
  resultStore.fetchResult(eventId, filters)
}, 300)

watch(filters, (newFilters) => {
  fetchFilteredResult(newFilters)
}, { deep: true, immediate: true })

</script>

<template>
  <div class="flex gap-3">
    <ResultsCategoryFilter v-model="filters.category"/>
    <ResultsGenderFilter v-model="filters.gender"/>
    <ResultsAgeFilter v-model="filters.age"/>
  </div>
</template>