export const createInlineData = (mimeType: string, data: string, params?: Record<string, string>) => {
	const encodedParams =
		params ?
			Object.entries(params)
				.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
				.join(';') + ';'
		:	'';

	return `data:${mimeType};${encodedParams}base64,${btoa(data)}`;
};
