// Solution for adding crypto definitions: https://stackoverflow.com/questions/71525466/property-subtle-does-not-exist-on-type-typeof-webcrypto

declare module "crypto" {
	namespace webcrypto {
		const subtle: SubtleCrypto;
	}
}
