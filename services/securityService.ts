import * as CryptoJS from "crypto-js";

const encryptSecretKey: CryptoJS.lib.WordArray = CryptoJS.enc.Utf8.parse(
  process.env.ENCRYPT_SECRET_KEY!
);
const ivKey = process.env.IV_KEY!;

export function encryptData(data: string): string | null {
  const iv: CryptoJS.lib.WordArray = CryptoJS.enc.Utf8.parse(ivKey);
  try {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(data),
      encryptSecretKey,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  } catch (e) {
    console.error("Encryption error:", e);
    return null;
  }
}

export function decryptData(encryptedData: string): string | null {
  const iv: CryptoJS.lib.WordArray = CryptoJS.enc.Utf8.parse(ivKey);
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptSecretKey, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedData = CryptoJS.enc.Utf8.stringify(decrypted);
    return decryptedData || null;
  } catch (e) {
    console.error("Decryption error:", e);
    return null;
  }
}
