export class SlugHelper {

    static slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .trim()
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/&/g, '-and-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
    }
}