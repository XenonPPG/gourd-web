<script lang="ts" setup>
import Select from "@/components/ui/Select.vue";
import {useClient} from "@/stores/client.ts";

const clientStore = useClient();
</script>

<template>
  <div class="flex flex-col">
    <textarea
        v-model="clientStore.raw?.text"
        :class="{'brightness-70': !!clientStore.file}"
        :disabled="!!clientStore.file"
        :placeholder="clientStore.file ? 'Пока можно выбрать только либо файл, либо текст' : 'Введите текст или закиньте файл'"
        class="resize-none size-full outline-none p-1"/>
    <div class="flex flex-col">
      <template v-if="!clientStore.file && clientStore.raw">
        <label class="ml-2 mb-1 text-sm text-muted">Формат текста</label>
        <Select :items="['Текст', 'Markdown']"/>
      </template>
    </div>
  </div>
</template>