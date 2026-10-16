<script lang="ts" setup>
import {useClient} from "@/stores/client.ts";
import HomeButton from "@/components/features/home/HomeButton.vue";
import Card from "@/components/ui/Card.vue";
import FileDialog from "@/components/ui/FileDialog.vue";
import File from "@/components/features/home/File.vue";

const clientStore = useClient();
</script>

<template>
  <div class="flex items-center size-full relative p-5">
    <!-- artifacts -->
    <Card class="h-full min-w-73 rounded-3xl p-5 flex flex-col gap-10">
      <h1 class="font-bold text-3xl">Файлы</h1>

      <div class="grid grid-cols-2 gap-2">
        <File
            @delete="() => clientStore.SetFile(null)"
            v-motion-pop
            v-if="clientStore.file"
            :file="clientStore.file"/>
      </div>
      <div class="size-full flex-center">
        <p class="text-muted">Перетащите сюда файлы</p>
      </div>
    </Card>

    <!-- central menu -->
    <div class="flex-center flex-col absolute-center">
      <h1 class="text-7xl py-20">gourd</h1>

      <div class="flex-center gap-5">
        <HomeButton icon="lucide:plus" label="Текст"/>

        <FileDialog v-slot="{ open }" @change="clientStore.SetFile">
          <HomeButton @click="open" icon="lucide:paperclip" label="Файл"/>
        </FileDialog>

        <HomeButton
            v-if="clientStore.file || clientStore.raw.length > 0"
            variant="primary"
            icon="lucide:arrow-right"
            label="Дальше"/>
      </div>
    </div>
  </div>
</template>