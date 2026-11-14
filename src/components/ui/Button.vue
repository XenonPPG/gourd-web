<script lang="ts" setup>
export type ButtonType = 'accent' | 'primary' | 'secondary' | 'secondary-dark' | 'ghost'

const props = withDefaults(defineProps<{
      variant?: ButtonType
    }>(),
    {
      variant: 'primary'
    });

const variants = {
  'accent': 'bg-primary text-secondary hover:brightness-110',
  'primary': 'bg-secondary text-text-primary not-disabled:hover:bg-secondary-light disabled:brightness-70',
  'secondary': 'bg-card border-2 border-border-color not-disabled:hover:brightness-120 disabled:brightness-70',
  'secondary-dark': 'bg-dark border-2 border-border-color not-disabled:hover:brightness-120 disabled:brightness-70',
  'ghost': 'hover:bg-dark'
};
</script>

<template>
  <button :class="variants[props.variant]"
          class="p-2 px-4 rounded-2xl not-disabled:hover:cursor-pointer transition-colors">
    <slot/>
  </button>
</template>