import {defineStore} from "pinia";
import {type Component, markRaw, ref} from "vue";
import type {ButtonType} from "@/components/ui/Button.vue";

export interface DialogButton {
    title: string;
    action: () => void;
    variant: ButtonType;
    disabled?: boolean | (() => boolean);
}

export const defaultDialogButtons: DialogButton[] = [
    {
        title: "Отмена",
        action: function (): void {
            useDialog().Close();
        },
        variant: "secondary-dark",
    },
    {
        title: "Подтвердить",
        action: function (): void {
            useDialog().Submit();
        },
        variant: "primary",
        disabled: function (): boolean {
            const dialog = useDialog();
            return !!dialog.condition && !dialog.condition!();
        }
    },
];

export const useDialog = defineStore('dialog', () => {
    const component = ref<Component | null>(null);
    const open = ref(false);
    const value = ref<any>();
    const label = ref("");
    const condition = ref<(() => boolean) | undefined>();
    const buttons = ref<DialogButton[]>([]);

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
        buttons,
        label,
        condition,
        GetResult,
        Close,
        Submit
    };
});