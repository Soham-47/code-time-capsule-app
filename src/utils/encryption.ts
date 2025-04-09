import * as CryptoJS from 'crypto-js';

/**
 * Encrypts data using AES-256 with a user-provided passphrase
 * 
 * @param data - The data to encrypt (can be any serializable object)
 * @param passphrase - The user-provided passphrase
 * @returns The encrypted string
 */
export function encryptData(data: any, passphrase: string): string {
  // Convert data to JSON string if it's not already a string
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);
  
  // Encrypt the data
  const encrypted = CryptoJS.AES.encrypt(dataString, passphrase).toString();
  
  return encrypted;
}

/**
 * Decrypts AES-256 encrypted data with a user-provided passphrase
 * 
 * @param encryptedData - The encrypted string
 * @param passphrase - The user-provided passphrase
 * @returns The decrypted data (as string or parsed JSON)
 * @throws Error if decryption fails
 */
export function decryptData(encryptedData: string, passphrase: string): any {
  try {
    // Decrypt the data
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, passphrase);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      throw new Error('Decryption failed - incorrect passphrase');
    }
    
    // Try to parse as JSON, return as string if parsing fails
    try {
      return JSON.parse(decryptedText);
    } catch (e) {
      return decryptedText;
    }
  } catch (error) {
    throw new Error('Decryption failed - incorrect passphrase');
  }
}

/**
 * Additional server-side encryption layer using environment variable secret
 * This adds an extra layer of protection for data stored in the database
 * 
 * @param data - The data to encrypt (after client-side encryption)
 * @returns The encrypted string
 */
export function serverEncrypt(data: string): string {
  const serverSecret = process.env.ENCRYPTION_SECRET;
  
  if (!serverSecret) {
    throw new Error('Server encryption secret not configured');
  }
  
  return CryptoJS.AES.encrypt(data, serverSecret).toString();
}

/**
 * Decrypts server-encrypted data
 * 
 * @param encryptedData - The encrypted string
 * @returns The decrypted data (still encrypted with client-side passphrase)
 */
export function serverDecrypt(encryptedData: string): string {
  const serverSecret = process.env.ENCRYPTION_SECRET;
  
  if (!serverSecret) {
    throw new Error('Server encryption secret not configured');
  }
  
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, serverSecret);
  const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
  
  if (!decryptedText) {
    throw new Error('Server decryption failed');
  }
  
  return decryptedText;
} 