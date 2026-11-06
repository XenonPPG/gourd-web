<script lang="ts" setup>
import {useClient} from "@/stores/client.ts";
import {onMounted} from "vue";
import Sidebar from "@/components/features/sidebar/Sidebar.vue";
import Dialog from "@/components/features/Dialog.vue";

const client = useClient();

onMounted(async () => {
  await client.FetchCounter();
  await client.FetchCategories();
});
</script>

<template>
  <div class="flex w-screen min-h-screen">
    <Sidebar/>

    <div class="flex-1">
      <RouterView/>
    </div>
  </div>

  <Dialog/>
</template>
