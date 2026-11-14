<script lang="ts" setup>
import {ref} from 'vue';
import {useFileDialog} from '@vueuse/core';

const EXTENSIONS = ['.txt', '.md', '.docx'];

const props = defineProps<{
  disabled?: boolean
}>();

const emit = defineEmits<{
  change: [files: File[]]
  cancel: []
}>();

defineSlots<{
  default(props: {
    files: File[]
    rejected: File[]
    disabled: boolean
    open: () => void
    reset: () => void
  }): unknown
}>();

const files = ref<File[]>([]);
const rejected = ref<File[]>([]);

const {open: openDialog, reset: resetDialog, onChange, onCancel} = useFileDialog({
  accept: EXTENSIONS.join(','),
  multiple: true,
});

function isAllowed(f: File): boolean {
  const name = f.name.toLowerCase();
  return EXTENSIONS.some((ext) => name.endsWith(ext));
}

onChange((list) => {
  if (props.disabled) {
    return;
  }

  const picked = Array.from(list ?? []);
  if (picked.length === 0) {
    return;
  }

  const accepted = picked.filter(isAllowed);
  rejected.value = picked.filter((f) => !isAllowed(f));

  if (accepted.length === 0) {
    return;
  }

  files.value = accepted;
  emit('change', accepted);
});

onCancel(() => {
  if (props.disabled) {
    return;
  }

  emit('cancel');
});

function open() {
  if (props.disabled) {
    return;
  }

  resetDialog();
  openDialog();
}

function reset() {
  if (props.disabled) {
    return;
  }

  resetDialog();
  files.value = [];
  rejected.value = [];
  emit('change', []);
}

defineExpose({open, reset});
</script>

<template>
  <slot
      :disabled="props.disabled"
      :files="files"
      :open="open"
      :rejected="rejected"
      :reset="reset"
  />
</template>