import moment, { type Moment } from "moment";
import { requestUrl, type EmbedCache } from "obsidian";
import { encryptMarkdown, getKey } from "./crypto/encryption";

type Response = {
	view_url: string;
	expire_time: Moment;
};

export class NoteSharingService {
	private _url: string;
	private _userId: string;
	private _pluginVersion: string;

	constructor(serverUrl: string, userId: string, pluginVersion: string) {
		this.serverUrl = serverUrl;
		this._userId = userId;
		this._pluginVersion = pluginVersion;
	}

	/**
	 * @param md Markdown file to share.
	 * @param embeds Optional array of EmbedCache to include in the share link.
	 * @returns link to shared note with attached decryption key.
	 */
	public async shareNote(
		md: string,
		embeds?: EmbedCache[]
	): Promise<Response> {
		// generate key from content
		const key = await getKey(md);

		// TODO: load and encrypt embedded files
		// const encryptedEmbeds = ...

		// santize note content
		const sanitizedMd = this.sanitizeNote(md);

		// TODO: Enrich Markdown with e.g. rendered DataView queries
		const enrichedMd = sanitizedMd;

		// encrypt note content
		const encryptedMd = await encryptMarkdown(enrichedMd, key);

		// TODO: check final payload size
		// ...

		// upload encrypted note
		const res = await this.postNote(
			encryptedMd.ciphertext,
			encryptedMd.hmac
		);

		// return link to shared note
		res.view_url += `#${encryptedMd.key}`;
		console.log(`Note shared: ${res.view_url}`);
		return res;
	}

	/**
	 * Sanitizes a note by removing the following:
	 * - YAML frontmatter
	 * @param mdText Markdown text to sanitize.
	 * @returns  sanitized markdown text.
	 */
	private sanitizeNote(mdText: string): string {
		mdText = mdText.trim();
		const match = mdText.match(
			/^(?:---\s*\n)(?:(?:.*?\n)*?)(?:---)((?:.|\n|\r)*)/
		);
		if (match) {
			mdText = match[1].trim();
		}
		return mdText;
	}

	private async postNote(
		ciphertext: string,
		hmac: string
	): Promise<Response> {
		const res = await requestUrl({
			url: `${this._url}/api/note`,
			method: "POST",
			contentType: "application/json",
			body: JSON.stringify({
				ciphertext: ciphertext,
				hmac: hmac,
				user_id: this._userId,
				plugin_version: this._pluginVersion,
				crypto_version: "v2",
			}),
		});

		if (res.status == 200 && res.json != null) {
			const returnValue = res.json;
			returnValue.expire_time = moment(returnValue.expire_time);
			return <Response>returnValue;
		}
		throw Error(
			`Error uploading encrypted note (${res.status}): ${res.text}`
		);
	}

	public set serverUrl(newUrl: string) {
		newUrl = newUrl.replace(/([^:]\/)\/+/g, "$1");
		if (newUrl[newUrl.length - 1] == "/") {
			newUrl = newUrl.substring(0, newUrl.length - 1);
		}
		this._url = newUrl;
	}
}
