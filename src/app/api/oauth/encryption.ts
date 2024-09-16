import CryptoJS from 'crypto-js';
const secretKey = process.env.AUTH_SECRET || '';

export const encrypt = async (data: string): Promise<string> => {
    const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
    return encrypted;
};

export const decrypt = async (data: string): Promise<string> => {
    const decrypted = CryptoJS.AES.decrypt(data, secretKey).toString(
        CryptoJS.enc.Utf8
    );
    return decrypted;
};
