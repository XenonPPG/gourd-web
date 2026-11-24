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
          loading: false,
          type: r!.type,
          isRaw: false,
        };
      }
    },
);
</script>

<template>
  <div class="flex flex-col size-full p-10 gap-10">
    <h1 class="text-5xl font-bold">Результаты</h1>

    <div class="flex flex-col gap-5 items-end w-min">
      <div class="flex-center flex-col w-110 gap-2">
        <ResultsArtifact v-for="a in artifacts" :artifact="a"/>
      </div>

      <RouterLink to="/">
        <Button class="flex-center gap-1 text-xl">
          <SafeIcon icon="lucide:arrow-left"/>
          Обратно
        </Button>
      </RouterLink>
    </div>
  </div>
</template>