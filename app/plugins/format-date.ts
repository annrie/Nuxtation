import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            formatDate: (dateStr) => (dateStr ? Intl.DateTimeFormat('ja-JP', { dateStyle: 'full' }).format(new Date(dateStr)) : undefined)
        }
    };
});
