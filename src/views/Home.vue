<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";
import SafeIcon from "@/components/ui/SafeIcon.vue";
import MainTextarea from "@/components/features/home/MainTextarea.vue";
import {useClient, type UserFile} from "@/stores/client.ts";
import FileDialog from "@/components/ui/FileDialog.vue";
import Card from "@/components/ui/Card.vue";
import FileDropZone from "@/components/ui/FileDropZone.vue";
import HomeFile from "@/components/features/home/HomeFile.vue";

const clientStore = useClient();
</script>

<template>
  <div class="flex-center size-full">
    <div class="flex-center flex-col relative">
      <h1 class="text-7xl py-20">gourd</h1>

      <div class="flex flex-col gap-2">
        <div class="flex gap-2 relative">
          <!-- input part -->
          <FileDropZone v-slot="{ isOverDropZone }" @change="clientStore.SetFile">
            <!-- attached files -->
            <HomeFile :file="clientStore.file as UserFile | null" @delete="clientStore.SetFile(null)"/>

            <Card class="flex gap-2 relative overflow-hidden">
              <MainTextarea class="w-150 min-h-40 max-h-80"/>

              <!-- blur overlay -->
              <div v-if="isOverDropZone" v-motion-fade class="absolute inset-0 flex-center size-full backdrop-blur-sm">
                <p class="text-2xl">Загрузить файл</p>
              </div>
            </Card>
          </FileDropZone>

          <!-- send button -->
          <Button v-if="clientStore.file || clientStore.raw.length > 0" v-motion-fade
                  class="size-min aspect-square rounded-full absolute left-full ml-2">
            <SafeIcon class="size-6 -rotate-45 translate-y-1" icon="lucide:send"/>
          </Button>
        </div>
        <div class="flex items-center gap-1">
          <FileDialog
              v-slot="{ open, disabled }"
              :disabled="clientStore.raw.length > 0"
              @change="clientStore.SetFile">
            <Button
                :disabled="disabled"
                class="aspect-square rounded-full size-min"
                variant="secondary"
                @click="open">
              <SafeIcon class="size-6" icon="lucide:paperclip"/>
            </Button>
          </FileDialog>
        </div>
      </div>
      <h1
          v-if="clientStore.raw.length > 0 || clientStore.file"
          class="text-sm text-text-primary bg-secondary px-5 rounded-full absolute -bottom-10"
      >Загрузка нескольких файлов пока недоступна</h1>
    </div>
  </div>
</template>