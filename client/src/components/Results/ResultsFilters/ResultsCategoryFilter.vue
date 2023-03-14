<template>
  <NText tag="label" class="w-full">
    Categoria
    <NSelect :value="props.modelValue" :options="options" :on-update:value="onInput" :show-checkmark="false" />
  </NText>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { NSelect, NText } from 'naive-ui';
type ResultsCategoryFilterProps = {
  modelValue: string
}
type ResultsCategoryFilterEmits = {
  (e: 'update:modelValue', value: string): void
}
const props = defineProps<ResultsCategoryFilterProps>()
const emit = defineEmits<ResultsCategoryFilterEmits>()
const onInput = (newValue: string) => {
  emit('update:modelValue', newValue)
}

const options = [
  {
    label: 'Profissional',
    value: 'pro'
  },
  {
    label: 'Amador',
    value: 'amateur'
  },
  {
    label: 'Todos',
    value: 'all'
  },
]
</script>