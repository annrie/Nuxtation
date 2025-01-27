import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            formatDate: (dateStr) => {
                if (!dateStr) {
                    console.error(`Invalid date: ${dateStr}`);
                    return undefined;
                }

                const date = new Date(dateStr);
                if (isNaN(date.getTime())) {
                    console.error(`Invalid date: ${dateStr}`);
                    return undefined;
                }

                return Intl.DateTimeFormat('ja-JP', { dateStyle: 'long' }).format(date);
            }
        }
    };
});
