<script setup lang="ts">
import SafeIcon from "@/components/ui/SafeIcon.vue";
import {onMounted, ref, watch} from "vue";
import {type ArtifactType, FileType, type ProcessDocumentResult, useClient} from "@/stores/client.ts";
import {useRouter} from "vue-router";
import Artifact from "@/components/ui/Artifact.vue";
import Button from "@/components/ui/Button.vue";

const clientStore = useClient();
const data = ref<ProcessDocumentResult | null>(null);

onMounted(async () => {
  if (!clientStore.canProcess) {
    await useRouter().push("/");
  }

  const result = await clientStore.Process();
  if (result) {
    data.value = result;
  }
});

const artifact = ref<ArtifactType | null>(null);

watch(data, async () => {
  if (!data.value) {
    return;
  }

  artifact.value = {
    file: data.value.file,
    data: null,
    loading: true,
    type: data.value.type,
    isRaw: false,
  };

  artifact.value.data = await data.value.file.arrayBuffer();
  artifact.value.loading = false;
});

async function handleArtifactButtonClick(artifact: ArtifactType, event: string) {
  switch (event) {
    case "download":
      download(artifact.file);
      break;
    case "copy":
      const text = await artifact.file.text();
      await navigator.clipboard.writeText(text);
      break;
    default:
      console.error("unimplemented: ", event);
      break;
  }
}

function download(file: File) {
  const url = URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();

  document.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="size-full flex-center flex-col gap-20">
    <div class="flex flex-col gap-10 w-100">
      <div class="flex-center flex-col gap-2">
        <h1 class="text-4xl font-bold">Результаты</h1>
        <p class="text-sm text-muted">Мы добавим более красивую страницу позже</p>
      </div>

      <div class="flex-center flex-col gap-2">
        <SafeIcon v-if="!data" icon="lucide:loader-circle" class="size-20 animate-spin"/>
        <Artifact
            v-if="artifact"
            :artifact="artifact"
            class="w-full"
            @action="e => handleArtifactButtonClick(artifact!, e)"
            :buttons="[
              {
                id:'copy',
                icon: 'lucide:copy',
                condition: () => artifact?.type !== FileType.Docx,
              },
              {
                id: 'expand',
                icon: 'lucide:expand',
                condition: () => artifact?.type !== FileType.Docx,
              },
              {
                id: 'download',
                icon: 'lucide:arrow-down-to-line'
              }
          ]"/>
      </div>

      <RouterLink to="/">
        <Button class="flex-center text-center gap-2 text-xl size-min mt-10">
          <SafeIcon icon="lucide:arrow-left"/>
          Обратно
        </Button>
      </RouterLink>
    </div>
  </div>
</template>