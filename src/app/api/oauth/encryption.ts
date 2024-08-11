// import { encrypt, decrypt } from './encryption'; // Implement these functions

const secretKey = process.env.AUTH_SECRET || '';

export const encrypt = async (data: string) => {
    // const encodedData = new TextEncoder().encode(data);
    // const key = await crypto.subtle.importKey(
    //     'raw',
    //     Buffer.from(secretKey),
    //     { name: 'AES-GCM' },
    //     false,
    //     ['encrypt']
    // );
    // const iv = crypto.getRandomValues(new Uint8Array(12));
    // const encryptedData = await crypto.subtle.encrypt(
    //     { name: 'AES-GCM', iv: iv },
    //     key,
    //     encodedData
    // );
    // return { encryptedData, iv };
    return data;
};

export const decrypt = async (data: string) => {
    // const encodedData = new TextEncoder().encode(data);
    // const key = await crypto.subtle.importKey(
    //     'raw',
    //     Buffer.from(secretKey),
    //     { name: 'AES-GCM' },
    //     false,
    //     ['decrypt']
    // );
    // const decryptedData = await crypto.subtle.decrypt(
    //     { name: 'AES-GCM', iv: Buffer.from(secretKey) },
    //     key,
    //     encodedData
    // );
    // return new TextDecoder().decode(decryptedData);
    return data;
};
