<script setup lang="ts">
import Artifact from "@/components/ui/Artifact.vue";
import {FileType} from "@/stores/client.ts";
import {computed} from "vue";

const props = defineProps<{
  text: string,
  type: FileType.Text | FileType.Markdown
}>();

const styles = {
  [FileType.Markdown]: {
    bg: "md-bg",
    border: "md-border"
  },
  [FileType.Text]: {
    bg: "dark",
    border: "border-color"
  }
};

const style = computed(() => {
  let s = styles[props.type];
  if (!s) {
    s = styles[FileType.Markdown];
  }
  return {
    bg: `var(--${s.bg})`,
    border: `var(--${s.border})`
  };
});

const title = computed(() => {
  if (props.text.length <= 8) {
    return props.text;
  }
  return props.text.slice(0, 6) + "...";
});

const emits = defineEmits(["delete"]);
</script>

<template>
  <Artifact
      :title="title"
      :label="type === FileType.Markdown ? 'Markdown' : 'Текст'"
      icon="lucide:text-align-start"
      :bg="style.bg"
      :border="style.border"
      @delete="emits('delete')"/>
</template>