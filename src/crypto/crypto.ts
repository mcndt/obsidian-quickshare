interface EncryptedData {
	ciphertext: string;
	iv: string;
	/** @deprecated Please use GCM encryption instead. */
	hmac?: string;
}

/**
 * Generates a 256-bit key from a
 * Note: I don't add a salt because the key will be derived from a different
 *       passphrase for every shared note anyways..
 * @param seed passphrase-like data to generate the key from.
 */
export async function generateKey(seed: string): Promise<ArrayBuffer> {
	const _seed = new TextEncoder().encode(seed);
	return _generateKey(_seed);
}

/**
 * Generates a random 256-bit key using crypto.getRandomValues.
 */
export async function generateRandomKey(): Promise<ArrayBuffer> {
	const seed = window.crypto.getRandomValues(new Uint8Array(64));
	return _generateKey(seed);
}

async function _generateKey(seed: ArrayBuffer) {
	const keyMaterial = await window.crypto.subtle.importKey(
		"raw",
		seed,
		{ name: "PBKDF2" },
		false,
		["deriveBits"]
	);

	const masterKey = await window.crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: new Uint8Array(16),
			iterations: 100000,
			hash: "SHA-256",
		},
		keyMaterial,
		256
	);

	return new Uint8Array(masterKey);
}

export function masterKeyToString(masterKey: ArrayBuffer): string {
	return arrayBufferToBase64(masterKey);
}

export async function encryptString(
	md: string,
	secret: ArrayBuffer
): Promise<EncryptedData> {
	const plaintext = new TextEncoder().encode(md);

	const iv = window.crypto.getRandomValues(new Uint8Array(16));

	const buf_ciphertext: ArrayBuffer = await window.crypto.subtle.encrypt(
		{ name: "AES-GCM", iv: iv },
		await _getAesGcmKey(secret),
		plaintext
	);
	const ciphertext = arrayBufferToBase64(buf_ciphertext);

	return { ciphertext, iv: arrayBufferToBase64(iv) };
}

export async function decryptString(
	{ ciphertext, iv }: EncryptedData,
	secret: ArrayBuffer
): Promise<string> {
	const ciphertext_buf = base64ToArrayBuffer(ciphertext);
	const iv_buf = base64ToArrayBuffer(iv);

	const md = await window.crypto.subtle
		.decrypt(
			{ name: "AES-GCM", iv: iv_buf },
			await _getAesGcmKey(secret),
			ciphertext_buf
		)
		.catch((e) => {
			throw new Error(`Cannot decrypt ciphertext with this key.`);
		});
	return new TextDecoder().decode(md);
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
	return window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
	return Uint8Array.from(window.atob(base64), (c) => c.charCodeAt(0));
}

function _getAesGcmKey(secret: ArrayBuffer): Promise<CryptoKey> {
	return window.crypto.subtle.importKey(
		"raw",
		secret,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"]
	);
}
