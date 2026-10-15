import * as Crypto from 'expo-crypto';

// Hash the password (salted with the email) so it is never stored as plain text.
export function hashPassword(email: string, password: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${email.trim().toLowerCase()}:${password}`
  );
}