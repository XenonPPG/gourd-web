import AddTextDialog, {type AddTextDialogResult} from "@/components/dialogs/AddTextDialog.vue";
import {type ArtifactType, useClient} from "@/stores/client.ts";
import {useDialog} from "@/stores/dialog.ts";

export async function OpenTextDialogue(defaultValue?: AddTextDialogResult, target?: ArtifactType) {
    let result = await useDialog().GetResult<AddTextDialogResult>(
        AddTextDialog,
        "Добавить текст",
        defaultValue ? {
            text: defaultValue?.text,
            type: defaultValue?.type,
        } : undefined);

    result.text = result.text.trim();
    if (result.text.length == 0) {
        return;
    }

    const clientStore = useClient();

    if (target) {
        clientStore.RemoveArtifact(target);
    }

    await clientStore.AddRaw(result.text, result.type);
}