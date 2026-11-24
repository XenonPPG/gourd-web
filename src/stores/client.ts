import {computed, ref} from 'vue';
import {defineStore} from 'pinia';
import Client, {BaseURL} from "@/api/client.ts";
import type {DtoCategoryDTO, DtoRuleDTO} from "@/api/gen/Api.ts";
import {DecodeBase64Json} from "@/scripts/utils.ts";

export enum FileType {
    Markdown = "md",
    Docx = "docx",
    Text = "txt",
}

export interface ArtifactType {
    id: string;
    file: File;
    data: ArrayBuffer | null;
    loading: boolean;
    type: FileType;
    isRaw: boolean;
}

export interface Rule {
    rule: DtoRuleDTO;
    enabled: boolean | null;
}

export interface Category {
    category: DtoCategoryDTO;
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
    const artifacts = ref<ArtifactType[]>([]);
    const results = ref<ProcessDocumentResult[] | undefined>(undefined);

    const counter = ref<number>();

    const categories = ref<Category[]>([]);
    const enabledRuleIds = ref<string[]>([]);

    async function FetchCounter() {
        const response = await Client.counter.counterList();
        counter.value = response.data;
    }

    async function FetchCategories() {
        const response = await Client.rules.rulesList();
        if (!response.data?.categories || response.data.categories.length === 0) {
            return;
        }

        const newCategories: Category[] = [];
        const newEnabledIds: string[] = [];

        for (const category of response.data.categories) {
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

    function ResolveType(f: File, overrideType?: FileType): FileType {
        return overrideType ?? f.name.split(".").pop()?.toLowerCase() as FileType;
    }

    async function LoadArtifactData(id: string, file: File) {
        const data = await file.arrayBuffer();

        const art = artifacts.value.find((a) => a.id === id);
        if (!art || art.file !== file) {
            return;
        }

        art.data = data;
        art.loading = false;
    }

    async function AddFile(f: File | null, overrideType?: FileType, isRaw = false) {
        if (f === null) {
            artifacts.value = [];
            return;
        }
        if (!f) {
            return;
        }

        const id = crypto.randomUUID();

        artifacts.value.push({
            id,
            file: f,
            data: null,
            loading: true,
            type: ResolveType(f, overrideType),
            isRaw,
        });

        await LoadArtifactData(id, f);
    }

    async function AddFiles(files: File[]) {
        if (files.length === 0) {
            artifacts.value = [];
            return;
        }

        await Promise.all(files.map((f) => AddFile(f)));
    }

    async function EditArtifact(id: string, f: File, overrideType?: FileType) {
        const art = artifacts.value.find((a) => a.id === id);
        if (!art) {
            return;
        }

        art.file = f;
        art.data = null;
        art.loading = true;
        art.type = overrideType ?? (art.isRaw ? art.type : ResolveType(f));

        await LoadArtifactData(id, f);
    }

    async function EditRaw(id: string, content: string, type?: FileType) {
        const art = artifacts.value.find((a) => a.id === id);
        if (!art || !art.isRaw) {
            return;
        }

        const file = new File([content], art.file.name, {
            type: "text/plain",
        });

        return EditArtifact(id, file, type);
    }

    function RemoveArtifact(artifact: ArtifactType) {
        artifacts.value = artifacts.value.filter((a) => a.id !== artifact.id);
    }

    async function AddRaw(content: string, type: FileType) {
        const number = artifacts.value.filter((a) => a.isRaw).length + 1;
        const file = new File([content], `Артефакт ${number}`, {
            type: "text/plain"
        });

        return AddFile(file, type, true);
    }

    const canProcess = computed(() => artifacts.value.length > 0);

    async function Process(): Promise<ProcessDocumentResult[] | undefined> {
        if (!canProcess.value) {
            return;
        }

        results.value = undefined;

        for (const f of artifacts.value) {
            // auto generated api is broken. lmao
            const form = new FormData();
            form.append("file", f.file);
            form.append("file_type", f.type);
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

            const file = new File([blob], f.file.name, {
                type: f.file.type,
                lastModified: Date.now(),
            });

            results.value = [
                ...(results.value ?? []),
                {
                    file: file,
                    type: meta.file_type as FileType,
                },
            ];
        }

        return results.value;
    }

    return {
        artifacts,
        results,
        counter,
        enabledRuleIds,
        AddRaw,
        AddFile,
        AddFiles,
        EditArtifact,
        EditRaw,
        RemoveArtifact,
        FetchCounter,
        categories,
        FetchCategories,
        canProcess,
        Process,
    };
});