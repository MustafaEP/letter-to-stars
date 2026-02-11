const TOKEN_KEY = 'access_token';

export const tokenUtils = {
    get: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },

    set: (token: string): void => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    remove: (): void => {
        localStorage.removeItem(TOKEN_KEY);
    },

    isValid: (): boolean => {
        const token = tokenUtils.get();
        if (!token) return false;

        try {
        // JWT payload'ını decode et (exp kontrolü)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Saniyeden milisaniyeye
        return Date.now() < exp;
        } catch {
        return false;
        }
    },
};