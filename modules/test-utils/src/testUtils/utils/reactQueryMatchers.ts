expect.extend({
	toBeLoadingQuery(result: { isLoading: boolean }) {
		return {
			pass: result.isLoading,
			message: () => `expected query to be loading`,
		};
	},

	toBeErrorQuery(result: { isError: boolean }) {
		return {
			pass: result.isError,
			message: () => `expected query to be in error state`,
		};
	},
});

export {};
