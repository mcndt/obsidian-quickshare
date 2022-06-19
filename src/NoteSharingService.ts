import { MarkdownView, requestUrl } from "obsidian";
import { encryptMarkdown } from "./encryption";

export class NoteSharingService {
	private _url: string;

	constructor(serverUrl: string) {
		this.serverUrl = serverUrl;
	}

	/**
	 * @param mdView Markdown file to share.
	 * @returns link to shared note with attached decryption key.
	 */
	public async shareNote(mdView: MarkdownView): Promise<string> {
		const cryptData = encryptMarkdown(mdView);
		let url = await this.postNote(cryptData.ciphertext, cryptData.hmac);
		url += `#${cryptData.key}`;
		console.log(`Note shared: ${url}`);
		return url;
	}

	private async postNote(ciphertext: string, hmac: string): Promise<string> {
		const res = await requestUrl({
			url: `${this._url}/note`,
			method: "POST",
			contentType: "application/json",
			body: JSON.stringify({ ciphertext, hmac }),
		});

		if (res.status == 200 && res.json != null) {
			const id = res.json.id;
			return `${this._url}/note/${id}`;
		}
		throw Error("Did not get expected response from server on note POST.");
	}

	public set serverUrl(newUrl: string) {
		newUrl = newUrl.replace(/([^:]\/)\/+/g, "$1");
		if (newUrl[newUrl.length - 1] == "/") {
			newUrl = newUrl.substring(0, newUrl.length - 1);
		}
		this._url = newUrl;
	}
}
