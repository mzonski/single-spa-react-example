import { assertIsError } from '../../../utils';
import { ModuleFederationFetchScriptAdapter } from '../types';
import { getErrorMessage, logUrlError } from './errorLogging';
import { createScriptContent } from '../factories';
import axiosSingleton, { AxiosInstance, AxiosResponse, CreateAxiosDefaults, isAxiosError } from 'axios';

export class AxiosLoadAdapter implements ModuleFederationFetchScriptAdapter {
	readonly #axios: AxiosInstance;

	// TODO: Add support of utilizing the config
	constructor(config?: CreateAxiosDefaults) {
		this.#axios = axiosSingleton.create(config);
	}

	async fetchScriptContent(url: string) {
		try {
			const response = await this.#axios.get<string>(url, {
				validateStatus: null,
			});

			if (response.status >= 200 && response.status < 300) {
				return createScriptContent(response.data);
			} else {
				const errorMessage = getErrorMessage(response.status, url);
				const errorDetails = this.getErrorDetails(response);
				throw new Error(`${errorMessage}\n${errorDetails}`);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				logUrlError(url, error);
				if (error.response) {
					console.error('Response data:', error.response.data);
					console.error('Response status:', error.response.status);
					console.error('Response headers:', error.response.headers);
				} else if (error.request) {
					console.error('Request:', error.request);
				}
				throw new Error(`Failed to load script from ${url}: ${error.message}`);
			} else {
				assertIsError(error);
				logUrlError(url, error);
				throw new Error(`Failed to load script from ${url}: ${error.message}`);
			}
		}
	}

	private getErrorDetails(response: AxiosResponse) {
		if (typeof response.data === 'object') {
			return JSON.stringify(response.data, null, 2);
		} else if (typeof response.data === 'string') {
			return response.data;
		} else {
			return 'Unable to retrieve error details';
		}
	}
}
