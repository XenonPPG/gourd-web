<script setup lang="ts">
import {useDialog} from "@/stores/dialog.ts";

const dialog = useDialog();
dialog.buttons = [{
  title: "Закрыть",
  action: dialog.Close,
  variant: "secondary-dark"
}];
</script>

<template>
  <div class="h-100 w-200 p-5 overflow-scroll">
    <p>{{ dialog.value }}</p>
  </div>
</template>