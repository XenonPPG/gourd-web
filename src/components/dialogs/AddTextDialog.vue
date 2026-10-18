<script setup lang="ts">
import {computed, ref, watch} from "vue";
import Textarea from "@/components/ui/Textarea.vue";
import Select from "@/components/ui/Select.vue";
import {useDialog} from "@/stores/dialog.ts";
import {FileType} from "@/stores/client.ts";

const typeItems = [
  {type: FileType.Text, name: "Текст"},
  {type: FileType.Markdown, name: "Markdown"},
];
const typeNames = typeItems.map((item) => item.name);

const text = ref<string>("");
const type = ref<FileType>(FileType.Text);
watch(() => [text.value, type.value], () => {
  dialog.value = {
    text: text.value,
    type: type.value,
  };
});

const typeName = computed({
  get: () => typeItems.find((item) => item.type === type.value)?.name,
  set: (name) => {
    const item = typeItems.find((item) => item.name === name);
    if (item) {
      type.value = item.type;
    }
  },
});

const dialog = useDialog();
dialog.condition = () => text.value.length > 0;
</script>

<template>
  <div class="flex flex-col gap-1">
    <Textarea v-model="text" class="h-100 w-200" placeholder="Введите текст"/>
    <Select v-model="typeName" :items="typeNames"/>
  </div>
</template>