<script lang="ts" setup>
import {ref} from 'vue';
import {useFileDialog} from '@vueuse/core';

const EXTENSIONS = ['.txt', '.md', '.docx'];

const props = defineProps<{
  disabled?: boolean
}>();

const emit = defineEmits<{
  change: [file: File | null]
  cancel: []
}>();

defineSlots<{
  default(props: {
    file: File | null
    rejected: File | null
    disabled: boolean
    open: () => void
    reset: () => void
  }): unknown
}>();

const file = ref<File | null>(null);
const rejected = ref<File | null>(null);

const {open: openDialog, reset: resetDialog, onChange, onCancel} = useFileDialog({
  accept: EXTENSIONS.join(','),
  multiple: false,
});

function isAllowed(f: File): boolean {
  const name = f.name.toLowerCase();
  return EXTENSIONS.some((ext) => name.endsWith(ext));
}

onChange((list) => {
  if (props.disabled) {
    return;
  }

  const picked = list?.[0];
  if (!picked) {
    return;
  }

  if (!isAllowed(picked)) {
    rejected.value = picked;
    return;
  }

  rejected.value = null;
  file.value = picked;
  emit('change', picked);
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

  openDialog();
}

function reset() {
  if (props.disabled) {
    return;
  }

  resetDialog();
  file.value = null;
  rejected.value = null;
  emit('change', null);
}

defineExpose({open, reset});
</script>

<template>
  <slot
      :disabled="props.disabled"
      :file="file"
      :open="open"
      :rejected="rejected"
      :reset="reset"
  />
</template>