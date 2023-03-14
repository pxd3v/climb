<script setup lang="ts">
import { NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { computed } from 'vue';
import { useResultStore } from '@/stores/result';
import ResultsFilters from '@/components/Results/ResultsFilters/ResultsFilters.vue'
type CandidateResult = { 
  name: string, 
  birthDate: string, 
  gender: string, 
  state: string, 
  city: string, 
  category: string, 
  score: number 
}
const resultStore = useResultStore();
const data = computed<Array<CandidateResult>>(() => resultStore.result.map(({ candidate: { user, category }, score }) => ({ ...user, category, score })))
const columns: DataTableColumns<CandidateResult> = [
  {
    title: 'Atleta',
    key: 'name'
  },
  {
    title: 'Idade',
    key: 'birthDate'
  },
  {
    title: 'Genero',
    key: 'gender'
  },
  {
    title: 'Estado',
    key: 'state'
  },
  {
    title: 'Cidade',
    key: 'city'
  },
  {
    title: 'Categoria',
    key: 'category'
  },
  {
    title: 'Pontuacao',
    key: 'score'
  },
]
</script>

<template>
  <div class="flex flex-col">
    <ResultsFilters />
    <NDataTable 
		:columns="columns"
		:data="data"
		:pagination="false"
		:bordered="false"
    />
  </div>
</template>