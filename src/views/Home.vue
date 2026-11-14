<script lang="ts" setup>
import {computed} from "vue";
import {FileType, useClient, type ArtifactType} from "@/stores/client.ts";
import HomeButton from "@/components/features/home/HomeButton.vue";
import Card from "@/components/ui/Card.vue";
import FileDialog from "@/components/ui/FileDialog.vue";
import Artifact from "@/components/ui/Artifact.vue";
import FileDropZone from "@/components/ui/FileDropZone.vue";
import {Icon, loadIcon} from "@iconify/vue";
import {useDialog} from "@/stores/dialog.ts";
import AddTextDialog, {type AddTextDialogResult} from "@/components/dialogs/AddTextDialog.vue";
import {useRouter} from "vue-router";

const clientStore = useClient();
const dialog = useDialog();

const canContinue = computed(() =>
    clientStore.artifacts.length > 0 && clientStore.artifacts.every((a) => !a.loading));

async function OpenTextDialogue(defaultValue?: AddTextDialogResult, target?: ArtifactType) {
  let result = await dialog.GetResult<AddTextDialogResult>(
      AddTextDialog,
      "Добавить текст",
      defaultValue ? {
        text: defaultValue?.text,
        type: defaultValue?.type,
      } : undefined);

  result.text = result.text.trim();
  if (result.text.length == 0) {
    return;
  }

  if (target) {
    clientStore.RemoveArtifact(target);
  }

  await clientStore.AddRaw(result.text, result.type);
}

function handleArtifactAction(action: string, artifact: ArtifactType) {
  switch (action) {
    case "delete":
      clientStore.RemoveArtifact(artifact);
      break;
    case "edit":
      if (!artifact.data ||
          !(artifact.type == FileType.Text ||
              artifact.type == FileType.Markdown)) {
        return;
      }

      const decoder = new TextDecoder("utf-8");

      OpenTextDialogue({
        text: decoder.decode(artifact.data),
        type: artifact.type
      }, artifact);
  }
}

function getArtifactButtons(artifact: ArtifactType) {
  return [
    {
      id: "edit",
      icon: "lucide:pencil",
      condition: () => artifact.type !== FileType.Docx && !artifact.loading,
    },
    {
      id: "delete",
      icon: "lucide:x",
    },
  ];
}

const router = useRouter();

loadIcon("lucide:arrow-right");
</script>

<template>
  <div class="flex items-center size-full relative p-5">
    <!-- artifacts -->
    <Card class="h-full w-90 rounded-3xl p-3 py-5 flex flex-col gap-10 relative">
      <h1 class="font-bold text-3xl">Артефакты</h1>

      <FileDropZone
          v-slot="{ isOverDropZone }"
          @change="clientStore.AddFiles"
          class="size-full flex-center absolute-center">
        <div v-if="clientStore.artifacts.length == 0" class="absolute-center text-center">
          <p class="text-muted">Перетащите сюда файлы</p>
        </div>

        <!-- blur overlay -->
        <div v-motion-fade v-if="isOverDropZone"
             class="size-full flex-center backdrop-blur backdrop-brightness-75 rounded-xl">
          <Icon icon="lucide:upload" class="size-15"/>
        </div>
      </FileDropZone>

      <!-- artifacts -->
      <div class="flex flex-col gap-2 overflow-y-auto">
        <Artifact
            v-for="(artifact, index) in clientStore.artifacts"
            :key="index"
            @action="handleArtifactAction($event, artifact)"
            :buttons="getArtifactButtons(artifact)"
            v-motion-pop
            :artifact="artifact"/>
      </div>
    </Card>

    <!-- central menu -->
    <div class="flex-center flex-col absolute-center">
      <h1 class="text-7xl bottom-35 absolute">gourd</h1>

      <div class="flex-center gap-5">
        <!-- add text -->
        <HomeButton @click="OpenTextDialogue" icon="lucide:plus" label="Текст"/>

        <!-- add file -->
        <FileDialog v-slot="{ open }" @change="clientStore.AddFiles">
          <HomeButton @click="open" icon="lucide:paperclip" label="Файл"/>
        </FileDialog>

        <!-- go to rules -->
        <RouterLink to="/rules">
          <HomeButton icon="lucide:box" label="Правила обработки"/>
        </RouterLink>

        <!-- forward -->
        <HomeButton
            @click="router.push('/results')"
            v-motion-pop
            v-if="canContinue"
            variant="primary"
            icon="lucide:arrow-right"
            label="Дальше"/>
      </div>
    </div>
  </div>
</template>