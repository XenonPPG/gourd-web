<script setup lang="ts">
import Artifact, {type ArtifactButton} from "@/components/ui/Artifact.vue";
import {type ArtifactType, FileType, useClient} from "@/stores/client.ts";
import {OpenTextDialogue} from "@/views/Home/common.ts";

const props = defineProps<{
  artifact: ArtifactType,
}>();

const clientStore = useClient();

function Delete() {
  clientStore.RemoveArtifact(props.artifact);
}

function Edit() {
  if (!props.artifact.data ||
      !(props.artifact.type == FileType.Text ||
          props.artifact.type == FileType.Markdown)) {
    return;
  }

  const decoder = new TextDecoder('utf-8');

  OpenTextDialogue({
    text: decoder.decode(props.artifact.data),
    type: props.artifact.type
  }, props.artifact);
}

const buttons: ArtifactButton[] = [
  {
    icon: 'lucide:pencil',
    condition: () => props.artifact.type !== FileType.Docx && !props.artifact.loading,
    action: Edit
  },
  {
    icon: 'lucide:x',
    action: Delete
  },
];
</script>

<template>
  <Artifact
      v-motion-pop
      :artifact="props.artifact"
      :buttons="buttons"/>
</template>