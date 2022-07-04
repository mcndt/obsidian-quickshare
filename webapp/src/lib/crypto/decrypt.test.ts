import { expect, it } from 'vitest';
import decrypt from './decrypt';

const TEST_NOTE = {
	ciphertext: 'U2FsdGVkX1+r+nJffb6piMq1hPFSBSkf9/sgXj/UalA=',
	hmac: '7bfd5b0e96a0ed7ea43091d3e26f7c487bcebf8ba06175a4d4fc4d8466ba37f6'
};
const TEST_KEY = 'mgyUwoFwhlb1cnjhYYSrkY9_7hZKcRHQJs5l8wYB3Vk';
const TEST_PLAINTEXT = 'You did it!';

it('Should return plaintext with the correct key', () => {
	decrypt({ ...TEST_NOTE, key: TEST_KEY }).then((plaintext) => {
		expect(plaintext).toContain(TEST_PLAINTEXT);
	});
});

it('Should throw with the wrong key', async () => {
	await expect(decrypt({ ...TEST_NOTE, key: '' })).rejects.toThrow('Failed HMAC check');
});

it('Should throw with the wrong HMAC', async () => {
	await expect(decrypt({ ...TEST_NOTE, hmac: '', key: TEST_KEY })).rejects.toThrow(
		'Failed HMAC check'
	);
});
