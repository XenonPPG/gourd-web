<script lang="ts" setup>
import SafeIcon from "@/components/ui/SafeIcon.vue";
import {onMounted, ref, watch} from "vue";
import {type ArtifactType, FileType, useClient} from "@/stores/client.ts";
import {useRouter} from "vue-router";
import Artifact from "@/components/ui/Artifact.vue";
import Button from "@/components/ui/Button.vue";
import ResultsArtifact from "@/components/features/results/ResultsArtifact.vue";

const router = useRouter();
const clientStore = useClient();
const artifacts = ref<ArtifactType[]>([]);

onMounted(async () => {
  if (!clientStore.canProcess) {
    await router.push("/");
    return;
  }

  artifacts.value = clientStore.artifacts.map((a) => ({...a, loading: true}));

  await clientStore.Process();
});

watch(
    () => clientStore.results?.length ?? 0,
    (length, oldLength) => {
      const results = clientStore.results;
      if (!results) {
        return;
      }

      for (let i = oldLength; i < length; i++) {
        const r = results[i];
        const id = artifacts.value[i]?.id ?? crypto.randomUUID();

        artifacts.value[i] = {
          id,
          file: r!.file,
          data: null,
          loading: true,
          type: r!.type,
          isRaw: false,
        };

        r!.file.arrayBuffer().then((data) => {
          const art = artifacts.value.find((a) => a.id === id);
          if (art) {
            art.data = data;
            art.loading = false;
          }
        });
      }
    },
);
</script>

<template>
  <div class="size-full flex-center flex-col gap-20">
    <div class="flex flex-col gap-10 w-100">
      <div class="flex-center flex-col gap-2">
        <h1 class="text-4xl font-bold">Результаты</h1>
        <p class="text-sm text-muted">Мы добавим более красивую страницу позже</p>
      </div>

      <div class="flex-center flex-col gap-2">
        <SafeIcon v-if="!clientStore.results" class="size-20 animate-spin" icon="lucide:loader-circle"/>
        <ResultsArtifact
            v-for="a in artifacts"
            v-else
            :artifact="a"
            class="w-full"/>
      </div>

      <RouterLink class="size-min mt-10" to="/">
        <Button class="flex-center text-center gap-2 text-xl size-min">
          <SafeIcon icon="lucide:arrow-left"/>
          Обратно
        </Button>
      </RouterLink>
    </div>
  </div>
</template>