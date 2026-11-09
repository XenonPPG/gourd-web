<script lang="ts" setup>
import {Icon} from "@iconify/vue";
import {type Artifact, FileType} from "@/stores/client.ts";
import {computed, type HTMLAttributes} from "vue";

const props = defineProps<{
  artifact: Artifact
}>();

const emits = defineEmits(["delete"]);

const name = computed(() => {
  const parts = props.artifact.file.name.split(".");
  if (parts.length == 1) {
    return parts[0];
  }
  parts.pop();
  return parts.join(".");
});

const icons = {
  'file': "lucide:file",
  'raw': "lucide:text-initial",
};

const styles: Partial<Record<FileType, HTMLAttributes['class']>> = {
  [FileType.Markdown]: "from-md",
  [FileType.Docx]: "from-docx",
};

const gradientFrom = computed(() => styles[props.artifact.type] ?? "from-zinc-600/20");
</script>

<template>
  <div
      class="flex flex-col p-3 justify-between rounded-2xl bg-medium select-none relative isolate border-2 border-border-color">
    <div class="flex-center justify-between">
      <div class="flex gap-2">
        <!-- icon -->
        <div class="bg-light flex-center p-3 rounded-2xl bg-linear-to-t to-zinc-600/20 to-75%"
             :class="gradientFrom">
          <Icon v-if="props.artifact.loading" class="animate-spin size-7" icon="lucide:loader-circle"/>
          <Icon v-else class="size-7" :icon="artifact.isRaw ? icons.raw : icons.file"/>
        </div>

        <!-- info -->
        <div class="flex flex-col gap-0.5">
          <p class="wrap-anywhere">
            {{ name }}
          </p>
          <p class="text-xs text-muted">
            {{ props.artifact.type }}
          </p>
        </div>
      </div>

      <!-- buttons -->
      <div class="flex flex-col h-full">
        <button
            class="aspect-square rounded-full bg-card p-0.5 hover:cursor-pointer"
            @click="emits('delete')">
          <Icon icon="lucide:x" class="text-muted"/>
        </button>
      </div>
    </div>
  </div>
</template>