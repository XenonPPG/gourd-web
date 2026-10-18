<script lang="ts" setup>
import {Icon} from "@iconify/vue";

defineProps<{
  title: string
  subtitle?: string
  loading?: boolean
  label: string
  icon: string
  bg: string
  border: string
}>();

const emits = defineEmits(["delete"]);
</script>

<template>
  <div :style="`background-color:${bg};border: ${border} 2px solid`"
       class="w-30 h-40 flex flex-col p-2 justify-between rounded-2xl select-none relative isolate">
    <div class="flex items-start justify-between">
      <!-- info -->
      <div class="flex flex-col gap-1.5">
        <p class="text-sm wrap-anywhere">
          {{ title }}
        </p>
        <Icon v-if="loading" class="animate-spin" icon="lucide:loader-circle"/>
        <p v-else class="text-xs">
          {{ subtitle }}
        </p>
      </div>

      <!-- delete button -->
      <button
          :style="`background-color:${border}`"
          class="aspect-square rounded-full p-0.5 hover:cursor-pointer"
          @click="emits('delete')">
        <Icon icon="lucide:x"/>
      </button>
    </div>

    <!-- type -->
    <p :style="`background-color:${border}`"
       class="text-sm size-min px-2 rounded-full">{{ label }}</p>

    <!-- icon -->
    <Icon class="absolute-center size-8 -z-1" :icon="icon" :style="{ color: border }"/>
  </div>
</template>