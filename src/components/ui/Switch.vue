<script lang="ts" setup>
const model = defineModel<boolean>();
</script>

<template>
  <button
      :class="model ? 'bg-muted' : 'bg-muted/30'"
      class="flex size-min rounded-full p-0.5 w-12 transition-colors duration-200"
      @click.stop="model = !model">
  <span
      :class="model ? 'translate-x-5' : 'translate-x-0'"
      class="bg-secondary aspect-square p-3 rounded-full transition-transform duration-200 ease-in-out active:scale-130"/>
  </button>
</template>