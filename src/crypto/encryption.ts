import {
	encryptString as _encryptString,
	masterKeyToString,
	generateRandomKey,
} from "./crypto";

export interface EncryptedString {
	ciphertext: string;
	key: string;
	iv: string;
	/** @deprecated Please use GCM with IV instead. */
	hmac?: string;
}

export async function encryptString(
	plaintext: string
): Promise<EncryptedString> {
	const key = await generateRandomKey();
	const { ciphertext, iv } = await _encryptString(plaintext, key);
	return { ciphertext, iv, key: masterKeyToString(key).slice(0, 43) };
}
