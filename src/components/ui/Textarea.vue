<script lang="ts" setup>
const model = defineModel<string | number | readonly string[] | null | undefined>();
</script>

<template>
  <textarea v-model="model"
            class="p-3 size-full bg-card normal-border resize-none rounded-2xl outline-none disabled:brightness-104 disabled:cursor-not-allowed transition-colors"/>
</template>