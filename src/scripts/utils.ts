export function HumanFileSize(size: number) {
    let i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return ((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['Б', 'кБ', 'МБ', 'ГБ', 'ТБ'][i];
}

export function DecodeBase64Json<T = unknown>(value: string): T {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');

    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);

    return JSON.parse(json) as T;
}