export type EncryptedNote = {
	id: string;
	insert_time: Date;
	ciphertext: string;
	hmac: string;
};
