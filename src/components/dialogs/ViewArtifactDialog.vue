<script setup lang="ts">
import {useDialog} from "@/stores/dialog.ts";
import {computed, toDisplayString} from "vue";

const dialog = useDialog();
const displayString = computed(() => toDisplayString(dialog.value));
dialog.subtitle = `${displayString.value.length} символов`;
dialog.buttons = [
  {
    icon: "lucide:copy",
    action: function (): void {
      navigator.clipboard.writeText(displayString.value);
    },
    variant: "ghost"
  },
  {
    title: "Закрыть",
    action: dialog.Close,
    variant: "secondary-dark"
  }
];
</script>

<template>
  <div class="h-100 w-200 p-5 overflow-scroll">
    <p class="whitespace-pre-line">{{ displayString }}</p>
  </div>
</template>