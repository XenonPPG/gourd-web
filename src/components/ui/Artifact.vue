<script lang="ts" setup>
import {Icon} from "@iconify/vue";
import {type ArtifactType, FileType} from "@/stores/client.ts";
import {computed, type HTMLAttributes} from "vue";

export interface ArtifactButton {
  icon: string;
  condition?: () => boolean;
  action: () => void;
}

const props = defineProps<{
  artifact: ArtifactType,
  buttons?: ArtifactButton[],
}>();

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
        <div :class="gradientFrom"
             class="bg-light flex-center p-3 rounded-2xl bg-linear-to-t to-zinc-600/20 to-75%">
          <Icon v-if="props.artifact.loading" class="animate-spin size-7" icon="lucide:loader-circle"/>
          <Icon v-else :icon="artifact.isRaw ? icons.raw : icons.file" class="size-7"/>
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
      <div class="flex-center h-full gap-1">
        <template v-for="b in buttons">
          <button
              v-if="!b.condition || b.condition()"
              v-motion-fade
              class="aspect-square rounded bg-zinc-600/40 p-1.5 hover:cursor-pointer"
              @click="b.action">
            <Icon :icon="b.icon" class="text-muted size-5"/>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>