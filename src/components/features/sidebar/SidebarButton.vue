<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";
import {Icon} from "@iconify/vue";
import {useRoute} from "vue-router";
import {computed} from "vue";

const props = defineProps<{
  to: string
  icon: string
  label: string
}>();

const route = useRoute();
const active = computed(() => route.path === props.to);
</script>

<template>
  <RouterLink :to="props.to" class="w-full w-full">
    <Button :class="{'bg-secondary hover:bg-secondary! text-text-primary': active}" class="w-full flex-center flex-col gap-1"
            variant="ghost">
      <Icon :icon="props.icon" class="size-7"/>
      <span class="text-xs">{{ props.label }}</span>
    </Button>
  </RouterLink>
</template>