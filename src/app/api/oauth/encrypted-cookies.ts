import { encrypt, decrypt } from './encryption';

export async function setAuthToken(name: string, token: string) {
    const encryptedToken = await encrypt(token);
    document.cookie = `${name}_token=${encryptedToken}; path=/; HttpOnly; Secure; SameSite=Strict`;
}

export async function getAuthToken(name: string): Promise<string | null> {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith(`${name}_token=`)
    );
    if (!tokenCookie) return null;
    const encryptedToken = tokenCookie.split('=')[1];
    return await decrypt(encryptedToken);
}
