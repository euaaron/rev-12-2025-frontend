/// <reference types="vite/client" />

declare global {
	/**
	 * Test-only override for MSW bootstrapping.
	 *
	 * When set to a boolean, `Boot` will use it instead of `import.meta.env`.
	 */
	 
	var __BOOT_USE_MSW__: boolean | undefined;
}

export {};
