<script lang="ts" setup>
import {useClient} from "@/stores/client.ts";
import HomeButton from "@/components/features/home/HomeButton.vue";
import Card from "@/components/ui/Card.vue";
import FileDialog from "@/components/ui/FileDialog.vue";
import Artifact from "@/components/ui/Artifact.vue";
import FileDropZone from "@/components/ui/FileDropZone.vue";
import {Icon, loadIcon} from "@iconify/vue";
import {useDialog} from "@/stores/dialog.ts";
import AddTextDialog from "@/components/dialogs/AddTextDialog.vue";
import {useRouter} from "vue-router";

const clientStore = useClient();
const dialog = useDialog();

async function AddText() {
  let result = await dialog.GetResult(AddTextDialog, "Добавить текст");

  result.text = result.text.trim();
  if (result.text.length == 0) {
    return;
  }

  await clientStore.SetRaw(result.text, result.type);
}

const router = useRouter();

loadIcon("lucide:arrow-right");
</script>

<template>
  <div class="flex items-center size-full relative p-5">
    <!-- artifacts -->
    <Card class="h-full w-80 rounded-3xl p-5 flex flex-col gap-10 relative">
      <h1 class="font-bold text-3xl">Артефакты</h1>

      <FileDropZone
          v-slot="{ isOverDropZone }"
          @change="clientStore.SetFile"
          class="size-full flex-center absolute-center">
        <div v-if="!clientStore.file" class="absolute-center text-center">
          <p class="text-muted">Перетащите сюда файлы</p>
        </div>

        <!-- blur overlay -->
        <div v-motion-fade v-if="isOverDropZone"
             class="size-full flex-center backdrop-blur backdrop-brightness-75 rounded-xl">
          <Icon icon="lucide:upload" class="size-15"/>
        </div>
      </FileDropZone>

      <!-- artifacts -->
      <div class="flex flex-col gap-2">
        <Artifact
            @delete="() => clientStore.SetFile(null)"
            v-motion-pop
            v-if="clientStore.file"
            :artifact="clientStore.file"/>
      </div>
    </Card>

    <!-- central menu -->
    <div class="flex-center flex-col absolute-center">
      <h1 class="text-7xl bottom-35 absolute">gourd</h1>

      <div class="flex-center gap-5">
        <!-- add text -->
        <HomeButton @click="AddText" icon="lucide:plus" label="Текст"/>

        <!-- add file -->
        <FileDialog v-slot="{ open }" @change="clientStore.SetFile">
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
            v-if="clientStore.file && !clientStore.file.loading"
            variant="primary"
            icon="lucide:arrow-right"
            label="Дальше"/>
      </div>
    </div>
  </div>
</template>