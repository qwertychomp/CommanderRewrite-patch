const storage = {
    set: (key: string, value: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },
    get: (key: string) => {
        if (typeof window !== "undefined") {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        }
    },
    remove: (key: string) => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(key);
        }
    }
};

export default storage;