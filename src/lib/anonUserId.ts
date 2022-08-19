import crc from "crc/calculators/crc16";

/**
 * @returns {string} a 16 character base16 string with 12 random characters and 4 CRC characters
 */
export function generateId() {
	// Generate a random 64-bit number and convert to base16 string
	const random = Math.floor(Math.random() * 2 ** 64).toString(16);

	// truncate the string to 12 characters and pad if necessary
	const truncated = random.slice(0, 12).padStart(12, "0");

	// compute the CRC of the random number

	// create int8array from "truncated"
	const buffer = new TextEncoder().encode(truncated);

	const checksum = crc(buffer).toString(16).padStart(4, "0");

	return truncated + checksum;
}

/**
 * @param id {string} a 16 character base16 string with 12 random characters and 4 CRC characters
 * @returns {boolean} true if the id is valid, false otherwise
 */
export function checkId(id: string): boolean {
	// check length
	if (id.length !== 16) {
		return false;
	}
	// extract the random number and the checksum
	const random = id.slice(0, 12);
	const checksum = id.slice(12, 16);
	const buffer = new TextEncoder().encode(random);

	// compute the CRC of the random number
	const computedChecksum = crc(buffer).toString(16).padStart(4, "0");

	// compare the computed checksum with the one in the id
	return computedChecksum === checksum;
}
