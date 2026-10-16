<script lang="ts" setup>
import {FileType, type UserFile} from "@/stores/client.ts";
import {HumanFileSize} from "@/scripts/utils.ts";
import {computed} from "vue";
import {Icon} from "@iconify/vue";

const props = defineProps<{
  file: UserFile,
  muted: boolean
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
    bg: "card",
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
  <div :style="`background-color:${style.bg};border: ${style.border} 2px solid`"
       class="w-30 h-40 flex flex-col p-2 justify-between rounded-2xl select-none">
    <div class="flex items-start justify-between">
      <div class="flex flex-col gap-1.5">
        <p :class="{'text-transparent bg-black/50! rounded-2xl':props.muted}" class="text-sm transition-colors">
          {{ name }}
        </p>
        <Icon v-if="props.file.loading" class="animate-spin" icon="lucide:loader-circle"/>
        <p v-else :class="{'text-transparent bg-black/50! rounded-2xl':props.muted}" class="text-xs transition-colors">
          {{ HumanFileSize(file.file.size) }}
        </p>
      </div>

      <button
          :class="{'opacity-0': props.muted}"
          :disabled="props.muted"
          :style="`background-color:${style.border}`"
          class="aspect-square rounded-full p-0.5 not-disabled:hover:cursor-pointer transition-opacity"
          @click="emits('delete')">
        <Icon icon="lucide:x"/>
      </button>
    </div>

    <p :class="{'text-transparent bg-black/50! rounded-2xl':props.muted}" :style="`background-color:${style.border}`"
       class="text-sm size-min px-2 rounded-full transition-colors">{{ props.file.type }}</p>
  </div>
</template>