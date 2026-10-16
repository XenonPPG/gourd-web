<script lang="ts" setup>
import type {Rule} from "@/stores/client.ts";
import Switch from "@/components/ui/Switch.vue";
import {useRulesStore} from "@/stores/rules";

const props = defineProps<{
  rule: Rule
}>();

const rulesStore = useRulesStore();
</script>

<template>
  <button
      class="flex gap-2 size-full hover:bg-muted/15 p-2 py-3.5"
      @mouseenter="rulesStore.active = rule"
      @click.stop="rule.enabled = !rule.enabled">
    <Switch v-model="rule.enabled"/>
    {{ rule.rule.name }}
  </button>
</template>