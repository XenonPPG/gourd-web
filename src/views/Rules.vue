<script lang="ts" setup>
import {useClient} from "@/stores/client.ts";
import {onMounted} from "vue";
import Category from "@/components/features/rules/Category.vue";
import Card from "@/components/ui/Card.vue";
import {useRulesStore} from "@/stores/rules.ts";
import Button from "@/components/ui/Button.vue";
import SafeIcon from "@/components/ui/SafeIcon.vue";

const props = defineProps<{
  showLeadButton?: boolean
}>();

const clientStore = useClient();
const rulesStore = useRulesStore();

onMounted(async () => {
  if (clientStore.categories.length === 0) {
    await clientStore.FetchCategories();
  }
});
</script>

<template>
  <div class="flex size-full gap-5 p-10">
    <div class="size-full flex flex-col gap-12">
      <div class="flex flex-col gap-2">
        <h1 class="text-5xl font-bold">Правила</h1>
        <p>Настройте правила, которые {{
            showLeadButton ? 'будут применены к документу' : 'по умолчанию будут применяться к документам'
          }}</p>
      </div>

      <div class="size-full flex flex-col gap-5">
        <Category v-for="(c, i) in clientStore.categories" :key="i" :category="c"/>
      </div>

      <!-- leading button -->
      <div v-if="props.showLeadButton" class="flex w-full items-center justify-end">
        <RouterLink to="/TODO">
          <Button class="size-min text-xl flex-center gap-2 p-5">
            Дальше
            <SafeIcon icon="lucide:arrow-right"/>
          </Button>
        </RouterLink>
      </div>
    </div>

    <!-- active rule -->
    <Card class="w-150 p-5 flex flex-col gap-5">
      <template v-if="rulesStore.active">
        <h1 class="text-3xl font-bold">{{ rulesStore.active.rule.name }}</h1>

        <div class="flex flex-col gap-1">
          <p class="font-bold">Описание</p>
          <p class="bg-dark rounded-xl p-2">{{ rulesStore.active.rule.description }}</p>
        </div>

        <div class="flex flex-col gap-1">
          <p class="font-bold">Поддерживаемый формат</p>
          <div class="flex gap-1">
            <p
                v-for="(f, i) in rulesStore.active.rule.available_formats"
                :key="i"
                class="bg-dark rounded-md p-2">
              .{{ f }}
            </p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>