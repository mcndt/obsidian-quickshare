import { moment } from "obsidian";
import { generateKey, encryptString } from "./crypto";

export interface EncryptedMarkdown {
	ciphertext: string;
	hmac: string;
	key: string;
}

export function encryptMarkdown(plaintext: string): EncryptedMarkdown {
	const key = generateKey(moment.now() + plaintext);
	const { ciphertext, hmac } = encryptString(plaintext, key);
	return { ciphertext, hmac, key };
}
