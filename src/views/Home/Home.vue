<script lang="ts" setup>
import {computed, onMounted} from "vue";
import {useClient} from "@/stores/client.ts";
import HomeButton from "@/components/features/home/HomeButton.vue";
import Card from "@/components/ui/Card.vue";
import FileDialog from "@/components/ui/FileDialog.vue";
import FileDropZone from "@/components/ui/FileDropZone.vue";
import {Icon, loadIcon} from "@iconify/vue";
import {useDialog} from "@/stores/dialog.ts";
import {useRouter} from "vue-router";
import HomeArtifact from "@/components/features/home/HomeArtifact.vue";
import {OpenTextDialogue} from "@/views/Home/common.ts";

const clientStore = useClient();

const canContinue = computed(() =>
    clientStore.artifacts.length > 0 && clientStore.artifacts.every((a) => !a.loading));

const router = useRouter();

loadIcon("lucide:arrow-right");

onMounted(clientStore.FetchCounter);
</script>

<template>
  <div class="flex items-center size-full relative p-5">
    <!-- artifacts -->
    <Card class="h-full w-90 rounded-3xl p-3 py-5 flex flex-col gap-10 relative">
      <h1 class="font-bold text-3xl">Артефакты</h1>

      <FileDropZone
          v-slot="{ isOverDropZone }"
          class="size-full flex-center absolute-center"
          @change="clientStore.AddFiles">
        <div v-if="clientStore.artifacts.length == 0" class="absolute-center text-center">
          <p class="text-muted">Перетащите сюда файлы</p>
        </div>

        <!-- blur overlay -->
        <div v-if="isOverDropZone" v-motion-fade
             class="size-full flex-center backdrop-blur backdrop-brightness-75 rounded-xl">
          <Icon class="size-15" icon="lucide:upload"/>
        </div>
      </FileDropZone>

      <!-- artifacts -->
      <div class="flex flex-col gap-2 overflow-y-auto">
        <HomeArtifact
            v-for="(artifact, i) in clientStore.artifacts"
            :key="i"
            v-motion-pop
            :artifact="artifact"/>
      </div>
    </Card>

    <!-- central menu -->
    <div class="flex-center flex-col absolute-center">
      <div class="flex-center flex-col bottom-30 absolute gap-5">
        <h1 class="text-7xl">gourd</h1>
        <p class="text-sm text-muted">Обработали уже <span class="bg-card p-0.5 rounded-md">{{
            clientStore.counter
          }}</span> документов</p>
      </div>

      <div class="flex-center gap-5">
        <!-- add text -->
        <HomeButton icon="lucide:plus" label="Текст" @click="OpenTextDialogue"/>

        <!-- add file -->
        <FileDialog v-slot="{ open }" @change="clientStore.AddFiles">
          <HomeButton icon="lucide:paperclip" label="Файл" @click="open"/>
        </FileDialog>

        <!-- go to rules -->
        <RouterLink to="/rules">
          <HomeButton icon="lucide:box" label="Правила обработки"/>
        </RouterLink>

        <!-- forward -->
        <HomeButton
            v-if="canContinue"
            v-motion-pop
            icon="lucide:arrow-right"
            label="Дальше"
            variant="primary"
            @click="router.push('/results')"/>
      </div>
    </div>
  </div>
</template>