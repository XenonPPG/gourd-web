<script lang="ts" setup>
const props = withDefaults(defineProps<{
      variant?: 'accent' | 'primary' | 'secondary' | 'ghost'
    }>(),
    {
      variant: 'primary'
    });

const variants = {
  'accent': 'bg-primary text-secondary hover:brightness-110',
  'primary': 'bg-secondary text-text-primary not-disabled:hover:bg-secondary-light disabled:brightness-70',
  'secondary': 'bg-card border-2 border-border-color not-disabled:hover:brightness-120 disabled:brightness-70',
  'ghost': 'hover:bg-dark'
};
</script>

<template>
  <button :class="variants[props.variant]"
          class="p-2 px-4 rounded-2xl not-disabled:hover:cursor-pointer transition-colors">
    <slot/>
  </button>
</template>