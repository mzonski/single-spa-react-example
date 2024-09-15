import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

type MockNetworkLayerOptions = {
	baseUrl?: string;
};

export const createMockNetworkLayer = (options: MockNetworkLayerOptions = {}) => {
	const { baseUrl = 'http://localhost' } = options;

	const server = setupServer();

	const mockGet = (path: string, responseData?: any) => {
		server.use(
			http.get(`${baseUrl}${path}`, () => {
				return HttpResponse.json(responseData);
			}),
		);
	};

	const mockPost = (path: string, responseData?: any) => {
		server.use(
			http.post(`${baseUrl}${path}`, () => {
				return HttpResponse.json(responseData);
			}),
		);
	};

	const mockPut = (path: string, responseData?: any) => {
		server.use(
			http.put(`${baseUrl}${path}`, () => {
				return HttpResponse.json(responseData);
			}),
		);
	};

	const mockDelete = (path: string, responseData?: any) => {
		server.use(
			http.delete(`${baseUrl}${path}`, () => {
				return HttpResponse.json(responseData);
			}),
		);
	};

	return {
		server,
		mockGet,
		mockPost,
		mockPut,
		mockDelete,
	};
};
