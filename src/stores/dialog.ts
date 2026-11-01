import {defineStore} from "pinia";
import {type Component, markRaw, ref} from "vue";

export const useDialog = defineStore('dialog', () => {
    const component = ref<Component | null>(null);
    const open = ref(false);
    const value = ref<any>();
    const label = ref("");
    const condition = ref<(() => boolean) | undefined>();

    let defaultValue: any;
    let resolver: ((result: any) => void) | null = null;

    function GetResult<T = any>(c: Component, l: string, defaultVal?: T): Promise<T> {
        resolver?.(defaultValue);

        defaultValue = defaultVal;
        value.value = defaultVal;
        component.value = markRaw(c);
        open.value = true;
        label.value = l;

        return new Promise<T>((resolve) => {
            resolver = resolve;
        });
    }

    function finish(result: any) {
        open.value = false;
        value.value = result;
        resolver?.(result);
        resolver = null;
    }

    function Close() {
        finish(defaultValue);
    }

    function Submit() {
        finish(value.value !== undefined ? value.value : value.value);
    }

    return {
        component,
        open,
        value,
        label,
        condition,
        GetResult,
        Close,
        Submit
    };
});