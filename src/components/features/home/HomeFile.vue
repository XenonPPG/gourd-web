<script lang="ts" setup>
import File from "@/components/features/home/File.vue";
import type {UserFile} from "@/stores/client.ts";
import {onBeforeUnmount, ref, watch} from "vue";

const props = defineProps<{
  file: UserFile | null
}>();

const overrideMuted = ref(true);
const hovered = ref(false);

let timer: ReturnType<typeof setTimeout> | undefined;

watch(() => props.file?.loading, (val) => {
  clearTimeout(timer);

  if (val) {
    overrideMuted.value = true;
    return;
  }

  if (overrideMuted.value) {
    timer = setTimeout(() => overrideMuted.value = false, 1000);
  }
}, {immediate: true});

onBeforeUnmount(() => clearTimeout(timer));

const emits = defineEmits(['delete']);
</script>

<template>
  <div :class="{'-top-42':hovered || overrideMuted}" class="pb-2 absolute -top-10 left-5 transition-all duration-500"
       @mouseenter="hovered = true"
       @mouseleave="hovered = false">
    <File
        v-if="file"
        v-motion-pop
        :file="file"
        :muted="!hovered && !overrideMuted"
        @delete="emits('delete')"/>
  </div>
</template>