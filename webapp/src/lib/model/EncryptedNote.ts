export type EncryptedNote = {
	id: string;
	insert_time: Date;
	expire_time: Date;
	ciphertext: string;
	hmac: string;
};
