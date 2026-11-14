<script lang="ts" setup>
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
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-50 ease-in"
        leave-to-class="opacity-0">
      <div
          v-if="dialog.open"
          class="fixed inset-0 w-screen h-screen flex-center backdrop-blur-xs bg-black/50"
          @pointerdown.self="dialog.Close">
        <Card class="flex flex-col items-end gap-2">
          <div class="w-full flex items-center justify-between">
            <h1 class="font-bold text-3xl ml-2">{{ dialog.label }}</h1>

            <!-- close button -->
            <Button class="aspect-square rounded-full size-min" variant="ghost" @click="dialog.Close">
              <SafeIcon class="size-5" icon="lucide:x"/>
            </Button>
          </div>

          <component :is="dialog.component"/>

          <div class="flex-center gap-2">
            <Button
                v-for="b in dialog.buttons"
                :disabled="typeof b.disabled === 'function' ? b.disabled() : Boolean(b.disabled)"
                :variant="b.variant"
                @click="b.action">
              {{ b.title }}
            </Button>
          </div>
        </Card>
      </div>
    </Transition>
  </Teleport>
</template>