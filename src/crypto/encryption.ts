import { encryptString, masterKeyToString, generateRandomKey } from "./crypto";

export interface EncryptedMarkdown {
	ciphertext: string;
	hmac: string;
	key: string;
}

export async function encryptMarkdown(
	plaintext: string
): Promise<EncryptedMarkdown> {
	const key = await generateRandomKey();
	const { ciphertext, hmac } = await encryptString(plaintext, key);
	return { ciphertext, hmac, key: masterKeyToString(key).slice(0, 43) };
}
