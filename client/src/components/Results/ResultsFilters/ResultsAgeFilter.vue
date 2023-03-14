<template>
  <NText tag="label" class="w-full">
    Idade
  <NSlider :value="props.modelValue" :on-update:value="onInput" range :step="1" />
  </NText>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { NSlider, NText } from 'naive-ui';
type ResultsGenderFilterProps = {
  modelValue: [number, number]
}
type ResultsGenderFilterEmits = {
  (e: 'update:modelValue', value: [number, number]): void
}
const props = defineProps<ResultsGenderFilterProps>()
const emit = defineEmits<ResultsGenderFilterEmits>()
  
const onInput = (newValue: number | [number, number]) => {
  if(typeof newValue === 'number') return
  emit('update:modelValue', newValue)
}
</script>