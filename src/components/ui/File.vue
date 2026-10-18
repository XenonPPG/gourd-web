<script lang="ts" setup>
import {FileType, type UserFile} from "@/stores/client.ts";
import {HumanFileSize} from "@/scripts/utils.ts";
import {computed} from "vue";
import Artifact from "@/components/ui/Artifact.vue";

const props = defineProps<{
  file: UserFile
}>();

const name = computed(() => {
  const parts = props.file.file.name.split(".");
  parts.pop();
  return parts.join(".");
});

const styles = {
  [FileType.Markdown]: {
    bg: "md-bg",
    border: "md-border"
  },
  [FileType.Docx]: {
    bg: "docx-bg",
    border: "docx-border"
  },
  [FileType.Text]: {
    bg: "dark",
    border: "border-color "
  }
};

const style = computed(() => {
  let s = styles[props.file.type];
  if (!s) {
    s = styles[FileType.Markdown];
  }
  return {
    bg: `var(--${s.bg})`,
    border: `var(--${s.border})`
  };
});

const emits = defineEmits(["delete"]);
</script>

<template>
  <Artifact
      :bg="style.bg"
      :border="style.border"
      :label="props.file.type"
      :loading="props.file.loading"
      :subtitle="HumanFileSize(props.file.file.size)"
      :title="name"
      icon="lucide:file"
      @delete="emits('delete')"/>
</template>