export interface EncryptedData {
	ciphertext: string;
	hmac: string;
}

/**
 * Generates a 256-bit key from a
 * Note: I don't add a salt because the key will be derived from a different
 *       passphrase for every shared note anyways..
 * @param seed passphrase-like data to generate the key from.
 */
export async function generateKey(seed: string): Promise<ArrayBuffer> {
	const keyMaterial = await window.crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(seed),
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
	return encryptArrayBuffer(plaintext, secret);
}

export async function encryptArrayBuffer(
	buf: ArrayBuffer,
	secret: ArrayBuffer
): Promise<EncryptedData> {
	const buf_ciphertext: ArrayBuffer = await window.crypto.subtle.encrypt(
		{ name: "AES-CBC", iv: new Uint8Array(16) },
		await _getAesKey(secret),
		buf
	);
	const ciphertext = arrayBufferToBase64(buf_ciphertext);

	const buf_hmac = await window.crypto.subtle.sign(
		{ name: "HMAC", hash: "SHA-256" },
		await _getSignKey(secret),
		buf_ciphertext
	);
	const hmac = arrayBufferToBase64(buf_hmac);

	return { ciphertext, hmac };
}

export async function decryptString(
	{ ciphertext, hmac }: EncryptedData,
	secret: ArrayBuffer
): Promise<string> {
	const ciphertext_buf = base64ToArrayBuffer(ciphertext);
	const hmac_buf = base64ToArrayBuffer(hmac);

	const is_authentic = await window.crypto.subtle.verify(
		{ name: "HMAC", hash: "SHA-256" },
		await _getSignKey(secret),
		hmac_buf,
		ciphertext_buf
	);

	if (!is_authentic) {
		throw Error("Cannot decrypt ciphertext with this key.");
	}

	const md = await window.crypto.subtle.decrypt(
		{ name: "AES-CBC", iv: new Uint8Array(16) },
		await _getAesKey(secret),
		ciphertext_buf
	);
	return new TextDecoder().decode(md);
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
	// see https://stackoverflow.com/questions/38432611/converting-arraybuffer-to-string-maximum-call-stack-size-exceeded
	let binary = "";
	const bytes = new Uint8Array(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
	return Uint8Array.from(window.atob(base64), (c) => c.charCodeAt(0));
}

function _getAesKey(secret: ArrayBuffer): Promise<CryptoKey> {
	return window.crypto.subtle.importKey(
		"raw",
		secret,
		{ name: "AES-CBC", length: 256 },
		false,
		["encrypt", "decrypt"]
	);
}

function _getSignKey(secret: ArrayBuffer): Promise<CryptoKey> {
	return window.crypto.subtle.importKey(
		"raw",
		secret,
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign", "verify"]
	);
}
