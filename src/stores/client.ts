import {ref} from 'vue';
import {defineStore} from 'pinia';
import Client from "@/api/client.ts";
import type {GatewayCategoryDTO, GatewayRuleDTO} from "@/api/gen/Api.ts";

export enum FileType {
    Markdown = "md",
    Docx = "docx",
    Text = "txt",
}

export interface UserFile {
    file: File;
    data: ArrayBuffer | null;
    loading: boolean;
    type: FileType;
}

export interface Rule {
    rule: GatewayRuleDTO;
    enabled: boolean | null;
}

export interface Category {
    category: GatewayCategoryDTO;
    rules: Rule[];
}

export const useClient = defineStore('client', () => {
    const file = ref<UserFile | null>();
    const raw = ref<{
        text: string;
        type: FileType;
    } | null>(null);

    const counter = ref<number>();

    const categories = ref<Category[]>([]);
    const enabledRuleIds = ref<string[]>([]);

    async function FetchCounter() {
        const response = await Client.counter.counterList();
        counter.value = response.data;
    }

    async function FetchCategories() {
        categories.value = [];

        // TODO: fetch correct type instead of md always
        const response = await Client.rules.rulesList();
        for (const category of response.data) {
            const rules: Rule[] = [];
            for (const rule of category.rules!) {
                rules.push({
                    rule: rule,
                    enabled: !!rule.enabled_by_default
                });
            }

            categories.value.push({
                category: category,
                rules: rules
            });
        }
    }

    async function SetFile(f: File | null) {
        if (f === null) {
            file.value = null;
            return;
        }

        const parts = f.name.split(".");

        file.value = {
            file: f,
            data: null,
            loading: true,
            type: parts[parts.length - 1] as FileType
        };

        file.value.data = await f.arrayBuffer();
        file.value.loading = false;
    }

    async function ProcessRaw() {
        // why is it called that way? wtf??
        if (!raw.value?.text || raw.value.text.length === 0) {
            return;
        }

        return await Client.documents.postDocuments({
            rules: enabledRuleIds.value,
            text: raw.value.text,
            type: raw.value.type
        });
    }

    return {
        file,
        raw,
        counter,
        enabledRuleIds,
        FetchCounter,
        categories,
        FetchCategories,
        SetFile,
        ProcessRaw
    };
});
