<script setup lang="ts">
import {useDialog} from "@/stores/dialog.ts";

const dialog = useDialog();
dialog.buttons = [
  {
    icon: "lucide:copy",
    action: function (): void {
      navigator.clipboard.writeText(dialog.value);
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
    <p class="whitespace-pre-line">{{ dialog.value }}</p>
  </div>
</template>