<script lang="ts" setup>
import {computed, onMounted} from "vue";
import {useClient} from "@/stores/client.ts";
import HomeButton from "@/components/features/home/HomeButton.vue";
import Card from "@/components/ui/Card.vue";
import FileDialog from "@/components/ui/FileDialog.vue";
import FileDropZone from "@/components/ui/FileDropZone.vue";
import {Icon, loadIcon} from "@iconify/vue";
import {useRouter} from "vue-router";
import HomeArtifact from "@/components/features/home/HomeArtifact.vue";
import {OpenTextDialogue} from "@/views/Home/common.ts";
import {Declension} from "@/scripts/utils.ts";

const clientStore = useClient();

const canContinue = computed(() =>
    clientStore.artifacts.length > 0 && clientStore.artifacts.every((a) => !a.loading));

const router = useRouter();

const forwardToResults = computed(() => clientStore.results && clientStore.results.length > 0);

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
    <div class="absolute-center">
      <div class="relative flex-center gap-5">
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-12
                    flex-center flex-col gap-5 whitespace-nowrap">
          <h1 class="text-7xl">gourd</h1>
          <p class="text-sm text-muted min-h-5">
            <template v-if="clientStore.counter">
              Обработали уже
              <span class="bg-card p-0.5 rounded-md">{{ clientStore.counter }}</span>
              {{ Declension(clientStore.counter, {one: "документ", few: "документа", many: "документов"}) }}
            </template>
          </p>
        </div>

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
        <div v-if="canContinue" class="absolute left-full top-0 ml-5">
          <HomeButton
              v-motion-pop
              :icon="forwardToResults ? 'lucide:check' : 'lucide:arrow-right'"
              :label="forwardToResults ? `Результаты ×${clientStore.results!.length}` : 'Дальше'"
              variant="primary"
              @click="router.push('/results')"/>
        </div>
      </div>
    </div>
  </div>
</template>