import { moment } from "obsidian";
import { generateKey, encryptString, masterKeyToString } from "./crypto";

export interface EncryptedMarkdown {
	ciphertext: string;
	hmac: string;
	key: string;
}

export async function encryptMarkdown(
	plaintext: string
): Promise<EncryptedMarkdown> {
	const key = await generateKey(moment.now() + plaintext);
	const { ciphertext, hmac } = await encryptString(plaintext, key);
	return { ciphertext, hmac, key: masterKeyToString(key).slice(0, 43) };
}
