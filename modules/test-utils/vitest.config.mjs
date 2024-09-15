import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
/**
 * @type {import('vitest/config').defineConfig}
 */
export default defineConfig({
	test: {
		globals: true,
		// environment: 'jsdom',
		coverage: {
			provider: 'v8',
		},
		include: ['src/**/*.test.ts', 'src/**/*.test-d.ts'],
		setupFiles: ['./src/testUtils/index.ts'],
		typecheck: {
			enabled: true,
			include: ['src/**/*.test.ts', 'src/**/*.test-d.ts'],
			tsconfig: './tsconfig.json',
		},
	},
	plugins: [],
});
