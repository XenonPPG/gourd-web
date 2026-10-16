<script lang="ts" setup>
import Card from "@/components/ui/Card.vue";
import Logo from "@/assets/icons/logo_colored.svg";
import SidebarButton from "@/components/features/sidebar/SidebarButton.vue";
</script>

<template>
  <Card class="shrink-0 rounded-none! flex flex-col items-center py-5 px-1 justify-between">
    <RouterLink class="w-full flex-center" to="/">
      <Logo class="size-12"/>
    </RouterLink>

    <SidebarButton icon="lucide:box" label="Обработка" to="/rules"/>
  </Card>
</template>
