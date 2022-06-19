import { MarkdownView, moment } from "obsidian";
import { generateKey, encryptString } from "./crypto";

export interface EncryptedMarkdown {
	ciphertext: string;
	hmac: string;
	key: string;
}

export function encryptMarkdown(mdView: MarkdownView): EncryptedMarkdown {
	const plaintext = mdView.getViewData();
	const key = generateKey(moment.now() + plaintext);
	const { ciphertext, hmac } = encryptString(plaintext, key);
	return { ciphertext, hmac, key };
}
