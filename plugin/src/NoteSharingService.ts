import moment, { type Moment } from "moment";
import { requestUrl } from "obsidian";
import { encryptMarkdown } from "./crypto/encryption";

type Response = {
	view_url: string;
	expire_time: Moment;
};

export class NoteSharingService {
	private _url: string;

	constructor(serverUrl: string) {
		this.serverUrl = serverUrl;
	}

	/**
	 * @param mdText Markdown file to share.
	 * @returns link to shared note with attached decryption key.
	 */
	public async shareNote(mdText: string): Promise<Response> {
		mdText = this.sanitizeNote(mdText);
		const cryptData = encryptMarkdown(mdText);
		const res = await this.postNote(cryptData.ciphertext, cryptData.hmac);
		res.view_url += `#${cryptData.key}`;
		console.log(`Note shared: ${res.view_url}`);
		return res;
	}

	private async postNote(
		ciphertext: string,
		hmac: string
	): Promise<Response> {
		const res = await requestUrl({
			url: `${this._url}/note`,
			method: "POST",
			contentType: "application/json",
			body: JSON.stringify({ ciphertext, hmac }),
		});

		if (res.status == 200 && res.json != null) {
			const returnValue = res.json;
			returnValue.expire_time = moment(returnValue.expire_time);
			return <Response>returnValue;
		}
		throw Error("Did not get expected response from server on note POST.");
	}

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

	public set serverUrl(newUrl: string) {
		newUrl = newUrl.replace(/([^:]\/)\/+/g, "$1");
		if (newUrl[newUrl.length - 1] == "/") {
			newUrl = newUrl.substring(0, newUrl.length - 1);
		}
		this._url = newUrl;
	}
}
