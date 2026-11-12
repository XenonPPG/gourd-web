import {computed, ref} from 'vue';
import {defineStore} from 'pinia';
import Client, {BaseURL} from "@/api/client.ts";
import type {GatewayCategoryDTO, GatewayRuleDTO} from "@/api/gen/Api.ts";
import {DecodeBase64Json} from "@/scripts/utils.ts";

export enum FileType {
    Markdown = "md",
    Docx = "docx",
    Text = "txt",
}

export interface ArtifactType {
    file: File;
    data: ArrayBuffer | null;
    loading: boolean;
    type: FileType;
    isRaw: boolean;
}

export interface Rule {
    rule: GatewayRuleDTO;
    enabled: boolean | null;
}

export interface Category {
    category: GatewayCategoryDTO;
    rules: Rule[];
}

export interface ProcessDocumentEventMeta {
    file_type: string;
}

export interface ProcessDocumentResult {
    file: File;
    type: FileType;
}

export const useClient = defineStore('client', () => {
    const file = ref<ArtifactType | null>();

    const counter = ref<number>();

    const categories = ref<Category[]>([]);
    const enabledRuleIds = ref<string[]>([]);

    async function FetchCounter() {
        const response = await Client.counter.counterList();
        counter.value = response.data;
    }

    async function FetchCategories() {
        const response = await Client.rules.rulesList();

        const newCategories: Category[] = [];
        const newEnabledIds: string[] = [];

        for (const category of response.data) {
            const rules: Rule[] = [];

            for (const rule of category.rules!) {
                const enabled = !!rule.enabled_by_default;

                rules.push({
                    rule: {
                        ...rule,
                        available_formats: [...(rule.available_formats ?? [])].sort(),
                    },
                    enabled,
                });

                if (enabled) {
                    newEnabledIds.push(rule.id!);
                }
            }

            newCategories.push({category, rules});
        }

        categories.value = newCategories;
        enabledRuleIds.value = newEnabledIds;
    }

    async function SetFile(f: File | null, overrideType?: FileType, isRaw = false) {
        if (f === null) {
            file.value = null;
            return;
        }

        const parts = f.name.split(".");

        file.value = {
            file: f,
            data: null,
            loading: true,
            type: overrideType ?? parts[parts.length - 1] as FileType,
            isRaw: isRaw,
        };

        file.value.data = await f.arrayBuffer();
        file.value.loading = false;
    }

    async function SetRaw(content: string, type: FileType) {
        const file = new File([content], "Артефакт 1", {
            type: "text/plain"
        });

        return SetFile(file, type, true);
    }

    const canProcess = computed(() => !!file.value);

    async function Process(): Promise<ProcessDocumentResult | undefined> {
        if (!canProcess.value) {
            return;
        }

        // auto generated api is broken. lmao
        const form = new FormData();
        form.append("file", file.value!.file);
        form.append("file_type", file.value!.type);
        for (const id of enabledRuleIds.value) {
            form.append("rules", id);
        }

        const response = await fetch(`${BaseURL}/documents/file`, {
            method: "POST",
            body: form,
        });

        if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new Error(body?.error ?? response.statusText);
        }

        const typeHeader = response.headers.get("X-Process-Meta");
        if (!typeHeader) {
            throw new Error("X-Process-Meta header required");
        }
        const meta = DecodeBase64Json<ProcessDocumentEventMeta>(typeHeader);

        const blob = await response.blob();

        const f = new File([blob], file.value!.file.name, {
            type: file.value!.file.type,
            lastModified: Date.now(),
        });

        return {
            file: f,
            type: meta.file_type as FileType,
        };
    }

    return {
        file,
        counter,
        enabledRuleIds,
        FetchCounter,
        categories,
        FetchCategories,
        SetFile,
        SetRaw,
        canProcess,
        Process,
    };
});
