<script lang="ts" setup>
import {Icon, loadIcon} from "@iconify/vue";
import {onMounted, ref} from "vue";
import Skeleton from "@/components/ui/Skeleton.vue";

const props = defineProps<{
  icon: string
}>();

const loaded = ref(false);

onMounted(async () => {
  await loadIcon(props.icon).then(() => loaded.value = true);
});
</script>

<template>
  <Skeleton v-if="!loaded"/>
  <Icon v-else :icon="props.icon"/>
</template>