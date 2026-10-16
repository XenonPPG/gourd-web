<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import SafeIcon from "@/components/ui/SafeIcon.vue";
import Card from "@/components/ui/Card.vue";

const props = defineProps<{
  items: any[]
  disabled?: boolean
}>();

const selected = ref(0);
const open = ref(false);

const model = defineModel();

const root = ref<HTMLElement | null>(null);
const dropdown = ref<HTMLElement | null>(null);
const dropdownStyle = ref({top: "0px", left: "0px", minWidth: "0px"});

function updatePosition() {
  if (!root.value) {
    return;
  }

  const rect = root.value.getBoundingClientRect();
  dropdownStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    minWidth: `${rect.width}px`,
  };
}

function onPointerDown(e: PointerEvent) {
  const target = e.target as Node;

  if (root.value?.contains(target) || dropdown.value?.contains(target)) {
    return;
  }

  open.value = false;
}

function addListeners() {
  window.addEventListener("scroll", updatePosition, true);
  window.addEventListener("resize", updatePosition);
  document.addEventListener("pointerdown", onPointerDown);
}

function removeListeners() {
  window.removeEventListener("scroll", updatePosition, true);
  window.removeEventListener("resize", updatePosition);
  document.removeEventListener("pointerdown", onPointerDown);
}

watch(open, (isOpen) => {
  if (isOpen) {
    updatePosition();
    addListeners();
  } else {
    removeListeners();
  }
});

onBeforeUnmount(removeListeners);

onMounted(() => {
  model.value = props.items[0];
});

watch(() => selected.value, () => {
  model.value = props.items[selected.value];
});

watch(() => props.disabled, () => {
  open.value = !props.disabled && open.value;
});

function select(index: number) {
  open.value = false;

  if (selected.value !== index) {
    selected.value = index;
  }
}
</script>

<template>
  <div ref="root" class="flex flex-col w-fit">
    <Button :class="{'text-muted':disabled}"
            :disabled="disabled"
            class="flex items-center justify-between gap-5 bg-dark"
            variant="secondary"
            @click="open = !disabled && !open">
      <span class="grid text-start whitespace-nowrap">
        <span class="col-start-1 row-start-1">{{ model }}</span>
        <span v-for="item in items"
              :key="item"
              aria-hidden="true"
              class="col-start-1 row-start-1 invisible">
          {{ item }}
        </span>
      </span>
      <SafeIcon :class="{'rotate-180':open}" class="size-5 shrink-0" icon="lucide:chevron-up"/>
    </Button>

    <Teleport to="body">
      <div v-if="open" ref="dropdown" :style="dropdownStyle" class="fixed z-50">
        <Card class="p-1! border-2 bg-dark flex flex-col w-full gap-1">
          <Button
              v-for="(item, i) in items"
              :key="item"
              class="text-start flex items-center justify-between gap-5 whitespace-nowrap hover:bg-card!"
              variant="ghost"
              @click="select(i)">
            {{ item }}
            <SafeIcon v-if="selected === i" class="shrink-0" icon="lucide:check"/>
          </Button>
        </Card>
      </div>
    </Teleport>
  </div>
</template>