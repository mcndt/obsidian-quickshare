import { moment } from "obsidian";
import { generateKey, encryptString, masterKeyToString } from "./crypto";

type MasterSecret = ArrayBuffer;
export interface EncryptedMarkdown {
	ciphertext: string;
	hmac: string;
	key: string;
}

export async function getKey(md: string): Promise<MasterSecret> {
	const key = await generateKey(moment.now() + md);
	return key;
}

export async function encryptMarkdown(
	plaintext: string,
	key: MasterSecret
): Promise<EncryptedMarkdown> {
	const { ciphertext, hmac } = await encryptString(plaintext, key);
	return { ciphertext, hmac, key: masterKeyToString(key).slice(0, 43) };
}
