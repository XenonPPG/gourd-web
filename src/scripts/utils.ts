export function HumanFileSize(size: number) {
    let i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return ((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['Б', 'кБ', 'МБ', 'ГБ', 'ТБ'][i];
}