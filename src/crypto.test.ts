import { describe, expect, it } from "vitest";
import { encryptString, decryptString, generateKey } from "./crypto";

const testKey = "0123456789ABCDEF";
const testData = "This is the test data.";
const derivedTestKey = "1UPCi_Wvhl8EsfW2cERtOL9KB5RbZkmmIa5wMrLLz6E";

describe("Encryption suite", () => {
	it("should generate 256-bit keys", () => {
		const key = generateKey(testData);
		expect(key).toHaveLength(43);
	});

	it("should generate deterministic 256-bit keys from seed material", () => {
		const key = generateKey(testData);
		expect(key).toEqual(derivedTestKey);
	});

	it("should encrypt", () => {
		const encryptedData = encryptString(testData, testKey);
		expect(encryptedData).toHaveProperty("ciphertext");
		expect(encryptedData).toHaveProperty("hmac");
	});

	it("should decrypt encrypted data with the correct key", () => {
		const encryptedData = encryptString(testData, testKey);
		const data = decryptString(encryptedData, testKey);
		expect(data).toEqual(testData);
	});

	it("should fail decrypting with wrong key", () => {
		const ciphertext = encryptString(testData, testKey);
		const tempKey = generateKey("wrong key");
		expect(() => {
			decryptString(ciphertext, tempKey);
		}).toThrowError(/Cannot decrypt ciphertext with this key./g);
	});
});
