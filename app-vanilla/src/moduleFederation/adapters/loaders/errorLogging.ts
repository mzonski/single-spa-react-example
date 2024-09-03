export function getErrorMessage(status: number, url: string) {
	switch (status) {
		case 404:
			return `Module not found at ${url}. Please check if the URL is correct.`;
		case 403:
			return `Access forbidden to module at ${url}. Please check your permissions.`;
		case 500:
			return `Server error occurred while fetching module from ${url}. Please try again later.`;
		default:
			return `Failed to fetch module from ${url}. Status: ${status}`;
	}
}

export async function getErrorDetails(response: Response) {
	try {
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			const errorJson = await response.json();
			return JSON.stringify(errorJson, null, 2);
		} else {
			return await response.text();
		}
	} catch {
		return 'Unable to retrieve error details';
	}
}

export function logUrlError(url: string, error: unknown) {
	console.error(`Error fetching script from ${url}:`, error);
}
