<script lang="ts" setup>
import {type Rule, useClient} from "@/stores/client.ts";
import Switch from "@/components/ui/Switch.vue";
import {useRulesStore} from "@/stores/rules";
import {onMounted, watch} from "vue";

const props = defineProps<{
  rule: Rule
}>();

const client = useClient();
const rulesStore = useRulesStore();

function ToggleRule() {
  if (!props.rule.rule.id) {
    return;
  }

  if (props.rule.enabled) {
    client.enabledRuleIds.push(props.rule.rule.id);
  } else {
    client.enabledRuleIds = client.enabledRuleIds.filter(id => id !== props.rule.rule.id);
  }
}

onMounted(ToggleRule);
watch(() => props.rule.enabled, ToggleRule);
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