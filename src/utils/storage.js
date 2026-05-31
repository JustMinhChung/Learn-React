// LocalStorage wrapper utility
export const AppStore = {
    get: (key, defaultValue) => {
        const data = localStorage.getItem(`hr_portal_${key}`);
        return data ? JSON.parse(data) : defaultValue;
    },

    set: (key, value) => {
        localStorage.setItem(`hr_portal_${key}`, JSON.stringify(value));
    },

    remove: (key) => {
        localStorage.removeItem(`hr_portal_${key}`);
    },

    clear: () => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('hr_portal_')) {
                localStorage.removeItem(key);
            }
        });
    }
};
