import { AES, enc, HmacSHA256 } from 'crypto-js';

// TODO: should be same source code as used in the plugin!!
export default async function decrypt(cryptData: {
	ciphertext: string;
	hmac: string;
	key: string;
}): Promise<string> {
	const hmac_calculated = HmacSHA256(cryptData.ciphertext, cryptData.key).toString();
	const is_authentic = hmac_calculated == cryptData.hmac;

	if (!is_authentic) {
		throw Error('Failed HMAC check');
	}
	const md = AES.decrypt(cryptData.ciphertext, cryptData.key).toString(enc.Utf8);
	return md;
}
