import moment, { type Moment } from "moment";
import { App, requestUrl, TFile, type EmbedCache } from "obsidian";
import type { EncryptedData } from "./crypto/crypto";
import {
	encryptData,
	encryptMarkdown,
	deriveRandomKey,
	type MasterSecret,
	getBase64Key,
	deriveDeterministicKey,
} from "./crypto/encryption";

type Response = {
	view_url: string;
	expire_time: Moment;
};

interface EncryptedEmbed extends EncryptedData {
	embed_id: string;
}

export class NoteSharingService {
	private _url: string;
	private _userId: string;
	private _pluginVersion: string;
	private _app: App;

	constructor(
		serverUrl: string,
		userId: string,
		pluginVersion: string,
		app: App
	) {
		this.serverUrl = serverUrl;
		this._userId = userId;
		this._pluginVersion = pluginVersion;
		this._app = app;
	}

	/**
	 * @param md Markdown file to share.
	 * @param embeds Optional array of EmbedCache to include in the share link.
	 * @returns link to shared note with attached decryption key.
	 */
	public async shareNote(md: string, file: TFile): Promise<Response> {
		// generate key from content
		const key = await deriveRandomKey(md);

		// TODO: load and encrypt embedded files
		const encryptedEmbeds = await this.loadAndEncryptEmbeds(file, key);
		console.log(encryptedEmbeds);

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
			encryptedMd.hmac,
			encryptedEmbeds
		);

		// return link to shared note
		const keyString = getBase64Key(key);
		res.view_url += `#${keyString}`;
		console.log(`Note shared: ${res.view_url}`);
		return res;
	}

	private async loadAndEncryptEmbeds(
		baseFile: TFile,
		key: MasterSecret
	): Promise<EncryptedEmbed[]> {
		// thanks to Mara#3000 for this code!
		const embeds = this._app.metadataCache.getFileCache(baseFile).embeds;
		if (embeds == null) return [];
		const encryptedEmbeds = await Promise.all(
			embeds.map((e) => this.loadAndEncryptEmbed(e, baseFile, key))
		);
		return encryptedEmbeds.filter((e) => e != null);
	}

	/**
	 * Checks if a file is embeddable (e.g. image), then encrypts it.
	 * @param embed Cache of an embed to share.
	 * @param baseFile The file that contains the embed.
	 * @param key The master secret to derive AES and HMAC keys from.
	 * @returns The encrypted embed if file extension is supported, null otherwise.
	 */
	private async loadAndEncryptEmbed(
		embed: EmbedCache,
		baseFile: TFile,
		key: MasterSecret
	): Promise<EncryptedEmbed | null> {
		const file = this._app.metadataCache.getFirstLinkpathDest(
			embed.link,
			baseFile.path
		);
		if (!isEmbeddable(file)) return null;
		const data = await this._app.vault.adapter.readBinary(file.path);
		const cryptData = await encryptData(data, key);
		return { ...cryptData, embed_id: await getEmbedId(embed.link) };
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
		hmac: string,
		embeds: EncryptedEmbed[] = []
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
				embeds: embeds,
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

function isEmbeddable(file: TFile): boolean {
	return isImage(file.extension);
}

function isImage(extension: string): boolean {
	return extension.match(/(png|jpe?g|svg|bmp|gif|)$/i)[0]?.length > 0;
}

async function getEmbedId(embedLink: string): Promise<string> {
	// generate 64 bit id
	const idBuf = new Uint32Array(
		(await deriveDeterministicKey(embedLink)).slice(0, 8)
	);

	// convert idBuf to base 32 string
	const id = idBuf.reduce((acc, cur) => {
		return acc + cur.toString(32);
	}, "");

	return id;
}
