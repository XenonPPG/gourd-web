<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";
import SafeIcon from "@/components/ui/SafeIcon.vue";

defineOptions({inheritAttrs: false});

const props = withDefaults(defineProps<{
      icon: string,
      label: string,
      variant?: 'primary' | 'secondary'
    }>(),
    {
      variant: 'secondary'
    });
</script>

<template>
  <div class="flex-center flex-col relative">
    <Button :variant="variant"
            class="rounded-full aspect-square size-20 flex-center active:scale-105   transition-transform ease-in-out"
            v-bind="$attrs">
      <SafeIcon :icon="icon" class="size-9"/>
    </Button>
    <p class="size-min text-center text-sm select-none absolute top-full mt-2">{{ props.label }}</p>
  </div>
</template>