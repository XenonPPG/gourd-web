<script lang="ts" setup>
import {ref} from "vue";

const props = defineProps<{
  tooltip: string;
}>();

const open = ref(false);
</script>

<template>
  <div
      class="flex-center gap-2 relative"
      @mouseenter="open = true"
      @mouseleave="open = false">
    <slot/>
    <p v-if="open" class="absolute rounded-full bg-secondary text-white text-xs p-2 whitespace-nowrap left-full">
      {{ tooltip }}
    </p>
  </div>
</template>