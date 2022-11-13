import { encryptString, masterKeyToString, generateRandomKey } from "./crypto";

export interface EncryptedMarkdown {
	ciphertext: string;
	key: string;
	iv: string;
	/** @deprecated Please use GCM with IV instead. */
	hmac?: string;
}

export async function encryptMarkdown(
	plaintext: string
): Promise<EncryptedMarkdown> {
	const key = await generateRandomKey();
	const { ciphertext, iv } = await encryptString(plaintext, key);
	return { ciphertext, iv, key: masterKeyToString(key).slice(0, 43) };
}
