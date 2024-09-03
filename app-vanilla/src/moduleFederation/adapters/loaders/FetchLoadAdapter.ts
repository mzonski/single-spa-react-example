import { assertIsError } from '../../../utils';
import { ModuleFederationFetchScriptAdapter } from '../types';
import { getErrorDetails, getErrorMessage, logUrlError } from './errorLogging';
import { createScriptContent } from '../factories';

export class FetchLoadAdapter implements ModuleFederationFetchScriptAdapter {
	async fetchScriptContent(url: string) {
		try {
			const response = await fetch(url);

			if (!response.ok) {
				const errorMessage = getErrorMessage(response.status, url);
				const errorDetails = await getErrorDetails(response);
				throw new Error(`${errorMessage}\n${errorDetails}`);
			}

			return createScriptContent(await response.text());
		} catch (error) {
			assertIsError(error);
			logUrlError(url, error);
			throw new Error(`Failed to load script from ${url}: ${error.message}`);
		}
	}
}
