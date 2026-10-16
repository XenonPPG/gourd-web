<script lang="ts" setup>
import type {Category} from "@/stores/client.ts";
import Card from "@/components/ui/Card.vue";
import Rule from "@/components/features/rules/Rule.vue";

const props = defineProps<{
  category: Category
}>();
</script>

<template>
  <div>
    {{ category.category.name }}
    <Card class="flex flex-col items-start p-0! overflow-hidden">
      <Rule
          v-for="(r, i) in category.rules"
          :key="i"
          :class="{'border-b border-muted/30':i<category.rules.length-1}"
          :rule="r"
          class="py-3"/>
    </Card>
  </div>
</template>