<script setup lang="ts">
import SafeIcon from "@/components/ui/SafeIcon.vue";
import {onMounted, ref} from "vue";
import {useClient} from "@/stores/client.ts";
import Card from "@/components/ui/Card.vue";
import Button from "@/components/ui/Button.vue";
import {useRouter} from "vue-router";

const clientStore = useClient();
const data = ref<File | null>(null);

onMounted(async () => {
  if (!clientStore.canProcess) {
    await useRouter().push("/");
  }

  const result = await clientStore.Process();
  if (result) {
    data.value = result;
  }
});
</script>

<template>
  <div class="size-full flex-center flex-col gap-20">
    <div class="flex-center flex-col gap-2">
      <h1 class="text-4xl font-bold">Результаты</h1>
      <p class="text-sm text-muted">Мы добавим более красивую страницу позже</p>
    </div>

    <SafeIcon v-if="!data" icon="lucide:loader-circle" class="size-20 animate-spin"/>
    <div v-else class="flex flex-col gap-2">
      <Card class="flex flex-col gap-3 p-4">
        <h1 class="font-bold text-2xl">Артефакт 1</h1>
        <div class="bg-dark p-2 rounded-2xl">
          <p>{{ data }}</p>
        </div>
      </Card>

      <Button variant="secondary" class="aspect-square rounded-full size-min">
        <SafeIcon icon="lucide:copy" class="size-6"/>
      </Button>
    </div>
  </div>
</template>