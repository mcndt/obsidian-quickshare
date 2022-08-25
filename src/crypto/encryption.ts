import { moment } from "obsidian";
import {
	generateKey,
	encryptString,
	encryptArrayBuffer,
	masterKeyToString,
} from "./crypto";

export type MasterSecret = ArrayBuffer;
export interface EncryptedData {
	ciphertext: string;
	hmac: string;
}

export async function deriveKey(md: string): Promise<MasterSecret> {
	const key = await generateKey(moment.now() + md);
	return key;
}

export async function encryptMarkdown(
	plaintext: string,
	key: MasterSecret
): Promise<EncryptedData> {
	const { ciphertext, hmac } = await encryptString(plaintext, key);
	return { ciphertext, hmac };
}

export async function encryptData(
	data: ArrayBuffer,
	key: MasterSecret
): Promise<EncryptedData> {
	const { ciphertext, hmac } = await encryptArrayBuffer(data, key);
	return { ciphertext, hmac };
}

export function getBase64Key(key: MasterSecret): string {
	return masterKeyToString(key);
}
