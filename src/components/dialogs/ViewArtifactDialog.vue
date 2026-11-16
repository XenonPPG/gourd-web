<script setup lang="ts">
import {useDialog} from "@/stores/dialog.ts";
import {computed, ref, toDisplayString} from "vue";
import {Declension} from "@/scripts/utils.ts";

const dialog = useDialog();
const displayString = computed(() => toDisplayString(dialog.value));
const lineBreak = ref(true);

dialog.subtitle = `${displayString.value.length} ${Declension(displayString.value.length, {
  one: "символ", few: "символа", many: "символов"
})}`;
dialog.buttons = [
  {
    icon: "lucide:corner-down-right",
    action: function (): void {
      lineBreak.value = !lineBreak.value;
    },
    variant: "ghost"
  },
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
    <p class="whitespace-pre-wrap" :class="{ 'break-all': lineBreak }">{{ displayString }}</p>
  </div>
</template>