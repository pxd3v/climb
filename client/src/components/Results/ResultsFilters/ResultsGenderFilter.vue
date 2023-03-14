<template>
  <NText tag="label" class="w-full">
    Idade
    <NSelect :value="props.modelValue" :options="options" :on-update:value="onInput" :show-checkmark="false" />
  </NText>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { NSelect, NText } from 'naive-ui';
type ResultsGenderFilterProps = {
  modelValue: string
}
type ResultsGenderFilterEmits = {
  (e: 'update:modelValue', value: string): void
}
const props = defineProps<ResultsGenderFilterProps>()
const emit = defineEmits<ResultsGenderFilterEmits>()
const onInput = (newValue: string) => {
  emit('update:modelValue', newValue)
}

const options = [
  {
    label: 'Masculino',
    value: 'Male'
  },
  {
    label: 'Feminino',
    value: 'Female'
  },
  {
    label: 'Todos',
    value: 'all'
  },
]
</script>