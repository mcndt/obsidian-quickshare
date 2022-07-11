import { AES, PBKDF2, HmacSHA256, enc } from "crypto-js";

interface EncryptedData {
	ciphertext: string;
	hmac: string;
}

/**
 * Generates a 256-bit key from a
 * Note: I don't add a salt because the key will be derived from a different
 *       passphrase for every shared note anyways..
 * @param seed passphrase-like data to generate the key from.
 */
export function generateKey(seed: string): string {
	const salt = "";
	const key256 = PBKDF2(seed, salt, { keySize: 256 / 32 });
	return key256.toString(enc.Base64url);
}

export function encryptString(md: string, key: string): EncryptedData {
	// Generate message authentication code
	const msg = enc.Utf8.parse(md);
	const ciphertext = AES.encrypt(msg, key).toString();
	const hmac = HmacSHA256(ciphertext, key).toString();
	return { ciphertext, hmac };
}

export function decryptString(
	{ ciphertext, hmac }: EncryptedData,
	key: string
): string {
	const hmac_calculated = HmacSHA256(ciphertext, key).toString();
	const is_authentic = hmac_calculated == hmac;

	if (!is_authentic) {
		throw Error("Cannot decrypt ciphertext with this key.");
	}
	const md = AES.decrypt(ciphertext, key).toString(enc.Utf8);
	return md;
}
