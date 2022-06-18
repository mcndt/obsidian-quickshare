import { MarkdownView, moment } from "obsidian";
import { generateKey, encryptString } from "./crypto";

interface encryptedMarkdown {
	ciphertext: string;
	hmac: string;
	key: string;
}

export function encryptMarkdown(mdView: MarkdownView): encryptedMarkdown {
	const plaintext = mdView.getViewData();
	const key = generateKey(moment.now() + plaintext);
	const { ciphertext, hmac } = encryptString(plaintext, key);
	return { ciphertext, hmac, key };
}
