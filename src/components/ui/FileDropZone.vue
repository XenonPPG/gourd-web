<script lang="ts" setup>
import {ref, useTemplateRef} from 'vue';
import {useDropZone} from '@vueuse/core';

const EXTENSIONS = ['.txt', '.md', '.docx'];

const emit = defineEmits<{
  change: [file: File | null]
}>();

defineSlots<{
  default(props: {
    file: File | null
    rejected: File | null
    isOverDropZone: boolean
    reset: () => void
  }): unknown
}>();

const zone = useTemplateRef<HTMLElement>('zone');
const file = ref<File | null>(null);
const rejected = ref<File | null>(null);

function isAllowed(f: File): boolean {
  const name = f.name.toLowerCase();
  return EXTENSIONS.some((ext) => name.endsWith(ext));
}

const {isOverDropZone} = useDropZone(zone, {
  multiple: false,
  onDrop(dropped) {
    const [first] = dropped ?? [];
    if (!first) {
      return;
    }

    if (!isAllowed(first)) {
      rejected.value = first;
      return;
    }

    rejected.value = null;
    file.value = first;
    emit('change', first);
  },
});

function reset() {
  file.value = null;
  rejected.value = null;
  emit('change', null);
}

defineExpose({reset});
</script>

<template>
  <div ref="zone">
    <slot
        :file="file"
        :isOverDropZone="isOverDropZone"
        :rejected="rejected"
        :reset="reset"
    />
  </div>
</template>