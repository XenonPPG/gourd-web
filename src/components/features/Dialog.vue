<script setup lang="ts">
import {useDialog} from "@/stores/dialog.ts";
import Card from "@/components/ui/Card.vue";
import Button from "@/components/ui/Button.vue";
import SafeIcon from "@/components/ui/SafeIcon.vue";

const dialog = useDialog();
</script>

<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition-opacity duration-100 ease-out"
        leave-active-class="transition-opacity duration-50 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0">
      <div
          v-if="dialog.open"
          class="fixed inset-0 w-screen h-screen flex-center backdrop-blur-xs bg-black/50"
          @pointerdown.self="dialog.Close">
        <Card class="flex flex-col items-end gap-2">
          <div class="w-full flex items-center justify-between">
            <h1 class="font-bold text-3xl ml-2">{{ dialog.label }}</h1>

            <!-- close button -->
            <Button @click="dialog.Close" variant="ghost" class="aspect-square rounded-full size-min">
              <SafeIcon icon="lucide:x" class="size-5"/>
            </Button>
          </div>

          <component :is="dialog.component"/>

          <div class="flex-center gap-2">
            <Button @click="dialog.Close" variant="secondary" class="bg-dark">Отмена</Button>
            <Button @click="dialog.Submit" :disabled="dialog.condition === undefined || !dialog.condition()">
              Подтвердить
            </Button>
          </div>
        </Card>
      </div>
    </Transition>
  </Teleport>
</template>