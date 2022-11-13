import { describe, expect, it, vi } from "vitest";
import {
	encryptString,
	decryptString,
	generateKey,
	masterKeyToString,
	base64ToArrayBuffer,
	generateRandomKey,
} from "./crypto";

import { webcrypto } from "crypto";

vi.stubGlobal("crypto", {
	// @ts-ignore - bad typing on webcrypto
	getRandomValues: webcrypto.getRandomValues,
	subtle: webcrypto.subtle,
});

const testData = "This is the test data.";

describe("Encryption suite", () => {
	it("should convert a key to and from base64 correctly", async () => {
		const secret = await generateKey(testData);
		const secretString = masterKeyToString(secret);
		const secret2 = base64ToArrayBuffer(secretString);

		expect(secret2).toEqual(secret);
	});

	it("should generate 256-bit keys", async () => {
		const key = await generateKey(testData);
		expect(key.byteLength).toEqual(32);
		expect(masterKeyToString(key)).toHaveLength(44);

		const key2 = await generateRandomKey();
		expect(key2.byteLength).toEqual(32);
		expect(masterKeyToString(key2)).toHaveLength(44);
	});

	it("should generate deterministic 256-bit keys from seed material", async () => {
		const key1 = await generateKey(testData);
		const key2 = await generateKey(testData);
		expect(key1).toEqual(key2);
	});

	it("should generate random 256-bit keys", async () => {
		const key = await generateRandomKey();
		const key2 = await generateRandomKey();
		expect(key).not.toEqual(key2);
	});

	it("should encrypt", async () => {
		const key = await generateKey(testData);
		const encryptedData = await encryptString(testData, key);
		expect(encryptedData).toHaveProperty("ciphertext");
		expect(encryptedData).toHaveProperty("iv");
	});

	it("should decrypt encrypted data with the correct key", async () => {
		const key = await generateKey(testData);
		const encryptedData = await encryptString(testData, key);
		const data = await decryptString(encryptedData, key);
		expect(data).toEqual(testData);
	});

	it("should decrypt encrypted data with the correct deserialized key", async () => {
		const key = await generateKey(testData);
		const encryptedData = await encryptString(testData, key);
		const keyString = masterKeyToString(key);

		const key2 = base64ToArrayBuffer(keyString);
		const data = await decryptString(encryptedData, key2);
		expect(data).toEqual(testData);
	});

	it("should fail decrypting with wrong key", async () => {
		const key = await generateKey(testData);
		const ciphertext = await encryptString(testData, key);
		const tempKey = await generateKey("wrong key");
		await expect(decryptString(ciphertext, tempKey)).rejects.toThrowError(
			/Cannot decrypt ciphertext with this key./g
		);
	});
});
