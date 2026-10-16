import {defineStore} from "pinia";
import {ref} from "vue";
import type {Rule} from "@/stores/client.ts";

export const useRulesStore = defineStore('rules', () => {
    const active = ref<Rule | null>(null);

    return {active};
});