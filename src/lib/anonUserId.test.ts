import { describe, expect, it } from "vitest";
import { checkId, generateId } from "./anonUserId";

const VALID_ID = "f06536e7df6857fc";
const INVALID_ID_WRONG_CRC = "f06536e7df6857fd";
const INVALID_ID_WRONG_LENGTH = "0";

describe("Generating user IDs", () => {
	it("should generate different IDs each time", () => {
		for (let i = 0; i < 100; i++) {
			const id1 = generateId();
			const id2 = generateId();
			expect(id1).not.toEqual(id2);
		}
	});

	it("should generate a userId with length 16 and valid CRC", () => {
		for (let i = 0; i < 100; i++) {
			const id = generateId();
			expect(id).toHaveLength(16);
			expect(checkId(id)).toBe(true);
		}
	});
});

describe("checking user IDs", () => {
	it("should fail userIds other than 16 chars", () => {
		expect(checkId(INVALID_ID_WRONG_LENGTH)).toBe(false);
	});

	it("should fail userIds with invalid CRC", () => {
		expect(checkId(INVALID_ID_WRONG_CRC)).toBe(false);
	});

	it("should pass userIds with valid length and CRC", () => {
		expect(checkId(VALID_ID)).toBe(true);
	});
});
