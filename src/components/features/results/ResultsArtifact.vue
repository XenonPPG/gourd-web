<script setup lang="ts">
import {type ArtifactType, FileType} from "@/stores/client.ts";
import Artifact from "@/components/ui/Artifact.vue";
import {useDialog} from "@/stores/dialog.ts";
import ViewArtifactDialog from "@/components/dialogs/ViewArtifactDialog.vue";
import {computed} from "vue";

const dialog = useDialog();

const props = defineProps<{
  artifact: ArtifactType
}>();

async function Copy() {
  const text = await props.artifact.file.text();
  await navigator.clipboard.writeText(text);
}

function Download(file: File) {
  const url = URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();

  document.removeChild(a);
  URL.revokeObjectURL(url);
}

const decoder = new TextDecoder('utf-8');
const content = computed(() => decoder.decode(props.artifact.data!));

function Expand() {
  dialog.GetResult(ViewArtifactDialog, props.artifact.file.name, content);
}
</script>

<template>
  <Artifact
      :artifact="props.artifact"
      :buttons="[
              {
                icon: 'lucide:copy',
                condition: () => !props.artifact.loading && props.artifact?.type !== FileType.Docx,
                action: Copy
              },
              {
                icon: 'lucide:expand',
                condition: () => !props.artifact.loading && props.artifact?.type !== FileType.Docx,
                action: Expand
              },
              {
                icon: 'lucide:arrow-down-to-line',
                condition: () => !props.artifact.loading,
                action: () => Download(props.artifact.file)
              }
          ]"
      class="w-full"/>
</template>