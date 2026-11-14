<script lang="ts" setup>
import {ref, useTemplateRef} from 'vue';
import {useDropZone} from '@vueuse/core';

const EXTENSIONS = ['.txt', '.md', '.docx'];

const emit = defineEmits<{
  change: [files: File[]]
}>();

defineSlots<{
  default(props: {
    files: File[]
    rejected: File[]
    isOverDropZone: boolean
    reset: () => void
  }): unknown
}>();

const zone = useTemplateRef<HTMLElement>('zone');
const files = ref<File[]>([]);
const rejected = ref<File[]>([]);

function isAllowed(f: File): boolean {
  const name = f.name.toLowerCase();
  return EXTENSIONS.some((ext) => name.endsWith(ext));
}

const {isOverDropZone} = useDropZone(zone, {
  multiple: true,
  onDrop(dropped) {
    if (!dropped || dropped.length === 0) {
      return;
    }

    const accepted = dropped.filter(isAllowed);
    rejected.value = dropped.filter((f) => !isAllowed(f));

    if (accepted.length === 0) {
      return;
    }

    files.value = accepted;
    emit('change', accepted);
  },
});

function reset() {
  files.value = [];
  rejected.value = [];
  emit('change', []);
}

defineExpose({reset});
</script>

<template>
  <div ref="zone">
    <slot
        :files="files"
        :isOverDropZone="isOverDropZone"
        :rejected="rejected"
        :reset="reset"
    />
  </div>
</template>