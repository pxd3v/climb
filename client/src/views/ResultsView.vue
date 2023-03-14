<script setup lang="ts">
import { NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { computed } from 'vue';
import ResultsTable from '@/components/Results/ResultsTable/ResultsTable.vue'

</script>

<template>
  <main>
    <ResultsTable />
  </main>
</template>